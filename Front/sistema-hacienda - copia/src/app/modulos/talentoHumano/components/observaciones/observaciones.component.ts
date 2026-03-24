import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-observaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="parentForm" class="card mb-4 shadow-sm border-0 animate-fade-in">
      <div class="card-header bg-primary text-white py-3">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-chat-left-text-fill me-2"></i>12. Observaciones internas
        </h5>
      </div>
      
      <div class="card-body p-4">
        <!-- Nota Informativa -->
        <div class="alert alert-warning d-flex align-items-center mb-4 border-0 shadow-sm py-3" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
          <div>
            <strong>Uso Exclusivo Interno:</strong> Este espacio está destinado para observaciones realizadas por Mando Medio, Administración o Recursos Humanos.
          </div>
        </div>

        <!-- Historial de Observaciones (Timeline/Cards) -->
        <div class="observaciones-historial mb-5">
          <h6 class="fw-bold mb-3 text-secondary text-uppercase small tracking-wider">Historial de Comentarios</h6>
          
          <div *ngIf="observaciones.length === 0" class="text-center py-4 border border-dashed rounded-4 bg-light bg-opacity-50">
            <i class="bi bi-chat-dots fs-1 text-muted mb-2 d-block"></i>
            <p class="mb-0 text-muted italic">No hay observaciones registradas todavía.</p>
          </div>

          <div class="timeline" *ngIf="observaciones.length > 0">
            <div *ngFor="let obs of observaciones.controls; let i=index" class="timeline-item pb-4 position-relative">
              <div class="timeline-marker shadow-sm" [ngClass]="getTipoClass(obs.get('tipo')?.value)">
                <i class="bi" [ngClass]="getTipoIcon(obs.get('tipo')?.value)"></i>
              </div>
              <div class="timeline-content card border-0 shadow-sm rounded-4 ms-5 overflow-hidden animate-fade-up" [style.animation-delay]="i * 100 + 'ms'">
                <div class="card-header border-0 py-2 px-3 d-flex justify-content-between align-items-center" [ngClass]="getTipoHeaderClass(obs.get('tipo')?.value)">
                  <span class="fw-bold small">{{ obs.get('tipo')?.value }}</span>
                  <div class="d-flex align-items-center">
                    <span class="text-muted small me-3"><i class="bi bi-calendar3 me-1"></i>{{ obs.get('fecha')?.value | date:'dd/MM/yyyy' }}</span>
                    <button type="button" class="btn btn-link text-danger p-0" (click)="eliminarObservacion(i)" *ngIf="!isReadOnly" title="Eliminar observación">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
                <div class="card-body py-3 px-3">
                  <p class="mb-1 text-dark">{{ obs.get('comentario')?.value }}</p>
                  <div class="text-muted small text-end mt-2">
                    <i class="bi bi-person-circle me-1"></i>Registrado por: <strong>{{ obs.get('usuario')?.value }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario para Nueva Observación (Solo si no es lectura) -->
        <div class="nueva-observacion p-4 border rounded-4 bg-light bg-opacity-75 shadow-sm" *ngIf="!isReadOnly">
          <h6 class="fw-bold mb-3 d-flex align-items-center">
            <i class="bi bi-plus-circle-fill text-primary me-2"></i>Nueva Observación
          </h6>
          
          <form [formGroup]="nuevaObsForm" (ngSubmit)="agregarObservacion()">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label fw-bold text-secondary small">TIPO DE OBSERVACIÓN</label>
                <select class="form-select border shadow-sm" formControlName="tipo" [class.is-invalid]="nuevaObsForm.get('tipo')?.invalid && nuevaObsForm.get('tipo')?.touched">
                  <option value="">Seleccione el nivel...</option>
                  <option value="Mando Medio">Mando Medio</option>
                  <option value="Administración">Administración</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                </select>
                <div class="invalid-feedback">Por favor seleccione el tipo.</div>
              </div>
              
              <div class="col-md-8">
                <label class="form-label fw-bold text-secondary small">COMENTARIO INTERNO</label>
                <textarea class="form-control border shadow-sm" formControlName="comentario" rows="3" maxlength="500"
                          placeholder="Comentarios relevantes sobre el postulante, verificación de datos, recomendaciones, etc."
                          [class.is-invalid]="nuevaObsForm.get('comentario')?.invalid && nuevaObsForm.get('comentario')?.touched"></textarea>
                <div class="d-flex justify-content-between mt-1">
                  <div class="invalid-feedback" *ngIf="nuevaObsForm.get('comentario')?.errors?.['required']">El comentario es obligatorio.</div>
                  <div class="ms-auto">
                    <span class="badge" [ngClass]="getCounterClass(nuevaObsForm.get('comentario')?.value?.length || 0)">
                      {{ nuevaObsForm.get('comentario')?.value?.length || 0 }} / 500
                    </span>
                  </div>
                </div>
              </div>

              <div class="col-12 text-end">
                <button type="submit" class="btn btn-primary px-4 py-2 rounded-pill shadow-sm fw-bold">
                  <i class="bi bi-check2-circle me-1"></i> Agregar Comentario
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tracking-wider { letter-spacing: 0.05em; }
    .border-dashed { border-style: dashed !important; border-width: 2px !important; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    .animate-fade-up { animation: fadeInUp 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

    /* Timeline Styles */
    .timeline { position: relative; padding-left: 1rem; }
    .timeline::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #dee2e6;
    }
    .timeline-item { position: relative; }
    .timeline-marker {
      position: absolute;
      left: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      border: 3px solid #fff;
      color: #fff;
    }
    .marker-mando { background: #6f42c1; }
    .marker-admin { background: #fd7e14; }
    .marker-rrhh { background: #0d6efd; }
    
    .header-mando { background-color: rgba(111, 66, 193, 0.08); color: #6f42c1; }
    .header-admin { background-color: rgba(253, 126, 20, 0.08); color: #fd7e14; }
    .header-rrhh { background-color: rgba(13, 110, 253, 0.08); color: #0d6efd; }
    textarea { text-transform: uppercase; }
    textarea::placeholder { text-transform: none; }
  `]
})
export class ObservacionesComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  @Input() isReadOnly: boolean = false;
  @Input() controlName: string = 'observaciones';
  @Input() currentUser: string = 'SISTEMA';

  nuevaObsForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initNuevaObsForm();
  }

  ngOnInit() {
    // Ensure observations array exists if not provided
    if (!this.parentForm.get(this.controlName)) {
      this.parentForm.addControl(this.controlName, this.fb.array([]));
    }
  }

  private initNuevaObsForm() {
    this.nuevaObsForm = this.fb.group({
      tipo: ['', Validators.required],
      comentario: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  get observaciones() {
    return this.parentForm.get(this.controlName) as FormArray;
  }

  agregarObservacion() {
    if (this.nuevaObsForm.valid) {
      const val = this.nuevaObsForm.value;
      const observation = this.fb.group({
        tipo: [val.tipo],
        comentario: [val.comentario],
        fecha: [new Date().toISOString().split('T')[0]], // YYYY-MM-DD
        usuario: [this.currentUser] // Use the injected user or current username
      });

      this.observaciones.push(observation);
      this.nuevaObsForm.reset({ tipo: '', comentario: '' });
      this.nuevaObsForm.markAsPristine();
      this.nuevaObsForm.markAsUntouched();
    } else {
      this.nuevaObsForm.markAllAsTouched();
    }
  }

  eliminarObservacion(index: number) {
    Swal.fire({
      title: '¿Eliminar observación?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.observaciones.removeAt(index);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    });
  }

  getTipoClass(tipo: string): string {
    switch (tipo) {
      case 'Mando Medio': return 'marker-mando';
      case 'Administración': return 'marker-admin';
      case 'Recursos Humanos': return 'marker-rrhh';
      default: return 'bg-secondary';
    }
  }

  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'Mando Medio': return 'bi-person-badge';
      case 'Administración': return 'bi-briefcase';
      case 'Recursos Humanos': return 'bi-shield-check';
      default: return 'bi-chat';
    }
  }

  getTipoHeaderClass(tipo: string): string {
    switch (tipo) {
      case 'Mando Medio': return 'header-mando';
      case 'Administración': return 'header-admin';
      case 'Recursos Humanos': return 'header-rrhh';
      default: return 'bg-light';
    }
  }

  getCounterClass(len: number): string {
    if (len > 450) return 'bg-danger text-white';
    if (len > 400) return 'bg-warning text-dark';
    return 'bg-secondary text-white';
  }
}

