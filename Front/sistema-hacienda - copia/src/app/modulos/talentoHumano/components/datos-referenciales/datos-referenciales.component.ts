import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TalentoHumanoService } from '../../services/talentoHumano.service';
import { CustomValidators } from '../../utils/custom-validators';

@Component({
  selector: 'app-datos-referenciales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="card mb-3 shadow-sm border-0">
      <div class="card-header bg-primary text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-geo-alt me-2"></i>4. Datos Referenciales</h5>
      </div>
      <div class="card-body p-4">
        <div class="row g-3">
          
          <!-- Dirección y Ciudad -->
          <div class="col-12">
            <label class="form-label fw-semibold">Dirección Domiciliaria <span class="text-danger">*</span></label>
            <div class="input-group has-validation">
              <span class="input-group-text"><i class="bi bi-house-door"></i></span>
              <input type="text" class="form-control" formControlName="direccion" 
                     placeholder="Calle principal, número, calle secundaria y referencia"
                     (input)="sanitizeInput('direccion')"
                     [readonly]="isReadOnly"
                     [class.is-invalid]="isInvalid('direccion')" [class.is-valid]="isValid('direccion')">
              <div class="invalid-feedback">La dirección es obligatoria y no puede contener solo espacios (máx. 200 carac.).</div>
            </div>
            <div class="form-text small"><i class="bi bi-info-circle me-1"></i> Incluye referencias que faciliten la ubicación (ej: frente a la tienda, casa color verde).</div>
          </div>

          <!-- Geografía Domicilio -->
          <div class="col-md-6 col-lg-3">
            <label class="form-label fw-semibold">Provincia <span class="text-danger">*</span></label>
            <select class="form-select" formControlName="provincia" (change)="onProvinciaChange()"
                    [class.is-invalid]="isInvalid('provincia')" [class.is-valid]="isValid('provincia')" [attr.disabled]="isReadOnly ? true : null">
              <option value="">Seleccione...</option>
              <option *ngFor="let p of provinciasDisponibles" [value]="p.nombre">{{p.nombre}}</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div class="col-md-6 col-lg-3 animate-fade" *ngIf="form.get('provincia')?.value === 'Otros'">
            <label class="form-label fw-semibold">Especifique Provincia <span class="text-danger">*</span></label>
            <input type="text" class="form-control" formControlName="provinciaOtro" 
                   placeholder="Escriba la provincia" (input)="cleanLetters('provinciaOtro')"
                   (blur)="trimField('provinciaOtro')"
                   [readonly]="isReadOnly"
                   [class.is-invalid]="isInvalid('provinciaOtro')">
            <div class="invalid-feedback">Especifique la provincia.</div>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label fw-semibold">Cantón/Ciudad <span class="text-danger">*</span></label>
            <select class="form-select" formControlName="ciudad" (change)="onCantonChange()"
                    [class.is-invalid]="isInvalid('ciudad')" [class.is-valid]="isValid('ciudad')" [attr.disabled]="isReadOnly ? true : null">
              <option value="">Seleccione...</option>
              <option *ngFor="let c of cantonesDisponibles" [value]="c.nombre">{{c.nombre}}</option>
              <option value="Otros">Otros</option>
            </select>
            <div class="invalid-feedback">El cantón es obligatorio.</div>
          </div>
          <div class="col-md-6 col-lg-3 animate-fade" *ngIf="form.get('ciudad')?.value === 'Otros'">
            <label class="form-label fw-semibold">Especifique Cantón <span class="text-danger">*</span></label>
            <input type="text" class="form-control text-uppercase" formControlName="ciudadOtro" 
                   placeholder="Escriba el cantón" (input)="cleanLetters('ciudadOtro'); toUpperCase('ciudadOtro')"
                   (blur)="trimField('ciudadOtro')"
                   [readonly]="isReadOnly"
                   [class.is-invalid]="isInvalid('ciudadOtro')">
            <div class="invalid-feedback">Especifique el cantón.</div>
          </div>

          <hr class="my-3 text-muted">

          <!-- Teléfonos -->
          <div class="col-md-6">
            <label class="form-label fw-semibold">Teléfono Principal <span class="text-danger">*</span></label>
            <div class="input-group has-validation">
              <span class="input-group-text"><i class="bi bi-telephone"></i></span>
              <input type="tel" class="form-control" formControlName="telefono_principal" 
                     placeholder="Ej: 0991234567" 
                     (input)="cleanNumbers('telefono_principal')"
                     [readonly]="isReadOnly" 
                     [class.is-invalid]="isInvalid('telefono_principal')" [class.is-valid]="isValid('telefono_principal')">
              <div class="invalid-feedback">Número requerido (7 a 10 dígitos, sin espacios).</div>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-semibold">Teléfono Secundario <span class="text-muted small">(Opcional)</span></label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-telephone"></i></span>
              <input type="tel" class="form-control" formControlName="telefono_secundario" 
                     placeholder="Ej: 042123456" 
                     (input)="cleanNumbers('telefono_secundario')"
                     [readonly]="isReadOnly" 
                     [class.is-invalid]="isInvalid('telefono_secundario')" [class.is-valid]="isValid('telefono_secundario')">
              <div class="invalid-feedback">Ingrese un número válido (7 a 10 dígitos).</div>
            </div>
          </div>

          <hr class="my-3 text-muted">

          <!-- Vivienda -->
          <div class="col-md-6">
            <label class="form-label fw-semibold">Material de la Vivienda <span class="text-danger">*</span></label>
            <select class="form-select" formControlName="vivienda_material" 
                    [attr.disabled]="isReadOnly ? true : null"
                    [class.is-invalid]="isInvalid('vivienda_material')" [class.is-valid]="isValid('vivienda_material')">
              <option value="">Seleccione material...</option>
              <option value="Cemento">Cemento</option>
              <option value="Mixto">Mixto</option>
              <option value="Cabaña">Cabaña</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-semibold">Condición de la Vivienda <span class="text-danger">*</span></label>
            <div class="d-flex gap-2">
              <input type="radio" class="btn-check" value="PROPIA" formControlName="vivienda_condicion" id="condPropia" [attr.disabled]="isReadOnly ? true : null">
              <label class="btn btn-outline-primary flex-fill" for="condPropia">Propia</label>
              
              <input type="radio" class="btn-check" value="ALQUILADA" formControlName="vivienda_condicion" id="condAlquilada" [attr.disabled]="isReadOnly ? true : null">
              <label class="btn btn-outline-primary flex-fill" for="condAlquilada">Alquilada</label>
              
              <input type="radio" class="btn-check" value="FAMILIAR" formControlName="vivienda_condicion" id="condFamiliar" [attr.disabled]="isReadOnly ? true : null">
              <label class="btn btn-outline-primary flex-fill" for="condFamiliar">Familiar</label>
            </div>
            <div class="text-danger small mt-1" *ngIf="isInvalid('vivienda_condicion')">Seleccione una condición.</div>
          </div>

          <hr class="my-3 text-muted">

          <!-- Servicios Básicos -->
          <div [formGroupName]="'servicios_basicos'" class="col-12">
            <label class="form-label fw-bold d-block pb-2">Servicios Básicos Disponibles</label>
            <div class="row g-3">
              <div class="col-md-4">
                <div class="form-check form-switch p-2 border rounded bg-light">
                  <input class="form-check-input ms-0 me-3" type="checkbox" formControlName="agua" id="servAgua" [attr.disabled]="isReadOnly ? true : null">
                  <label class="form-check-label fw-semibold" for="servAgua"><i class="bi bi-droplet me-2 text-info"></i>Agua</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check form-switch p-2 border rounded bg-light">
                  <input class="form-check-input ms-0 me-3" type="checkbox" formControlName="luz" id="servLuz" [attr.disabled]="isReadOnly ? true : null">
                  <label class="form-check-label fw-semibold" for="servLuz"><i class="bi bi-lightning-charge me-2 text-warning"></i>Luz</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check form-switch p-2 border rounded bg-light">
                  <input class="form-check-input ms-0 me-3" type="checkbox" formControlName="telefono" id="servTelef" [attr.disabled]="isReadOnly ? true : null">
                  <label class="form-check-label fw-semibold" for="servTelef"><i class="bi bi-telephone me-2 text-primary"></i>Teléfono</label>
                </div>
              </div>
            </div>
          </div>

          <hr class="my-3 text-muted">

          <!-- Familiares -->
          <div class="col-md-4">
            <label class="form-label fw-semibold">Cantidad de Familiares <small class="text-muted">(Con los que vive)</small> <span class="text-danger">*</span></label>
            <input type="number" class="form-control" formControlName="cantidad_familiares" 
                   min="0" max="20" [readonly]="isReadOnly" [class.is-invalid]="isInvalid('cantidad_familiares')" [class.is-valid]="isValid('cantidad_familiares')">
            <div class="invalid-feedback">Máximo 20 familiares.</div>
          </div>
          <div class="col-md-8">
            <label class="form-label fw-semibold">Relación o Parentesco <span class="text-danger">*</span></label>
            <input type="text" class="form-control" formControlName="familiares_relacion" 
                   placeholder="Ej: Madre, 2 hijos (Si vive solo puede ingresar 'Nadie')" 
                   (input)="cleanAlphanumeric('familiares_relacion')"
                   (blur)="trimField('familiares_relacion')"
                   [readonly]="isReadOnly"
                   [class.is-invalid]="isInvalid('familiares_relacion')" [class.is-valid]="isValid('familiares_relacion')">
            <div class="invalid-feedback" *ngIf="form.get('familiares_relacion')?.errors?.['pattern']">
              Este campo no puede iniciar con espacios o contener caracteres especiales.
            </div>
            <div class="invalid-feedback" *ngIf="form.get('familiares_relacion')?.errors?.['required'] || form.get('familiares_relacion')?.errors?.['whitespace']">
              Este campo es obligatorio. Indique con quién vive actualmente.
            </div>
            <div class="form-text small">Indique con quién vive actualmente (sepárelos por comas).</div>
          </div>

          <hr class="my-3 text-muted">

          <!-- Emergencia -->
          <div class="col-12">
            <div class="p-4 border rounded-3 bg-light border-warning border-opacity-25 shadow-sm">
              <label class="form-label fw-bold text-dark fs-6 mb-3">
                <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>En Caso de Emergencia Contactar a: <span class="text-danger">*</span>
              </label>
              <div class="row g-3">
                <div class="col-md-5">
                  <label class="form-label small fw-semibold">Teléfono de Emergencia</label>
                   <div class="input-group has-validation">
                    <span class="input-group-text bg-white"><i class="bi bi-phone"></i></span>
                    <input type="tel" class="form-control" formControlName="telefono_emergencia" 
                           placeholder="Ej: 0987654321" 
                           (input)="cleanNumbers('telefono_emergencia')"
                           [readonly]="isReadOnly" 
                           [class.is-invalid]="isInvalid('telefono_emergencia')" [class.is-valid]="isValid('telefono_emergencia')">
                    <div class="invalid-feedback">Número requerido (7 a 10 dígitos, sin espacios).</div>
                  </div>
                </div>
                <div class="col-md-7">
                  <label class="form-label small fw-semibold">Nombre del Propietario</label>
                  <div class="input-group has-validation">
                    <span class="input-group-text bg-white"><i class="bi bi-person"></i></span>
                    <input type="text" class="form-control text-capitalize" formControlName="nombre_contacto_emergencia" 
                           placeholder="Nombre completo de la persona" 
                           (input)="cleanLetters('nombre_contacto_emergencia'); capitalizeWords('nombre_contacto_emergencia')"
                           (blur)="trimField('nombre_contacto_emergencia')"
                           [readonly]="isReadOnly"
                           [class.is-invalid]="isInvalid('nombre_contacto_emergencia')" [class.is-valid]="isValid('nombre_contacto_emergencia')">
                    <div class="invalid-feedback" *ngIf="form.get('nombre_contacto_emergencia')?.errors?.['pattern']">
                      El nombre no puede iniciar con espacios o contener caracteres especiales.
                    </div>
                    <div class="invalid-feedback" *ngIf="form.get('nombre_contacto_emergencia')?.errors?.['required'] || form.get('nombre_contacto_emergencia')?.errors?.['minlength'] || form.get('nombre_contacto_emergencia')?.errors?.['whitespace']">
                      Nombre requerido (mín. 3 letras, sin solo espacios).
                    </div>
                  </div>
                  <div class="form-text small text-muted mt-1">Ingrese el nombre de la persona a quien pertenece este número.</div>
                </div>
                <div class="col-12 mt-2">
                  <div class="alert alert-warning border-0 bg-transparent p-0 mb-0 small d-flex align-items-center">
                    <i class="bi bi-shield-lock me-2"></i> Este contacto será utilizado únicamente en caso de emergencia.
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
    .form-control, .form-select { border-radius: 8px; padding: 10px; }
    .btn-group .btn, .btn-check + .btn { border-radius: 8px !important; }
    .input-group-text { border-radius: 8px 0 0 8px; }
    .form-control + .input-group-text { border-radius: 0 8px 8px 0; }
    .border-dashed { border-style: dashed !important; }
    input[type="text"], input[type="tel"] { text-transform: uppercase; }
    input[type="text"]::placeholder, input[type="tel"]::placeholder { text-transform: none; }
  `]
})
export class DatosReferencialesComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() isReadOnly: boolean = false;

  provinciasDisponibles: any[] = [];
  cantonesDisponibles: any[] = [];

  constructor(private thService: TalentoHumanoService) { }

  ngOnInit() {
    // Carga inicial y escucha de cambios
    this.cargarProvincias();

    this.form.get('provincia')?.valueChanges.subscribe(provNombre => {
      this.handleProvinciaChange(provNombre);
    });
  }

  private handleProvinciaChange(provNombre: string) {
    if (provNombre && provNombre !== 'Otros') {
      const selectedProv = this.provinciasDisponibles.find(
        p => p.nombre.toLowerCase() === provNombre.toLowerCase()
      );
      if (selectedProv) {
        if (this.form.get('provincia')?.value !== selectedProv.nombre) {
          this.form.get('provincia')?.setValue(selectedProv.nombre, { emitEvent: false });
        }
        this.cargarCantones(selectedProv.codigo);
      }
    } else {
      this.cantonesDisponibles = [];
    }
  }

  cargarProvincias() {
    this.thService.getProvinciasPorPais('Ecuador').subscribe(data => {
      this.provinciasDisponibles = data.map(p => ({
        ...p,
        nombre: this.toTitleCase(p.nombre)
      }));
      const provActual = this.form.get('provincia')?.value;
      if (provActual) {
        this.handleProvinciaChange(provActual);
      }
    });
  }

  cargarCantones(provinciaCodigo: string) {
    this.thService.getCantonesPorProvincia(provinciaCodigo).subscribe(data => {
      this.cantonesDisponibles = data.map(c => ({
        ...c,
        nombre: this.toTitleCase(c.nombre)
      }));
      const ciudadActual = this.form.get('ciudad')?.value;
      if (ciudadActual) {
        const matchingCanton = this.cantonesDisponibles.find(
          c => c.nombre.toLowerCase() === ciudadActual.toLowerCase()
        );
        if (matchingCanton) {
          this.form.get('ciudad')?.setValue(matchingCanton.nombre, { emitEvent: false });
          this.form.get('ciudadCodigo')?.setValue(matchingCanton.codigo, { emitEvent: false });
        }
      }
    });
  }

  private toTitleCase(str: string): string {
    if (!str) return str;
    return str.trim().toLowerCase().split(/\s+/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  onProvinciaChange() {
    const provNombre = this.form.get('provincia')?.value;
    const provOtroCtrl = this.form.get('provinciaOtro');
    const cantonCtrl = this.form.get('ciudad');
    const cantonOtroCtrl = this.form.get('ciudadOtro');
    const cantonCodCtrl = this.form.get('ciudadCodigo');

    // Reset cantones
    this.cantonesDisponibles = [];
    cantonCtrl?.setValue('');
    cantonOtroCtrl?.setValue('');
    cantonCodCtrl?.setValue(null);

    if (provNombre === 'Otros') {
      provOtroCtrl?.enable();
      provOtroCtrl?.setValidators([
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
        CustomValidators.noWhitespace
      ]);
    } else {
      provOtroCtrl?.disable();
      provOtroCtrl?.setValue('');
      provOtroCtrl?.clearValidators();
      
      const selectedProv = this.provinciasDisponibles.find(p => p.nombre === provNombre);
      if (selectedProv) {
        this.cargarCantones(selectedProv.codigo);
      }
    }
    provOtroCtrl?.updateValueAndValidity();
    cantonOtroCtrl?.updateValueAndValidity();
  }

  onCantonChange() {
    const cantonNombre = this.form.get('ciudad')?.value;
    const cantonOtroCtrl = this.form.get('ciudadOtro');
    const cantonCodCtrl = this.form.get('ciudadCodigo');

    if (cantonNombre === 'Otros') {
      cantonOtroCtrl?.enable();
      cantonOtroCtrl?.setValidators([
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
        CustomValidators.noWhitespace
      ]);
      cantonCodCtrl?.setValue(null);
    } else {
      cantonOtroCtrl?.disable();
      cantonOtroCtrl?.setValue('');
      cantonOtroCtrl?.clearValidators();
      
      const selectedCant = this.cantonesDisponibles.find(c => c.nombre === cantonNombre);
      if (selectedCant) {
        cantonCodCtrl?.setValue(selectedCant.codigo);
      } else {
        cantonCodCtrl?.setValue(null);
      }
    }
    cantonOtroCtrl?.updateValueAndValidity();
  }

  toUpperCase(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value) {
      const sanitized = control.value.toUpperCase().replace(/\s+/g, ' ');
      control.setValue(sanitized, { emitEvent: false });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isValid(controlName: string): boolean {
    const control = this.form.get(controlName);
    // Solo marcar como válido (verde) si tiene contenido y es válido
    return !!(control && control.valid && (control.dirty || control.touched) && control.value !== '' && control.value !== null);
  }

  sanitizeInput(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value) {
      const sanitized = control.value.replace(/\s+/g, ' ');
      control.setValue(sanitized, { emitEvent: false });
    }
  }

  capitalizeFirstLetter(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value) {
      const value = control.value;
      const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
      control.setValue(capitalized, { emitEvent: false });
    }
  }

  capitalizeWords(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value) {
      const words = control.value.split(' ');
      const capitalized = words
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      control.setValue(capitalized, { emitEvent: false });
    }
  }

  cleanLetters(controlName: string) {
    const control = this.form.get(controlName);
    if (control) {
      const cleaned = control.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
      if (cleaned !== control.value) {
        control.setValue(cleaned, { emitEvent: false });
      }
    }
  }

  cleanNumbers(controlName: string) {
    const control = this.form.get(controlName);
    if (control) {
      // Remover todo lo que no sea número y espacios iniciales
      let cleaned = control.value.replace(/\D/g, '');
      // Si el valor era solo espacios o empezó con espacios, el replace anterior ya limpia
      if (cleaned !== control.value) {
        control.setValue(cleaned, { emitEvent: false });
      }
    }
  }

  cleanAlphanumeric(controlName: string) {
    const control = this.form.get(controlName);
    if (control) {
      const cleaned = control.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.]/g, '');
      if (cleaned !== control.value) {
        control.setValue(cleaned, { emitEvent: false });
      }
    }
  }

  trimField(controlName: string) {
    const control = this.form.get(controlName);
    if (control && typeof control.value === 'string') {
      const trimmed = control.value.trim();
      if (trimmed !== control.value) {
        control.setValue(trimmed, { emitEvent: false });
      }
    }
  }
}
