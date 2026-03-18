import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-estado-civil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="card mb-3 shadow-sm border-0">
      <div class="card-header bg-primary text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-heart me-2"></i>5. Estado Civil</h5>
      </div>
      <div class="card-body p-4">
        <div class="row g-4">
          
          <!-- Selector Principal de Estado Civil -->
          <div class="col-12">
            <label class="form-label fw-bold mb-3">Seleccione Estado Civil <span class="text-danger">*</span></label>
            <div class="row g-2">
              <div class="col-6 col-md-4 col-lg-2" *ngFor="let opcion of estadosCiviles">
                <input type="radio" class="btn-check" [id]="opcion.id" 
                       [value]="opcion.value" formControlName="estado_civil"
                       [attr.disabled]="isReadOnly ? true : null"
                       (change)="onEstadoChange()">
                <label class="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3" [for]="opcion.id">
                  <i [class]="'bi ' + opcion.icon + ' fs-4 mb-1'"></i>
                  <span class="small fw-semibold">{{opcion.label}}</span>
                </label>
              </div>
            </div>
            <div class="text-danger small mt-2" *ngIf="isInvalid('estado_civil')">Por favor, seleccione su estado civil actual.</div>
          </div>

          <!-- Campos Dinámicos con Animación -->
          <div class="col-12" *ngIf="form.get('estado_civil')?.value && form.get('estado_civil')?.value !== 'SOLTERO'">
            <div class="p-4 border rounded-3 bg-light fade-in border-primary border-opacity-10 bg-opacity-50">
              <div class="row g-3">
                
                <!-- Tiempo en el estado actual (Valor + Unidad) -->
                <div class="col-md-7">
                  <label class="form-label fw-semibold">{{ getTiempoLabel() }} <span class="text-danger">*</span></label>
                  <div class="input-group has-validation">
                    <span class="input-group-text bg-white"><i class="bi bi-clock-history"></i></span>
                    <input type="number" class="form-control" formControlName="tiempo_estado_civil_valor" 
                           placeholder="Ej: 5" (input)="validateRange()" step="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                           [readonly]="isReadOnly"
                           [class.is-invalid]="isInvalid('tiempo_estado_civil_valor')">
                    
                    <select class="form-select bg-light fw-bold" formControlName="tiempo_estado_civil_unidad" style="max-width: 120px;" [attr.disabled]="isReadOnly ? true : null">
                      <option value="ANIOS">Años</option>
                      <option value="MESES">Meses</option>
                    </select>
                    <div class="invalid-feedback">Solo se permiten números enteros positivos.</div>
                  </div>
                  <div class="form-text small mt-1">Ingrese solo números enteros. Use meses si el tiempo es menor a un año.</div>
                </div>

                <!-- Tipo de Matrimonio (Solo para Casados) -->
                <div class="col-md-6" *ngIf="form.get('estado_civil')?.value === 'CASADO'">
                  <label class="form-label fw-semibold">Tipo de Matrimonio <span class="text-danger">*</span></label>
                  <select class="form-select" formControlName="tipo_matrimonio" [attr.disabled]="isReadOnly ? true : null" [class.is-invalid]="isInvalid('tipo_matrimonio')">
                    <option value="">Seleccione tipo...</option>
                    <option value="CIVIL">Civil</option>
                    <option value="ECLESIASTICO">Eclesiástico</option>
                    <option value="AMBOS">Ambos</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="isInvalid('tipo_matrimonio')">Seleccione el tipo de matrimonio.</div>
                </div>

              </div>
            </div>
          </div>

          <hr class="my-2 text-muted opacity-25">

          <!-- Compromisos Anteriores -->
          <div class="col-md-4">
            <label class="form-label fw-semibold">Compromisos Anteriores <span class="text-danger">*</span></label>
            <div class="input-group">
              <span class="input-group-text bg-white"><i class="bi bi-people"></i></span>
              <input type="number" class="form-control" formControlName="compromisos_anteriores" 
                     min="0" [readonly]="isReadOnly" [class.is-invalid]="isInvalid('compromisos_anteriores')">
            </div>
            <div class="form-text small">Matrimonios o uniones previas.</div>
          </div>

          <!-- Demandas -->
          <div class="col-md-8">
            <label class="form-label fw-semibold">¿Posee Demandas o Procesos Pendientes? <span class="text-danger">*</span></label>
            <textarea class="form-control" formControlName="demandas" rows="2"
                      placeholder="Describa brevemente o escriba 'Ninguna'"
                      [readonly]="isReadOnly"
                      maxlength="250"
                      [class.is-invalid]="isInvalid('demandas')" [class.is-valid]="isValid('demandas')"></textarea>
            <div class="d-flex justify-content-between">
              <div class="form-text small"><i class="bi bi-shield-check me-1"></i> Esta información se maneja con total confidencialidad.</div>
              <div class="form-text small" [class.text-danger]="form.get('demandas')?.value?.length >= 250">
                {{ form.get('demandas')?.value?.length || 0 }}/250
              </div>
            </div>
            <div class="invalid-feedback" *ngIf="form.get('demandas')?.errors?.['required'] || form.get('demandas')?.errors?.['whitespace']">
              Este campo es obligatorio y no puede contener solo espacios.
            </div>
            <div class="invalid-feedback" *ngIf="form.get('demandas')?.errors?.['maxlength']">
              Máximo 250 caracteres permitidos.
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-outline-primary { border: 1.5px solid #dee2e6; color: #495057; }
    .btn-check:checked + .btn-outline-primary { border-color: var(--bs-primary); background-color: rgba(var(--bs-primary-rgb), 0.05); color: var(--bs-primary); box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.1); }
    .fade-in { animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .form-control:focus, .form-select:focus { box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.1); }
  `]
})
export class EstadoCivilComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() isReadOnly: boolean = false;

  ngOnInit(): void {
    // Aplicar validadores iniciales sin resetear valores
    if (!this.isReadOnly) {
      this.aplicarValidadoresIniciales();
    }
  }

  private aplicarValidadoresIniciales() {
    const estado = this.form.get('estado_civil')?.value;
    const valorCtrl = this.form.get('tiempo_estado_civil_valor');
    const unidadCtrl = this.form.get('tiempo_estado_civil_unidad');
    const tipoMatriCtrl = this.form.get('tipo_matrimonio');

    if (estado && estado !== 'SOLTERO') {
      valorCtrl?.setValidators([Validators.required, Validators.min(1)]);
      unidadCtrl?.setValidators([Validators.required]);
    }
    if (estado === 'CASADO') {
      tipoMatriCtrl?.setValidators([Validators.required]);
    }

    valorCtrl?.updateValueAndValidity({ emitEvent: false });
    unidadCtrl?.updateValueAndValidity({ emitEvent: false });
    tipoMatriCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  estadosCiviles = [
    { id: 'estSoltero', value: 'SOLTERO', label: 'Soltero/a', icon: 'bi-person' },
    { id: 'estCasado', value: 'CASADO', label: 'Casado/a', icon: 'bi-people-fill' },
    { id: 'estUnion', value: 'UNION_LIBRE', label: 'Unión Libre', icon: 'bi-heart-fill' },
    { id: 'estViudo', value: 'VIUDO', label: 'Viudo/a', icon: 'bi-patch-minus' },
    { id: 'estDivorciado', value: 'DIVORCIADO', label: 'Divorciado/a', icon: 'bi-person-x' },
    { id: 'estSeparado', value: 'SEPARADO', label: 'Separado/a', icon: 'bi-distribute-vertical' }
  ];

  onEstadoChange() {
    const estado = this.form.get('estado_civil')?.value;
    const valorCtrl = this.form.get('tiempo_estado_civil_valor');
    const unidadCtrl = this.form.get('tiempo_estado_civil_unidad');
    const tipoMatriCtrl = this.form.get('tipo_matrimonio');

    // Reset extras
    valorCtrl?.reset();
    unidadCtrl?.setValue('ANIOS');
    tipoMatriCtrl?.reset();

    // Set validators dynamically
    if (estado && estado !== 'SOLTERO') {
      valorCtrl?.setValidators([Validators.required, Validators.min(1)]);
      unidadCtrl?.setValidators([Validators.required]);
    } else {
      valorCtrl?.clearValidators();
      unidadCtrl?.clearValidators();
    }

    if (estado === 'CASADO') {
      tipoMatriCtrl?.setValidators([Validators.required]);
    } else {
      tipoMatriCtrl?.clearValidators();
    }

    valorCtrl?.updateValueAndValidity();
    unidadCtrl?.updateValueAndValidity();
    tipoMatriCtrl?.updateValueAndValidity();
  }

  // Validación de rango y tipo de dato (Solo enteros positivos)
  validateRange() {
    const valorCtrl = this.form.get('tiempo_estado_civil_valor');
    const unidad = this.form.get('tiempo_estado_civil_unidad')?.value;

    if (valorCtrl?.value !== null && valorCtrl?.value !== undefined) {
      // Forzar entero positivo
      let valor = Math.floor(Math.abs(valorCtrl.value));

      if (unidad === 'ANIOS' && valor > 80) {
        valor = 80;
      } else if (unidad === 'MESES' && valor > 960) {
        valor = 960;
      }

      if (valor !== valorCtrl.value) {
        valorCtrl.setValue(valor, { emitEvent: false });
      }
    }
  }

  getTiempoLabel(): string {
    const estado = this.form.get('estado_civil')?.value;
    switch (estado) {
      case 'CASADO': return 'Tiempo de Casado';
      case 'UNION_LIBRE': return 'Tiempo de Unión';
      case 'VIUDO': return 'Tiempo de Viudez';
      case 'DIVORCIADO': return 'Tiempo desde Divorcio';
      case 'SEPARADO': return 'Tiempo de Separación';
      default: return 'Duración';
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isValid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.valid && (control.dirty || control.touched) && control.value !== '' && control.value !== null);
  }
}
