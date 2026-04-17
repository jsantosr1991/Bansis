import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-experiencia-laboral',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="card mb-4 shadow-sm border-0 animate-fade">
      <div class="card-header bg-primary text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-briefcase me-2"></i>8. Experiencia Laboral</h5>
      </div>
      <div class="card-body p-4">
        
        <!-- PREGUNTA INICIAL: ¿HA TRABAJADO ANTES? -->
        <div class="p-4 bg-light border-start border-5 border-primary rounded-4 mb-4 shadow-sm">
          <label class="form-label fw-bold d-flex align-items-center mb-3 text-primary fs-5">
            <i class="bi bi-question-circle-fill me-2"></i> ¿Ha trabajado anteriormente? <span class="text-danger ms-1 small">*</span>
          </label>
          <div class="d-flex gap-4">
            <div class="form-check custom-radio">
              <input class="form-check-input" type="radio" [value]="false" formControlName="sin_experiencia" id="expSi" (change)="onSinExperienciaChange()">
              <label class="form-check-label fw-semibold" for="expSi">Sí, tiene experiencia laboral</label>
            </div>
            <div class="form-check custom-radio">
              <input class="form-check-input" type="radio" [value]="true" formControlName="sin_experiencia" id="expNo" (change)="onSinExperienciaChange()">
              <label class="form-check-label fw-semibold" for="expNo">No, es su primer empleo / No ha trabajado</label>
            </div>
          </div>
          
          <div *ngIf="form.get('sin_experiencia')?.value === true" class="mt-3 animate-fade">
            <div class="alert alert-info border-0 shadow-sm d-flex align-items-center mb-0">
              <i class="bi bi-info-circle-fill fs-4 me-3"></i>
              <div>
                <span class="fw-bold">Nota:</span> Se registrará el perfil como aspirante sin experiencia previa. No es necesario completar esta sección.
              </div>
            </div>
          </div>

          <div *ngIf="form.hasError('minExperienceRequired') && form.get('sin_experiencia')?.touched" class="mt-3 alert alert-danger border-start border-4 border-danger shadow-sm animate-fade py-2 px-3">
             <div class="d-flex align-items-center fw-bold">
               <i class="bi bi-exclamation-octagon-fill fs-5 me-2"></i> 
               <span>Requerido: Debe agregar al menos un registro de experiencia laboral si indica que sí ha trabajado.</span>
             </div>
          </div>
        </div>

        <!-- LISTADO DE EXPERIENCIAS (Condicional) -->
        <div *ngIf="form.get('sin_experiencia')?.value === false" class="animate-fade">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h6 class="fw-bold text-dark mb-1">Registros de Empleo</h6>
              <p class="text-muted small mb-0">Puede registrar hasta 3 de las experiencias laborales más relevantes.</p>
            </div>
            <div class="text-end" *ngIf="!form.disabled">
              <span class="badge" [ngClass]="experiencias.length >= 3 ? 'bg-danger' : 'bg-primary'">
                {{ experiencias.length }} de 3 registrados
              </span>
              <button type="button" class="ms-3 btn btn-primary btn-sm rounded-pill px-3 shadow-sm d-flex align-items-center" 
                      (click)="addExperiencia()" [disabled]="experiencias.length >= 3 || isReadOnly">
                <i class="bi bi-plus-circle me-2"></i> Agregar experiencia
              </button>
            </div>
          </div>

          <div *ngIf="experiencias.length === 0 && !isReadOnly" class="text-center py-5 border border-dashed rounded-4 bg-light bg-opacity-50">
            <i class="bi bi-journal-plus fs-1 text-muted mb-3 d-block"></i>
            <p class="text-muted fw-semibold mb-0">No ha agregado ningún registro de trabajo.</p>
            <small class="text-secondary">Haga clic en el botón superior para añadir uno.</small>
          </div>

          <div formArrayName="experiencias">
            <div *ngFor="let exp of experiencias.controls; let i=index" [formGroupName]="i" 
                 class="experience-card p-4 border rounded-4 mb-4 shadow-sm bg-white position-relative animate-fade-in">
              
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="d-flex align-items-center">
                  <div class="step-number bg-primary text-white me-3">{{i + 1}}</div>
                  <h6 class="fw-bold text-primary mb-0">EXPERIENCIA LABORAL</h6>
                </div>
                <button type="button" class="btn btn-link text-danger btn-sm text-decoration-none fw-bold d-flex align-items-center" (click)="removeExperiencia(i)" *ngIf="!isReadOnly">
                  <i class="bi bi-trash3 me-1"></i> Eliminar Registro
                </button>
              </div>

              <div class="row g-3">
                <!-- Empresa -->
                <div class="col-md-12 col-lg-6">
                  <label class="form-label small fw-bold">Nombre de la Empresa <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-building"></i></span>
                    <input type="text" class="form-control" formControlName="empresa" placeholder="Ej: Corporación Favorita" maxlength="100" 
                           (blur)="trimFieldInArray(experiencias, i, 'empresa')"
                           [class.is-invalid]="isInvalidInArray(experiencias, i, 'empresa')"
                           [readonly]="isReadOnly">
                    <div class="invalid-feedback">El nombre de la empresa es obligatorio.</div>
                  </div>
                </div>

                <!-- Área -->
                <div class="col-md-6 col-lg-3">
                  <label class="form-label small fw-bold">Área / Departamento <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="area" 
                         placeholder="Ej: Ventas / Producción" 
                         (input)="cleanInArray(experiencias, i, 'area')" 
                         (blur)="trimFieldInArray(experiencias, i, 'area')"
                         [class.is-invalid]="isInvalidInArray(experiencias, i, 'area')"
                         [readonly]="isReadOnly">
                   <div class="invalid-feedback">El área es obligatoria.</div>
                </div>

                <!-- Jefe Inmediato -->
                <div class="col-md-6 col-lg-3">
                  <label class="form-label small fw-bold">Jefe Inmediato</label>
                  <input type="text" class="form-control" formControlName="jefe_inmediato" 
                         placeholder="Nombre completo" maxlength="80" (input)="cleanInArray(experiencias, i, 'jefe_inmediato')" [readonly]="isReadOnly">
                </div>

                <!-- Fechas y actualmente -->
                <div class="col-12 mt-4">
                   <div class="p-3 rounded-3 bg-light bg-opacity-50 border border-opacity-10 shadow-sm-inset">
                      <div class="row g-3">
                        <div class="col-md-4">
                          <label class="form-label small fw-bold">Fecha de Inicio <span class="text-danger">*</span></label>
                          <input type="date" class="form-control" formControlName="fecha_inicio" [max]="today" 
                                 [class.is-invalid]="isInvalidInArray(experiencias, i, 'fecha_inicio')"
                                 [readonly]="isReadOnly">
                          <div class="invalid-feedback">La fecha de inicio es requerida.</div>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label small fw-bold">Fecha de Finalización <span class="text-danger" *ngIf="!exp.get('actualmente')?.value">*</span></label>
                          <input type="date" class="form-control" formControlName="fecha_fin" [max]="today"
                                 [class.is-invalid]="isInvalidInArray(experiencias, i, 'fecha_fin')"
                                 [attr.disabled]="(exp.get('actualmente')?.value || isReadOnly) ? true : null">
                          <div class="invalid-feedback">Fecha de fin es obligatoria.</div>
                        </div>
                        <div class="col-md-4 d-flex align-items-end">
                          <div class="form-check form-switch mb-2">
                            <input class="form-check-input" type="checkbox" formControlName="actualmente" 
                                   [id]="'checkAct' + i" (change)="onActualmenteChange(i)" [attr.disabled]="isReadOnly ? true : null">
                            <label class="form-check-label fw-semibold small text-primary" [for]="'checkAct' + i">
                              Actualmente trabaja aquí?
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="mt-2" *ngIf="showDateError(i)">
                        <small class="text-danger"><i class="bi bi-exclamation-triangle-fill me-1"></i> La fecha de inicio debe ser anterior a la de finalización.</small>
                      </div>
                   </div>
                </div>

                <!-- Motivo de salida -->
                <div class="col-12 mt-3">
                  <label class="form-label small fw-bold">Motivo de Salida <span class="text-danger">*</span></label>
                  <textarea class="form-control" formControlName="motivo_salida" rows="2" 
                            (blur)="trimFieldInArray(experiencias, i, 'motivo_salida')"
                            [class.is-invalid]="isInvalidInArray(experiencias, i, 'motivo_salida')"
                            placeholder="Ej: Renuncia voluntaria, fin de contrato..." maxlength="200" [readonly]="isReadOnly"></textarea>
                  <div class="invalid-feedback">El motivo de salida es obligatorio (indique "ACTUAL" si aún labora ahí).</div>
                  <div class="form-text text-end small">{{ exp.get('motivo_salida')?.value?.length || 0 }}/200</div>
                </div>
              </div>

              <!-- TIMELINE VISUAL INTERNO RENOVADO -->
              <div class="mt-4 pt-4 border-top border-dashed animate-fade" *ngIf="exp.get('fecha_inicio')?.value">
                <div class="timeline-container px-2">
                  <div class="d-flex justify-content-between align-items-center mb-2 px-1">
                    <span class="badge bg-primary-subtle text-primary rounded-pill px-2 py-1 border border-primary-subtle d-flex align-items-center x-small-text">
                      <i class="bi bi-calendar-event me-1"></i> {{ exp.get('fecha_inicio')?.value | date:'MMM yyyy' }}
                    </span>
                    <span class="duration-badge shadow-sm" *ngIf="calculateDuration(exp.get('fecha_inicio')?.value, exp.get('fecha_fin')?.value, exp.get('actualmente')?.value) as duration">
                      <i class="bi bi-clock-history me-1"></i> {{ duration }}
                    </span>
                    <span class="badge rounded-pill px-2 py-1 border d-flex align-items-center x-small-text" 
                          [class.bg-success-subtle]="exp.get('actualmente')?.value"
                          [class.text-success]="exp.get('actualmente')?.value"
                          [class.border-success-subtle]="exp.get('actualmente')?.value"
                          [class.bg-secondary-subtle]="!exp.get('actualmente')?.value"
                          [class.text-secondary]="!exp.get('actualmente')?.value"
                          [class.border-secondary-subtle]="!exp.get('actualmente')?.value">
                      <i class="bi me-1" [ngClass]="exp.get('actualmente')?.value ? 'bi-check-circle-fill' : 'bi-calendar-check'"></i>
                      {{ exp.get('actualmente')?.value ? 'Presente' : (exp.get('fecha_fin')?.value | date:'MMM yyyy') || '...' }}
                    </span>
                  </div>
                  <div class="modern-timeline">
                    <div class="timeline-bar">
                      <div class="timeline-progress" [class.is-current]="exp.get('actualmente')?.value"></div>
                    </div>
                    <div class="timeline-nodos d-flex justify-content-between">
                      <div class="timeline-node start shadow-sm" title="Inicio de labores">
                        <i class="bi bi-building-fill fs-6"></i>
                      </div>
                      <div class="timeline-node end shadow-sm" [class.is-current]="exp.get('actualmente')?.value" 
                           [title]="exp.get('actualmente')?.value ? 'Trabajo Actual' : 'Fin de labores'">
                        <i class="bi fs-6" [ngClass]="exp.get('actualmente')?.value ? 'bi-star-fill text-warning' : 'bi-door-closed-fill'"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- DESCRIPCIÓN DE LABORES (Global para la sección) -->
          <div class="mt-5 p-4 border rounded-4 bg-white shadow-sm border-start border-5 border-info animate-fade">
            <h6 class="fw-bold text-info mb-3">
              <i class="bi bi-tools me-2"></i> Capacidad y Preferencias Laborales
            </h6>
            <div class="row">
              <div class="col-12">
                <label class="form-label small fw-bold">Describa labores que el aspirante sepa realizar o le gustaría:</label>
                <textarea class="form-control" formControlName="descripcion_labores" rows="3" 
                          (blur)="trimField('descripcion_labores')"
                          [class.is-invalid]="isInvalid('descripcion_labores')"
                          placeholder="Ej: Manejo de maquinaria, mantenimiento preventivo, soporte técnico, etc."
                          maxlength="500"></textarea>
                <div class="invalid-feedback">Dato obligatorio: Por favor describa sus capacidades o qué tipo de trabajo le interesaría realizar.</div>
                <div class="form-text d-flex justify-content-between">
                  <span>Puede detallar habilidades técnicas, oficios o áreas específicas de interés.</span>
                  <span class="fw-bold">{{ form.get('descripcion_labores')?.value?.length || 0 }}/500</span>
                </div>
              </div>
            </div>
          </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade { animation: fadeIn 0.4s ease-out; }
    .animate-fade-in { animation: slideUp 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    
    .custom-radio .form-check-input:checked { background-color: #0d6efd; border-color: #0d6efd; }
    .custom-radio .form-check-label { cursor: pointer; }
    
    .border-dashed { border-style: dashed !important; border-width: 1.5px !important; }
    .experience-card { transition: all 0.2s ease; border-left: 5px solid transparent !important; }
    .experience-card:hover { border-left-color: #0d6efd !important; transform: translateX(5px); }
    
    .step-number { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; }
    
    .shadow-sm-inset { box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); }
    
    /* MODER TIMELINE STYLES */
    .timeline-container { position: relative; }
    .x-small-text { font-size: 0.7rem; }
    .duration-badge {
      background: white;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #0d6efd;
      border: 1px solid #e0e0e0;
      z-index: 5;
    }

    .modern-timeline {
      position: relative;
      height: 32px;
      margin-top: 5px;
      display: flex;
      align-items: center;
    }

    .timeline-bar {
      position: absolute;
      left: 15px;
      right: 15px;
      height: 4px;
      background: #e9ecef;
      border-radius: 2px;
      overflow: hidden;
    }

    .timeline-progress {
      height: 100%;
      width: 100%;
      background: linear-gradient(90deg, #0d6efd 0%, #0dcaf0 100%);
      transition: all 0.5s ease;
    }
    
    .timeline-progress.is-current {
        background: linear-gradient(90deg, #0d6efd 0%, #198754 100%);
    }

    .timeline-nodos {
      width: 100%;
      position: relative;
      z-index: 2;
    }

    .timeline-node {
      width: 28px;
      height: 28px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #0d6efd;
      color: #0d6efd;
      transition: all 0.3s ease;
    }
    
    .timeline-node.end {
        border-color: #6c757d;
        color: #6c757d;
    }
    
    .timeline-node.end.is-current {
        border-color: #198754;
        color: #198754;
        animation: pulse-green 2s infinite;
    }
    
    @keyframes pulse-green {
      0% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(25, 135, 84, 0); }
      100% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
    }

    .form-control:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, .1); }
    input[type="text"], textarea { text-transform: uppercase; }
    input[type="text"]::placeholder, textarea::placeholder { text-transform: none; }
  `]
})
export class ExperienciaLaboralComponent {
  @Input() form!: FormGroup;
  @Input() isReadOnly: boolean = false;
  today = new Date().toISOString().split('T')[0];
  private readonly LETTERS_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;

  constructor(private fb: FormBuilder) { }

  get experiencias() {
    return this.form.get('experiencias') as FormArray;
  }

  calculateDuration(startStr: string, endStr: string, actualmente: boolean): string {
    if (!startStr) return '';
    
    const start = new Date(startStr);
    const end = actualmente ? new Date() : (endStr ? new Date(endStr) : new Date());
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
    if (start > end) return 'Fechas inválidas';

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    const durationParts = [];
    if (years > 0) durationParts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
    if (months > 0) durationParts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
    
    if (durationParts.length === 0) return 'Menos de un mes';
    
    return durationParts.join(' y ');
  }

  onSinExperienciaChange() {
    const sinExp = this.form.get('sin_experiencia')?.value;
    if (sinExp) {
      this.experiencias.clear();
    } else if (this.experiencias.length === 0) {
      this.addExperiencia();
    }
  }

  addExperiencia() {
    if (this.experiencias.length < 3) {
      const expGroup = this.fb.group({
        empresa: ['', [Validators.required, Validators.maxLength(100)]],
        fecha_inicio: ['', [Validators.required]],
        fecha_fin: [''],
        actualmente: [false],
        area: ['', [Validators.required, Validators.pattern(this.LETTERS_PATTERN)]],
        jefe_inmediato: ['', [Validators.maxLength(80), Validators.pattern(this.LETTERS_PATTERN)]],
        motivo_salida: ['', [Validators.required, Validators.maxLength(200)]]
      }, { validators: this.dateComparator });

      this.experiencias.push(expGroup);
      this.onActualmenteChange(this.experiencias.length - 1); // Aplicar validadores iniciales de fecha_fin
    }
  }

  removeExperiencia(index: number) {
    this.experiencias.removeAt(index);
  }

  onActualmenteChange(index: number) {
    const exp = this.experiencias.at(index);
    const actualmente = exp.get('actualmente')?.value;
    const fechaFin = exp.get('fecha_fin');

    if (actualmente) {
      fechaFin?.setValue('');
      fechaFin?.clearValidators();
      fechaFin?.disable();
    } else {
      fechaFin?.setValidators([Validators.required]);
      fechaFin?.enable();
    }
    fechaFin?.updateValueAndValidity();
  }

  dateComparator(group: any) {
    const start = group.get('fecha_inicio')?.value;
    const end = group.get('fecha_fin')?.value;
    const actualmente = group.get('actualmente')?.value;

    if (actualmente) return null;
    if (!start || !end) return null;

    return start <= end ? null : { dateInvalid: true };
  }

  showDateError(index: number) {
    const exp = this.experiencias.at(index);
    return exp.hasError('dateInvalid') && (exp.get('fecha_fin')?.touched || exp.get('fecha_fin')?.dirty);
  }

  cleanInArray(array: FormArray, index: number, controlName: string) {
    const control = array.at(index).get(controlName);
    if (control?.value) {
      const cleaned = control.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
      if (cleaned !== control.value) {
        control.setValue(cleaned, { emitEvent: false });
      }
    }
  }

  trimField(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value && typeof control.value === 'string') {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }

  trimFieldInArray(array: FormArray, index: number, controlName: string) {
    const control = array.at(index).get(controlName);
    if (control?.value && typeof control.value === 'string') {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isInvalidInArray(array: FormArray, index: number, controlName: string): boolean {
    const control = array.at(index).get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
