import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-datos-familiares',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="card mb-3 shadow-sm border-0">
      <div class="card-header bg-primary text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-people me-2"></i>6. Datos Familiares</h5>
      </div>
      <div class="card-body p-4">
        
        <!-- PADRE Y MADRE (Secciones Fijas) -->
        <div class="row g-4 mb-5">
          <div class="col-lg-6">
            <div class="p-4 border rounded-3 bg-light h-100" [formGroup]="getGroup('padre')">
              <h6 class="fw-bold mb-3 d-flex align-items-center"><i class="bi bi-gender-male me-2 text-primary"></i>Datos del Padre <span class="text-danger ms-1">*</span></h6>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label x-small mb-0 fw-bold">Nombre Completo <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="nombre" placeholder="Nombre completo" 
                         (input)="cleanLetters('padre.nombre')" (blur)="trimField('padre.nombre')"
                         [class.is-invalid]="isInvalidGroup('padre', 'nombre')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">El nombre es obligatorio y solo debe contener letras (evitar solo espacios).</div>
                </div>
                <div class="col-md-6">
                  <div class="btn-group w-100" role="group">
                    <input type="radio" class="btn-check" value="VIVO" formControlName="estado" id="padreVivo" (change)="updateFamiliarValidators('padre')" [attr.disabled]="isReadOnly ? true : null">
                    <label class="btn btn-outline-success" for="padreVivo">Vivo</label>
                    <input type="radio" class="btn-check" value="FINADO" formControlName="estado" id="padreFinado" (change)="updateFamiliarValidators('padre')" [attr.disabled]="isReadOnly ? true : null">
                    <label class="btn btn-outline-secondary" for="padreFinado">Finado</label>
                  </div>
                </div>
                <!-- Opción de No Conoce Fecha -->
                <div class="col-12" *ngIf="getGroup('padre').get('estado')?.value">
                  <div class="form-check form-switch small">
                    <input class="form-check-input" type="checkbox" formControlName="no_conoce_fecha" id="padreNoFecha" (change)="updateFamiliarValidators('padre')" [attr.disabled]="isReadOnly ? true : null">
                    <label class="form-check-label text-muted" for="padreNoFecha">No conozco la fecha exacta de nacimiento</label>
                  </div>
                </div>
                <!-- Campo de Fecha de Nacimiento -->
                <div class="col-md-6" *ngIf="!getGroup('padre').get('no_conoce_fecha')?.value">
                  <label class="form-label x-small mb-0 fw-bold">Fecha de Nacimiento</label>
                  <input type="date" class="form-control" formControlName="fecha_nacimiento" 
                         [readonly]="isReadOnly" (change)="onFechaNacimientoChange('padre')"
                         [class.is-invalid]="isInvalidGroup('padre', 'fecha_nacimiento')"
                         [max]="maxDate"
                         title="Fecha de Nacimiento">
                  <div class="invalid-feedback">La fecha es obligatoria.</div>
                </div>
                <!-- Campo de Edad (Editable si no conoce fecha) -->
                <div class="col-12">
                  <label class="form-label x-small mb-0 fw-bold">Edad</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white text-muted small">{{ getGroup('padre').get('no_conoce_fecha')?.value ? 'Ingreso manual:' : 'Edad calculada:' }}</span>
                    <input type="number" class="form-control fw-bold" formControlName="edad" placeholder="0" 
                           [class.bg-light]="!getGroup('padre').get('no_conoce_fecha')?.value"
                           [class.is-invalid]="isInvalidGroup('padre', 'edad')">
                    <span class="input-group-text">años</span>
                  </div>
                  <div class="invalid-feedback d-block" *ngIf="isInvalidGroup('padre', 'edad')">La edad es obligatoria (0-120 años).</div>
                  <small class="text-muted italic" style="font-size: 0.7rem;" *ngIf="!getGroup('padre').get('no_conoce_fecha')?.value">* Se calcula automáticamente al ingresar la fecha.</small>
                </div>
                <div class="col-12">
                  <label class="form-label x-small mb-0 fw-bold">Domicilio <span class="text-danger" *ngIf="getGroup('padre').get('estado')?.value === 'VIVO'">*</span></label>
                  <input type="text" class="form-control" formControlName="domicilio" placeholder="Domicilio actual / Referencia" 
                         (blur)="trimField('padre.domicilio')"
                         [class.is-invalid]="isInvalidGroup('padre', 'domicilio')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">El domicilio es obligatorio y no puede contener solo espacios.</div>
                </div>
                <div class="col-12">
                  <label class="form-label x-small mb-0 fw-bold">Ocupación <span class="text-danger" *ngIf="getGroup('padre').get('estado')?.value === 'VIVO'">*</span></label>
                  <input type="text" class="form-control" formControlName="ocupacion" 
                         placeholder="Ocupación / Labor" 
                         (input)="cleanLetters('padre.ocupacion')"
                         (blur)="trimField('padre.ocupacion')"
                         [class.is-invalid]="isInvalidGroup('padre', 'ocupacion')"
                         [readonly]="isReadOnly">
                  <div class="invalid-feedback">
                    La ocupación es obligatoria y no puede iniciar con espacios o caracteres especiales.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="p-4 border rounded-3 bg-light h-100" [formGroup]="getGroup('madre')">
              <h6 class="fw-bold mb-3 d-flex align-items-center"><i class="bi bi-gender-female me-2 text-danger"></i>Datos de la Madre <span class="text-danger ms-1">*</span></h6>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label x-small mb-0 fw-bold">Nombre Completo <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="nombre" placeholder="Nombre completo" 
                         (input)="cleanLetters('madre.nombre')" (blur)="trimField('madre.nombre')"
                         [class.is-invalid]="isInvalidGroup('madre', 'nombre')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">El nombre es obligatorio y solo debe contener letras (evitar solo espacios).</div>
                </div>
                <div class="col-md-6">
                  <div class="btn-group w-100" role="group">
                    <input type="radio" class="btn-check" value="VIVO" formControlName="estado" id="madreVivo" (change)="updateFamiliarValidators('madre')" [attr.disabled]="isReadOnly ? true : null">
                    <label class="btn btn-outline-success" for="madreVivo">Vivo</label>
                    <input type="radio" class="btn-check" value="FINADO" formControlName="estado" id="madreFinado" (change)="updateFamiliarValidators('madre')" [attr.disabled]="isReadOnly ? true : null">
                    <label class="btn btn-outline-secondary" for="madreFinado">Finado</label>
                  </div>
                </div>
                <!-- Opción de No Conoce Fecha -->
                <div class="col-12" *ngIf="getGroup('madre').get('estado')?.value">
                  <div class="form-check form-switch small">
                    <input class="form-check-input" type="checkbox" formControlName="no_conoce_fecha" id="madreNoFecha" (change)="updateFamiliarValidators('madre')" [attr.disabled]="isReadOnly ? true : null">
                    <label class="form-check-label text-muted" for="madreNoFecha">No conozco la fecha exacta de nacimiento</label>
                  </div>
                </div>
                <!-- Campo de Fecha de Nacimiento -->
                <div class="col-md-6" *ngIf="!getGroup('madre').get('no_conoce_fecha')?.value">
                  <label class="form-label x-small mb-0 fw-bold">Fecha de Nacimiento</label>
                  <input type="date" class="form-control" formControlName="fecha_nacimiento" 
                         [readonly]="isReadOnly" (change)="onFechaNacimientoChange('madre')"
                         [class.is-invalid]="isInvalidGroup('madre', 'fecha_nacimiento')"
                         [max]="maxDate"
                         title="Fecha de Nacimiento">
                  <div class="invalid-feedback">La fecha es obligatoria.</div>
                </div>
                <!-- Campo de Edad (Editable si no conoce fecha) -->
                <div class="col-12">
                  <label class="form-label x-small mb-0 fw-bold">Edad</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white text-muted small">{{ getGroup('madre').get('no_conoce_fecha')?.value ? 'Ingreso manual:' : 'Edad calculada:' }}</span>
                    <input type="number" class="form-control fw-bold" formControlName="edad" placeholder="0" 
                           [class.bg-light]="!getGroup('madre').get('no_conoce_fecha')?.value"
                           [class.is-invalid]="isInvalidGroup('madre', 'edad')">
                    <span class="input-group-text">años</span>
                  </div>
                  <div class="invalid-feedback d-block" *ngIf="isInvalidGroup('madre', 'edad')">La edad es obligatoria (0-120 años).</div>
                  <small class="text-muted italic" style="font-size: 0.7rem;" *ngIf="!getGroup('madre').get('no_conoce_fecha')?.value">* Se calcula automáticamente al ingresar la fecha.</small>
                </div>
                <div class="col-12">
                  <label class="form-label x-small mb-0 fw-bold">Domicilio <span class="text-danger" *ngIf="getGroup('madre').get('estado')?.value === 'VIVO'">*</span></label>
                  <input type="text" class="form-control" formControlName="domicilio" placeholder="Domicilio actual / Referencia" 
                         (blur)="trimField('madre.domicilio')"
                         [class.is-invalid]="isInvalidGroup('madre', 'domicilio')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">El domicilio es obligatorio y no puede contener solo espacios.</div>
                </div>
                <div class="col-12">
                  <label class="form-label x-small mb-0 fw-bold">Ocupación <span class="text-danger" *ngIf="getGroup('madre').get('estado')?.value === 'VIVO'">*</span></label>
                  <input type="text" class="form-control" formControlName="ocupacion" 
                         placeholder="Ocupación / Labor" 
                         (input)="cleanLetters('madre.ocupacion')"
                         (blur)="trimField('madre.ocupacion')"
                         [class.is-invalid]="isInvalidGroup('madre', 'ocupacion')"
                         [readonly]="isReadOnly">
                  <div class="invalid-feedback">
                    La ocupación es obligatoria y no puede iniciar con espacios o caracteres especiales.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CÓNYUGE ACTUAL (Solo si aplica) -->
        <div class="mb-5 animate-fade" *ngIf="showConyugeActual()">
          <div class="p-4 border rounded-3 bg-primary bg-opacity-10" [formGroup]="getGroup('conyuge_actual')">
            <h6 class="fw-bold mb-3"><i class="bi bi-suit-heart-fill me-2 text-danger"></i>Información del Cónyuge / Pareja Actual</h6>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Nombre Completo <span class="text-danger">*</span></label>
                <input type="text" class="form-control bg-white" formControlName="nombre" placeholder="Nombres y Apellidos" 
                       (input)="cleanLetters('conyuge_actual.nombre')" (blur)="trimField('conyuge_actual.nombre')"
                       [readonly]="isReadOnly" [class.is-invalid]="isInvalidGroup('conyuge_actual', 'nombre')">
                <div class="invalid-feedback">El nombre es obligatorio y solo debe contener letras.</div>
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-semibold">Estado <span class="text-danger">*</span></label>
                <select class="form-select bg-white" formControlName="estado" [attr.disabled]="isReadOnly ? true : null" (change)="updateFamiliarValidators('conyuge_actual')">
                  <option value="VIVO">Vivo</option>
                  <option value="FINADO">Finado</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-semibold">Edad</label>
                <input type="number" class="form-control bg-white" formControlName="edad" placeholder="0" [readonly]="isReadOnly" [class.is-invalid]="isInvalidGroup('conyuge_actual', 'edad')">
                <div class="invalid-feedback" *ngIf="getGroup('conyuge_actual').get('edad')?.errors?.['required']">Edad obligatoria si está vivo.</div>
                <div class="invalid-feedback" *ngIf="getGroup('conyuge_actual').get('edad')?.errors?.['min'] || getGroup('conyuge_actual').get('edad')?.errors?.['max']">0-120 años.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Domicilio <span class="text-danger">*</span></label>
                <input type="text" class="form-control bg-white" formControlName="domicilio" placeholder="Donde reside actualmente" 
                       (blur)="trimField('conyuge_actual.domicilio')"
                       [readonly]="isReadOnly" [class.is-invalid]="isInvalidGroup('conyuge_actual', 'domicilio')">
                <div class="invalid-feedback">Domicilio obligatorio.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Ocupación <span class="text-danger">*</span></label>
                <input type="text" class="form-control bg-white" formControlName="ocupacion" 
                       placeholder="A qué se dedica"
                       (input)="cleanLetters('conyuge_actual.ocupacion')"
                       (blur)="trimField('conyuge_actual.ocupacion')"
                       [class.is-invalid]="isInvalidGroup('conyuge_actual', 'ocupacion')"
                       [readonly]="isReadOnly">
                <div class="invalid-feedback">
                  Ocupación obligatoria (solo letras).
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ARREGLOS DINÁMICOS (Hermanos, Hijos, Ex-Cónyuges) -->
        <div class="row g-4">
          
          <!-- HERMANOS -->
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 class="fw-bold mb-0 text-secondary"><i class="bi bi-people-fill me-2"></i>Hermanos <small class="text-muted">(Ingrese todos los hermanos)</small></h6>
                <small class="text-primary fw-semibold"><i class="bi bi-info-circle me-1"></i> Recomendación: Ingrese un máximo de 6 hermanos para un formato de impresión óptimo.</small>
              </div>
              <button type="button" class="btn btn-sm btn-outline-primary" (click)="addHermano()" *ngIf="!isReadOnly">
                <i class="bi bi-plus-lg me-1"></i> Agregar Hermano
              </button>
            </div>
            <div class="row g-3">
              <div class="col-md-6 animate-fade" *ngFor="let h of hermanos.controls; let i=index" [formGroup]="getGroupFromArray(hermanos, i)">
                <div class="p-3 border rounded-3 bg-white shadow-sm position-relative pt-4 familiar-card">
                  <button type="button" class="btn-close position-absolute top-0 end-0 m-2" (click)="removeFromArray(hermanos, i)" *ngIf="!isReadOnly"></button>
                  <div class="row g-2">
                    <div class="col-12">
                      <input type="text" class="form-control form-control-sm" formControlName="nombre" 
                             placeholder="Nombre completo" 
                             (input)="cleanLettersInArray(hermanos, i, 'nombre')"
                             (blur)="trimFieldInArray(hermanos, i, 'nombre')"
                             [readonly]="isReadOnly"
                             [class.is-invalid]="getGroupFromArray(hermanos, i).get('nombre')?.invalid && getGroupFromArray(hermanos, i).get('nombre')?.touched">
                      <div class="invalid-feedback">El nombre es obligatorio (solo letras).</div>
                    </div>
                    <div class="col-6">
                      <select class="form-select form-select-sm" formControlName="genero" [attr.disabled]="isReadOnly ? true : null">
                        <option value="MASCULINO">Masc.</option>
                        <option value="FEMENINO">Fem.</option>
                      </select>
                    </div>
                    <div class="col-6">
                      <select class="form-select form-select-sm" formControlName="estado" [attr.disabled]="isReadOnly ? true : null" (change)="updateFamiliarValidators('hermanos', i)">
                        <option value="VIVO">Vivo</option>
                        <option value="FINADO">Finado</option>
                      </select>
                    </div>
                    <div class="col-3">
                      <select class="form-select form-select-sm" formControlName="es_mayor_menor" 
                             [class.is-invalid]="getGroupFromArray(hermanos, i).get('es_mayor_menor')?.invalid && getGroupFromArray(hermanos, i).get('es_mayor_menor')?.touched"
                             [attr.disabled]="isReadOnly ? true : null">
                        <option value="">Orden</option>
                        <option value="MAYOR">Mayor</option>
                        <option value="MENOR">Menor</option>
                      </select>
                      <div class="invalid-feedback small">Seleccionar orden.</div>
                    </div>
                    <div class="col-3">
                      <input type="number" class="form-control form-control-sm" formControlName="numero_hermano" 
                             placeholder="# Hermano" [readonly]="isReadOnly" 
                             (input)="preventSpaces(hermanos, i, 'numero_hermano')"
                             [class.is-invalid]="getGroupFromArray(hermanos, i).get('numero_hermano')?.invalid && getGroupFromArray(hermanos, i).get('numero_hermano')?.touched">
                      <div class="invalid-feedback small">1-50.</div>
                    </div>
                    <div class="col-6">
                      <label class="form-label extreme-small mb-0">Edad <span class="text-danger" *ngIf="isVivoInArray(hermanos, i)">*</span></label>
                      <input type="number" class="form-control form-control-sm" formControlName="edad" placeholder="Edad" [readonly]="isReadOnly" [class.is-invalid]="getGroupFromArray(hermanos, i).get('edad')?.invalid && getGroupFromArray(hermanos, i).get('edad')?.touched">
                      <div class="invalid-feedback">Edad no válida.</div>
                    </div>
                    <div class="col-12">
                      <input type="text" class="form-control form-control-sm" formControlName="domicilio" 
                             placeholder="Domicilio o Referencia" 
                             (input)="cleanAlphanumericInArray(hermanos, i, 'domicilio')"
                             (blur)="trimFieldInArray(hermanos, i, 'domicilio')"
                             [readonly]="isReadOnly"
                             [class.is-invalid]="getGroupFromArray(hermanos, i).get('domicilio')?.invalid && getGroupFromArray(hermanos, i).get('domicilio')?.touched">
                      <div class="invalid-feedback">El domicilio es obligatorio.</div>
                    </div>
                    <div class="col-12">
                      <input type="text" class="form-control form-control-sm" formControlName="ocupacion" 
                             placeholder="Ocupación / Labor" 
                             (input)="cleanLettersInArray(hermanos, i, 'ocupacion')"
                             (blur)="trimFieldInArray(hermanos, i, 'ocupacion')"
                             [readonly]="isReadOnly"
                             [class.is-invalid]="getGroupFromArray(hermanos, i).get('ocupacion')?.invalid && getGroupFromArray(hermanos, i).get('ocupacion')?.touched">
                      <div class="invalid-feedback">La ocupación es obligatoria.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="alert alert-light border py-2 px-3 mt-2 small" *ngIf="hermanos.length === 0">No ha agregado hermanos.</div>
          </div>

          <hr class="opacity-25">

          <!-- HIJOS (Ilimitados) -->
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 class="fw-bold mb-0 text-secondary"><i class="bi bi-emoji-smile me-2"></i>Hijos <small class="text-muted">(Ingrese todos los hijos)</small></h6>
                <small class="text-primary fw-semibold"><i class="bi bi-info-circle me-1"></i> Recomendación: Ingrese un máximo de 6 hijos para un formato de impresión óptimo.</small>
              </div>
              <button type="button" class="btn btn-sm btn-outline-primary" (click)="addHijo()" *ngIf="!isReadOnly">
                <i class="bi bi-plus-lg me-1"></i> Agregar Hijo
              </button>
            </div>
            <div class="row g-3">
              <div class="col-lg-6 animate-fade" *ngFor="let h of hijos.controls; let i=index" [formGroup]="getGroupFromArray(hijos, i)">
                <div class="p-3 border rounded-3 bg-white shadow-sm position-relative familiar-card">
                  <button type="button" class="btn-close position-absolute top-0 end-0 m-2" (click)="removeFromArray(hijos, i)" *ngIf="!isReadOnly"></button>
                  <div class="row g-2">
                    <div class="col-md-8">
                      <label class="form-label small mb-0">Nombre del Hijo</label>
                      <input type="text" class="form-control form-control-sm" formControlName="nombre" 
                             placeholder="Nombre completo" 
                             (input)="cleanLettersInArray(hijos, i, 'nombre')"
                             (blur)="trimFieldInArray(hijos, i, 'nombre')"
                             [readonly]="isReadOnly"
                             [class.is-invalid]="getGroupFromArray(hijos, i).get('nombre')?.invalid && getGroupFromArray(hijos, i).get('nombre')?.touched">
                      <div class="invalid-feedback">El nombre es obligatorio.</div>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label small mb-0">Edad</label>
                      <input type="number" class="form-control form-control-sm" formControlName="edad" placeholder="0" [readonly]="isReadOnly" [class.is-invalid]="getGroupFromArray(hijos, i).get('edad')?.invalid && getGroupFromArray(hijos, i).get('edad')?.touched">
                      <div class="invalid-feedback">Campo obligatorio.</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small mb-0">Ocupación / Estudio <span class="text-danger">*</span></label>
                      <input type="text" class="form-control form-control-sm" formControlName="ocupacion" 
                             placeholder="Ej: Estudiante / Primaria / Ninguna" 
                             (input)="cleanLettersInArray(hijos, i, 'ocupacion')"
                             (blur)="trimFieldInArray(hijos, i, 'ocupacion')"
                             [readonly]="isReadOnly"
                             [class.is-invalid]="getGroupFromArray(hijos, i).get('ocupacion')?.invalid && getGroupFromArray(hijos, i).get('ocupacion')?.touched">
                      <div class="invalid-feedback">La ocupación o estudio es obligatorio.</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small mb-0">¿Tiene Discapacidad? <span class="text-danger">*</span></label>
                      <select class="form-select form-select-sm" formControlName="discapacidad" [attr.disabled]="isReadOnly ? true : null" (change)="toggleDiscapacidadValidator(i)">
                        <option [value]="false">No</option>
                        <option [value]="true">Sí</option>
                      </select>
                    </div>
                    <div class="col-12" *ngIf="h.get('discapacidad')?.value === 'true' || h.get('discapacidad')?.value === true">
                      <label class="form-label small mb-0">Especifique la discapacidad <span class="text-danger">*</span></label>
                      <input type="text" class="form-control form-control-sm border-warning" formControlName="descripcion_discapacidad" 
                             placeholder="Ej: Auditiva, Visual, Física, etc." 
                             (blur)="trimFieldInArray(hijos, i, 'descripcion_discapacidad')"
                             [class.is-invalid]="getGroupFromArray(hijos, i).get('descripcion_discapacidad')?.invalid && getGroupFromArray(hijos, i).get('descripcion_discapacidad')?.touched"
                             [readonly]="isReadOnly">
                      <div class="invalid-feedback">Debe especificar la discapacidad observada o diagnosticada.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="alert alert-light border py-2 px-3 mt-2 small" *ngIf="hijos.length === 0">No ha agregado hijos.</div>
          </div>

          <hr class="opacity-25">

          <!-- COMPROMISOS ANTERIORES -->
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold mb-0 text-secondary"><i class="bi bi-person-dash me-2"></i>Cónyuges Anteriores <small class="text-muted">(Máx. 3)</small></h6>
              <button type="button" class="btn btn-sm btn-outline-secondary" (click)="addConyugeAnterior()" [disabled]="conyuges_anteriores.length >= 3" *ngIf="!isReadOnly">
                <i class="bi bi-plus-lg me-1"></i> Agregar Registro
              </button>
            </div>
            <div class="row g-3">
              <div class="col-md-4 animate-fade" *ngFor="let c of conyuges_anteriores.controls; let i=index" [formGroup]="getGroupFromArray(conyuges_anteriores, i)">
                <div class="p-3 border rounded-3 bg-light position-relative shadow-sm pt-4 familiar-card">
                  <button type="button" class="btn-close position-absolute top-0 end-0 m-1" style="transform: scale(0.8)" (click)="removeFromArray(conyuges_anteriores, i)" *ngIf="!isReadOnly"></button>
                  <label class="form-label small mb-1 fw-semibold">Cónyuge #{{i+1}}</label>
                  <input type="text" class="form-control form-control-sm mb-2" formControlName="nombre" 
                         placeholder="Nombre completo" 
                         (input)="cleanLettersInArray(conyuges_anteriores, i, 'nombre')"
                         (blur)="trimFieldInArray(conyuges_anteriores, i, 'nombre')"
                         [readonly]="isReadOnly"
                         [class.is-invalid]="getGroupFromArray(conyuges_anteriores, i).get('nombre')?.invalid && getGroupFromArray(conyuges_anteriores, i).get('nombre')?.touched">
                  <div class="invalid-feedback">Obligatorio.</div>
                  <div class="row g-2">
                    <div class="col-4">
                      <label class="form-label extreme-small mb-0">Edad <span class="text-danger">*</span></label>
                      <input type="number" class="form-control form-control-sm" formControlName="edad" placeholder="0" [readonly]="isReadOnly" [class.is-invalid]="getGroupFromArray(conyuges_anteriores, i).get('edad')?.invalid && getGroupFromArray(conyuges_anteriores, i).get('edad')?.touched">
                    </div>
                    <div class="col-8">
                      <label class="form-label extreme-small mb-0">Ocupación <span class="text-danger">*</span></label>
                      <input type="text" class="form-control form-control-sm" formControlName="ocupacion" 
                             placeholder="Ocupación" 
                             (input)="cleanLettersInArray(conyuges_anteriores, i, 'ocupacion')"
                             (blur)="trimFieldInArray(conyuges_anteriores, i, 'ocupacion')"
                             [readonly]="isReadOnly"
                             [class.is-invalid]="getGroupFromArray(conyuges_anteriores, i).get('ocupacion')?.invalid && getGroupFromArray(conyuges_anteriores, i).get('ocupacion')?.touched">
                    </div>
                    <div class="invalid-feedback d-block" *ngIf="getGroupFromArray(conyuges_anteriores, i).invalid && getGroupFromArray(conyuges_anteriores, i).touched">
                      Nombre, edad y ocupación son obligatorios.
                    </div>
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
    .animate-fade { animation: fadeIn 0.3s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .form-control, .form-select { border-radius: 8px; }
    .btn-group .btn { border-radius: 8px !important; }
    input[type="text"] { text-transform: uppercase; }
    input[type="text"]::placeholder { text-transform: none; }
    .extreme-small { font-size: 0.75rem; }
  `]
})
export class DatosFamiliaresComponent implements OnInit, OnChanges {
  @Input() form!: FormGroup;
  @Input() mainForm!: FormGroup; // Necesario para detectar estado civil
  @Input() isReadOnly: boolean = false;
  maxDate = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isReadOnly'] && !changes['isReadOnly'].firstChange) {
      this.refreshAllValidators();
    }
  }

  ngOnInit() {
    this.setupConyugeValidator();
    this.setupParentsInitialState(); // Inferir estado inicial de no_conoce_fecha
    this.setupParentsAgeCalcuator(); // Nuevo watcher para padres
    // Refresco inicial inmediato
    this.refreshAllValidators();

    // Escuchar cambios profundos para re-validar dinámicamente
    this.form.valueChanges.subscribe(() => {
      this.refreshAllValidators();
    });
  }

  private setupParentsInitialState() {
    ['padre', 'madre'].forEach(parent => {
      const group = this.getGroup(parent);
      if (!group) return;

      const fecha = group.get('fecha_nacimiento')?.value;
      const edad = group.get('edad')?.value;

      // Si tiene edad pero no fecha de nacimiento, marcar no_conoce_fecha como true
      if (edad && !fecha) {
        group.get('no_conoce_fecha')?.setValue(true, { emitEvent: false });
      }
    });
  }

  refreshAllValidators() {
    this.updateFamiliarValidators('padre');
    this.updateFamiliarValidators('madre');
    if (this.showConyugeActual()) {
      this.updateFamiliarValidators('conyuge_actual');
    }

    // Validar hermanos existentes
    for (let i = 0; i < this.hermanos.length; i++) {
      this.updateFamiliarValidators('hermanos', i);
    }
  }

  private setupConyugeValidator() {
    if (!this.mainForm) return;

    // Escuchar cambios en el estado civil del formulario principal
    this.mainForm.get('estadoCivil')?.get('estado_civil')?.valueChanges.subscribe(estado => {
      this.updateConyugeValidators(estado);
    });

    // Ejecutar una vez al inicio por si ya tiene valor (ej: modo edición)
    const currentEstado = this.mainForm.get('estadoCivil')?.get('estado_civil')?.value;
    this.updateConyugeValidators(currentEstado);
  }

  private updateConyugeValidators(estado: string) {
    const conyugeGroup = this.getGroup('conyuge_actual');
    const fields = ['nombre', 'domicilio', 'ocupacion'];

    if (estado === 'CASADO' || estado === 'UNION_LIBRE') {
      fields.forEach(f => {
        const control = conyugeGroup.get(f);
        if (f === 'nombre' || f === 'ocupacion') {
          control?.setValidators([Validators.required, Validators.pattern(this.ONLY_LETTERS_PATTERN)]);
        } else {
          control?.setValidators([Validators.required]);
        }
      });
      // La edad se maneja en updateFamiliarValidators('conyuge_actual')
      this.updateFamiliarValidators('conyuge_actual');
    } else {
      fields.forEach(f => {
        const control = conyugeGroup.get(f);
        control?.clearValidators();
        if (!this.isReadOnly) control?.setValue('');
      });
      conyugeGroup.get('edad')?.clearValidators();
      if (!this.isReadOnly) conyugeGroup.get('edad')?.setValue(null);
    }

    fields.forEach(f => conyugeGroup.get(f)?.updateValueAndValidity());
    conyugeGroup.get('edad')?.updateValueAndValidity();
  }

  toggleDiscapacidadValidator(index: number) {
    const group = this.hijos.at(index) as FormGroup;
    const discapacidad = group.get('discapacidad')?.value === 'true' || group.get('discapacidad')?.value === true;
    const descCtrl = group.get('descripcion_discapacidad');

    if (discapacidad) {
      descCtrl?.setValidators([Validators.required]);
    } else {
      descCtrl?.clearValidators();
      if (!this.isReadOnly) descCtrl?.setValue('');
    }
    descCtrl?.updateValueAndValidity();
  }

  get hermanos() { return this.form.get('hermanos') as FormArray; }
  get hijos() { return this.form.get('hijos') as FormArray; }
  get conyuges_anteriores() { return this.form.get('conyuges_anteriores') as FormArray; }

  getGroup(name: string): FormGroup {
    return this.form.get(name) as FormGroup;
  }

  getGroupFromArray(array: FormArray, index: number): FormGroup {
    return array.at(index) as FormGroup;
  }

  // Lógica Dinámica
  showConyugeActual(): boolean {
    if (!this.mainForm) return false;
    const estadoCivil = this.mainForm.get('estadoCivil')?.get('estado_civil')?.value;
    return estadoCivil === 'CASADO' || estadoCivil === 'UNION_LIBRE';
  }

  private readonly ONLY_LETTERS_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/;
  private readonly ALPHANUMERIC_PATTERN = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.]*$/;

  private setupParentsAgeCalcuator() {
    ['padre', 'madre'].forEach(parent => {
      const group = this.getGroup(parent);
      if (!group) return;

      group.get('fecha_nacimiento')?.valueChanges.subscribe(fecha => {
        if (!group.get('no_conoce_fecha')?.value) {
          if (fecha) {
            const edad = this.calculateAge(fecha);
            group.get('edad')?.setValue(edad, { emitEvent: false });
          } else {
            group.get('edad')?.setValue(null, { emitEvent: false });
          }
          group.get('edad')?.updateValueAndValidity({ emitEvent: false });
        }
      });
    });
  }

  onFechaNacimientoChange(parent: string) {
    const group = this.getGroup(parent);
    const fecha = group.get('fecha_nacimiento')?.value;
    if (fecha) {
      const edad = this.calculateAge(fecha);
      group.get('edad')?.setValue(edad, { emitEvent: false });
    } else {
      group.get('edad')?.setValue(null, { emitEvent: false });
    }
    group.get('edad')?.updateValueAndValidity();
  }

  calculateAge(birthDate: string): number | null {
    if (!birthDate) return null;
    
    const [year, month, day] = birthDate.split('-').map(Number);
    if (!year || !month || !day) return null;

    const today = new Date();
    const birth = new Date(year, month - 1, day);
    
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  }

  updateFamiliarValidators(parent: string, index?: number) {
    let group: FormGroup;
    if (parent === 'hermanos') {
      group = this.hermanos.at(index!) as FormGroup;
    } else {
      group = this.getGroup(parent);
    }

    const estado = group.get('estado')?.value?.toString().toUpperCase();
    const fields = ['edad', 'domicilio', 'ocupacion', 'fecha_nacimiento'];
    
    // Si es del arreglo de hermanos, incluimos campos de orden
    if (parent === 'hermanos') {
      fields.push('es_mayor_menor', 'numero_hermano');
    }

    if (estado === 'VIVO' || estado === 'FINADO') {
      const isVivo = estado === 'VIVO';
      const noFecha = group.get('no_conoce_fecha') ? group.get('no_conoce_fecha')?.value : true;

      fields.forEach(f => {
        const control = group.get(f);
        if (!control) return;

        if (f === 'edad') {
          const isParentType = (parent === 'padre' || parent === 'madre');
          const validators = [Validators.min(0), Validators.max(120)];
          if (isVivo && !isParentType) {
            validators.push(Validators.required);
          }
          control.setValidators(validators);
          if (!this.isReadOnly) {
            noFecha ? control.enable({emitEvent: false}) : control.disable({emitEvent: false});
          } else {
            control.disable({emitEvent: false});
          }
        } else if (f === 'fecha_nacimiento') {
          control.setValidators(null);
          if (!this.isReadOnly) {
            !noFecha ? control.enable({emitEvent: false}) : control.disable({emitEvent: false});
            if (noFecha) control.setValue(null, { emitEvent: false });
          } else {
            control.disable({emitEvent: false});
          }
        } else if (f === 'ocupacion') {
          control.setValidators(isVivo ? [Validators.required, Validators.pattern(this.ONLY_LETTERS_PATTERN)] : null);
          if (!this.isReadOnly) control.enable({emitEvent: false});
        } else if (f === 'domicilio') {
          const pattern = parent === 'hermanos' ? this.ALPHANUMERIC_PATTERN : null;
          const validators = isVivo ? (pattern ? [Validators.required, Validators.pattern(pattern)] : [Validators.required]) : null;
          control.setValidators(validators);
          if (!this.isReadOnly) control.enable({emitEvent: false});
        } else if (f === 'es_mayor_menor') {
          control.setValidators(isVivo ? [Validators.required] : null);
          if (!this.isReadOnly) control.enable({emitEvent: false});
        } else if (f === 'numero_hermano') {
          control.setValidators(isVivo ? [Validators.required, Validators.min(1), Validators.max(50), Validators.pattern(/^[0-9]+$/)] : null);
          if (!this.isReadOnly) control.enable({emitEvent: false});
        }
      });
    } else {
      // Si no hay estado o es otro estado, limpiar y deshabilitar
      fields.forEach(f => {
        const control = group.get(f);
        if (!control) return;
        control.setValidators(null);
        control.setErrors(null);
        if (!this.isReadOnly) {
          control.disable({emitEvent: false});
          if (f === 'edad' || f === 'numero_hermano' || f === 'fecha_nacimiento') {
            if (control.value !== null) control.setValue(null, { emitEvent: false });
          } else if (control.value !== '') {
            control.setValue('', { emitEvent: false });
          }
        }
      });
    }

    fields.forEach(f => group.get(f)?.updateValueAndValidity({ emitEvent: false }));
    // No disparamos eventos hacia arriba para evitar lentitud en formularios grandes
    group.updateValueAndValidity({ emitEvent: false, onlySelf: true });
  }

  preventSpaces(array: FormArray, index: number, controlName: string) {
    const control = array.at(index).get(controlName);
    if (control && control.value) {
      // Si es un número en el input, a veces llega como string.
      // Eliminamos cualquier espacio.
      const val = control.value.toString().replace(/\s/g, '');
      if (val !== control.value.toString()) {
        control.setValue(val === '' ? null : parseInt(val, 10), { emitEvent: false });
      }
    }
  }

  // Agregadores
  addHermano() {
    const group = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.ONLY_LETTERS_PATTERN)]],
      estado: ['VIVO', Validators.required],
      edad: [null, [Validators.required, Validators.min(0), Validators.max(120)]],
      domicilio: ['', [Validators.required, Validators.pattern(this.ALPHANUMERIC_PATTERN)]],
      ocupacion: ['', [Validators.required, Validators.pattern(this.ONLY_LETTERS_PATTERN)]],
      genero: ['MASCULINO', Validators.required],
      es_mayor_menor: ['', Validators.required],
      numero_hermano: [null, [Validators.required, Validators.min(1), Validators.max(50), Validators.pattern(/^[0-9]+$/)]]
    });
    this.hermanos.push(group);
    this.updateFamiliarValidators('hermanos', this.hermanos.length - 1);
    this.scrollToLast('.familiar-card', 'Hermano/a añadido/a abajo');
  }

  addHijo() {
    this.hijos.push(this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.ONLY_LETTERS_PATTERN)]],
      edad: [null, [Validators.required, Validators.min(0), Validators.max(120)]],
      ocupacion: ['', [Validators.required, Validators.pattern(this.ONLY_LETTERS_PATTERN)]],
      discapacidad: [false, Validators.required],
      descripcion_discapacidad: ['']
    }));
    this.scrollToLast('.familiar-card', 'Hijo/a añadido/a abajo');
  }

  addConyugeAnterior() {
    if (this.conyuges_anteriores.length < 3) {
      this.conyuges_anteriores.push(this.fb.group({
        nombre: ['', [Validators.required, Validators.pattern(this.ONLY_LETTERS_PATTERN)]],
        edad: [null, [Validators.required, Validators.min(0), Validators.max(120)]],
        ocupacion: ['', [Validators.required, Validators.pattern(this.ONLY_LETTERS_PATTERN)]]
      }));
      this.scrollToLast('.familiar-card', 'Registro de cónyuge anterior añadido abajo');
    }
  }

  private scrollToLast(selector: string, message: string) {
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: message,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }, 100);
  }

  removeFromArray(array: FormArray, index: number) {
    array.removeAt(index);
  }

  cleanLettersInArray(array: FormArray, index: number, controlName: string) {
    const control = array.at(index).get(controlName);
    if (control) {
      const cleaned = control.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
      if (cleaned !== control.value) {
        control.setValue(cleaned, { emitEvent: false });
      }
    }
  }

  cleanAlphanumericInArray(array: FormArray, index: number, controlName: string) {
    const control = array.at(index).get(controlName);
    if (control) {
      const cleaned = control.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.]/g, '');
      if (cleaned !== control.value) {
        control.setValue(cleaned, { emitEvent: false });
      }
    }
  }

  trimFieldInArray(array: FormArray, index: number, controlName: string) {
    const control = array.at(index).get(controlName);
    if (control && typeof control.value === 'string') {
      const trimmed = control.value.trim();
      if (trimmed !== control.value) {
        control.setValue(trimmed, { emitEvent: false });
      }
    }
  }

  cleanLetters(path: string) {
    const control = this.form.get(path);
    if (control) {
      const cleaned = control.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
      if (cleaned !== control.value) {
        control.setValue(cleaned, { emitEvent: false });
      }
    }
  }

  trimField(path: string) {
    const control = this.form.get(path);
    if (control && typeof control.value === 'string') {
      const trimmed = control.value.trim();
      if (trimmed !== control.value) {
        control.setValue(trimmed, { emitEvent: false });
      }
    }
  }

  isVivoInArray(array: FormArray, index: number): boolean {
    const group = array.at(index) as FormGroup;
    return group.get('estado')?.value === 'VIVO';
  }

  // Helpers de Validación
  isInvalidGroup(groupName: string, controlName: string): boolean {
    const control = this.getGroup(groupName).get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isValid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.valid && (control.dirty || control.touched) && control.value !== '' && control.value !== null);
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
