import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SoporteService } from '../../../../services/soporte.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-sistemas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid fade-in p-4">
      <div class="header-section mb-4">
        <h2 class="fw-bold text-dark mb-1"><i class="bi bi-shield-check-fill me-2 text-primary"></i>Panel de Gestión Sistemas</h2>
        <p class="text-muted">Administración y resolución de requerimientos técnicos de todas las áreas.</p>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div class="card-header bg-white py-3 border-0">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
             <div>
               <h6 class="fw-bold mb-0">Listado Maestro de Solicitudes</h6>
               <div class="d-flex gap-2 mt-2">
                  <span class="badge bg-warning-subtle text-warning border border-warning rounded-pill px-3 py-1">
                    Pendientes: {{ getCount('pendiente') }}
                  </span>
                  <span class="badge bg-success-subtle text-success border border-success rounded-pill px-3 py-1">
                    Resueltos: {{ getCount('resuelto') }}
                  </span>
               </div>
             </div>

             <!-- Filtros Premium -->
             <div class="d-flex flex-wrap align-items-center bg-white border rounded-pill shadow-sm px-3 py-1 gap-2 flex-grow-1 flex-md-grow-0 mt-3 mt-md-0 transition-hover" style="max-width: 800px;">
                <div class="d-flex align-items-center flex-grow-1">
                  <i class="bi bi-search text-primary me-2"></i>
                  <input type="text" class="form-control border-0 bg-transparent shadow-none px-1" placeholder="Búsqueda interactiva inteligente..." [(ngModel)]="searchTerm" style="min-width: 200px;">
                </div>
                
                <div class="vr bg-secondary opacity-25 d-none d-md-block" style="width: 1px; height: 24px;"></div>
                
                <div class="d-flex align-items-center">
                  <i class="bi bi-cpu text-muted me-1 small"></i>
                  <select class="form-select border-0 bg-transparent shadow-none fw-medium text-secondary custom-select px-2 pe-4" [(ngModel)]="filtroTipo" style="cursor: pointer; min-width: 160px;">
                    <option value="todos">Cualquier Categoría</option>
                    <option value="MANT">⚙️ Mantenimiento</option>
                    <option value="HARD">💻 Hardware</option>
                    <option value="CONS">🖨️ Insumos</option>
                    <option value="SOFT">🪟 Software</option>
                    <option value="RED">📶 Redes</option>
                    <option value="OTRO">❓ Otro</option>
                  </select>
                </div>

                <div class="vr bg-secondary opacity-25 d-none d-md-block" style="width: 1px; height: 24px;"></div>
                
                <div class="d-flex align-items-center">
                  <span class="badge rounded-circle p-1 me-1" [ngClass]="filtroEstado === 'pendiente' ? 'bg-warning' : (filtroEstado === 'resuelto' ? 'bg-success' : 'bg-primary opacity-50')"></span>
                  <select class="form-select border-0 bg-transparent shadow-none fw-medium text-secondary custom-select px-2 pe-4" [(ngModel)]="filtroEstado" style="cursor: pointer; min-width: 170px;">
                    <option value="todos">Cualquier Estado</option>
                    <option value="pendiente">Solo Pendientes</option>
                    <option value="resuelto">Solo Resueltos</option>
                  </select>
                </div>
             </div>
          </div>
        </div>
        
        <div class="card-body p-0">
          <div class="table-responsive rounded-bottom-4">
            <table class="table custom-table align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-4 cursor-pointer" (click)="toggleSort('id')">
                    Folio 
                    <i class="bi" [ngClass]="getSortIcon('id')"></i>
                  </th>
                  <th class="cursor-pointer" (click)="toggleSort('created_at')">
                    Fecha 
                    <i class="bi" [ngClass]="getSortIcon('created_at')"></i>
                  </th>
                  <th>Solicitante</th>
                  <th>Ubicación</th>
                  <th>Requerimiento</th>
                  <th>Estado</th>
                  <th class="text-center pe-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let sol of filteredSolicitudes" class="fade-in premium-row">
                  <td class="ps-4">
                    <span class="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle font-monospace p-2">
                       #{{ sol.id.toString().padStart(5, '0') }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                       <span class="text-dark fw-medium">{{ sol.created_at | date:'dd/MM/yyyy' }}</span>
                       <span class="text-muted small">{{ sol.created_at | date:'HH:mm' }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="fw-bold text-dark">{{ sol.user?.name }} {{ sol.user?.surname }}</span>
                      <span class="small text-muted"><i class="bi bi-envelope me-1"></i>{{ sol.user?.email }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="badge bg-light text-secondary border d-inline-block text-truncate" style="max-width: 150px;">{{ sol.area_solicitante }}</span>
                      <span class="small text-muted mt-1 d-inline-block text-truncate" style="max-width: 150px;" title="{{ sol.empresa?.nombre }}"><i class="bi bi-building me-1"></i>{{ sol.empresa?.nombre || 'N/A' }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <span class="badge bg-secondary opacity-75 fw-normal me-2 fs-xs shadow-sm" style="font-size: 0.65rem; min-width: 65px; text-align: center;">
                         {{ getTipoLabel(sol.tipo_solicitud) | uppercase }}
                      </span>
                      <span class="fw-semibold text-dark text-truncate d-inline-block" style="max-width: 200px;" [title]="sol.titulo">{{ sol.titulo }}</span>
                      <span *ngIf="sol.visto_por_sistemas === false || sol.visto_por_sistemas === 0" 
                            class="premium-new-badge ms-2" style="font-size: 0.6rem;">
                        NUEVO
                      </span>
                    </div>
                  </td>
                  <td>
                    <span class="badge rounded-pill px-3 py-2 fw-medium shadow-sm transition-hover" 
                          [ngClass]="sol.estado === 'pendiente' ? 'bg-warning-subtle text-warning border border-warning' : 'bg-success-subtle text-success border border-success'">
                      <i class="bi" [ngClass]="sol.estado === 'pendiente' ? 'bi-clock-history' : 'bi-check-circle'"></i> {{ sol.estado | uppercase }}
                    </span>
                  </td>
                  <td class="text-center pe-4">
                    <!-- Botón para solicitudes pendientes -->
                    <button *ngIf="sol.estado === 'pendiente'" 
                            class="btn btn-primary d-inline-flex align-items-center rounded-pill px-3 shadow-sm btn-hover-lift" 
                            (click)="verDetalle(sol.id)">
                      <i class="bi bi-gear-fill me-2"></i> Atender
                    </button>
                    
                    <!-- Botón para solicitudes resueltas u otros estados -->
                    <button *ngIf="sol.estado !== 'pendiente'" 
                            class="btn btn-outline-secondary d-inline-flex align-items-center rounded-pill px-3 shadow-sm btn-hover-lift" 
                            (click)="verDetalle(sol.id)">
                      <i class="bi bi-eye-fill me-2"></i> Ver Detalle
                    </button>
                  </td>
                </tr>
                <tr *ngIf="filteredSolicitudes.length === 0 && !loading">
                  <td colspan="7" class="text-center py-5 text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
                    No se encontraron solicitudes que coincidan con la búsqueda.
                  </td>
                </tr>
                <tr *ngIf="loading">
                  <td colspan="7" class="text-center py-5 text-muted">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2 text-primary fw-bold">Optimizando y cargando solicitudes...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer bg-white border-0 py-3 d-flex flex-column flex-md-row justify-content-between align-items-center border-top gap-3">
             <p class="small text-muted mb-0">Mostrando las primeras <b class="text-primary">{{itemsPerPage}}</b> solicitudes de un total de <b>{{filteredTotal}}</b> encontradas.</p>
             
             <!-- Selector de Cantidad Premium (Abajo) -->
             <div class="d-flex align-items-center bg-light rounded-pill px-3 py-1 border shadow-sm">
                <span class="small text-muted fw-bold me-2 text-uppercase" style="font-size: 0.65rem;">Registros:</span>
                <select class="border-0 bg-transparent shadow-none fw-bold text-primary custom-select p-0" style="width: auto; cursor: pointer; font-size: 0.85rem;" [(ngModel)]="itemsPerPage">
                  <option [ngValue]="10">10</option>
                  <option [ngValue]="20">20</option>
                  <option [ngValue]="50">50</option>
                  <option [ngValue]="100">100</option>
                  <option [ngValue]="0">Todos</option>
                </select>
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
    .cursor-pointer { cursor: pointer !important; }
    .cursor-pointer:hover { background-color: #f1f3f5 !important; color: #0d6efd !important; }
    .fs-xs { font-size: 0.70rem; }
    .premium-new-badge {
      background: linear-gradient(135deg, #ff416c, #ff4b2b);
      color: white;
      font-weight: 800;
      letter-spacing: 0.5px;
      padding: 0.35em 0.8em;
      border-radius: 50rem;
      box-shadow: 0 4px 10px rgba(255, 65, 108, 0.4);
      animation: premiumPulse 2s infinite;
    }
    @keyframes premiumPulse {
      0% { transform: scale(1); box-shadow: 0 4px 10px rgba(255, 65, 108, 0.4); }
      50% { transform: scale(1.08); box-shadow: 0 6px 15px rgba(255, 65, 108, 0.6); }
      100% { transform: scale(1); box-shadow: 0 4px 10px rgba(255, 65, 108, 0.4); }
    }
    .custom-select { appearance: none; -webkit-appearance: none; background-image: none; outline: none; box-shadow: none !important; }
    .custom-select:focus { outline: none; box-shadow: none; border: none; }
    input:focus { outline: none !important; box-shadow: none !important; }
    .transition-hover { transition: all 0.3s ease; }
    .transition-hover:focus-within { box-shadow: 0 8px 25px rgba(13, 110, 253, 0.15) !important; transform: translateY(-1px); border-color: #0d6efd !important; }
    .custom-table th { padding: 1rem 1rem; border-top: none; background: #f8f9fa; color: #6c757d; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #dee2e6; }
    .custom-table td { padding: 1.25rem 1rem; border-bottom: 1px solid #f1f3f5; vertical-align: middle; }
    .premium-row { transition: background-color 0.2s ease; }
    .premium-row:hover { background-color: rgba(13, 110, 253, 0.04); }
    .btn-hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .btn-hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(13, 110, 253, 0.3) !important; }
  `]
})
export class GestionSistemasComponent implements OnInit {
  solicitudes: any[] = [];
  loading = false;
  searchTerm: string = '';
  filtroEstado: string = 'todos';
  filtroTipo: string = 'todos';

  // Paginación y Orden
  itemsPerPage: number = 10;
  sortField: string = 'created_at';
  sortAsc: boolean = false; // Descendente por defecto (más recientes primero)
  filteredTotal: number = 0;

  constructor(private soporteService: SoporteService, private router: Router) {}

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.loading = true;
    this.soporteService.getSolicitudes(true).subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get filteredSolicitudes(): any[] {
    let list = this.solicitudes;

    // Filtro de Estado
    if (this.filtroEstado !== 'todos') {
      list = list.filter(s => s.estado === this.filtroEstado);
    }
    
    // Filtro de Tipo
    if (this.filtroTipo !== 'todos') {
      list = list.filter(s => s.tipo_solicitud === this.filtroTipo);
    }

    // Filtro de Texto (Buscador Globalizado)
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(s => {
        const idFull = `#${s.id.toString().padStart(5, '0')}`;
        const dateStr = s.created_at ? new Date(s.created_at).toLocaleString().toLowerCase() : '';
        const tipoLabel = this.getTipoLabel(s.tipo_solicitud).toLowerCase();
        
        return (
          idFull.includes(term) ||
          s.id.toString().includes(term) ||
          (s.titulo && s.titulo.toLowerCase().includes(term)) ||
          (s.user?.name && s.user.name.toLowerCase().includes(term)) ||
          (s.user?.surname && s.user.surname.toLowerCase().includes(term)) ||
          (s.user?.email && s.user.email.toLowerCase().includes(term)) ||
          (s.estado && s.estado.toLowerCase().includes(term)) ||
          (tipoLabel && tipoLabel.includes(term)) ||
          (s.empresa?.nombre && s.empresa.nombre.toLowerCase().includes(term)) ||
          (s.area_solicitante && s.area_solicitante.toLowerCase().includes(term)) ||
          dateStr.includes(term)
        );
      });
    }

    // Ordenamiento dinámico
    list = [...list].sort((a, b) => {
      let valA = a[this.sortField];
      let valB = b[this.sortField];

      // Manejo especial para fechas
      if (this.sortField === 'created_at') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });

    this.filteredTotal = list.length;

    // Paginación (Slicing)
    if (this.itemsPerPage > 0) {
      return list.slice(0, this.itemsPerPage);
    }

    return list;
  }

  toggleSort(field: string) {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'bi-arrow-down-up opacity-25 ms-1';
    return this.sortAsc ? 'bi-sort-up text-primary ms-1' : 'bi-sort-down text-primary ms-1';
  }

  getCount(estado: string): number {
    return this.solicitudes.filter(s => s.estado === estado).length;
  }

  verDetalle(id: number) {
    this.router.navigate(['/soporte-tecnico/detalle', id]);
  }

  getTipoLabel(tipo: string): string {
    const labels:any = { 
      'MANT': 'Mantenimiento', 'HARD': 'Hardware', 'CONS': 'Insumos', 
      'SOFT': 'Software', 'RED': 'Redes', 'OTRO': 'Otro' 
    };
    return labels[tipo] || tipo;
  }
}
