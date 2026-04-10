import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SoporteService } from '../../../../services/soporte.service';
import { AuthserviceService } from '../../../../services/authservice.service';
import { jwtDecode } from 'jwt-decode';
import { interval, Subscription, switchMap, startWith, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
     <div class="container-fluid fade-in p-4 px-lg-5">
      <!-- Encabezado con Botón Volver Elegante -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div class="d-flex align-items-center">
           <button (click)="goBack()" class="btn btn-white border shadow-sm rounded-pill px-3 py-2 me-3 d-flex align-items-center btn-hover-lift">
              <i class="bi bi-arrow-left text-primary me-2 fw-bold"></i>
              <span class="fw-bold small text-secondary">VOLVER</span>
           </button>
           <div>
              <div class="d-flex align-items-center mb-1">
                <h2 class="fw-bold text-dark mb-0 me-3">Solicitud #{{ idSolicitud.toString().padStart(5, '0') }}</h2>
                <span class="badge rounded-pill px-3 py-1 shadow-sm" [ngClass]="solicitud?.estado === 'pendiente' ? 'bg-warning-subtle text-warning border border-warning' : 'bg-success-subtle text-success border border-success'">
                  {{ solicitud?.estado | uppercase }}
                </span>
              </div>
              <p class="text-muted small mb-0">Gestión individual del requerimiento técnico</p>
           </div>
        </div>
        
        <!-- Botón Resolver -->
        <button *ngIf="esPersonalSistemas && solicitud?.estado === 'pendiente'" 
                class="btn btn-success rounded-pill px-4 py-2 shadow-sm fw-bold btn-hover-lift"
                (click)="marcarComoResuelto()">
          <i class="bi bi-check-circle-fill me-2"></i> Resolver Requerimiento
        </button>
      </div>

      <div class="row g-4">
        <!-- Columna Izquierda: Información de la Solicitud -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 mb-4 h-100">
            <div class="card-header bg-white py-3 border-0">
               <h6 class="fw-bold mb-0">Información del Requerimiento</h6>
            </div>
            <div class="card-body" *ngIf="solicitud">
              <div class="info-item mb-4">
                 <label class="text-muted d-block small fw-bold mb-1">TÍTULO</label>
                 <p class="fw-bold mb-0">{{ solicitud.titulo }}</p>
              </div>

              <div class="info-item mb-4">
                 <label class="text-muted d-block small fw-bold mb-1">TIPO</label>
                 <span class="badge bg-light text-dark border px-2 py-1">{{ getTipoLabel(solicitud.tipo_solicitud) }}</span>
                 <p *ngIf="solicitud.tipo_personalizado" class="small text-muted mt-1">Específicamente: {{ solicitud.tipo_personalizado }}</p>
              </div>

              <div class="info-item mb-4">
                 <label class="text-muted d-block small fw-bold mb-1">DESCRIPCIÓN</label>
                 <p class="text-secondary small">{{ solicitud.descripcion }}</p>
              </div>

              <div class="info-item mb-4">
                 <label class="text-muted d-block small fw-bold mb-1">SOLICITANTE</label>
                 <div class="d-flex align-items-center">
                    <div class="user-avatar-small me-2">{{ solicitud.user?.name?.substring(0,1) }}{{ solicitud.user?.surname?.substring(0,1) }}</div>
                    <div>
                       <p class="mb-0 fw-bold small">{{ solicitud.user?.name }} {{ solicitud.user?.surname }}</p>
                       <p class="text-muted mb-0 x-small">{{ solicitud.area_solicitante }}</p>
                    </div>
                 </div>
              </div>

              <div class="info-item mb-4" *ngIf="solicitud.foto_path">
                 <label class="text-muted d-block small fw-bold mb-1">EVIDENCIA FOTO</label>
                 <img [src]="solicitud.foto_path" class="img-fluid rounded-3 border" (click)="verImagen(solicitud.foto_path)" style="cursor: pointer">
              </div>

              <div class="mt-auto pt-3 border-top x-small text-muted">
                 Registrado el {{ solicitud.created_at | date:'dd/MM/yyyy HH:mm' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Chat / Hilo de conversación -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 h-100 d-flex flex-column" style="min-height: 600px;">
            <div class="card-header bg-white py-3 border-0 d-flex align-items-center justify-content-between">
               <h6 class="fw-bold mb-0">Conversación con el Área de Sistemas</h6>
               
               <div class="d-flex align-items-center gap-2">
                 <button *ngIf="esPersonalSistemas && solicitud?.estado === 'pendiente'" 
                         class="btn btn-primary-subtle text-primary border-primary border-opacity-25 rounded-pill px-3 py-1 btn-sm fw-bold shadow-sm transition-hover"
                         (click)="openMaterialModal()">
                   <i class="bi bi-box-seam me-1"></i> Despachar Insumos
                 </button>

                 <ng-container *ngIf="!esPersonalSistemas">
                    <span *ngIf="solicitud?.visto_por_sistemas === true" class="badge bg-primary-subtle text-primary border border-primary px-3 py-1 rounded-pill">
                        <i class="bi bi-check2-all me-1"></i> Visto por Sistemas
                    </span>
                 </ng-container>
               </div>
            </div>

            <div class="card-body chat-container flex-grow-1 p-4" #scrollContainer>
               <div *ngFor="let msg of mensajes" class="chat-wrapper mb-4" [ngClass]="msg.user_id === userIdActual ? 'my-msg' : 'other-msg'">
                  <div class="d-flex align-items-end" [ngClass]="msg.user_id === userIdActual ? 'flex-row-reverse' : 'flex-row'">
                    <!-- Avatar Minimalista -->
                    <div class="user-avatar-small shadow-sm" [ngClass]="msg.user_id === userIdActual ? 'ms-2 bg-primary text-white' : 'me-2 bg-white border text-primary'">
                      {{ getInitials(msg) }}
                    </div>
                    
                    <div class="chat-bubble shadow-sm p-3 rounded-4 position-relative">
                      <div class="d-flex align-items-center justify-content-between mb-1 gap-3">
                         <span class="fw-bold x-small opacity-75 text-truncate" style="max-width: 120px;">{{ msg.user_id === userIdActual ? 'Tú' : (msg.user?.name || msg.user?.username) }}</span>
                         <span class="opacity-50 x-small">{{ msg.created_at | date:'dd/MM/yyyy HH:mm' }}</span>
                      </div>
                      <p class="mb-0 lh-sm">{{ msg.mensaje }}</p>
                    </div>
                  </div>
               </div>
               
               <div *ngIf="mensajes.length === 0" class="text-center py-5">
                  <div class="empty-chat-icon mb-3">
                    <i class="bi bi-chat-heart text-primary opacity-25" style="font-size: 4rem;"></i>
                  </div>
                  <h5 class="fw-bold text-dark opacity-50">¡Hola! Comencemos por aquí</h5>
                  <p class="text-muted small">El equipo de sistemas está atento a tus mensajes.</p>
               </div>
            </div>

            <div class="card-footer bg-white border-0 p-4 pt-1">
               <!-- Área de entrada Deshabilitada si está Resuelto -->
               <div *ngIf="solicitud?.estado === 'resuelto'" class="alert alert-secondary border-0 rounded-4 py-3 text-center mb-0 fade-in">
                  <i class="bi bi-lock-fill me-2"></i>
                  <span class="fw-bold small text-uppercase">Esta solicitud ha sido resuelta y la conversación se encuentra cerrada.</span>
               </div>

               <div *ngIf="solicitud?.estado !== 'resuelto'" class="chat-input-area p-2 border shadow-sm rounded-4 d-flex align-items-center bg-white transition-hover">
                  <div class="bg-light rounded-3 p-2 me-3 d-none d-md-block">
                    <i class="bi bi-chat-left-text text-primary"></i>
                  </div>
                  <input type="text" class="form-control border-0 bg-transparent shadow-none fs-6 py-2" 
                         placeholder="Escriba un mensaje aquí..." 
                         [(ngModel)]="nuevoMensaje" 
                         (keyup.enter)="enviarMensaje()"
                         [disabled]="sending"
                         style="color: #2d3748; font-weight: 500;">
                  
                  <button class="btn btn-primary rounded-3 shadow d-flex align-items-center justify-content-center btn-send-premium p-0 ms-2" 
                          (click)="enviarMensaje()" 
                          [disabled]="!nuevoMensaje.trim() || sending"
                          style="width: 42px; height: 42px;">
                    <i class="bi" [ngClass]="sending ? 'spinner-border spinner-border-sm' : 'bi-send-fill'" style="font-size: 1.1rem;"></i>
                  </button>
               </div>
               
               <div *ngIf="solicitud?.estado !== 'resuelto'" class="text-center mt-2">
                 <span class="x-small text-muted opacity-50"><i class="bi bi-info-circle me-1"></i>Presione Enter para enviar su mensaje rápidamente</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Despacho de Materiales (Ventana Pequeña) -->
    <div class="premium-modal-overlay fade-in" *ngIf="showMaterialModal">
       <div class="premium-modal-content shadow-lg rounded-5 border-0 overflow-hidden">
          <div class="modal-header-glass p-3 d-flex justify-content-between align-items-center bg-white border-bottom">
             <h6 class="fw-bold mb-0 text-dark"><i class="bi bi-box-seam me-2 text-primary"></i>Despacho de Materiales</h6>
             <button class="btn-close p-2" (click)="closeMaterialModal()"></button>
          </div>
          
          <div class="modal-body-scroll p-4 bg-light bg-opacity-50">
             <!-- Buscador Híbrido Reutilizado -->
              <div class="search-box mb-4 position-relative">
                <label class="x-small fw-bold text-muted mb-2 text-uppercase">Buscador Inteligente</label>
                <div class="input-group input-group-lg shadow-sm rounded-4 overflow-hidden border">
                  <span class="input-group-text bg-white border-0 ps-3"><i class="bi bi-search text-primary"></i></span>
                  <input type="text" class="form-control border-0 shadow-none ps-0" 
                         placeholder="Ej: Cable, Mouse, Teclado..." 
                         [(ngModel)]="searchMaterialTerm" 
                         (input)="onSearchMaterialChange()">
                  <button *ngIf="searchMaterialTerm" class="btn btn-white border-0 py-0 pe-3" (click)="clearSearchMaterial()">
                    <i class="bi bi-x-lg small text-muted"></i>
                  </button>
                </div>

                <!-- Resultados de búsqueda dinámicos -->
                <div class="material-results-modal shadow rounded-4 border mt-2 position-absolute w-100 bg-white" 
                     *ngIf="searchMaterialTerm.length > 0 && showResults" style="z-index: 2000; max-height: 200px; overflow-y: auto;">
                  <div *ngIf="loadingMaterials" class="p-3 text-center">
                    <div class="spinner-border spinner-border-sm text-primary"></div>
                  </div>
                  
                  <div *ngFor="let mat of materialesFiltrados" 
                       class="material-item p-3 border-bottom cursor-pointer hover-bg-light transition-all" 
                       (click)="seleccionarMaterial(mat)">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="me-2">
                         <p class="mb-0 fw-bold text-dark">{{ mat.name }}</p>
                         <p class="mb-0 x-small text-muted">{{ mat.descripcion }}</p>
                      </div>
                      <span class="badge rounded-pill px-3 py-2" [ngClass]="mat.stock > 0 ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'">
                        Stock: {{ mat.stock }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Carrito de Despacho (Ahora arriba del catálogo) -->
              <div class="dispatch-cart fade-in mb-4" *ngIf="carritoMateriales.length > 0">
                 <div class="d-flex justify-content-between align-items-center mb-3">
                   <p class="x-small fw-bold text-primary mb-0 text-uppercase">Materiales seleccionados ({{ carritoMateriales.length }})</p>
                   <button class="btn btn-link btn-sm text-danger p-0 x-small fw-bold text-decoration-none" (click)="carritoMateriales = []">Limpiar todo</button>
                 </div>

                 <div class="list-group list-group-flush border rounded-4 overflow-hidden mb-3 shadow-sm">
                    <div *ngFor="let mat of carritoMateriales; let i = index" class="list-group-item p-3 bg-white">
                       <div class="d-flex justify-content-between align-items-start mb-2">
                          <div>
                             <h6 class="fw-bold mb-0 text-dark small">{{ mat.name }}</h6>
                             <span class="x-small text-muted">Disponible: {{ mat.stock }}</span>
                          </div>
                          <button class="btn-close x-small" (click)="eliminarDelCarrito(i)"></button>
                       </div>

                       <div class="d-flex justify-content-between align-items-center">
                          <div class="input-group input-group-sm" style="max-width: 120px;">
                             <button class="btn btn-outline-secondary border-opacity-25" (click)="ajustarCantidad(mat, -1)">-</button>
                             <input type="number" class="form-control text-center fw-bold border-opacity-25 px-1" 
                                    [(ngModel)]="mat.cantidad_despacho" readonly>
                             <button class="btn btn-outline-secondary border-opacity-25" 
                                     [disabled]="mat.cantidad_despacho >= mat.stock"
                                     (click)="ajustarCantidad(mat, 1)">+</button>
                          </div>
                          <span class="small fw-bold text-primary">{{ mat.cantidad_despacho }} un.</span>
                       </div>
                    </div>
                 </div>

                 <!-- Mensaje de Error de Stock -->
                 <div *ngIf="stockError" class="alert alert-danger p-2 x-small fw-bold text-center rounded-3 mb-3 animate__animated animate__shakeX">
                    <i class="bi bi-exclamation-octagon me-1"></i> {{ stockError }}
                 </div>

                 <!-- Botón de Acción Principal -->
                 <button class="btn btn-primary w-100 py-3 rounded-4 shadow-sm fw-bold d-flex align-items-center justify-content-center gap-2" 
                         [disabled]="dispatching"
                         (click)="procesarDespacho()">
                    <i class="bi" [ngClass]="dispatching ? 'spinner-border spinner-border-sm' : 'bi-check-all fs-5'"></i>
                    {{ dispatching ? 'PROCESANDO...' : 'CONFIRMAR DESPACHO TOTAL' }}
                 </button>
              </div>

              <!-- Catálogo de Productos Disponibles (Ahora debajo del carrito) -->
              <div class="quick-list mb-4">
                <p class="x-small fw-bold text-muted mb-2 text-uppercase">Catálogo de Productos Disponibles</p>
                <div class="row g-2">
                   <div class="col-12" *ngFor="let mat of listadoInicialMateriales">
                      <div class="p-3 bg-white border rounded-4 d-flex justify-content-between align-items-center transition-all"
                           [ngClass]="mat.stock > 0 ? 'cursor-pointer hover-shadow' : 'opacity-50 grayscale-filter bg-light'"
                           (click)="mat.stock > 0 && seleccionarMaterial(mat)">
                         <div>
                            <p class="mb-0 small fw-bold text-dark">{{ mat.name }}</p>
                            <div class="d-flex align-items-center">
                               <span class="x-small fw-bold me-2" [ngClass]="mat.stock > 0 ? 'text-success' : 'text-danger'">
                                  {{ mat.stock > 0 ? 'STOCK: ' + mat.stock : 'SIN STOCK / AGOTADO' }}
                               </span>
                               <span *ngIf="mat.stock > 0" class="badge bg-success-subtle text-success border-success border-opacity-25 x-small">Disponible</span>
                               <span *ngIf="mat.stock <= 0" class="badge bg-danger-subtle text-danger border-danger border-opacity-25 x-small">No disponible</span>
                            </div>
                         </div>
                         <i class="bi" [ngClass]="mat.stock > 0 ? 'bi-plus-circle-fill text-primary' : 'bi-dash-circle text-muted'" class="fs-5 opacity-50"></i>
                      </div>
                   </div>
                </div>
              </div>
          </div>
          
          <div class="modal-footer bg-white p-3 border-top text-center" *ngIf="carritoMateriales.length === 0">
             <button class="btn btn-light rounded-pill px-4 text-secondary small fw-bold" (click)="closeMaterialModal()">CANCELAR</button>
          </div>
       </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .chat-container { 
      overflow-y: auto; 
      background-color: #f0f2f5; 
      background-image: radial-gradient(#d1d5db 0.5px, transparent 0.5px);
      background-size: 15px 15px;
    }
    .chat-wrapper { display: flex; flex-direction: column; width: 100%; }
    .my-msg { align-items: flex-end; }
    .other-msg { align-items: flex-start; }
    .chat-bubble { max-width: 85%; line-height: 1.4; transition: all 0.2s ease; white-space: pre-wrap; }
    .my-msg .chat-bubble { 
      background: linear-gradient(135deg, #0d6efd 0%, #004dc7 100%); 
      color: white; 
      border-bottom-right-radius: 4px !important; 
      box-shadow: 0 4px 15px rgba(13, 110, 253, 0.2) !important;
    }
    .other-msg .chat-bubble { 
      background-color: white; 
      color: #333; 
      border-bottom-left-radius: 4px !important; 
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
    }
    .user-avatar-small { 
      width: 32px; height: 32px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.65rem;
    }
    .x-small { font-size: 0.65rem; }
    .chat-input-area:focus-within { 
      border-color: #0d6efd !important; 
      background-color: #fff !important; 
      box-shadow: 0 10px 25px rgba(13, 110, 253, 0.1) !important;
    }
    .btn-send-premium {
      background: linear-gradient(135deg, #0d6efd 0%, #004dc7 100%);
      border: none;
      transition: all 0.2s ease;
    }
    .btn-send-premium:hover:not(:disabled) {
      transform: scale(1.05) rotate(-5deg);
      box-shadow: 0 5px 15px rgba(13, 110, 253, 0.4);
    }
    .btn-hover-lift { transition: all 0.2s ease; }
    .btn-hover-lift:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
    /* Scrollbar minimalista */
    .chat-container::-webkit-scrollbar { width: 5px; }
    .chat-container::-webkit-scrollbar-track { background: transparent; }
    .chat-container::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
    
    .hover-bg-light:hover { background-color: #f8f9fa; }
    .letter-spacing-1 { letter-spacing: 0.5px; }
    .active-selection { background-color: rgba(13, 110, 253, 0.05) !important; border-left: 3px solid #0d6efd !important; }
    .material-results { box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important; }

    /* Estilos del Modal Premium */
    .premium-modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1040; padding: 20px;
    }
    .premium-modal-content {
      background: white; width: 100%; max-width: 500px;
      animation: modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes modalSlideIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .modal-body-scroll { max-height: 70vh; overflow-y: auto; }
    .hover-shadow:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important; transform: translateY(-2px); }
    .transition-all { transition: all 0.2s ease; }
    .material-results-modal { max-height: 200px; overflow-y: auto; }
  `]
})
export class DetalleSolicitudComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  idSolicitud!: number;
  solicitud: any;
  mensajes: any[] = [];
  nuevoMensaje = '';
  userIdActual!: number;
  userNameActual: string = '';
  userSurnameActual: string = '';
  esPersonalSistemas = false;
  sending = false;

  // Gestión de Materiales
  showMaterialModal = false;
  materialesFiltrados: any[] = [];
  listadoInicialMateriales: any[] = [];
  carritoMateriales: any[] = []; // Nueva lista de materiales seleccionados
  searchMaterialTerm: string = '';
  loadingMaterials = false;
  showResults = false;
  dispatching = false;
  stockError: string | null = null; // Mensaje de error de stock
  private searchSubject = new Subject<string>();
  
  private pollingSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private soporteService: SoporteService,
    private authService: AuthserviceService,
    private location: Location
  ) {}

  ngOnInit() {
    this.idSolicitud = +this.route.snapshot.params['id'];
    this.esPersonalSistemas = this.authService.tieneAlgunGrupo(['sistemas', 'administradores']);
    
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload: any = jwtDecode(token);
        this.userIdActual = Number(payload.sub || payload.id);
        
        if (payload.empe_nom) {
           const partes = payload.empe_nom.trim().replace(/\s+/g, ' ').split(' ');
           if (partes.length >= 2) {
             this.userNameActual = partes[0];
             this.userSurnameActual = partes[1];
           } else {
             this.userNameActual = partes[0];
             this.userSurnameActual = '';
           }
        }
      } catch (e) {
        console.error('Error al decodificar token', e);
      }
    }

    this.cargarDetalle();
    this.iniciarPolling();
    this.configurarBusquedaMateriales();
    if (this.esPersonalSistemas) {
      this.cargarListadoInicialMateriales();
    }
  }

  private configurarBusquedaMateriales() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) {
           this.showResults = false;
           return [];
        }
        this.loadingMaterials = true;
        this.showResults = true;
        return this.soporteService.getMateriales(term);
      })
    ).subscribe({
      next: (data) => {
        this.materialesFiltrados = data;
        this.loadingMaterials = false;
      },
      error: () => {
        this.loadingMaterials = false;
        this.showResults = false;
      }
    });
  }

  cargarListadoInicialMateriales() {
    this.soporteService.getMateriales('').subscribe({
      next: (data) => this.listadoInicialMateriales = data // Eliminado .slice(0, 5) para ver todo
    });
  }

  onSearchMaterialChange() {
    this.searchSubject.next(this.searchMaterialTerm);
  }

  clearSearchMaterial() {
    this.searchMaterialTerm = '';
    this.showResults = false;
    this.materialesFiltrados = [];
  }

  seleccionarMaterial(mat: any) {
    if (mat.stock <= 0) return;
    
    // Verificar si ya está en el carrito
    const existe = this.carritoMateriales.find(m => m.id === mat.id);
    if (!existe) {
      this.carritoMateriales.push({
        ...mat,
        cantidad_despacho: 1
      });

      // Notificación rápida tipo Toast
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Producto añadido',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'El producto ya está en la lista',
        showConfirmButton: false,
        timer: 1500
      });
    }
    this.showResults = false;
    this.searchMaterialTerm = '';
  }

  ajustarCantidad(mat: any, delta: number) {
    const nuevaCant = mat.cantidad_despacho + delta;
    if (nuevaCant >= 1 && nuevaCant <= mat.stock) {
      mat.cantidad_despacho = nuevaCant;
      this.stockError = null;
    } else if (nuevaCant > mat.stock) {
      this.stockError = `Stock máximo alcanzado para ${mat.name}`;
      setTimeout(() => this.stockError = null, 3000);
    }
  }

  eliminarDelCarrito(index: number) {
    this.carritoMateriales.splice(index, 1);
  }

  openMaterialModal() {
    this.showMaterialModal = true;
    this.carritoMateriales = [];
    this.searchMaterialTerm = '';
    this.stockError = null;
  }

  closeMaterialModal() {
    this.showMaterialModal = false;
    this.carritoMateriales = [];
    this.searchMaterialTerm = '';
    this.stockError = null;
  }

  procesarDespacho() {
    if (this.carritoMateriales.length === 0 || this.dispatching) return;

    Swal.fire({
      title: '¿Confirmar Despacho?',
      html: `Se despacharán <b>${this.carritoMateriales.length}</b> producto(s) para esta solicitud.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, despachar todo',
      confirmButtonColor: '#004dc7'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dispatching = true;
        
        const materialesDato = this.carritoMateriales.map(m => ({
          id: m.id,
          cantidad: m.cantidad_despacho
        }));

        this.soporteService.despacharMaterial(this.idSolicitud, materialesDato).subscribe({
          next: (res) => {
            Swal.fire('¡Éxito!', res.message, 'success');
            this.dispatching = false;
            this.closeMaterialModal();
            this.soporteService.getMensajes(this.idSolicitud).subscribe(data => this.mensajes = data);
            this.cargarListadoInicialMateriales();
          },
          error: (err) => {
            Swal.fire('Error', err.error.error || 'No se pudo procesar el despacho', 'error');
            this.dispatching = false;
          }
        });
      }
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  cargarDetalle() {
    this.soporteService.getDetalle(this.idSolicitud).subscribe({
      next: (data) => this.solicitud = data
    });
  }

  iniciarPolling() {
    this.pollingSub = interval(10000)
      .pipe(
        startWith(0),
        switchMap(() => this.soporteService.getMensajes(this.idSolicitud))
      ).subscribe({
        next: (data) => {
          if (data.length !== this.mensajes.length) {
            this.mensajes = data;
          }
        }
      });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() || this.sending) return;

    this.sending = true;
    this.soporteService.enviarMensaje(this.idSolicitud, this.nuevoMensaje).subscribe({
      next: (msg) => {
        // El servidor ahora retorna el comentario con la relación 'user' cargada
        this.mensajes.push(msg);
        this.nuevoMensaje = '';
        this.sending = false;
        this.scrollToBottom();
      },
      error: () => this.sending = false
    });
  }

  marcarComoResuelto() {
    Swal.fire({
      title: '¿Confirmar resolución?',
      text: 'La solicitud se marcará como resuelta y se notificará al usuario.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, resolver',
      confirmButtonColor: '#198754'
    }).then((result) => {
      if (result.isConfirmed) {
         this.soporteService.cambiarEstado(this.idSolicitud).subscribe({
           next: () => {
             this.solicitud.estado = 'resuelto';
             Swal.fire('¡Resuelto!', 'La solicitud ha sido cerrada exitosamente.', 'success');
           }
         });
      }
    });
  }

  getTipoLabel(tipo: string): string {
    const labels:any = { 
      'MANT': 'Mantenimiento', 'HARD': 'Hardware', 'CONS': 'Insumos', 
      'SOFT': 'Software', 'RED': 'Redes', 'OTRO': 'Otro' 
    };
    return labels[tipo] || tipo;
  }

  verImagen(url: string) {
    Swal.fire({
      imageUrl: url,
      imageAlt: 'Evidencia',
      showCloseButton: true,
      showConfirmButton: false
    });
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getInitials(msg: any): string {
    if (msg.user?.name || msg.user?.surname) {
      const n = (msg.user.name || '').substring(0, 1);
      const s = (msg.user.surname || '').substring(0, 1);
      return (n + s).toUpperCase() || '?';
    }
    if (msg.user?.username) {
      return msg.user.username.substring(0, 2).toUpperCase();
    }
    if (msg.user_id === this.userIdActual) {
      const n = (this.userNameActual || '').substring(0, 1);
      const s = (this.userSurnameActual || '').substring(0, 1);
      return (n + s).toUpperCase() || 'YO';
    }
    return '?';
  }
}
