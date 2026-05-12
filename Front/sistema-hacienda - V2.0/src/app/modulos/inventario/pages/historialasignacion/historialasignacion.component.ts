import { Component } from '@angular/core';
import { InventarioService } from '../../../../services/inventario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historialasignacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historialasignacion.component.html',
  styleUrl: './historialasignacion.component.css'
})
export class HistorialasignacionComponent {
  data: any[] = [];
  paginatedData: any[] = [];
  page = 1;
  pageSize = 10;
  filteredData: any[] = [];
  searchTerm: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  expandedRow: any = null;

  constructor(private api: InventarioService) { }

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.api.getAsignaciones().subscribe((res: any[]) => {
      this.data = res;
      this.setPage(1);
    });
  }

  // =========================
  // EXPANDIR FILA
  // =========================
  toggleRow(row: any) {
    this.expandedRow = this.expandedRow === row ? null : row;
  }

  isExpanded(row: any) {
    return this.expandedRow === row;
  }

  // =========================
  // PAGINACIÓN
  // =========================
  setPage(page: number) {
    this.page = page;

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedData = this.sourceData.slice(start, end);
  }
  get totalPages() {
    return Math.ceil(this.sourceData.length / this.pageSize);
  }

  get startIndex() {
    return this.sourceData.length === 0 ? 0 : (this.page - 1) * this.pageSize;
  }

  get endIndex() {
    return Math.min(this.startIndex + this.pageSize, this.sourceData.length);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.setPage(this.page + 1);
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.setPage(this.page - 1);
    }
  }

  applyFilters() {

    let filtered = [...this.data];

    // 🔎 BUSCADOR
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();

      filtered = filtered.filter(a =>
        a.producto?.toLowerCase().includes(term) ||
        a.usuario_recibe?.toLowerCase().includes(term) ||
        a.usuario_entrega?.toLowerCase().includes(term)
      );
    }

    // 📅 FECHA INICIO
    if (this.fechaInicio) {
      filtered = filtered.filter(a =>
        new Date(a.fecha) >= new Date(this.fechaInicio)
      );
    }

    // 📅 FECHA FIN
    if (this.fechaFin) {
      filtered = filtered.filter(a =>
        new Date(a.fecha) <= new Date(this.fechaFin + ' 23:59:59')
      );
    }

    this.page = 1;
    this.paginatedData = filtered.slice(0, this.pageSize);
    this.filteredData = filtered;
  }
  clearFilters() {
    this.searchTerm = '';
    this.fechaInicio = '';
    this.fechaFin = '';

    this.filteredData = [];
    this.setPage(1);
  }
  get sourceData() {
    return this.filteredData.length ? this.filteredData : this.data;
  }

}
