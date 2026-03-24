import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TalentoHumanoService } from '../../services/talentoHumano.service';
// FIX: Usar el servicio oficial para persistencia de sesión
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid fade-in p-4 print-container">
      <div class="d-flex justify-content-between align-items-center mb-4 d-print-none">
        <div>
          <h2 class="fw-bold text-primary mb-1 fs-3"><i class="bi bi-person-lines-fill me-2"></i>Solicitudes de Empleo</h2>
          <p class="text-muted small mb-0">Gestión de aspirantes y procesos de selección.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary shadow-sm rounded-pill px-4" (click)="imprimirLista()">
            <i class="bi bi-printer me-2"></i> Imprimir Lista
          </button>
          <a routerLink="../nuevaSolicitud" class="btn btn-primary shadow-sm rounded-pill px-4">
            <i class="bi bi-plus-lg me-2"></i> Nueva Solicitud
          </a>
        </div>
      </div>

      <div class="card shadow-sm border-0 rounded-4 overflow-hidden d-print-none">
        <!-- Header: Búsqueda + Botón Filtros -->
        <div class="card-header bg-white py-3 border-0">
          <div class="row align-items-center">
            <div class="col-md-5">
              <div class="input-group input-group-merge border rounded-pill px-3 py-1">
                <span class="input-group-text bg-transparent border-0"><i class="bi bi-search text-muted"></i></span>
                <input type="text" class="form-control border-0 shadow-none" 
                       placeholder="Buscar por nombre, cédula, código..." 
                       [(ngModel)]="searchText" (input)="filterSolicitudes()">
              </div>
            </div>
            <div class="col-md-7 text-end d-flex align-items-center justify-content-end gap-3">
              <button class="btn btn-outline-secondary rounded-pill px-3 py-1 d-flex align-items-center gap-2"
                      [class.btn-primary]="showFilters" [class.btn-outline-secondary]="!showFilters"
                      (click)="toggleFilters()">
                <i class="bi bi-funnel"></i>
                <span>Filtros</span>
                <span *ngIf="activeFilterCount > 0" class="badge bg-danger rounded-pill ms-1" style="font-size: 0.65rem;">{{ activeFilterCount }}</span>
              </button>
              <span class="text-muted small">Total: <strong>{{ filteredSolicitudes.length }}</strong> solicitudes</span>
            </div>
          </div>
        </div>

        <!-- Panel de Filtros Colapsable -->
        <div class="filter-panel px-4 py-3 d-print-none" *ngIf="showFilters">
          <div class="row g-3">
            <!-- Filtro por Estado -->
            <div class="col-12">
              <div class="d-flex align-items-center gap-2 mb-2">
                <i class="bi bi-tag text-primary"></i>
                <span class="fw-bold small text-dark">FILTRAR POR ESTADO</span>
                <span class="text-muted small ms-2">— clic para activar/desactivar</span>
                <div class="ms-auto d-flex gap-1">
                  <button class="btn btn-link btn-sm text-primary p-0 text-decoration-none" (click)="toggleAllEstados(true)">
                    <small>Todos</small>
                  </button>
                  <span class="text-muted small">|</span>
                  <button class="btn btn-link btn-sm text-primary p-0 text-decoration-none" (click)="toggleAllEstados(false)">
                    <small>Ninguno</small>
                  </button>
                </div>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <span *ngFor="let estado of estadoOptions"
                      class="estado-check badge rounded-pill px-3 py-2"
                      [ngClass]="estadoFilters[estado] ? getEstadoClass(estado) : 'bg-light text-muted border border-light'"
                      [class.opacity-40]="!estadoFilters[estado]"
                      (click)="toggleEstado(estado)">
                  <i class="bi me-1" [ngClass]="estadoFilters[estado] ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                  {{ getEstadoLabel(estado) }}
                </span>
              </div>
            </div>

            <!-- Filtro por Fecha -->
            <div class="col-12 mt-3">
              <div class="d-flex align-items-center gap-2 mb-2">
                <i class="bi bi-calendar3 text-primary"></i>
                <span class="fw-bold small text-dark">FILTRAR POR FECHA DE REGISTRO</span>
              </div>
              <div class="d-flex flex-wrap align-items-center gap-3">
                <!-- Radio buttons -->
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="fechaMode" id="fechaNone" 
                         value="none" [(ngModel)]="fechaFilterMode" (change)="filterSolicitudes()">
                  <label class="form-check-label small" for="fechaNone">Sin filtro de fecha</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="fechaMode" id="fechaSingle" 
                         value="single" [(ngModel)]="fechaFilterMode" (change)="filterSolicitudes()">
                  <label class="form-check-label small" for="fechaSingle">Día específico</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="fechaMode" id="fechaRange" 
                         value="range" [(ngModel)]="fechaFilterMode" (change)="filterSolicitudes()">
                  <label class="form-check-label small" for="fechaRange">Rango de fechas</label>
                </div>

                <!-- Date inputs -->
                <div class="d-flex align-items-center gap-2 ms-2" *ngIf="fechaFilterMode === 'single'">
                  <label class="small text-muted fw-semibold mb-0">Fecha:</label>
                  <input type="date" class="form-control form-control-sm border rounded-3 shadow-none" 
                         style="width: 170px;" [max]="maxDate"
                         [(ngModel)]="fechaSingle" (change)="filterSolicitudes()">
                </div>
                <div class="d-flex align-items-center gap-2 ms-2" *ngIf="fechaFilterMode === 'range'">
                  <label class="small text-muted fw-semibold mb-0">Desde:</label>
                  <input type="date" class="form-control form-control-sm border rounded-3 shadow-none" 
                         style="width: 170px;" [max]="maxDate"
                         [(ngModel)]="fechaDesde" (change)="filterSolicitudes()">
                  <label class="small text-muted fw-semibold mb-0">Hasta:</label>
                  <input type="date" class="form-control form-control-sm border rounded-3 shadow-none" 
                         style="width: 170px;" [max]="maxDate"
                         [(ngModel)]="fechaHasta" (change)="filterSolicitudes()">
                </div>
              </div>
            </div>

            <!-- Botón Limpiar -->
            <div class="col-12 mt-2 text-end" *ngIf="activeFilterCount > 0">
              <button class="btn btn-outline-danger btn-sm rounded-pill px-3" (click)="limpiarFiltros()">
                <i class="bi bi-x-circle me-1"></i> Limpiar Filtros ({{ activeFilterCount }})
              </button>
            </div>
          </div>
        </div>

        <div class="card-body p-0">
          <!-- Loading State -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="text-muted fw-semibold mb-0">Cargando solicitudes...</p>
            <p class="text-muted small">Obteniendo información del servidor</p>
          </div>

          <!-- Table Content -->
          <div class="table-responsive" *ngIf="!loading">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light text-muted small text-uppercase">
                <tr>
                  <th class="ps-4 cursor-pointer" (click)="sort('codigo_solicitud')">
                    Código <i class="bi" [ngClass]="getSortIcon('codigo_solicitud')"></i>
                  </th>
                  <th class="cursor-pointer" (click)="sort('fecha_entrevista')">
                    Fecha de registro <i class="bi" [ngClass]="getSortIcon('fecha_entrevista')"></i>
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
                <tr *ngFor="let solicitud of paginatedSolicitudes" class="fade-in">
                  <td class="ps-4 fw-bold text-primary">{{ solicitud.codigo_solicitud || 'S/C' }}</td>
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
                               [disabled]="solicitud.estado_solicitud === 'APROBADO'"
                               title="Cambiar Estado">
                        <i class="bi bi-arrow-repeat text-warning fs-5"></i>
                      </button>
                      <button class="btn btn-light btn-sm border-0 rounded-circle mx-1" 
                               (click)="eliminar(solicitud)" 
                               [disabled]="solicitud.estado_solicitud === 'APROBADO' || solicitud.estado_solicitud === 'RECHAZADO'"
                               title="Eliminar">
                        <i class="bi bi-trash text-danger fs-5"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="filteredSolicitudes.length === 0 && !loading">
                   <td colspan="6" class="text-center py-5 text-muted">
                     <i class="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
                     <span *ngIf="activeFilterCount > 0">
                       No se encontraron solicitudes con los filtros seleccionados.
                       <br><button class="btn btn-link btn-sm p-0 mt-2" (click)="limpiarFiltros()">Limpiar filtros</button>
                     </span>
                     <span *ngIf="activeFilterCount === 0">
                       {{ searchText ? 'No se encontraron coincidencias para su búsqueda.' : 'No hay solicitudes registradas actualmente.' }}
                     </span>
                   </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div class="card-footer bg-white border-top py-3 px-4" *ngIf="!loading && filteredSolicitudes.length > 0">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <!-- Page Size Selector -->
              <div class="d-flex align-items-center gap-2">
                <span class="text-muted small">Mostrar</span>
                <select class="form-select form-select-sm border rounded-pill shadow-none" 
                        style="width: auto;" 
                        [(ngModel)]="pageSize" (change)="onPageSizeChange()">
                  <option *ngFor="let opt of pageSizeOptions" [ngValue]="opt">{{ opt }}</option>
                </select>
                <span class="text-muted small">por página</span>
              </div>

              <!-- Page Info -->
              <div class="text-muted small fw-semibold">
                Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ filteredSolicitudes.length }}
              </div>

              <!-- Page Navigation -->
              <nav>
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item" [class.disabled]="currentPage === 1">
                    <a class="page-link rounded-start-pill border-0 shadow-none" (click)="goToPage(1)" title="Primera">
                      <i class="bi bi-chevron-double-left"></i>
                    </a>
                  </li>
                  <li class="page-item" [class.disabled]="currentPage === 1">
                    <a class="page-link border-0 shadow-none" (click)="goToPage(currentPage - 1)" title="Anterior">
                      <i class="bi bi-chevron-left"></i>
                    </a>
                  </li>
                  <li *ngFor="let page of visiblePages" class="page-item" [class.active]="page === currentPage">
                    <a class="page-link border-0 shadow-none" (click)="goToPage(page)">{{ page }}</a>
                  </li>
                  <li class="page-item" [class.disabled]="currentPage === totalPages">
                    <a class="page-link border-0 shadow-none" (click)="goToPage(currentPage + 1)" title="Siguiente">
                      <i class="bi bi-chevron-right"></i>
                    </a>
                  </li>
                  <li class="page-item" [class.disabled]="currentPage === totalPages">
                    <a class="page-link rounded-end-pill border-0 shadow-none" (click)="goToPage(totalPages)" title="Última">
                      <i class="bi bi-chevron-double-right"></i>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Cambio de Estado Simple -->
      <div *ngIf="solicitudSeleccionada" class="modal-backdrop fade show d-print-none"></div>
      <div *ngIf="solicitudSeleccionada" class="modal fade show d-block d-print-none" tabindex="-1">
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

              <div *ngIf="nuevoEstadoSeleccionado === 'APROBADO'" class="alert alert-warning border-0 rounded-4 small mb-0 animate__animated animate__shakeX">
                <i class="bi bi-exclamation-triangle-fill me-2 text-danger"></i>
                <strong>¡ADVERTENCIA CRÍTICA!</strong><br>
                Al seleccionar <strong>APROBADO</strong>, se creará un nuevo registro en la base de datos de trabajadores (rh_mtrab). Esta acción no se puede deshacer desde aquí.
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-light rounded-pill px-4" (click)="cerrarModal()">Cancelar</button>
              <button type="button" class="btn btn-warning rounded-pill px-4 fw-bold" 
                      [disabled]="!nuevoEstadoSeleccionado || procesandoEstado"
                      (click)="confirmarCambioEstado()">
                <span *ngIf="!procesandoEstado">Confirmar Cambio</span>
                <span *ngIf="procesandoEstado"><span class="spinner-border spinner-border-sm me-2"></span>Procesando...</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- === SECCIÓN EXCLUSIVA PARA IMPRESIÓN === -->
      <div id="print-section" class="print-only">
        <div class="print-header">
          <img src="assets/images/SistemaHac/Logo/bananas.svg" alt="Logo" class="print-logo">
          <div class="print-title">
            <h2>Reporte de Solicitudes de Empleo</h2>
            <p><strong>Total de registros filtrados:</strong> {{ filteredSolicitudes.length }}</p>
            
            <p *ngIf="searchText" class="print-filters mt-1">
              <strong>Búsqueda de texto:</strong> "{{ searchText }}"
            </p>
            <p class="print-filters mt-1" *ngIf="activeFilterCount > 0">
              <strong>Filtros aplicados:</strong><br>
              <span *ngIf="fechaFilterMode === 'single'">- Fecha específica: {{ fechaSingle | date:'dd/MM/yyyy' }}<br></span>
              <span *ngIf="fechaFilterMode === 'range'">
                - Rango: {{ fechaDesde ? (fechaDesde | date:'dd/MM/yyyy') : '...' }} al {{ fechaHasta ? (fechaHasta | date:'dd/MM/yyyy') : '...' }}<br>
              </span>
              <span *ngIf="getUncheckedEstados().length > 0">
                - Estados: {{ getCheckedEstados().join(', ') }}
              </span>
              <span *ngIf="getUncheckedEstados().length === 0 && fechaFilterMode !== 'none'">
                - Estados: Todos
              </span>
            </p>
            <p class="print-filters mt-1 text-end" style="width: 100%;">
              <em>Generado el: {{ currentDate | date:'dd/MM/yyyy HH:mm' }}</em>
            </p>
          </div>
        </div>

        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 5%;">Nº</th>
              <th style="width: 15%;">CÓDIGO</th>
              <th style="width: 15%;">FECHA DE REGISTRO</th>
              <th style="width: 15%;">CÉDULA</th>
              <th style="width: 35%;">POSTULANTE</th>
              <th style="width: 15%;">ESTADO</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let sol of filteredSolicitudes; let i = index">
              <td class="text-center">{{ i + 1 }}</td>
              <td><b>{{ sol.codigo_solicitud || 'S/C' }}</b></td>
              <td>{{ (sol.fecha_entrevista | date:'dd/MM/yyyy') || 'Pendiente' }}</td>
              <td>{{ sol.cedula || 'N/A' }}</td>
              <td>
                <b>{{ sol.apellido_paterno }} {{ sol.apellido_materno }}</b> {{ sol.nombres }}
              </td>
              <td>{{ getEstadoLabel(sol.estado_solicitud) | uppercase }}</td>
            </tr>
            <tr *ngIf="filteredSolicitudes.length === 0">
              <td colspan="6" class="text-center py-4">No hay registros con los filtros actuales.</td>
            </tr>
          </tbody>
        </table>
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
    .pagination .page-link { cursor: pointer; color: #0d6efd; }
    .pagination .page-item.active .page-link { background-color: #0d6efd; border-color: #0d6efd; color: #fff; }
    .pagination .page-item.disabled .page-link { cursor: not-allowed; opacity: 0.5; }

    /* Filter Panel */
    .filter-panel {
      background: #f8f9fc;
      border-top: 1px solid #eef0f2;
      border-bottom: 1px solid #eef0f2;
      animation: slideDown 0.3s ease-out;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .estado-check {
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
      font-size: 0.8rem !important;
    }
    .estado-check:hover { transform: scale(1.05); }
    .opacity-40 { opacity: 0.4; }

    /* ESTILOS DE IMPRESIÓN */
    .print-only { display: none !important; }

    @media print {
      /* Asegurarse que el main content use toda la zona disponible y sobreescribir colores base */
      body { background: white !important; margin: 0; padding: 0; color: black !important; }
      
      /* Ocultar elementos de layout global (Sidebar, Navbar) que estén fuera de este componente */
      app-sidebar, app-header, .sidebar, .navbar, aside, nav, header {
        display: none !important;
      }

      .main-content, main, .content-wrapper, .wrapper {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        left: 0 !important;
        top: 0 !important;
        position: absolute !important;
      }
      
      /* Ocultar elementos específicos del componente usando la clase nativa de Bootstrap */
      .d-print-none {
        display: none !important;
      }

      .print-container {
        padding: 0 !important;
        margin: 0 !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
      }

      /* Forzar que print-section se muestre sí o sí en la parte superior */
      #print-section {
        display: block !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100%;
        padding: 10px;
        background: white;
      }
      #print-section * { visibility: visible; }

      /* Dar formato bonito a la tabla impresa */
      .print-header { 
        display: flex; 
        align-items: center; 
        border-bottom: 2px solid #000; 
        padding-bottom: 10px; 
        margin-bottom: 20px; 
      }
      .print-logo { height: 60px; margin-right: 20px; }
      .print-title { flex: 1; }
      .print-title h2 { margin: 0; font-size: 16pt; color: #000 !important; font-weight: bold; }
      .print-title p { margin: 2px 0; font-size: 10pt; color: #333 !important; }
      .print-filters { font-size: 9pt; color: #555 !important; }
      
      .print-table { 
        width: 100%; 
        border-collapse: collapse; 
        font-family: Arial, sans-serif; 
      }
      .print-table th { 
        background-color: #f2f2f2 !important; 
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact; 
        color: #000 !important; 
        font-weight: bold; 
        border: 1px solid #ddd; 
        padding: 8px; 
        text-align: left; 
        font-size: 8pt; 
      }
      .print-table td { 
        border: 1px solid #ddd; 
        padding: 6px 8px; 
        color: #000 !important; 
        font-size: 7pt; 
      }
      .print-table tr:nth-child(even) { 
        background-color: #f9f9f9 !important; 
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact; 
      }
      
      /* Forzar salto de página interno */
      .print-table tr { page-break-inside: avoid; }
      
      /* Orientación vertical y márgenes mínimos */
      @page { size: portrait; margin: 1cm; }
    }
  `]
})
export class ListaSolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  filteredSolicitudes: any[] = [];
  searchText: string = '';
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'desc';
  grupos: any[] = [];
  loading: boolean = false;
  procesandoEstado: boolean = false;
  currentDate: Date = new Date();
  maxDate: string = new Date().toISOString().split('T')[0];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  // Advanced Filters
  showFilters: boolean = false;

  estadoOptions: string[] = ['BORRADOR', 'PENDIENTE', 'EN_REVISION', 'APROBADO', 'RECHAZADO'];
  estadoFilters: { [key: string]: boolean } = {
    'BORRADOR': true,
    'PENDIENTE': true,
    'EN_REVISION': true,
    'APROBADO': true,
    'RECHAZADO': true
  };

  fechaFilterMode: 'none' | 'single' | 'range' = 'none';
  fechaSingle: string = '';
  fechaDesde: string = '';
  fechaHasta: string = '';

  constructor(
    private thService: TalentoHumanoService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.cargarSolicitudes();
    this.thService.getGrupos().subscribe({
      next: (data: any[]) => this.grupos = data,
      error: (err: any) => console.error('Error cargando grupos', err)
    });
  }

  cargarSolicitudes() {
    this.loading = true;
    this.thService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.filterSolicitudes();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar solicitudes', err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error de Conexión',
          text: 'No se pudieron cargar las solicitudes. Verifique su conexión.',
          confirmButtonColor: '#0d6efd'
        });
      }
    });
  }

  // --- Advanced Filters ---
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  toggleEstado(estado: string) {
    this.estadoFilters[estado] = !this.estadoFilters[estado];
    this.filterSolicitudes();
  }

  toggleAllEstados(value: boolean) {
    this.estadoOptions.forEach(e => this.estadoFilters[e] = value);
    this.filterSolicitudes();
  }

  getEstadoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'BORRADOR': 'Borrador',
      'PENDIENTE': 'Pendiente',
      'EN_REVISION': 'En Revisión',
      'APROBADO': 'Aprobado',
      'RECHAZADO': 'Rechazado'
    };
    return labels[estado] || estado;
  }

  imprimirLista() {
    if (this.filteredSolicitudes.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Lista Vacía',
        text: 'No hay registros para imprimir con los filtros actuales.',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }
    this.currentDate = new Date(); // Update print timestamp
    window.print();
  }

  limpiarFiltros() {
    this.estadoOptions.forEach(e => this.estadoFilters[e] = true);
    this.fechaFilterMode = 'none';
    this.fechaSingle = '';
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.searchText = '';
    this.filterSolicitudes();
  }

  get activeFilterCount(): number {
    let count = 0;
    const uncheckedEstados = this.getUncheckedEstados().length;
    if (uncheckedEstados > 0) count += uncheckedEstados;
    if (this.fechaFilterMode === 'single' && this.fechaSingle) count++;
    if (this.fechaFilterMode === 'range' && (this.fechaDesde || this.fechaHasta)) count++;
    return count;
  }

  getUncheckedEstados(): string[] {
    return this.estadoOptions.filter(e => !this.estadoFilters[e]);
  }

  getCheckedEstados(): string[] {
    return this.estadoOptions.filter(e => this.estadoFilters[e]);
  }

  // --- Filter Logic ---
  filterSolicitudes() {
    // Step 1: Text search
    if (!this.searchText) {
      this.filteredSolicitudes = [...this.solicitudes];
    } else {
      const search = this.searchText.toLowerCase().trim();
      const searchNormalized = search.replace(/_/g, ' ');

      this.filteredSolicitudes = this.solicitudes.filter(s => {
        const full_name = `${s.nombres || ''} ${s.apellido_paterno || ''} ${s.apellido_materno || ''}`.toLowerCase();
        const cedula = (s.cedula || '').toLowerCase();
        const codigo = (s.codigo_solicitud || '').toLowerCase();
        const estado = (s.estado_solicitud || '').toLowerCase();
        const estadoNormalized = estado.replace(/_/g, ' ');

        let fecha = 'pendiente';
        if (s.fecha_entrevista) {
          const d = new Date(s.fecha_entrevista);
          fecha = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
        }
        fecha = fecha.toLowerCase();

        return full_name.includes(search) ||
          cedula.includes(search) ||
          codigo.includes(search) ||
          estadoNormalized.includes(searchNormalized) ||
          fecha.includes(search);
      });
    }

    // Step 2: Estado filter (checkboxes)
    this.filteredSolicitudes = this.filteredSolicitudes.filter(s => {
      return this.estadoFilters[s.estado_solicitud] !== false;
    });

    // Step 3: Date filter
    if (this.fechaFilterMode === 'single' && this.fechaSingle) {
      this.filteredSolicitudes = this.filteredSolicitudes.filter(s => {
        if (!s.fecha_entrevista) return false;
        const fechaDB = s.fecha_entrevista.substring(0, 10);
        return fechaDB === this.fechaSingle;
      });
    } else if (this.fechaFilterMode === 'range') {
      if (this.fechaDesde) {
        this.filteredSolicitudes = this.filteredSolicitudes.filter(s => {
          if (!s.fecha_entrevista) return false;
          return s.fecha_entrevista.substring(0, 10) >= this.fechaDesde;
        });
      }
      if (this.fechaHasta) {
        this.filteredSolicitudes = this.filteredSolicitudes.filter(s => {
          if (!s.fecha_entrevista) return false;
          return s.fecha_entrevista.substring(0, 10) <= this.fechaHasta;
        });
      }
    }

    this.currentPage = 1;
    this.applySort();
  }

  // --- Pagination ---
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredSolicitudes.length / this.pageSize));
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredSolicitudes.length);
  }

  get paginatedSolicitudes(): any[] {
    return this.filteredSolicitudes.slice(this.startIndex, this.endIndex);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;
  }

  // --- Sorting ---
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
      case 'BORRADOR': return 'bg-dark-subtle text-dark border border-dark';
      case 'PENDIENTE': return 'bg-secondary-subtle text-secondary border border-secondary';
      case 'EN_REVISION': return 'bg-primary-subtle text-primary border border-primary';
      case 'APROBADO': return 'bg-success text-white px-3';
      case 'RECHAZADO': return 'bg-danger-subtle text-danger border border-danger';
      default: return 'bg-dark text-white';
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
    this.procesandoEstado = false;
  }

  obtenerEstadosPermitidos(estadoActual: string): string[] {
    const mapa: { [key: string]: string[] } = {
      'BORRADOR': ['PENDIENTE', 'EN_REVISION', 'RECHAZADO'],
      'PENDIENTE': ['EN_REVISION', 'RECHAZADO'],
      'EN_REVISION': ['APROBADO', 'RECHAZADO'],
      'APROBADO': [],
      'RECHAZADO': ['PENDIENTE', 'EN_REVISION']
    };
    return mapa[estadoActual] || [];
  }

  confirmarCambioEstado() {
    if (!this.solicitudSeleccionada || !this.nuevoEstadoSeleccionado) return;

    if (this.nuevoEstadoSeleccionado === 'APROBADO') {
      const primerNombre = this.solicitudSeleccionada.nombres ? this.solicitudSeleccionada.nombres.split(' ')[0] : '';
      const nombreFormateado = `${this.solicitudSeleccionada.apellido_paterno} ${this.solicitudSeleccionada.apellido_materno} ${primerNombre}`.trim();

      Swal.fire({
        icon: 'warning',
        title: '¿ESTÁ TOTALMENTE SEGURO?',
        html: `Esta acción aprobará definitivamente la solicitud y registrará al postulante <strong>${nombreFormateado}</strong> en <code>rh_mtrab</code>.<br><br><strong>Esta acción no se puede deshacer.</strong>`,
        showCancelButton: true,
        confirmButtonText: 'Sí, APROBAR',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        focusCancel: true
      }).then(result => {
        if (result.isConfirmed) {
          this.ejecutarCambioEstado();
        }
      });
      return;
    }

    this.ejecutarCambioEstado();
  }

  private ejecutarCambioEstado() {
    this.procesandoEstado = true;
    const currentUser = this.userService.getUser();

    const currentGroupId = currentUser?.group_id ? Number(currentUser.group_id) : null;
    const grupoEncontrado = this.grupos.find(g => Number(g.id) === currentGroupId);

    const nombreGrupo = grupoEncontrado ? grupoEncontrado.grupo : (currentGroupId ? `GRUPO ${currentGroupId}` : 'TALENTO HUMANO');

    const payload = {
      estado: this.nuevoEstadoSeleccionado,
      aprobado_por: currentUser ? currentUser.username : 'SISTEMA',
      aprobacion_grupo: nombreGrupo
    };

    this.thService.updateEstado(this.solicitudSeleccionada.id, payload).subscribe({
      next: (res) => {
        this.procesandoEstado = false;
        this.cerrarModal();
        this.cargarSolicitudes();

        Swal.fire({
          icon: 'success',
          title: '¡Estado Actualizado!',
          text: res.message,
          timer: 2500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      },
      error: (err) => {
        this.procesandoEstado = false;

        // Handle Validation Errors (422 Unprocessable Entity)
        if (err.status === 422 && err.error?.missing_sections) {
          const missingSections = err.error.missing_sections;

          let htmlMessage = `<div class="text-start mt-3"><p class="mb-2"><strong>${err.error.message || 'No se puede enviar a revisión aún.'}</strong></p>`;
          htmlMessage += `<p class="small text-muted mb-2">Por favor complete las siguientes secciones obligatorias:</p>`;
          htmlMessage += `<ul class="list-group list-group-flush border rounded-3 text-start small mb-0">`;

          missingSections.forEach((section: string) => {
            htmlMessage += `<li class="list-group-item bg-light text-danger"><i class="bi bi-x-circle me-2"></i>${section}</li>`;
          });

          htmlMessage += `</ul></div>`;

          Swal.fire({
            icon: 'error',
            title: 'Faltan Datos Obligatorios',
            html: htmlMessage,
            confirmButtonColor: '#0d6efd',
            confirmButtonText: 'Entendido, voy a completarlos'
          });

          return;
        }

        // Generic error handler
        const msg = err.error?.message || 'No se pudo actualizar el estado.';
        Swal.fire({
          icon: 'error',
          title: 'Error al Cambiar Estado',
          text: msg,
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/solicitud-empleo/pages/verSolicitud', id]);
  }

  eliminar(solicitud: any) {
    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar Solicitud?',
      html: `Se eliminará permanentemente la solicitud de <strong>${solicitud.apellido_paterno} ${solicitud.apellido_materno}, ${solicitud.nombres}</strong>.<br><br>Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      focusCancel: true
    }).then(result => {
      if (result.isConfirmed) {
        this.thService.eliminarSolicitud(solicitud.id).subscribe({
          next: () => {
            this.cargarSolicitudes();
            Swal.fire({
              icon: 'success',
              title: '¡Eliminada!',
              text: 'La solicitud ha sido eliminada correctamente.',
              timer: 2000,
              showConfirmButton: false,
              toast: true,
              position: 'top-end'
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al Eliminar',
              text: err.error?.details || err.error?.message || 'No se pudo eliminar la solicitud.',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    });
  }
}
