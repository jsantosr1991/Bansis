import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-evaluacion-interna',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="form" [formGroup]="form" class="card mb-5 shadow-sm border-0 animate-fade-in">
      <div class="card-header bg-dark text-white py-3">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-shield-lock me-2"></i>13. Evaluación y Aprobación Interna
        </h5>
      </div>

      <div class="card-body p-4">
        <!-- NOTA INFORMATIVA -->
        <div class="alert alert-light border-0 shadow-sm d-flex align-items-center mb-4 py-3">
          <i class="bi bi-info-circle-fill text-primary fs-4 me-3"></i>
          <div class="text-muted fw-medium">
            Esta información es generada automáticamente por el sistema para garantizar la trazabilidad del proceso.
          </div>
        </div>

        <div class="row g-4 position-relative">
          <!-- LÍNEA DE TIEMPO VISUAL (Solo Desktop) -->
          <div class="d-none d-lg-block position-absolute start-50 translate-middle-x h-75 border-start border-2 border-light mt-2" style="width: 0; z-index: 0;"></div>

          <!-- BLOQUE 1: ENTREVISTADOR -->
          <div class="col-lg-6" formGroupName="entrevistador">
            <div class="card h-100 border-0 bg-light bg-opacity-50 rounded-4 p-3 shadow-sm-hover transition-all">
              <div class="d-flex align-items-center mb-3">
                <div class="icon-circle bg-primary text-white me-3">
                  <i class="bi bi-person-badge fs-4"></i>
                </div>
                <div>
                  <h6 class="mb-0 fw-bold text-primary">FICHA REGISTRADA POR</h6>
                  <small class="text-muted">Fase de Reclutamiento</small>
                </div>
              </div>

              <div class="p-3 bg-white rounded-3 shadow-sm">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Usuario que lo registró:</label>
                  <p class="form-control-plaintext py-0 fw-semibold text-dark">{{ form.get('entrevistador.nombre')?.value || '---' }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Departamento</label>
                  <p class="form-control-plaintext py-0 text-dark">{{ form.get('entrevistador.grupo')?.value || '---' }}</p>
                </div>
                <div class="mb-0">
                  <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Fecha de registro de ficha de solicitud</label>
                  <p class="form-control-plaintext py-0 text-dark">
                    <i class="bi bi-calendar3 me-2 text-primary"></i>{{ (form.get('entrevistador.fecha')?.value | date:'dd/MM/yyyy HH:mm') || '---' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- BLOQUE 2: APROBACIÓN -->
          <div class="col-lg-6" formGroupName="aprobacion">
            <div class="card h-100 border-0 bg-light bg-opacity-50 rounded-4 p-3 shadow-sm-hover transition-all">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center">
                  <div class="icon-circle me-3" [ngClass]="getStatusClass().bg">
                    <i [class]="'bi ' + getStatusClass().icon + ' fs-4'"></i>
                  </div>
                  <div>
                    <h6 class="mb-0 fw-bold" [ngClass]="getStatusClass().text">APROBACIÓN DEL POSTULANTE</h6>
                    <small class="text-muted">Estado Actual</small>
                  </div>
                </div>
                <span class="badge rounded-pill px-3 py-2 fs-7 shadow-sm" [ngClass]="getStatusClass().bg">
                  {{ getStatusLabel() }}
                </span>
              </div>

              <div class="p-3 bg-white rounded-3 shadow-sm">
                <div *ngIf="form.get('aprobacion.estado')?.value !== 'APROBADO'" class="text-center py-4">
                  <i class="bi bi-clock-history fs-1 text-muted opacity-25 mb-2 d-block"></i>
                  <p class="text-muted mb-0 small fw-bold text-uppercase">Pendiente de resolución</p>
                  <small class="text-secondary">Los datos finales se mostrarán aquí una vez que la solicitud pase a otro estado de aprobación.</small>
                </div>

                <div *ngIf="form.get('aprobacion.estado')?.value === 'APROBADO'" class="animate-fade-in">
                  <div class="mb-3">
                    <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Usuario que autorizó:</label>
                    <p class="form-control-plaintext py-0 fw-semibold text-dark text-uppercase">{{ form.get('aprobacion.aprobado_por')?.value || '---' }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Departamento</label>
                    <p class="form-control-plaintext py-0 text-dark">{{ form.get('aprobacion.grupo')?.value || '---' }}</p>
                  </div>
                  <div class="mb-0">
                    <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Fecha de Autorización</label>
                    <p class="form-control-plaintext py-0 text-dark">
                      <i class="bi bi-check-circle-fill me-2 text-success"></i>{{ (form.get('aprobacion.fecha')?.value | date:'dd/MM/yyyy HH:mm') || '---' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .icon-circle {
      width: 48px; height: 48px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .shadow-sm-hover:hover {
      box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.08) !important;
      transform: translateY(-2px);
    }
    .transition-all { transition: all 0.3s ease; }
    .animate-fade-in { animation: fadeIn 0.5s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .fs-7 { font-size: 0.85rem; }
    .text-uppercase { text-transform: uppercase; }
  `]
})
export class EvaluacionInternaComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() isReadOnly: boolean = false;

  private getLocalDateTimeISO(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 19);
  }

  ngOnInit() {
    // NOTA: Los datos de auditoría se inicializan en el componente padre 
    // y se mantienen aquí para visualización. No sobrescribir con N/A.
  }

  getStatusClass() {
    if (!this.form) return { bg: 'bg-light', text: 'text-muted', icon: 'bi-question-circle' };
    const estado = this.form.get('aprobacion.estado')?.value;
    switch (estado) {
      case 'APROBADO':
        return { bg: 'bg-success text-white', text: 'text-success', icon: 'bi-check-all' };
      case 'RECHAZADO':
        return { bg: 'bg-danger text-white', text: 'text-danger', icon: 'bi-x-circle' };
      case 'EN_REVISION':
        return { bg: 'bg-info text-dark', text: 'text-info', icon: 'bi-pencil-square' };
      case 'BORRADOR':
        return { bg: 'bg-secondary text-white', text: 'text-secondary', icon: 'bi-file-earmark-text' };
      default:
        return { bg: 'bg-warning text-dark', text: 'text-warning', icon: 'bi-clock' };
    }
  }

  getStatusLabel(): string {
    if (!this.form) return 'Cargando...';
    const estado = this.form.get('aprobacion.estado')?.value;
    switch (estado) {
      case 'APROBADO': return 'Aprobado';
      case 'RECHAZADO': return 'Rechazado';
      case 'EN_REVISION': return 'En Revisión';
      case 'BORRADOR': return 'Borrador';
      default: return 'Pendiente';
    }
  }
}
