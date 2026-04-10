import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SoporteService } from '../../../../services/soporte.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid fade-in p-4">
      <div class="header-section mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 class="fw-bold text-dark mb-1"><i class="bi bi-list-task me-2 text-primary"></i>Mis Solicitudes</h2>
          <p class="text-muted mb-0">Seguimiento de sus requerimientos técnicos enviados al área de sistemas.</p>
        </div>
        <a routerLink="/soporte-tecnico/nueva" class="btn btn-primary rounded-pill px-4 py-2 shadow-sm d-flex align-items-center btn-hover-lift">
          <i class="bi bi-plus-lg me-2"></i> Nueva Solicitud
        </a>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
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
                    <div class="d-flex align-items-center">
                      <span class="badge bg-secondary opacity-75 fw-normal me-2 fs-xs shadow-sm" style="font-size: 0.65rem; min-width: 65px; text-align: center;">
                         {{ getTipoLabel(sol.tipo_solicitud) | uppercase }}
                      </span>
                      <span class="fw-semibold text-dark d-inline-block text-truncate" style="max-width: 250px;">{{ sol.titulo }}</span>
                      <span *ngIf="sol.visto_por_solicitante === false || sol.visto_por_solicitante === 0" 
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
                    <button class="btn btn-primary btn-sm d-inline-flex align-items-center rounded-pill px-3 py-2 shadow-sm btn-hover-lift" (click)="verDetalle(sol.id)">
                      <i class="bi bi-chat-dots-fill me-2"></i> Ver Detalle
                    </button>
                  </td>
                </tr>
                <tr *ngIf="solicitudes.length === 0 && !loading">
                  <td colspan="6" class="text-center py-5 text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
                    No tiene solicitudes registradas actualmente.
                  </td>
                </tr>
                <tr *ngIf="loading">
                  <td colspan="6" class="text-center py-5 text-muted">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2 text-primary fw-bold">Optimizando su listado...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer bg-white border-0 py-3 d-flex flex-column flex-md-row justify-content-between align-items-center border-top gap-3">
             <p class="small text-muted mb-0">Mostrando las últimas <b class="text-primary">{{itemsPerPage}}</b> solicitudes de su historial.</p>
             
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
    .custom-table th { padding: 1rem 1rem; border-top: none; background: #f8f9fa; color: #6c757d; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #dee2e6; }
    .custom-table td { padding: 1.25rem 1rem; border-bottom: 1px solid #f1f3f5; vertical-align: middle; }
    .premium-row { transition: background-color 0.2s ease; }
    .premium-row:hover { background-color: rgba(13, 110, 253, 0.04); }
    .btn-hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .btn-hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(13, 110, 253, 0.3) !important; }
    .transition-hover { transition: all 0.3s ease; }
    .custom-select { appearance: none; -webkit-appearance: none; background-image: none; outline: none; box-shadow: none !important; border: none; }
    .custom-select:focus { outline: none; box-shadow: none; border: none; }
  `]
})
export class ListaSolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  loading = false;

  // Paginación y Orden
  itemsPerPage: number = 10;
  sortField: string = 'created_at';
  sortAsc: boolean = false;
  filteredTotal: number = 0;

  constructor(private soporteService: SoporteService, private router: Router) {}

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.loading = true;
    this.soporteService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get filteredSolicitudes(): any[] {
    let list = [...this.solicitudes];

    // Ordenamiento
    list.sort((a, b) => {
      let valA = a[this.sortField];
      let valB = b[this.sortField];

      if (this.sortField === 'created_at') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });

    this.filteredTotal = list.length;

    // Paginación
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

  getTipoLabel(tipo: string): string {
    const labels:any = { 
      'MANT': 'Mantenimiento', 'HARD': 'Hardware', 'CONS': 'Insumos', 
      'SOFT': 'Software', 'RED': 'Redes', 'OTRO': 'Otro' 
    };
    return labels[tipo] || tipo;
  }

  verDetalle(id: number) {
    this.router.navigate(['/soporte-tecnico/detalle', id]);
  }
}
