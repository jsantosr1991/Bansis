import { Component, Input, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CustomValidators } from '../../utils/custom-validators';

@Component({
  selector: 'app-referencias-laborales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="parentForm" class="card mb-4 shadow-sm border-0 animate-fade-in" *ngIf="isVisible()">
      <div class="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-people-fill me-2"></i>9. Referencias Laborales
          <small class="ms-2 fw-normal opacity-75">(Máximo 2)</small>
        </h5>
        <button type="button" class="btn btn-light btn-sm fw-bold px-3 rounded-pill shadow-sm" 
                (click)="agregarReferencia()" 
                *ngIf="referencias.length < 2 && !isReadOnly">
          <i class="bi bi-plus-circle me-1"></i> Agregar Referencia
        </button>
      </div>
      
      <div class="card-body p-4">
        <div class="alert alert-info d-flex align-items-center mb-4 border-0 shadow-sm py-2" role="alert">
          <i class="bi bi-info-circle-fill me-3 fs-4"></i>
          <div>
            <strong>Referencias del último empleo del aspirante:</strong> Ingrese personas que puedan dar referencias reales y verificables del último trabajo del aspirante.
          </div>
        </div>

        <div *ngIf="referencias.length === 0" class="text-center py-5 border border-dashed rounded-4 bg-light bg-opacity-50"
             [class.border-danger]="referencias.invalid && (parentForm.touched || parentForm.dirty)">
          <i class="bi bi-person-lines-fill fs-1 text-muted mb-3 d-block" [class.text-danger]="referencias.invalid && (parentForm.touched || parentForm.dirty)"></i>
          <p class="mb-1 text-muted fw-semibold" [class.text-danger]="referencias.invalid && (parentForm.touched || parentForm.dirty)">No se han registrado referencias laborales.</p>
          <small class="text-secondary" *ngIf="!referencias.invalid || (!parentForm.touched && !parentForm.dirty)">Haga clic en el botón superior para agregar una referencia.</small>
          <small class="text-danger fw-bold animate-shake d-block mt-2" *ngIf="referencias.invalid && (parentForm.touched || parentForm.dirty)">
            <i class="bi bi-exclamation-triangle-fill me-1"></i> ES OBLIGATORIO REGISTRAR AL MENOS UNA REFERENCIA LABORAL.
          </small>
        </div>

        <div [formArrayName]="controlName">
          <div *ngFor="let ref of referencias.controls; let i=index" [formGroupName]="i" 
               class="referencia-card border rounded-4 p-4 mb-4 bg-white shadow-sm position-relative animate-fade-up">
            
            <div class="d-flex justify-content-between align-items-center mb-4">
              <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-4 py-2 rounded-pill fw-bold fs-6">
                <i class="bi bi-person-badge me-2"></i>REFERENCIA LABORAL #{{i+1}}
              </span>
              
              <!-- BOTÓN ELIMINAR MEJORADO: Más intuitivo con texto e icono -->
              <button type="button" class="btn btn-link text-danger text-decoration-none fw-bold d-flex align-items-center p-0" 
                      (click)="eliminarReferencia(i)" 
                      *ngIf="!isReadOnly"
                      title="Eliminar esta referencia">
                <i class="bi bi-trash3-fill me-2 fs-5"></i>
                <span class="small">Eliminar Referencia</span>
              </button>
            </div>

            <div class="row g-4">
              <!-- Nombre Completo -->
              <div class="col-md-6">
                <label class="form-label fw-bold text-secondary small">NOMBRE COMPLETO <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0"><i class="bi bi-person text-primary"></i></span>
                  <input type="text" class="form-control border-start-0 ps-0" formControlName="nombre" 
                         [class.is-invalid]="ref.get('nombre')?.invalid && ref.get('nombre')?.touched"
                         placeholder="Ej: Juan Pérez" maxlength="100" (input)="cleanLetters(i, 'nombre')" (blur)="trimField(i, 'nombre')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">El nombre es obligatorio y no puede estar vacío.</div>
                </div>
              </div>

              <!-- Cargo -->
              <div class="col-md-6">
                <label class="form-label fw-bold text-secondary small">CARGO <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0"><i class="bi bi-briefcase text-primary"></i></span>
                  <input type="text" class="form-control border-start-0 ps-0" formControlName="cargo" 
                         [class.is-invalid]="ref.get('cargo')?.invalid && ref.get('cargo')?.touched"
                         placeholder="Ej: Supervisor de Producción" (input)="cleanLetters(i, 'cargo')" (blur)="trimField(i, 'cargo')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">El cargo es obligatorio.</div>
                </div>
              </div>

              <!-- Empresa -->
              <div class="col-md-6">
                <label class="form-label fw-bold text-secondary small">EMPRESA <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0"><i class="bi bi-building text-primary"></i></span>
                  <input type="text" class="form-control border-start-0 ps-0" formControlName="empresa" 
                         [class.is-invalid]="ref.get('empresa')?.invalid && ref.get('empresa')?.touched"
                         placeholder="Nombre de la empresa" maxlength="100" (blur)="trimField(i, 'empresa')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">El nombre de la empresa es obligatorio.</div>
                </div>
              </div>

              <!-- Teléfono -->
              <div class="col-md-6">
                <label class="form-label fw-bold text-secondary small">TELÉFONO DE CONTACTO <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0"><i class="bi bi-telephone text-primary"></i></span>
                  <input type="tel" class="form-control border-start-0 ps-0" formControlName="telefono" 
                         placeholder="Ej: 09XXXXXXXX" (keypress)="onlyNumbers($event)"
                         (input)="cleanPhoneNumber(i)" maxlength="10"
                         [readonly]="isReadOnly"
                         [class.is-invalid]="ref.get('telefono')?.invalid && ref.get('telefono')?.touched">
                  <div class="invalid-feedback" *ngIf="ref.get('telefono')?.errors?.['pattern'] || ref.get('telefono')?.errors?.['required']">
                    {{ ref.get('telefono')?.errors?.['required'] ? 'El teléfono es obligatorio.' : 'Formato inválido (Min 7, Max 10 dígitos)' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Alerta por duplicado -->
            <div class="mt-3 text-danger small fw-bold d-flex align-items-center animate-fade-in" *ngIf="isDuplicate(i)">
              <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
              Esta referencia o número de teléfono ya ha sido ingresado en este bloque.
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Feedback visual si la sección está oculta -->
    <div *ngIf="!isVisible()" class="card mb-4 border-0 bg-light animate-fade-in">
      <div class="card-body py-4 px-4 d-flex align-items-center">
        <div class="rounded-circle bg-secondary bg-opacity-10 p-3 me-4">
          <i class="bi bi-briefcase-fill fs-2 text-secondary"></i>
        </div>
        <div>
          <h6 class="mb-1 fw-bold text-secondary">Sección de Referencias Inactiva</h6>
          <p class="mb-0 text-muted small">No se requieren referencias laborales ya que el aspirante no posee experiencia previa.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .referencia-card { transition: all 0.3s ease; border-left: 5px solid #0d6efd !important; }
    .referencia-card:hover { transform: translateY(-3px); box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1) !important; }
    .input-group-text { color: #6c757d; border-color: #dee2e6; }
    .form-control:focus { border-color: #dee2e6; box-shadow: none; }
    .input-group:focus-within .input-group-text { border-color: #0d6efd; color: #0d6efd; }
    .input-group:focus-within .form-control { border-color: #0d6efd; }
    .border-dashed { border-style: dashed !important; border-width: 2px !important; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .animate-shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both; }
  `]
})
export class ReferenciasLaboralesComponent implements OnInit, OnDestroy {
  @Input() parentForm!: FormGroup;
  @Input() controlName: string = 'referenciasLaborales';
  @Input() isReadOnly: boolean = false;
  private sub: any;
  private readonly LETTERS_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Suscripción para asegurar que la UI reaccione inmediatamente al cambio en el componente hermano
    this.sub = this.parentForm.get('experienciaLaboral.sin_experiencia')?.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  get referencias() {
    return this.parentForm.get(this.controlName) as FormArray;
  }


  isVisible(): boolean {
    const sinExp = this.parentForm.get('experienciaLaboral.sin_experiencia')?.value;
    return sinExp === false;
  }

  agregarReferencia() {
    if (this.referencias.length < 2) {
      const refGroup = this.fb.group({
        nombre: ['', [Validators.required, CustomValidators.noWhitespace, Validators.pattern(this.LETTERS_PATTERN)]],
        cargo: ['', [Validators.required, CustomValidators.noWhitespace, Validators.pattern(this.LETTERS_PATTERN)]],
        empresa: ['', [Validators.required, CustomValidators.noWhitespace]],
        telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/), Validators.maxLength(10)]]
      });
      this.referencias.push(refGroup);
    }
  }

  eliminarReferencia(index: number) {
    this.referencias.removeAt(index);
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9\\+\\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  isDuplicate(index: number): boolean {
    const currentRef = this.referencias.at(index).value;
    if (!currentRef.nombre && !currentRef.telefono) return false;

    for (let i = 0; i < this.referencias.length; i++) {
      if (i === index) continue;
      const ref = this.referencias.at(i).value;

      const sameName = currentRef.nombre && ref.nombre &&
        currentRef.nombre.trim().toLowerCase() === ref.nombre.trim().toLowerCase();
      const samePhone = currentRef.telefono && ref.telefono &&
        currentRef.telefono.trim() === ref.telefono.trim();

      if (sameName || samePhone) return true;
    }
    return false;
  }

  cleanLetters(index: number, controlName: string) {
    const control = this.referencias.at(index).get(controlName);
    if (control?.value) {
      const cleaned = control.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
      if (cleaned !== control.value) {
        control.setValue(cleaned, { emitEvent: false });
      }
    }
  }

  cleanPhoneNumber(index: number) {
    const control = this.referencias.at(index).get('telefono');
    if (control?.value) {
      let cleaned = control.value.replace(/\D/g, '');
      if (cleaned.length > 10) {
        cleaned = cleaned.substring(0, 10);
      }
      if (cleaned !== control.value) {
        control.setValue(cleaned, { emitEvent: false });
      }
    }
  }

  trimField(index: number, controlName: string) {
    const control = this.referencias.at(index).get(controlName);
    if (control?.value && typeof control.value === 'string') {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}
