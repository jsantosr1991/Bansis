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
  @Input() refreshTrigger: any; // cambia su valor para refrescar tabla

  private initialized = false;

  constructor(private dtService: DataTableService) { }

  ngAfterViewInit(): void {
    // Espera a que el DOM esté listo antes de inicializar
    setTimeout(() => this.initTable(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia el refreshTrigger, reiniciamos la tabla
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {

      this.reinitTable();
    }
  }

  ngOnDestroy(): void {
    this.dtService.destroy(`#${this.tableId}`);
  }

  private initTable(): void {
    if (!this.initialized) {
      setTimeout(() => {
        this.dtService.init(`#${this.tableId}`, this.options);
        this.initialized = true;

      }, 200); // pequeño delay para asegurar que el DOM tenga datos
    }
  }

  private reinitTable(): void {
    if (this.initialized) {
      this.dtService.destroy(`#${this.tableId}`);
      this.initialized = false;

    }

    // Esperar un poco más para que Angular haya renderizado los nuevos datos
    setTimeout(() => this.initTable(), 400);
  }
}
