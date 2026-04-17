import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SoporteService } from '../../../../services/soporte.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nueva-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container-fluid fade-in p-4">
      <div class="header-section mb-4">
        <h2 class="fw-bold text-primary mb-1"><i class="bi bi-plus-circle-dotted me-2"></i>Nueva Solicitud de Soporte</h2>
        <p class="text-muted">Describa su requerimiento técnico para recibir asistencia del área de sistemas.</p>
      </div>

      <div class="row justify-content-center">
        <div class="col-xl-8">
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <!-- Stepper Indicator -->
            <div class="card-header bg-light border-0 py-3">
              <div class="d-flex justify-content-around stepper">
                <div class="step" [class.active]="step >= 1" [class.completed]="step > 1">
                  <span class="step-num">1</span>
                  <span class="step-text d-none d-md-inline">Tipo</span>
                </div>
                <div class="step-line"></div>
                <div class="step" [class.active]="step >= 2" [class.completed]="step > 2">
                  <span class="step-num">2</span>
                  <span class="step-text d-none d-md-inline">Detalles</span>
                </div>
                <div class="step-line"></div>
                <div class="step" [class.active]="step >= 3" [class.completed]="step > 3">
                  <span class="step-num">3</span>
                  <span class="step-text d-none d-md-inline">Adjuntos</span>
                </div>
              </div>
            </div>

            <div class="card-body p-4 p-md-5">
              <form [formGroup]="solicitudForm">
                
                <!-- STEP 1: Tipo de Solicitud -->
                <div *ngIf="step === 1" class="animate-content">
                  <h4 class="fw-bold mb-4">¿Qué tipo de requerimiento necesita?</h4>
                  <div class="row g-3">
                    <div class="col-md-4" *ngFor="let opt of tiposOpciones">
                      <div class="type-card" 
                           [class.selected]="solicitudForm.get('tipo_solicitud')?.value === opt.code"
                           (click)="seleccionarTipo(opt.code)">
                        <div class="icon-circle mb-3">
                          <i [class]="opt.icon"></i>
                        </div>
                        <h6 class="fw-bold mb-1">{{opt.label}}</h6>
                        <p class="small text-muted mb-0">{{opt.desc}}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Input manual si elige OTRO -->
                  <div class="mt-4" *ngIf="solicitudForm.get('tipo_solicitud')?.value === 'OTRO'">
                    <label class="form-label fw-bold">Especifique el tipo:</label>
                    <input type="text" class="form-control rounded-3" formControlName="tipo_personalizado" 
                           placeholder="Ej: Problemas con cámara de seguridad">
                  </div>
                </div>

                <!-- STEP 2: Título y Descripción -->
                <div *ngIf="step === 2" class="animate-content">
                  <h4 class="fw-bold mb-4">Cuéntenos más sobre su solicitud</h4>
                  
                  <div class="mb-3">
                    <label class="form-label fw-bold">Título o Resumen <span class="text-danger">*</span></label>
                    <input type="text" class="form-control rounded-3 py-2" formControlName="titulo" 
                           [placeholder]="currentTitlePlaceholder">
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-bold">Descripción detallada <span class="text-danger">*</span></label>
                    <textarea class="form-control rounded-3" formControlName="descripcion" rows="4"
                              [placeholder]="currentPlaceholder"></textarea>
                  </div>

                  <div class="alert alert-info border-0 rounded-4 small">
                    <i class="bi bi-info-circle me-2"></i>
                    <strong>Nota:</strong> Su área de trabajo y empresa se capturarán automáticamente.
                  </div>
                </div>

                <!-- STEP 3: Foto -->
                <div *ngIf="step === 3" class="animate-content">
                  <h4 class="fw-bold mb-4">¿Desea adjuntar una fotografía? (Opcional)</h4>
                  
                  <div class="upload-area" (click)="fileInput.click()" [class.has-image]="previewUrl">
                    <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" hidden>
                    
                    <div *ngIf="!previewUrl" class="text-center">
                      <i class="bi bi-camera-fill fs-1 text-primary opacity-50 mb-3"></i>
                      <p class="mb-0 fw-bold">Haga clic para tomar una foto o seleccionar un archivo</p>
                      <p class="text-muted small">Formatos permitidos: JPG, PNG</p>
                    </div>

                    <div *ngIf="previewUrl" class="preview-container">
                      <img [src]="previewUrl" alt="Vista previa" class="img-fluid rounded-4 shadow-sm">
                      <button type="button" class="btn btn-danger btn-sm rounded-circle remove-btn" (click)="removeImage($event)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="d-flex justify-content-between mt-5">
                  <button type="button" class="btn btn-light rounded-pill px-4" 
                          (click)="goBack()" [disabled]="loading">
                    Anterior
                  </button>
                  
                  <button type="button" class="btn btn-primary rounded-pill px-4 shadow-sm"
                          *ngIf="step < 3" (click)="goNext()" [disabled]="!isStepValid()">
                    Siguiente
                  </button>

                  <button type="button" class="btn btn-success rounded-pill px-5 shadow-sm fw-bold"
                          *ngIf="step === 3" (click)="onSubmit()" [disabled]="loading || solicitudForm.invalid">
                    <span *ngIf="!loading">Enviar Solicitud</span>
                    <span *ngIf="loading"><span class="spinner-border spinner-border-sm me-2"></span>Enviando...</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .stepper { position: relative; width: 100%; }
    .step { display: flex; flex-direction: column; align-items: center; z-index: 1; position: relative; }
    .step-num { 
      width: 32px; height: 32px; border-radius: 50%; background: #dee2e6; color: #6c757d;
      display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 5px;
      transition: all 0.3s;
    }
    .step.active .step-num { background: #0d6efd; color: white; transform: scale(1.1); box-shadow: 0 0 10px rgba(13,110,253,0.3); }
    .step.completed .step-num { background: #198754; color: white; }
    .step-text { font-size: 0.75rem; font-weight: 600; color: #adb5bd; }
    .step.active .step-text { color: #0d6efd; }
    .step-line { flex: 1; height: 2px; background: #dee2e6; margin-top: 15px; }

    .type-card {
      border: 2px solid #f1f3f5; border-radius: 16px; padding: 20px; text-align: center;
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; height: 100%;
    }
    .type-card:hover { border-color: #0d6efd; background-color: #f8fbff; transform: translateY(-5px); }
    .type-card.selected { border-color: #0d6efd; background-color: #e7f1ff; box-shadow: 0 10px 20px rgba(13,110,253,0.1); }
    .icon-circle { 
      width: 50px; height: 50px; background: #f8f9fa; border-radius: 12px; margin: 0 auto;
      display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #0d6efd;
    }
    .type-card.selected .icon-circle { background: #0d6efd; color: white; }

    .upload-area {
      border: 2px dashed #dee2e6; border-radius: 20px; padding: 40px; cursor: pointer;
      transition: all 0.3s; background: #fff; position: relative; min-height: 200px;
      display: flex; align-items: center; justify-content: center;
    }
    .upload-area:hover { border-color: #0d6efd; background-color: #f8fbff; }
    .upload-area.has-image { border-style: solid; padding: 10px; }
    .preview-container { position: relative; width: 100%; }
    .remove-btn { position: absolute; top: 10px; right: 10px; z-index: 5; }

    .animate-content { animation: slideIn 0.3s ease-out; }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  `]
})
export class NuevaSolicitudComponent implements OnInit {
  solicitudForm: FormGroup;
  step = 1;
  loading = false;
  previewUrl: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private soporteService: SoporteService,
    private router: Router
  ) {
    this.solicitudForm = this.fb.group({
      tipo_solicitud: ['', Validators.required],
      tipo_personalizado: [''],
      titulo: ['', [Validators.required, Validators.maxLength(150)]],
      descripcion: ['', Validators.required],
    });
  }

  get currentPlaceholder(): string {
    const tipo = this.solicitudForm.get('tipo_solicitud')?.value;
    const opcion = this.tiposOpciones.find(o => o.code === tipo);
    return opcion?.placeholder || 'Describa el problema o necesidad técnica con la mayor claridad posible...';
  }

  get currentTitlePlaceholder(): string {
    const tipo = this.solicitudForm.get('tipo_solicitud')?.value;
    const opcion = this.tiposOpciones.find(o => o.code === tipo);
    return opcion?.title_placeholder || 'Ej: Impresora no reconoce el tóner';
  }

  ngOnInit() { }

  tiposOpciones = [
    {
      code: 'MANT', label: 'Mantenimiento', icon: 'bi bi-tools',
      desc: 'Hardware dañado o preventivo',
      title_placeholder: 'Ej: Mantenimiento preventivo PC área rrhh',
      placeholder: 'Ej: El ventilador de la PC hace mucho ruido, requiere limpieza interna.'
    },
    {
      code: 'HARD', label: 'Hardware', icon: 'bi bi-pc-display',
      desc: 'Solicitud de equipos nuevos',
      title_placeholder: 'Ej: Solicitud de mouse y teclado ergonómico',
      placeholder: 'Ej: Solicito un mouse inalambrico y teclado nuevo para el área de balanza Primobanano.'
    },
    {
      code: 'CONS', label: 'Insumos', icon: 'bi bi-printer',
      desc: 'Tinta, tóner, papel, etc.',
      title_placeholder: 'Ej: Solicitud de tinta para impresora área bodega',
      placeholder: 'Ej: Se agotó la tinta negra para la impresora HP del área de bodega Primobanano.'
    },
    {
      code: 'SOFT', label: 'Software', icon: 'bi bi-window-stack',
      desc: 'Accesos o errores de sistema',
      title_placeholder: 'Ej: Error en el modulo de Asistencia',
      placeholder: 'Ej: Error al intentar ingresar al módulo de Asistencia, aparece mensaje de conexión.'
    },
    {
      code: 'RED', label: 'Redes', icon: 'bi bi-wifi',
      desc: 'Internet o conectividad',
      title_placeholder: 'Ej: No hay conexión a internet en empacadora',
      placeholder: 'Ej: La señal de Wi-Fi es muy débil en zona de empacadora Sofca.'
    },
    {
      code: 'OTRO', label: 'Otro', icon: 'bi bi-question-circle',
      desc: 'Otros requerimientos',
      title_placeholder: 'Ej: Asistencia para configuración de escáner en red',
      placeholder: 'Ej: Apoyo en configuración de correo en celular, servicios técnicos generales o asistencia en sitio.'
    },
  ];

  seleccionarTipo(code: string) {
    this.solicitudForm.patchValue({ tipo_solicitud: code });
    if (code !== 'OTRO') {
      this.solicitudForm.get('tipo_personalizado')?.reset();
    }
  }

  isStepValid(): boolean {
    if (this.step === 1) {
      const tipo = this.solicitudForm.get('tipo_solicitud')?.value;
      if (tipo === 'OTRO') return !!this.solicitudForm.get('tipo_personalizado')?.value;
      return !!tipo;
    }
    if (this.step === 2) {
      return (this.solicitudForm.get('titulo')?.valid ?? false) &&
        (this.solicitudForm.get('descripcion')?.valid ?? false);
    }
    return true;
  }

  goNext() {
    if (this.isStepValid()) this.step++;
  }

  goBack() {
    if (this.step > 1) {
      this.step--;
    } else {
      this.router.navigate(['/soporte-tecnico/lista']);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'warning',
          title: 'Archivo muy pesado',
          text: 'La imagen excede el límite permitido de 5MB. Por favor, selecciona una imagen más ligera.',
          confirmButtonColor: '#0d6efd'
        });
        this.selectedFile = null;
        this.previewUrl = null;
        event.target.value = ''; // Limpiar el input
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.previewUrl = null;
    this.selectedFile = null;
  }

  onSubmit() {
    if (this.solicitudForm.invalid) return;

    this.loading = true;
    const formData = new FormData();
    formData.append('tipo_solicitud', this.solicitudForm.get('tipo_solicitud')?.value);
    formData.append('tipo_personalizado', this.solicitudForm.get('tipo_personalizado')?.value || '');
    formData.append('titulo', this.solicitudForm.get('titulo')?.value);
    formData.append('descripcion', this.solicitudForm.get('descripcion')?.value);

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    this.soporteService.crearSolicitud(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Solicitud enviada',
          text: 'Su requerimiento ha sido registrado exitosamente.',
          confirmButtonColor: '#0d6efd'
        }).then(() => this.router.navigate(['/soporte-tecnico/lista']));
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar la solicitud. Intente nuevamente.'
        });
      }
    });
  }
}
