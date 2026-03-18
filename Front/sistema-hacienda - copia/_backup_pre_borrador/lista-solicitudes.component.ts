import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TalentoHumanoService } from '../../services/talentoHumano.service';

@Component({
  selector: 'app-lista-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid fade-in p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="fw-bold text-primary mb-1"><i class="bi bi-person-lines-fill me-2"></i>Solicitudes de Empleo</h1>
          <p class="text-muted small mb-0">Gestión de aspirantes y procesos de selección.</p>
        </div>
        <a routerLink="../nuevaSolicitud" class="btn btn-primary shadow-sm rounded-pill px-4">
          <i class="bi bi-plus-lg me-2"></i> Nueva Solicitud
        </a>
      </div>

      <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div class="card-header bg-white py-3 border-0">
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="input-group input-group-merge border rounded-pill px-3 py-1">
                <span class="input-group-text bg-transparent border-0"><i class="bi bi-search text-muted"></i></span>
                <input type="text" class="form-control border-0 shadow-none" 
                       placeholder="Buscar" 
                       [(ngModel)]="searchText" (input)="filterSolicitudes()">
              </div>
            </div>
            <div class="col-md-6 text-end">
              <span class="text-muted small">Total: <strong>{{ filteredSolicitudes.length }}</strong> solicitudes</span>
            </div>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light text-muted small text-uppercase">
                <tr>
                  <th class="ps-4 cursor-pointer" (click)="sort('id')">
                    ID <i class="bi" [ngClass]="getSortIcon('id')"></i>
                  </th>
                  <th class="cursor-pointer" (click)="sort('fecha_entrevista')">
                    Fecha Entrevista <i class="bi" [ngClass]="getSortIcon('fecha_entrevista')"></i>
                  </th>
                  <th class="cursor-pointer" (click)="sort('cedula')">
                    Cédula <i class="bi" [ngClass]="getSortIcon('cedula')"></i>
                  </th>
                  <th class="cursor-pointer" (click)="sort('apellido_paterno')">
                    Postulante <i class="bi" [ngClass]="getSortIcon('apellido_paterno')"></i>
                  </th>
                  <th class="cursor-pointer" (click)="sort('estado_solicitud')">
                    Estado <i class="bi" [ngClass]="getSortIcon('estado_solicitud')"></i>
                  </th>
                  <th class="text-center pe-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let solicitud of filteredSolicitudes" class="fade-in">
                  <td class="ps-4 fw-bold text-muted">#{{ solicitud.id }}</td>
                  <td>{{ (solicitud.fecha_entrevista | date:'dd/MM/yyyy') || 'Pendiente' }}</td>
                  <td class="fw-bold text-dark">{{ solicitud.cedula || 'N/A' }}</td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="fw-bold">{{ solicitud.apellido_paterno }} {{ solicitud.apellido_materno }}</span>
                      <small class="text-muted">{{ solicitud.nombres }}</small>
                    </div>
                  </td>
                  <td>
                    <span class="badge rounded-pill px-3 py-2" 
                          [ngClass]="getEstadoClass(solicitud.estado_solicitud)">
                      {{ solicitud.estado_solicitud }}
                    </span>
                  </td>
                  <td class="text-center pe-4">
                    <div class="btn-group">
                      <button class="btn btn-light btn-sm border-0 rounded-circle mx-1" 
                               (click)="verDetalle(solicitud.id)" title="Ver Detalle">
                        <i class="bi bi-eye text-primary fs-5"></i>
                      </button>
                      <button class="btn btn-light btn-sm border-0 rounded-circle mx-1" 
                               (click)="abrirModalEstado(solicitud)" 
                               [disabled]="solicitud.estado_solicitud === 'CONTRATADO'"
                               title="Cambiar Estado">
                        <i class="bi bi-arrow-repeat text-warning fs-5"></i>
                      </button>
                      <button class="btn btn-light btn-sm border-0 rounded-circle mx-1" 
                               (click)="eliminar(solicitud.id)" 
                               [disabled]="solicitud.estado_solicitud === 'CONTRATADO'"
                               title="Eliminar">
                        <i class="bi bi-trash text-danger fs-5"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="filteredSolicitudes.length === 0">
                   <td colspan="6" class="text-center py-5 text-muted">
                     <i class="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
                     {{ searchText ? 'No se encontraron coincidencias para su búsqueda.' : 'No hay solicitudes registradas actualmente.' }}
                   </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal de Cambio de Estado Simple -->
      <div *ngIf="solicitudSeleccionada" class="modal-backdrop fade show"></div>
      <div *ngIf="solicitudSeleccionada" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title fw-bold text-dark">
                <i class="bi bi-arrow-repeat me-2 text-warning"></i>Cambiar Estado
              </h5>
              <button type="button" class="btn-close" (click)="cerrarModal()"></button>
            </div>
            <div class="modal-body py-4">
              <div class="alert alert-info border-0 rounded-4 small mb-4">
                <i class="bi bi-info-circle-fill me-2"></i>
                Cambiando estado para: <strong>{{ solicitudSeleccionada.apellido_paterno }} {{ solicitudSeleccionada.nombres }}</strong>
              </div>
              
              <div class="mb-3">
                <label class="form-label fw-bold small text-muted">Seleccione el nuevo estado:</label>
                <select class="form-select border rounded-3 shadow-none py-2" [(ngModel)]="nuevoEstadoSeleccionado">
                  <option *ngFor="let opt of obtenerEstadosPermitidos(solicitudSeleccionada.estado_solicitud)" [value]="opt">
                    {{ opt }}
                  </option>
                </select>
              </div>

              <div *ngIf="nuevoEstadoSeleccionado === 'CONTRATADO'" class="alert alert-warning border-0 rounded-4 small mb-0 animate__animated animate__shakeX">
                <i class="bi bi-exclamation-triangle-fill me-2 text-danger"></i>
                <strong>¡ADVERTENCIA CRÍTICA!</strong><br>
                Al seleccionar <strong>CONTRATADO</strong>, se creará un nuevo registro en la base de datos de trabajadores (rh_mtrab). Esta acción no se puede deshacer desde aquí.
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-light rounded-pill px-4" (click)="cerrarModal()">Cancelar</button>
              <button type="button" class="btn btn-warning rounded-pill px-4 fw-bold" 
                      [disabled]="!nuevoEstadoSeleccionado"
                      (click)="confirmarCambioEstado()">
                Confirmar Cambio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .table thead th { border-top: 0; padding-top: 15px; padding-bottom: 15px; background: #f8f9fa; }
    .cursor-pointer { cursor: pointer; }
    .cursor-pointer:hover { background-color: #f1f3f5; }
    .input-group-merge { border: 1px solid #dee2e6 !important; background-color: #f8f9fa; }
    .input-group-merge:focus-within { border-color: #0d6efd !important; background-color: #fff; }
    .badge { font-weight: 600; font-size: 0.75rem; letter-spacing: 0.5px; }
    .modal-backdrop { background-color: rgba(0,0,0,0.5); }
  `]
})
export class ListaSolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  filteredSolicitudes: any[] = [];
  searchText: string = '';
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private thService: TalentoHumanoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.thService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.filterSolicitudes();
      },
      error: (err) => console.error('Error al cargar solicitudes', err)
    });
  }

  filterSolicitudes() {
    if (!this.searchText) {
      this.filteredSolicitudes = [...this.solicitudes];
    } else {
      const search = this.searchText.toLowerCase();
      this.filteredSolicitudes = this.solicitudes.filter(s => {
        const full_name = `${s.nombres || ''} ${s.apellido_paterno || ''} ${s.apellido_materno || ''}`.toLowerCase();
        const id_str = s.id?.toString() || '';
        const cedula_str = s.cedula || '';
        return id_str.includes(search) || full_name.includes(search) || cedula_str.includes(search);
      });
    }
    this.applySort();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySort();
  }

  private applySort() {
    this.filteredSolicitudes.sort((a, b) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      if (valA === null || valA === undefined) valA = '';
      if (valB === null || valB === undefined) valB = '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'bi-arrow-down-up opacity-25';
    return this.sortDirection === 'asc' ? 'bi-arrow-up text-primary' : 'bi-arrow-down text-primary';
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'bg-secondary-subtle text-secondary border border-secondary';
      case 'EN_REVISION': return 'bg-primary-subtle text-primary border border-primary';
      case 'APROBADO': return 'bg-info-subtle text-info border border-info';
      case 'RECHAZADO': return 'bg-danger-subtle text-danger border border-danger';
      case 'CONTRATADO': return 'bg-success text-white px-3';
      default: return 'bg-dark-subtle text-dark border border-dark';
    }
  }

  // Lógica de Cambio de Estado
  solicitudSeleccionada: any = null;
  nuevoEstadoSeleccionado: string = '';

  abrirModalEstado(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    const permitidos = this.obtenerEstadosPermitidos(solicitud.estado_solicitud);
    this.nuevoEstadoSeleccionado = permitidos.length > 0 ? permitidos[0] : '';
  }

  cerrarModal() {
    this.solicitudSeleccionada = null;
    this.nuevoEstadoSeleccionado = '';
  }

  obtenerEstadosPermitidos(estadoActual: string): string[] {
    const mapa: { [key: string]: string[] } = {
      'PENDIENTE': ['EN_REVISION', 'RECHAZADO'],
      'EN_REVISION': ['APROBADO', 'RECHAZADO'],
      'APROBADO': ['CONTRATADO'],
      'RECHAZADO': ['PENDIENTE'],
      'CONTRATADO': []
    };
    return mapa[estadoActual] || [];
  }

  confirmarCambioEstado() {
    if (!this.solicitudSeleccionada || !this.nuevoEstadoSeleccionado) return;

    if (this.nuevoEstadoSeleccionado === 'CONTRATADO') {
      if (!confirm('¿ESTÁ TOTALMENTE SEGURO? Esta acción registrará al postulante como trabajador oficial en rh_mtrab.')) {
        return;
      }
    }

    this.thService.updateEstado(this.solicitudSeleccionada.id, this.nuevoEstadoSeleccionado).subscribe({
      next: (res) => {
        alert(res.message);
        this.cerrarModal();
        this.cargarSolicitudes();
      },
      error: (err) => {
        const msg = err.error?.message || 'No se pudo actualizar el estado.';
        alert('Error: ' + msg);
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/solicitud-empleo/pages/verSolicitud', id]);
  }

  eliminar(id: number) {
    if (confirm('¿Está seguro de eliminar esta solicitud permanentemente?')) {
      this.thService.eliminarSolicitud(id).subscribe({
        next: () => {
          alert('Solicitud eliminada correctamente');
          this.cargarSolicitudes();
        },
        error: (err) => alert('Error al eliminar la solicitud: ' + (err.error?.details || err.message))
      });
    }
  }
}
