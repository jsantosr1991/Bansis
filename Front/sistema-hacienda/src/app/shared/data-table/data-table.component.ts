
import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { DataTableService } from '../../services/data-table.service';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent implements AfterViewInit, OnDestroy {
  @Input() tableId = 'datatable';
  @Input() options: any = {};

  constructor(private dtService: DataTableService) {}

  ngAfterViewInit() {
    this.dtService.init(`#${this.tableId}`, this.options);
  }

  ngOnDestroy() {
    this.dtService.destroy(`#${this.tableId}`);
  }
}
