import { AfterViewInit, Component, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { DataTableService } from '../../services/data-table.service';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() tableId = 'datatable';
  @Input() options: any = {};
  @Input() refreshTrigger: any; // puedes pasarle un valor que cambie para forzar recarga

  private initialized = false;

  constructor(private dtService: DataTableService) {}

  ngAfterViewInit() {
    this.initTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.reinitTable();
    }
  }

  ngOnDestroy() {
    this.dtService.destroy(`#${this.tableId}`);
  }

  private initTable() {
    if (!this.initialized) {
      setTimeout(() => {
        this.dtService.init(`#${this.tableId}`, this.options);
        this.initialized = true;
      }, 0);
    }
  }

  private reinitTable() {
    if (this.initialized) {
      this.dtService.destroy(`#${this.tableId}`);
      this.initialized = false;
    }
    this.initTable();
  }
}
