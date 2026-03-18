import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CustomValidators } from '../../utils/custom-validators';

@Component({
  selector: 'app-referencias-personales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="parentForm" class="animate-fade-in">
      
      <!-- SECCIÓN 10: REFERENCIAS PERSONALES -->
      <div class="card mb-4 shadow-sm border-0">
        <div class="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center">
          <h5 class="mb-0 fw-bold">
            <i class="bi bi-person-check me-2"></i>10. Referencias Personales
            <small class="ms-2 fw-normal opacity-75">(Máximo 2)</small>
          </h5>
          <button type="button" class="btn btn-light btn-sm fw-bold px-3 rounded-pill shadow-sm" 
                  (click)="agregarReferencia('referenciasPersonales')" 
                  *ngIf="referenciasPersonales.length < 2 && !isReadOnly">
            <i class="bi bi-plus-circle me-1"></i> Agregar Referencia
          </button>
        </div>
        
        <div class="card-body p-4">
          <div class="alert alert-info d-flex align-items-center mb-4 border-0 shadow-sm py-3" role="alert">
            <i class="bi bi-info-circle-fill me-3 fs-4 text-primary"></i>
            <div class="fw-medium">
              Ingrese personas que <strong>no sean familiares</strong> y que puedan dar referencias sobre el aspirante.
            </div>
          </div>

          <div *ngIf="referenciasPersonales.length === 0" class="text-center py-5 border border-dashed rounded-4 bg-light bg-opacity-50 mb-4"
               [class.border-danger]="referenciasPersonales.invalid && (parentForm.touched || parentForm.dirty)">
            <i class="bi bi-person-lines-fill fs-1 text-muted mb-3 d-block" [class.text-danger]="referenciasPersonales.invalid && (parentForm.touched || parentForm.dirty)"></i>
            <p class="mb-1 text-muted fw-semibold" [class.text-danger]="referenciasPersonales.invalid && (parentForm.touched || parentForm.dirty)">0 de 2 referencias registradas</p>
            <small class="text-secondary font-italic" *ngIf="!referenciasPersonales.invalid || (!parentForm.touched && !parentForm.dirty)">No olvide registrar al menos una referencia que no sea familiar.</small>
            <small class="text-danger fw-bold animate-shake" *ngIf="referenciasPersonales.invalid && (parentForm.touched || parentForm.dirty)">
              <i class="bi bi-exclamation-triangle-fill me-1"></i> ES OBLIGATORIO REGISTRAR AL MENOS UNA REFERENCIA PERSONAL PARA CONTINUAR.
            </small>
          </div>
          <div [formArrayName]="'referenciasPersonales'">
            <div *ngFor="let ref of referenciasPersonales.controls; let i=index" [formGroupName]="i" 
                 class="referencia-card border rounded-4 p-4 mb-4 bg-white shadow-sm position-relative animate-fade-up">
              
              <div class="d-flex justify-content-between align-items-center mb-4">
                <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-4 py-2 rounded-pill fw-bold fs-6">
                  <i class="bi bi-person-heart me-2"></i>REFERENCIA PERSONAL #{{i+1}}
                </span>
                
                <button type="button" class="btn btn-link text-danger text-decoration-none fw-bold d-flex align-items-center p-0" 
                        (click)="eliminarRegistro('referenciasPersonales', i)" 
                        *ngIf="!isReadOnly">
                  <i class="bi bi-trash3-fill me-2 fs-5"></i>
                  <span class="small">Eliminar Referencia</span>
                </button>
              </div>

              <div class="row g-4">
                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary small">NOMBRE COMPLETO <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-person text-primary"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" formControlName="nombre" 
                           placeholder="Ej: MARÍA LÓPEZ" maxlength="100" 
                           [class.is-invalid]="ref.get('nombre')?.invalid && ref.get('nombre')?.touched"
                           (input)="cleanLetters(i, 'nombre', 'referenciasPersonales')"
                           (blur)="trimField(i, 'nombre', 'referenciasPersonales')"
                           [readonly]="isReadOnly">
                    <div class="invalid-feedback">El nombre es obligatorio.</div>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary small">CARGO / PROFESIÓN <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-briefcase text-primary"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" formControlName="cargo" 
                           [class.is-invalid]="ref.get('cargo')?.invalid && ref.get('cargo')?.touched"
                           placeholder="Ej: DOCENTE, INGENIERO" 
                           (input)="cleanLetters(i, 'cargo', 'referenciasPersonales')" 
                           (blur)="trimField(i, 'cargo', 'referenciasPersonales')"
                           [readonly]="isReadOnly">
                    <div class="invalid-feedback">El cargo es obligatorio.</div>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary small">EMPRESA / LUGAR DE TRABAJO <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-building text-primary"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" formControlName="empresa" 
                           [class.is-invalid]="ref.get('empresa')?.invalid && ref.get('empresa')?.touched"
                           placeholder="Ej: Primobanano / Independiente" 
                           (blur)="trimField(i, 'empresa', 'referenciasPersonales')"
                           [readonly]="isReadOnly">
                    <div class="invalid-feedback">La empresa es obligatoria.</div>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary small">TELÉFONO DE CONTACTO <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-telephone text-primary"></i></span>
                    <input type="tel" class="form-control border-start-0 ps-0" formControlName="telefono" 
                           placeholder="09XXXXXXXX" (keypress)="onlyNumbers($event)"
                           (input)="cleanPhoneNumber(i, 'referenciasPersonales')" maxlength="10"
                           [readonly]="isReadOnly"
                           [class.is-invalid]="ref.get('telefono')?.invalid && ref.get('telefono')?.touched">
                    <div class="invalid-feedback">El teléfono es obligatorio (mínimo 7 dígitos).</div>
                  </div>
                </div>
              </div>

              <!-- ALERTAS CRUZADAS -->
              <div class="mt-3">
                <div class="alert alert-warning border-0 shadow-sm d-flex align-items-center mb-2 animate-fade-in" *ngIf="checkGlobalValidation('referenciasPersonales', i).isFamiliar">
                  <i class="bi bi-exclamation-triangle-fill me-3 fs-5"></i>
                  <div class="small fw-bold">Advertencia: Este nombre coincide con un familiar. Recuerde que las referencias deben ser externas.</div>
                </div>
                <div class="alert alert-danger border-0 shadow-sm d-flex align-items-center mb-0 animate-fade-in" *ngIf="checkGlobalValidation('referenciasPersonales', i).isDuplicate">
                  <i class="bi bi-x-circle-fill me-3 fs-5"></i>
                  <div class="small fw-bold">Error: Esta persona o teléfono ya ha sido registrado en otra sección de referencias.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SUBSECCIÓN: VÍNCULOS EN LA EMPRESA -->
      <div class="card mb-4 shadow-sm border-0 border-top border-5 border-info">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
          <h6 class="mb-0 fw-bold text-info fs-5">
            <i class="bi bi-buildings-fill me-2"></i>Familiares o conocidos que trabajan en la empresa <small class="text-muted fw-normal fs-6">(Opcional)</small>
          </h6>
          <button type="button" class="btn btn-info btn-sm text-white fw-bold px-3 rounded-pill shadow-sm" 
                  (click)="agregarReferencia('familiaresEnEmpresa')" 
                  *ngIf="familiaresEnEmpresa.length < 2 && !isReadOnly">
            <i class="bi bi-plus-circle me-1"></i> Agregar Persona
          </button>
        </div>

        <div class="card-body p-4 bg-light bg-opacity-10">
          <div class="alert alert-secondary d-flex align-items-center mb-4 border-0 shadow-sm py-2" role="alert">
            <i class="bi bi-info-circle-fill me-3 fs-5 text-secondary"></i>
            <div class="small fw-medium">Ingrese familiares o conocidos que trabajen actualmente en la empresa.</div>
          </div>

          <div *ngIf="familiaresEnEmpresa.length === 0" class="text-center py-4 border border-dashed rounded-4 bg-white mb-0 opacity-75">
            <i class="bi bi-info-square fs-2 text-muted mb-2 d-block"></i>
            <p class="mb-0 text-muted fw-bold">"No aplica"</p>
            <small class="text-secondary font-italic">No ha registrado vínculos internos. (0 de 2)</small>
          </div>

          <div [formArrayName]="'familiaresEnEmpresa'">
            <div *ngFor="let vinculo of familiaresEnEmpresa.controls; let i=index" [formGroupName]="i" 
                 class="vinculo-card border border-info border-opacity-25 rounded-4 p-4 mb-4 bg-white shadow-sm position-relative animate-fade-up">
              
              <div class="d-flex justify-content-between align-items-center mb-4">
                <span class="badge bg-info text-white px-4 py-2 rounded-pill fw-bold fs-6">
                  <i class="bi bi-building-check me-2"></i>VÍNCULO INTERNO #{{i+1}}
                </span>
                <button type="button" class="btn btn-link text-danger text-decoration-none fw-bold d-flex align-items-center p-0" 
                        (click)="eliminarRegistro('familiaresEnEmpresa', i)" 
                        *ngIf="!isReadOnly">
                  <i class="bi bi-trash3-fill me-2 fs-5"></i>
                  <span class="small">Eliminar Registro</span>
                </button>
              </div>

              <div class="row g-4">
                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary small text-uppercase">Nombres y Apellidos <span class="text-danger">*</span></label>
                  <input type="text" class="form-control border-info border-opacity-25" formControlName="nombre" 
                         [class.is-invalid]="vinculo.get('nombre')?.invalid && vinculo.get('nombre')?.touched"
                         placeholder="Ej: LUIS PÉREZ" maxlength="100" 
                         (input)="cleanLetters(i, 'nombre', 'familiaresEnEmpresa')"
                         (blur)="trimField(i, 'nombre', 'familiaresEnEmpresa')"
                         [readonly]="isReadOnly">
                  <div class="invalid-feedback">El nombre es obligatorio.</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold text-secondary small text-uppercase">Empresa <span class="text-danger">*</span></label>
                  <select class="form-select border-info border-opacity-25" formControlName="empresa" 
                          [class.is-invalid]="vinculo.get('empresa')?.invalid && vinculo.get('empresa')?.touched"
                          [attr.disabled]="isReadOnly ? true : null">
                    <option value="">Seleccione empresa...</option>
                    <option value="Agrícola e Industrial Primobanano S.A.">Agrícola e Industrial Primobanano S.A.</option>
                    <option value="Sociedad Fiduciaria e Inmobiliaria C.A.">Sociedad Fiduciaria e Inmobiliaria C.A.</option>
                    <option value="Agricola Las Villas S.A.">Agricola Las Villas S.A.</option>
                    <option value="Valores y Administraciones S.A.">Valores y Administraciones S.A.</option>
                    <option value="Gamaunion S.A.">Gamaunion S.A.</option>
                  </select>
                  <div class="invalid-feedback">Debe elegir la empresa.</div>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-bold text-secondary small text-uppercase">Labor o Cargo <span class="text-danger">*</span></label>
                  <input type="text" class="form-control border-info border-opacity-25" formControlName="cargo" 
                         [class.is-invalid]="vinculo.get('cargo')?.invalid && vinculo.get('cargo')?.touched"
                         placeholder="Ej: SUPERVISOR" 
                         (input)="cleanLetters(i, 'cargo', 'familiaresEnEmpresa')" 
                         (blur)="trimField(i, 'cargo', 'familiaresEnEmpresa')"
                         [readonly]="isReadOnly">
                  <div class="invalid-feedback">El cargo es obligatorio.</div>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-bold text-secondary small text-uppercase">Parentesco / Relación <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="parentesco" 
                         [class.is-invalid]="vinculo.get('parentesco')?.invalid && vinculo.get('parentesco')?.touched"
                         placeholder="Ej: PRIMO" 
                         (input)="cleanLetters(i, 'parentesco', 'familiaresEnEmpresa')" 
                         (blur)="trimField(i, 'parentesco', 'familiaresEnEmpresa')"
                         [readonly]="isReadOnly">
                  <div class="invalid-feedback">El parentesco es obligatorio.</div>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-bold text-secondary small text-uppercase">Teléfono <span class="text-danger">*</span></label>
                  <input type="tel" class="form-control" formControlName="telefono" 
                         [class.is-invalid]="vinculo.get('telefono')?.invalid && vinculo.get('telefono')?.touched"
                         placeholder="09XXXXXXXX" (keypress)="onlyNumbers($event)"
                         (input)="cleanPhoneNumber(i, 'familiaresEnEmpresa')" maxlength="10" [readonly]="isReadOnly">
                  <div class="invalid-feedback">El teléfono es obligatorio.</div>
                </div>
              </div>

              <!-- ALERTA DE COHERENCIA CON FAMILIA -->
              <div class="mt-3" *ngIf="checkFamiliarCoherence(i)">
                <div class="alert alert-info border-0 shadow-sm d-flex align-items-center mb-0 py-2 animate-fade-in">
                  <i class="bi bi-check-circle-fill me-3 fs-5 text-info"></i>
                  <div class="small fw-bold">Este registro coincide con un familiar declarado en la sección 6.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .referencia-card { border-left: 5px solid #007bff !important; }
    .vinculo-card { border-left: 5px solid #0dcaf0 !important; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    .animate-fade-up { animation: fadeInUp 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .animate-shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both; }
    .border-dashed { border-style: dashed !important; border-width: 2px !important; }
    .form-control:focus, .form-select:focus { box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, .1); }
    input[type="text"], input[type="tel"] { text-transform: uppercase; }
    input[type="text"]::placeholder, input[type="tel"]::placeholder { text-transform: none; }
  `]
})
export class ReferenciasPersonalesComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  @Input() isReadOnly: boolean = false;
  private readonly LETTERS_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (!this.referenciasPersonales) console.warn('FormArray no encontrado');
  }

  get referenciasPersonales() {
    return this.parentForm.get('referenciasPersonales') as FormArray;
  }

  get familiaresEnEmpresa() {
    return this.parentForm.get('familiaresEnEmpresa') as FormArray;
  }


  agregarReferencia(arrayName: string) {
    const array = this.parentForm.get(arrayName) as FormArray;
    if (array.length < 2) {
      if (arrayName === 'referenciasPersonales') {
        array.push(this.fb.group({
          nombre: ['', [Validators.required, CustomValidators.noWhitespace, Validators.maxLength(100), Validators.pattern(this.LETTERS_PATTERN)]],
          cargo: ['', [Validators.required, CustomValidators.noWhitespace, Validators.pattern(this.LETTERS_PATTERN)]],
          empresa: ['', [Validators.required, CustomValidators.noWhitespace]],
          telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/), Validators.maxLength(10)]]
        }));
      } else {
        array.push(this.fb.group({
          nombre: ['', [Validators.required, CustomValidators.noWhitespace, Validators.maxLength(100), Validators.pattern(this.LETTERS_PATTERN)]],
          empresa: ['', [Validators.required, CustomValidators.noWhitespace]],
          cargo: ['', [Validators.required, CustomValidators.noWhitespace, Validators.pattern(this.LETTERS_PATTERN)]],
          parentesco: ['', [Validators.required, CustomValidators.noWhitespace, Validators.pattern(this.LETTERS_PATTERN)]],
          telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/), Validators.maxLength(10)]]
        }));
      }
      this.cdr.detectChanges();
    }
  }

  eliminarRegistro(arrayName: string, index: number) {
    const array = this.parentForm.get(arrayName) as FormArray;
    array.removeAt(index);
    this.cdr.detectChanges();
  }

  cleanLetters(index: number, controlName: string, arrayName: string) {
    const array = this.parentForm.get(arrayName) as FormArray;
    const control = array.at(index).get(controlName);
    if (control?.value) {
      const cleaned = control.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
      if (cleaned !== control.value) {
        control.setValue(cleaned.toUpperCase(), { emitEvent: false });
      } else {
        control.setValue(control.value.toUpperCase(), { emitEvent: false });
      }
    }
  }

  cleanPhoneNumber(index: number, arrayName: string) {
    const array = this.parentForm.get(arrayName) as FormArray;
    const control = array.at(index).get('telefono');
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

  trimField(index: number, controlName: string, arrayName: string) {
    const array = this.parentForm.get(arrayName) as FormArray;
    const control = array.at(index).get(controlName);
    if (control?.value && typeof control.value === 'string') {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9\\+\\-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  /**
   * VALIDACIÓN CRUZADA GLOBAL
   * Compara el registro actual contra:
   * - Referencias Laborales
   * - Otras Referencias Personales
   * - Vínculos Internos
   * - Datos Familiares
   */
  checkGlobalValidation(arrayName: string, index: number) {
    const array = this.parentForm.get(arrayName) as FormArray;
    const current = array.at(index).value;
    const results = { isDuplicate: false, isFamiliar: false };

    if (!current.nombre && !current.telefono) return results;

    const nombreNorm = current.nombre?.trim().toLowerCase();
    const telNorm = current.telefono?.trim();

    // 1. Verificar contra Laborales
    const laborRefs = this.parentForm.get('referenciasLaborales') as FormArray;
    if (laborRefs) {
      laborRefs.value.forEach((ref: any) => {
        if (nombreNorm && ref.nombre?.trim().toLowerCase() === nombreNorm) results.isDuplicate = true;
        if (telNorm && ref.telefono?.trim() === telNorm) results.isDuplicate = true;
      });
    }

    // 2. Verificar contra Personales (otros registros)
    if (arrayName === 'referenciasPersonales') {
      this.referenciasPersonales.value.forEach((ref: any, idx: number) => {
        if (idx === index) return;
        if (nombreNorm && ref.nombre?.trim().toLowerCase() === nombreNorm) results.isDuplicate = true;
        if (telNorm && ref.telefono?.trim() === telNorm) results.isDuplicate = true;
      });
    }

    // 3. Verificar contra Vínculos en Empresa
    if (arrayName !== 'familiaresEnEmpresa') {
      this.familiaresEnEmpresa.value.forEach((ref: any) => {
        if (nombreNorm && ref.nombre?.trim().toLowerCase() === nombreNorm) results.isDuplicate = true;
        if (telNorm && ref.telefono?.trim() === telNorm) results.isDuplicate = true;
      });
    }

    // 4. Verificar contra contacto de emergencia (Sección 5)
    const emergencia = this.parentForm.get('datosReferenciales');
    if (emergencia) {
      const nomEme = emergencia.get('nombre_contacto_emergencia')?.value?.trim().toLowerCase();
      const telEme = emergencia.get('telefono_emergencia')?.value?.trim();
      if (nombreNorm && nomEme === nombreNorm) results.isDuplicate = true;
      if (telNorm && telEme === telNorm) results.isDuplicate = true;
    }

    // 5. Verificar contra Datos Familiares (Sección 6)
    const familiares = this.parentForm.get('datosFamiliares');
    if (familiares) {
      const familyNames = this.getFamilyNames(familiares);
      if (nombreNorm && familyNames.includes(nombreNorm)) results.isFamiliar = true;
    }

    return results;
  }

  /**
   * COHERENCIA DE VÍNCULOS
   */
  checkFamiliarCoherence(index: number): boolean {
    const nombre = this.familiaresEnEmpresa.at(index).get('nombre')?.value;
    if (!nombre) return false;
    const familiares = this.parentForm.get('datosFamiliares');
    if (!familiares) return false;
    return this.getFamilyNames(familiares).includes(nombre.trim().toLowerCase());
  }

  private getFamilyNames(familiares: any): string[] {
    const names: string[] = [];
    ['padre.nombre', 'madre.nombre', 'conyuge_actual.nombre'].forEach(p => {
      const val = familiares.get(p)?.value;
      if (val) names.push(val.trim().toLowerCase());
    });
    ['hermanos', 'hijos', 'conyuges_anteriores'].forEach(arr => {
      const formArr = familiares.get(arr) as FormArray;
      if (formArr) formArr.value.forEach((f: any) => { if (f.nombre) names.push(f.nombre.trim().toLowerCase()); });
    });
    return names;
  }
}
