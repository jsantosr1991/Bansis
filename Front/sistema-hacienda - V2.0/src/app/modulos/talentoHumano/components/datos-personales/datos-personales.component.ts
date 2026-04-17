import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators, FormControl, FormsModule } from '@angular/forms';
import { TalentoHumanoService } from '../../services/talentoHumano.service';
import { CustomValidators } from '../../utils/custom-validators';

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div [formGroup]="form" class="card mb-3 shadow-sm border-0">
      <div class="card-header bg-primary text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-person-badge me-2"></i>2. Datos Personales</h5>
      </div>
      <div class="card-body p-4">
        <div class="row g-3">
          
          <!-- Identificación -->
          <div class="col-md-6 col-lg-4">
            <label class="form-label fw-semibold">Número de Cédula <span class="text-danger">*</span></label>
            <div class="input-group has-validation">
              <span class="input-group-text"><i class="bi bi-card-checklist"></i></span>
              <input type="text" class="form-control" formControlName="cedula" 
                     placeholder="EJ: 0999999999" (input)="onlyNumbers('cedula')"
                     [class.is-invalid]="isInvalid('cedula')" [class.is-valid]="isValid('cedula')"
                     maxlength="10" [readonly]="isReadOnly">
              <div class="invalid-feedback">Ingrese 10 dígitos válidos.</div>
            </div>
          </div>

          <!-- Nombres y Apellidos -->
          <div class="col-md-6 col-lg-4">
            <label class="form-label fw-semibold">Apellido Paterno <span class="text-danger">*</span></label>
            <input type="text" class="form-control text-uppercase" formControlName="apellidoPaterno" 
                   placeholder="EJ: PÉREZ" (input)="toUpperCase('apellidoPaterno')"
                   (blur)="trimField('apellidoPaterno')"
                   [class.is-invalid]="isInvalid('apellidoPaterno')" [class.is-valid]="isValid('apellidoPaterno')" [readonly]="isReadOnly">
            <div class="invalid-feedback" *ngIf="form.get('apellidoPaterno')?.errors?.['required']">El apellido paterno es obligatorio.</div>
            <div class="invalid-feedback" *ngIf="form.get('apellidoPaterno')?.errors?.['pattern'] || form.get('apellidoPaterno')?.errors?.['whitespace']">No se aceptan solo espacios en blanco. Debe iniciar con una letra.</div>
          </div>
          <div class="col-md-6 col-lg-4">
            <label class="form-label fw-semibold">Apellido Materno <span class="text-danger">*</span></label>
            <input type="text" class="form-control text-uppercase" formControlName="apellidoMaterno" 
                   placeholder="EJ: RODRÍGUEZ" (input)="toUpperCase('apellidoMaterno')"
                   (blur)="trimField('apellidoMaterno')"
                   [class.is-invalid]="isInvalid('apellidoMaterno')" [class.is-valid]="isValid('apellidoMaterno')" [readonly]="isReadOnly">
            <div class="invalid-feedback" *ngIf="form.get('apellidoMaterno')?.errors?.['required']">El apellido materno es obligatorio.</div>
            <div class="invalid-feedback" *ngIf="form.get('apellidoMaterno')?.errors?.['pattern'] || form.get('apellidoMaterno')?.errors?.['whitespace']">No se aceptan solo espacios en blanco. Debe iniciar con una letra.</div>
          </div>
          <div class="col-md-6 col-lg-4">
            <label class="form-label fw-semibold">Nombres <span class="text-danger">*</span></label>
            <input type="text" class="form-control text-uppercase" formControlName="nombres" 
                   placeholder="EJ: JUAN CARLOS" (input)="toUpperCase('nombres')"
                   (blur)="trimField('nombres')"
                   [class.is-invalid]="isInvalid('nombres')" [class.is-valid]="isValid('nombres')" [readonly]="isReadOnly">
            <div class="invalid-feedback" *ngIf="form.get('nombres')?.errors?.['required']">Los nombres son obligatorios.</div>
            <div class="invalid-feedback" *ngIf="form.get('nombres')?.errors?.['pattern'] || form.get('nombres')?.errors?.['whitespace']">No se aceptan solo espacios en blanco. Debe iniciar con una letra.</div>
          </div>
          <div class="col-md-6 col-lg-4">
            <label class="form-label fw-semibold">Apodo <span class="text-muted">(Opcional)</span></label>
            <input type="text" class="form-control" formControlName="apodo" 
                   placeholder="Ej: Lucho"
                   (input)="cleanLetters('apodo')"
                   (blur)="trimField('apodo')"
                   [readonly]="isReadOnly"
                   [class.is-invalid]="isInvalid('apodo')">
            <div class="invalid-feedback" *ngIf="form.get('apodo')?.errors?.['pattern']">
              El apodo no puede iniciar con espacios o contener caracteres especiales.
            </div>
          </div>

          <hr class="my-3 text-muted">

          <!-- Género y Discapacidad -->
          <div class="col-md-4">
            <label class="form-label fw-semibold">Género <span class="text-danger">*</span></label>
            <select class="form-select" formControlName="genero" [class.is-invalid]="isInvalid('genero')" [class.is-valid]="isValid('genero')" [attr.disabled]="isReadOnly ? true : null">
              <option value="">Seleccione...</option>
              <option value="MASCULINO">MASCULINO</option>
              <option value="FEMENINO">FEMENINO</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fw-semibold">Discapacidad <span class="text-danger">*</span></label>
            <div class="btn-group w-100" role="group">
              <input type="radio" class="btn-check" [value]="true" formControlName="tieneDiscapacidad" id="discSi" (change)="onDiscapacidadChange()" [attr.disabled]="isReadOnly ? true : null">
              <label class="btn btn-outline-primary" style="padding: 10px;" for="discSi"><i class="bi bi-check-circle me-1"></i>Sí</label>
              <input type="radio" class="btn-check" [value]="false" formControlName="tieneDiscapacidad" id="discNo" (change)="onDiscapacidadChange()" [attr.disabled]="isReadOnly ? true : null">
              <label class="btn btn-outline-primary" style="padding: 10px;" for="discNo"><i class="bi bi-x-circle me-1"></i>No</label>
            </div>
          </div>
          <div class="col-md-5 animate-fade" *ngIf="form.get('tieneDiscapacidad')?.value">
            <label class="form-label fw-semibold">Detalle de Discapacidad <span class="text-danger">*</span></label>
            <input type="text" class="form-control text-uppercase" formControlName="discapacidadDetalle" 
                   placeholder="Especifique su discapacidad" (input)="cleanLetters('discapacidadDetalle'); toUpperCase('discapacidadDetalle')"
                   (blur)="trimField('discapacidadDetalle')"
                   [readonly]="isReadOnly"
                   [class.is-invalid]="isInvalid('discapacidadDetalle')">
            <div class="invalid-feedback">Debe especificar su discapacidad (máximo 150 caracteres).</div>
          </div>
          <div class="col-md-3 animate-fade" *ngIf="form.get('tieneDiscapacidad')?.value">
            <label class="form-label fw-semibold">Porcentaje (%) <span class="text-danger">*</span></label>
            <div class="input-group has-validation">
                <input type="text" class="form-control" formControlName="discapacidadPorcentaje" 
                       placeholder="0-100" (input)="onlyNumbers('discapacidadPorcentaje')"
                       [class.is-invalid]="isInvalid('discapacidadPorcentaje')" [class.is-valid]="isValid('discapacidadPorcentaje')"
                       maxlength="3" [readonly]="isReadOnly">
                <span class="input-group-text">%</span>
                <div class="invalid-feedback" *ngIf="form.get('discapacidadPorcentaje')?.errors?.['required']">El porcentaje es obligatorio.</div>
                <div class="invalid-feedback" *ngIf="form.get('discapacidadPorcentaje')?.errors?.['min'] || form.get('discapacidadPorcentaje')?.errors?.['max']">Debe ser entre 0 y 100.</div>
                <div class="invalid-feedback" *ngIf="form.get('discapacidadPorcentaje')?.errors?.['pattern']">Solo se permiten números.</div>
            </div>
          </div>

          <hr class="my-3 text-muted">

          <!-- Información de Nacimiento -->
          <div class="col-md-6 col-lg-3">
            <label class="form-label fw-semibold">País de Nacimiento <span class="text-danger">*</span></label>
            <select class="form-select" formControlName="paisNacimiento" (change)="onPaisChange()"
                    [class.is-invalid]="isInvalid('paisNacimiento')" [class.is-valid]="isValid('paisNacimiento')" [attr.disabled]="isReadOnly ? true : null">
              <option value="">Seleccione...</option>
              <option *ngFor="let p of listaPaises" [value]="p">{{p}}</option>
            </select>
          </div>
          <div class="col-md-6 col-lg-3 animate-fade" *ngIf="form.get('paisNacimiento')?.value === 'Otros'">
            <label class="form-label fw-semibold">Especifique País <span class="text-danger">*</span></label>
            <input type="text" class="form-control" formControlName="paisNacimientoOtro" 
                   placeholder="Escriba el país" (input)="cleanLetters('paisNacimientoOtro')"
                   (blur)="trimField('paisNacimientoOtro')"
                   [readonly]="isReadOnly"
                   [class.is-invalid]="isInvalid('paisNacimientoOtro')">
            <div class="invalid-feedback">Especifique el país (sin números ni espacios al inicio).</div>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label fw-semibold">Provincia de Nacimiento <span class="text-danger">*</span></label>
            <select class="form-select" formControlName="provinciaNacimiento" (change)="onProvinciaChange()"
                    [class.is-invalid]="isInvalid('provinciaNacimiento')" [class.is-valid]="isValid('provinciaNacimiento')" [attr.disabled]="isReadOnly ? true : null">
              <option value="">Seleccione...</option>
              <option *ngFor="let p of provinciasDisponibles" [value]="p.nombre">{{p.nombre}}</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div class="col-md-6 col-lg-3 animate-fade" *ngIf="form.get('provinciaNacimiento')?.value === 'Otros'">
            <label class="form-label fw-semibold">Especifique Provincia <span class="text-danger">*</span></label>
            <input type="text" class="form-control" formControlName="provinciaNacimientoOtro" 
                   placeholder="Escriba la provincia" (input)="cleanLetters('provinciaNacimientoOtro')"
                   (blur)="trimField('provinciaNacimientoOtro')"
                   [readonly]="isReadOnly"
                   [class.is-invalid]="isInvalid('provinciaNacimientoOtro')">
            <div class="invalid-feedback">Especifique la provincia (sin números ni espacios al inicio).</div>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label fw-semibold">Cantón de Nacimiento <span class="text-danger">*</span></label>
            <select class="form-select" formControlName="cantonNacimiento" (change)="onCantonChange()"
                    [class.is-invalid]="isInvalid('cantonNacimiento')" [class.is-valid]="isValid('cantonNacimiento')" [attr.disabled]="isReadOnly ? true : null">
              <option value="">Seleccione...</option>
              <option *ngFor="let c of cantonesDisponibles" [value]="c.nombre">{{c.nombre}}</option>
              <option value="Otros">Otros</option>
            </select>
            <div class="invalid-feedback">El cantón es obligatorio.</div>
          </div>
          <div class="col-md-6 col-lg-3 animate-fade" *ngIf="form.get('cantonNacimiento')?.value === 'Otros'">
            <label class="form-label fw-semibold">Especifique Cantón <span class="text-danger">*</span></label>
            <input type="text" class="form-control text-uppercase" formControlName="cantonNacimientoOtro" 
                   placeholder="Escriba el cantón" (input)="cleanLetters('cantonNacimientoOtro'); toUpperCase('cantonNacimientoOtro')"
                   (blur)="trimField('cantonNacimientoOtro')"
                   [readonly]="isReadOnly"
                   [class.is-invalid]="isInvalid('cantonNacimientoOtro')">
            <div class="invalid-feedback">Especifique el cantón (sin números ni espacios al inicio).</div>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label fw-semibold">Fecha de Nacimiento <span class="text-danger">*</span></label>
            <input type="date" class="form-control" formControlName="fechaNacimiento" 
                   (change)="onDateChange()" [max]="maxDate"
                   [readonly]="isReadOnly"
                   [class.is-invalid]="isInvalid('fechaNacimiento')" [class.is-valid]="isValid('fechaNacimiento')">
          </div>
          <div class="col-md-6 col-lg-5">
            <label class="form-label fw-semibold">Edad <small class="text-muted">(Calculada)</small></label>
            <div class="input-group">
              <span class="input-group-text bg-light"><i class="bi bi-calendar3"></i></span>
              <input type="text" class="form-control" [class.bg-light]="!isReadOnly" [class.fw-bold]="!isReadOnly" [class.text-primary]="!isReadOnly" [value]="edadTexto" [disabled]="isReadOnly">
            </div>
            <div class="form-text mt-1 text-primary small" *ngIf="!mostrarAlertaMenor"><i class="bi bi-info-circle me-1"></i>Edad en años y meses.</div>
          </div>

          <!-- Alerta Menor de Edad -->
          <div class="col-12 animate-fade" *ngIf="mostrarAlertaMenor">
            <div class="alert alert-warning border-warning shadow-sm d-flex align-items-center mb-0">
              <i class="bi bi-exclamation-triangle-fill fs-4 me-3 text-warning"></i>
              <div>
                <h6 class="alert-heading mb-1 fw-bold">Usuario Menor de Edad</h6>
                <p class="mb-0">El aspirante tiene <strong>{{edadTexto}}</strong>. Faltan <strong>{{tiempoPara18}}</strong> para cumplir los 18 años.</p>
              </div>
            </div>
          </div>

          <hr class="my-3 text-muted">

          <!-- Información Física -->
          <div class="col-md-6 col-lg-4">
            <label class="form-label fw-semibold">Tipo de Sangre <span class="text-danger">*</span></label>
            <select class="form-select" formControlName="tipoSangre" [class.is-invalid]="isInvalid('tipoSangre')" [class.is-valid]="isValid('tipoSangre')" [attr.disabled]="isReadOnly ? true : null">
              <option value="">Seleccione...</option>
              <option *ngFor="let s of tiposSangre" [value]="s">{{s}}</option>
            </select>
          </div>
          <div class="col-md-6 col-lg-4">
            <label class="form-label fw-semibold">Estatura <small class="text-muted">(Metros)</small> <span class="text-danger">*</span></label>
            <div class="input-group has-validation">
              <input type="number" step="0.01" class="form-control" formControlName="estatura" 
                     placeholder="Ej: 1.70" [class.is-invalid]="isInvalid('estatura')" [class.is-valid]="isValid('estatura')">
              <span class="input-group-text">m</span>
              <div class="invalid-feedback">Rango permitido: 1.00 - 2.50 m.</div>
            </div>
            <div class="form-text small">Ingrese la estatura en metros (ejemplo: 1.70).</div>
          </div>
          <div class="col-md-6 col-lg-5">
            <label class="form-label fw-semibold">Peso <span class="text-danger">*</span></label>
            <div class="input-group has-validation">
              <input type="number" class="form-control" [formControl]="pesoUI" 
                     placeholder="Ej: 160" [class.is-invalid]="isInvalid('peso')" [class.is-valid]="isValid('peso')">
              <select class="form-select flex-grow-0 w-auto" style="min-width: 80px;" [(ngModel)]="pesoUnidad" [ngModelOptions]="{standalone: true}" (change)="onPesoUnidadChange()" [disabled]="isReadOnly">
                <option value="LB">lb</option>
                <option value="KG">kg</option>
              </select>
              <div class="invalid-feedback">Rango permitido: 60 - 500 lb (27 - 227 kg).</div>
            </div>
            <div class="form-text mt-1 fw-medium text-secondary">
              <i class="bi bi-arrow-left-right me-1"></i>
              Equivale a: 
              <span class="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill px-3">
                {{pesoUnidad === 'LB' ? (getPesoKG() | number:'1.2-2') + ' kg' : (getPesoLB() | number:'1.2-2') + ' lb'}}
              </span>
            </div>
          </div>

          <!-- Información Personal -->
          <div class="col-md-6">
            <label class="form-label fw-semibold">Religión <span class="text-muted">(Opcional)</span></label>
            <input type="text" class="form-control" formControlName="religion" 
                   placeholder="Ej: Católica / Ninguna"
                   (input)="cleanLetters('religion')"
                   (blur)="trimField('religion')"
                   [class.is-invalid]="isInvalid('religion')"
                   [readonly]="isReadOnly">
            <div class="invalid-feedback" *ngIf="form.get('religion')?.errors?.['pattern']">
              La religión no puede iniciar con espacios o contener caracteres especiales.
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-semibold">Correo Electrónico <span class="text-danger">*</span></label>
            <div class="input-group has-validation">
              <span class="input-group-text"><i class="bi bi-envelope"></i></span>
              <input type="email" class="form-control" formControlName="correo" 
                     placeholder="ejemplo@email.com" [class.is-invalid]="isInvalid('correo')" [class.is-valid]="isValid('correo')"
                     [readonly]="isReadOnly">
              <div class="invalid-feedback">Verifique que su correo esté correctamente escrito.</div>
            </div>
          </div>

          <hr class="my-3 text-muted">

          <!-- IESS y Vacunas -->
          <div class="col-md-6">
            <label class="form-label fw-bold d-block pb-2">Afiliación al IESS <span class="text-danger">*</span></label>
            <div class="btn-group w-100" role="group">
              <input type="radio" class="btn-check" [value]="true" formControlName="afiliadoIess" id="iessSi" [attr.disabled]="isReadOnly ? true : null">
              <label class="btn btn-outline-primary py-2" for="iessSi"><i class="bi bi-check-circle me-2"></i>Sí, afiliación previa</label>
              <input type="radio" class="btn-check" [value]="false" formControlName="afiliadoIess" id="iessNo" [attr.disabled]="isReadOnly ? true : null">
              <label class="btn btn-outline-primary py-2" for="iessNo"><i class="bi bi-x-circle me-2"></i>No, primera vez</label>
            </div>
            <div class="text-danger small mt-1" *ngIf="isInvalid('afiliadoIess')">Debe seleccionar una opción.</div>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold d-block pb-2">Vacunación COVID-19 <span class="text-danger">*</span></label>
            <div class="d-flex gap-3 pt-1">
              <div class="form-check form-switch p-2 border rounded bg-light flex-fill" [class.border-danger]="isInvalidVacuna()">
                <input class="form-check-input ms-0 me-3" type="checkbox" formControlName="vacunaCovid1" id="v1" (change)="validateVacunas()" [attr.disabled]="isReadOnly ? true : null">
                <label class="form-check-label fw-semibold" for="v1">Dosis #1</label>
              </div>
              <div class="form-check form-switch p-2 border rounded bg-light flex-fill" [class.border-danger]="isInvalidVacuna()">
                <input class="form-check-input ms-0 me-3" type="checkbox" formControlName="vacunaCovid2" id="v2" (change)="validateVacunas()" [attr.disabled]="isReadOnly ? true : null">
                <label class="form-check-label fw-semibold" for="v2">Dosis #2</label>
              </div>
              <div class="form-check form-switch p-2 border rounded bg-light flex-fill">
                <input class="form-check-input ms-0 me-3" type="checkbox" formControlName="vacunaCovid3" id="v3" (change)="validateVacunas()" [attr.disabled]="isReadOnly ? true : null">
                <label class="form-check-label fw-semibold" for="v3">Dosis #3</label>
              </div>
            </div>
            <div class="text-danger small mt-1 animate-fade" *ngIf="isInvalidVacuna()">
              <i class="bi bi-exclamation-triangle-fill me-1"></i> Se requiere esquema básico completo (mínimo 2 dosis).
            </div>
          </div>

          <hr class="my-3 text-muted">

          <!-- FOTO CARNÉ -->
          <div class="col-12">
            <div class="d-flex align-items-start gap-4 flex-wrap">
              <!-- Input oculto (Debe estar fuera del ngIf para que #fotoInput sea accesible desde el Preview) -->
              <input #fotoInput type="file" accept="image/jpeg,image/png" class="d-none" (change)="onFotoSelected($event)">
              
              <!-- Preview -->
              <div class="foto-carnet-wrapper" (click)="!isReadOnly && triggerFotoUpload()" [class.clickable]="!isReadOnly">
                <img *ngIf="fotoSrc" [src]="fotoSrc" alt="Foto Carné" class="foto-carnet-img">
                <div *ngIf="!fotoSrc" class="foto-carnet-placeholder">
                  <i class="bi bi-person-bounding-box fs-1 text-secondary"></i>
                  <p class="mb-0 small text-muted mt-1">Foto Carné</p>
                </div>
              </div>
              <!-- Controles -->
              <div class="d-flex flex-column justify-content-center gap-2" *ngIf="!isReadOnly">
                <button type="button" class="btn btn-outline-primary btn-sm rounded-pill px-3" (click)="triggerFotoUpload()">
                  <i class="bi bi-upload me-1"></i> {{ fotoSrc ? 'Cambiar Foto' : 'Subir Foto' }}
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm rounded-pill px-3" *ngIf="fotoSrc" (click)="quitarFoto()">
                  <i class="bi bi-trash me-1"></i> Quitar Foto
                </button>
                <div class="text-muted small"><i class="bi bi-info-circle me-1"></i>JPG o PNG, máx. 2 MB. Opcional.</div>
                <div class="text-danger small" *ngIf="fotoError"><i class="bi bi-exclamation-triangle me-1"></i>{{ fotoError }}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-control, .form-select { border-radius: 8px; padding: 10px; }
    .btn-group .btn { border-radius: 8px !important; margin: 0 2px; }
    .card-header { border-bottom: 0; }
    .input-group-text { border-radius: 8px 0 0 8px; }
    .form-control + .input-group-text { border-radius: 0 8px 8px 0; }
    input[type="text"], textarea { text-transform: uppercase; }
    input[type="text"]::placeholder, textarea::placeholder { text-transform: none; }
    .animate-fade { animation: fadeIn 0.3s ease-in; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .foto-carnet-wrapper {
      width: 110px; height: 140px; border: 2px dashed #ced4da;
      border-radius: 8px; overflow: hidden; display: flex;
      align-items: center; justify-content: center;
      background: #f8f9fa; flex-shrink: 0;
      transition: border-color 0.2s;
    }
    .foto-carnet-wrapper.clickable { cursor: pointer; }
    .foto-carnet-wrapper.clickable:hover { border-color: #0d6efd; }
    .foto-carnet-img { width: 100%; height: 100%; object-fit: cover; }
    .foto-carnet-placeholder { text-align: center; padding: 8px; }
  `]
})
export class DatosPersonalesComponent implements OnInit, OnChanges {
  @Input() form!: FormGroup;
  @Input() isReadOnly: boolean = false;
  @ViewChild('fotoInput') fotoInputRef?: ElementRef<HTMLInputElement>;

  // Foto carné
  fotoError: string | null = null;

  maxDate = new Date().toISOString().split('T')[0];
  tiposSangre = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  listaPaises: string[] = [];
  provinciasDisponibles: any[] = [];
  cantonesDisponibles: any[] = [];

  // Propiedades para Edad
  edadTexto: string = '0 años';
  mostrarAlertaMenor: boolean = false;
  tiempoPara18: string = '';

  // Propiedades para Peso
  pesoUnidad: 'LB' | 'KG' = 'LB';
  pesoUI = new FormControl();

  private sanitizer = inject(DomSanitizer);
  constructor(private thService: TalentoHumanoService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isReadOnly']) {
      this.updatePesoUIState();
    }
  }

  ngOnInit() {
    this.cargarPaises();

    const currentPais = this.form.get('paisNacimiento')?.value;
    if (currentPais) {
      this.cargarProvincias(currentPais);
    }
    
    // Iniciar otros manuales si es necesario (modo edición)
    this.checkManualFields();

    // Ocultar Opcionales
    this.onDiscapacidadChange();

    // Escuchar cambios para carga asíncrona (especialmente útil en Ver/Editar)
    this.form.get('paisNacimiento')?.valueChanges.subscribe(pais => {
      if (pais) this.cargarProvincias(pais);
      else this.provinciasDisponibles = [];
    });

    this.form.get('provinciaNacimiento')?.valueChanges.subscribe(prov => {
      if (prov && prov !== 'Otros') {
        const selectedProv = this.provinciasDisponibles.find(p => p.nombre === prov);
        if (selectedProv) this.cargarCantones(selectedProv.codigo);
      }
    });

    this.form.get('fechaNacimiento')?.valueChanges.subscribe(() => {
      this.calcularEdad();
    });

    // Asegurar que los campos "Otros" y la edad se calculen/habiliten si hay datos
    this.checkManualFields();
    this.initPesoUI();
    this.calcularEdad();
  }

  get fotoSrc(): SafeUrl | string | null {
    if (!this.form) return null;
    const value = this.form.get('foto_base64')?.value || this.form.get('foto_url')?.value;
    if (!value) return null;
    return value.toString().startsWith('data:image/') ? this.sanitizer.bypassSecurityTrustUrl(value) : value;
  }

  // ── Foto Carné ─────────────────────────────────────────────────
  triggerFotoUpload() {
    this.fotoInputRef?.nativeElement.click();
  }

  onFotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.fotoError = 'Solo se aceptan imágenes JPG o PNG.';
      input.value = '';
      return;
    }
    if (file.size > MAX_BYTES) {
      this.fotoError = 'La imagen supera el límite de 2 MB.';
      input.value = '';
      return;
    }

    this.fotoError = null;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Send the full Data URI so the backend can extract the MIME type via regex
      this.form.get('foto_base64')?.setValue(result);
      this.form.get('foto_base64')?.markAsDirty();
      // Limpiar la URL anterior para que el backend sepa que hay imagen nueva
      this.form.get('foto_url')?.setValue(null, { emitEvent: false });
    };
    reader.readAsDataURL(file);
  }

  quitarFoto() {
    this.fotoError = null;
    this.form.get('foto_base64')?.setValue(null);
    this.form.get('foto_url')?.setValue(null, { emitEvent: false });
    this.form.get('foto_base64')?.markAsDirty();
  }

  private initPesoUI() {
    const pesoValue = this.form.get('peso')?.value;
    this.pesoUI.setValue(pesoValue, { emitEvent: false });
    
    this.pesoUI.valueChanges.subscribe(val => {
      this.actualizarPesoBase(val);
    });
    
    // Si el formulario principal cambia el peso (ej: al cargar), sincronizar UI
    this.form.get('peso')?.valueChanges.subscribe(val => {
      if (this.pesoUnidad === 'LB') {
        this.pesoUI.setValue(val, { emitEvent: false });
      } else {
        const kg = val / 2.20462;
        this.pesoUI.setValue(parseFloat(kg.toFixed(2)), { emitEvent: false });
      }
    });
    
    this.updatePesoUIState();
  }

  private updatePesoUIState() {
    if (this.isReadOnly) {
      this.pesoUI.disable({ emitEvent: false });
    } else {
      this.pesoUI.enable({ emitEvent: false });
    }
  }

  onPesoUnidadChange() {
    const val = this.pesoUI.value;
    if (val) {
      if (this.pesoUnidad === 'KG') {
        // Estaba en LB, pasó a KG
        const kg = val / 2.20462;
        this.pesoUI.setValue(parseFloat(kg.toFixed(2)), { emitEvent: false });
      } else {
        // Estaba en KG, pasó a LB
        const lb = val * 2.20462;
        this.pesoUI.setValue(parseFloat(lb.toFixed(2)), { emitEvent: false });
      }
    }
  }

  private actualizarPesoBase(val: any) {
    if (!val) {
      this.form.get('peso')?.setValue(null);
      return;
    }
    
    if (this.pesoUnidad === 'LB') {
      this.form.get('peso')?.setValue(val);
    } else {
      const lb = val * 2.20462;
      this.form.get('peso')?.setValue(parseFloat(lb.toFixed(2)));
    }
  }

  getPesoKG(): number {
    const val = this.pesoUI.value;
    if (!val) return 0;
    return this.pesoUnidad === 'LB' ? val / 2.20462 : val;
  }

  getPesoLB(): number {
    const val = this.pesoUI.value;
    if (!val) return 0;
    return this.pesoUnidad === 'LB' ? val : val * 2.20462;
  }

  private checkManualFields() {
    this.onPaisChange(false);
    this.onProvinciaChange(false);
    this.onCantonChange(false);
  }

  cargarPaises() {
    this.thService.getPaises().subscribe(p => {
      this.listaPaises = p;
      const pais = this.form.get('paisNacimiento')?.value;
      if (pais && p.includes(pais)) {
        this.form.get('paisNacimiento')?.setValue(pais, { emitEvent: true });
      }
    });
  }

  onPaisChange(resetFull = true) {
    const pais = this.form.get('paisNacimiento')?.value;
    const paisOtro = this.form.get('paisNacimientoOtro');

    if (resetFull) {
      this.form.get('provinciaNacimiento')?.setValue('');
      this.form.get('provinciaNacimientoOtro')?.setValue('');
      this.form.get('cantonNacimiento')?.setValue('');
      this.form.get('cantonCodigo')?.setValue(null);
    }

    if (pais === 'Otros') {
      paisOtro?.setValidators([Validators.required, Validators.maxLength(100), CustomValidators.noWhitespace]);
      paisOtro?.enable();
      this.provinciasDisponibles = [];
    } else {
      paisOtro?.clearValidators();
      paisOtro?.disable();
      if (resetFull) paisOtro?.setValue('');
      if (pais) {
        this.cargarProvincias(pais);
      } else {
        this.provinciasDisponibles = [];
      }
    }
    paisOtro?.updateValueAndValidity({ emitEvent: false });
  }

  onProvinciaChange(resetFull = true) {
    const provincia = this.form.get('provinciaNacimiento')?.value;
    const provinciaOtro = this.form.get('provinciaNacimientoOtro');

    if (resetFull) {
      this.form.get('cantonNacimiento')?.setValue('');
      this.form.get('cantonCodigo')?.setValue(null);
    }

    if (provincia === 'Otros') {
      provinciaOtro?.setValidators([Validators.required, Validators.maxLength(100), CustomValidators.noWhitespace]);
      provinciaOtro?.enable();
      this.cantonesDisponibles = [];
    } else {
      provinciaOtro?.clearValidators();
      provinciaOtro?.disable();
      if (resetFull) provinciaOtro?.setValue('');
      
      const selectedProv = this.provinciasDisponibles.find(p => p.nombre === provincia);
      if (selectedProv && selectedProv.codigo !== 'Otros') {
        this.cargarCantones(selectedProv.codigo);
      } else {
        this.cantonesDisponibles = [];
      }
    }
    provinciaOtro?.updateValueAndValidity({ emitEvent: false });
  }

  onCantonChange(resetCodigo = true) {
    const canton = this.form.get('cantonNacimiento')?.value;
    const cantonOtro = this.form.get('cantonNacimientoOtro');

    if (canton === 'Otros') {
      cantonOtro?.setValidators([Validators.required, Validators.maxLength(100), CustomValidators.noWhitespace]);
      cantonOtro?.enable();
      this.form.get('cantonCodigo')?.setValue(null);
    } else {
      cantonOtro?.clearValidators();
      cantonOtro?.disable();
      cantonOtro?.setValue('');
      const selectedCant = this.cantonesDisponibles.find(c => c.nombre === canton);
      if (selectedCant && resetCodigo) {
        this.form.get('cantonCodigo')?.setValue(selectedCant.codigo);
      }
    }
    cantonOtro?.updateValueAndValidity({ emitEvent: false });
  }

  private cargarProvincias(pais: string) {
    this.thService.getProvinciasPorPais(pais).subscribe(data => {
      this.provinciasDisponibles = data.map(p => ({
        ...p,
        nombre: this.toTitleCase(p.nombre)
      }));
      // Tratar de restaurar cantones si ya hay provincia
      const provincia = this.form.get('provinciaNacimiento')?.value;
      if (provincia) {
        const selectedProv = this.provinciasDisponibles.find(
          p => p.nombre.toLowerCase() === provincia.toLowerCase()
        );
        if (selectedProv && selectedProv.codigo !== 'Otros') {
          if (this.form.get('provinciaNacimiento')?.value !== selectedProv.nombre) {
            this.form.get('provinciaNacimiento')?.setValue(selectedProv.nombre, { emitEvent: false });
          }
          this.cargarCantones(selectedProv.codigo);
        }
      }
    });
  }

  private cargarCantones(provinciaCodigo: string) {
    this.thService.getCantonesPorProvincia(provinciaCodigo).subscribe(data => {
      this.cantonesDisponibles = data.map(c => ({
        ...c,
        nombre: this.toTitleCase(c.nombre)
      }));
      const canton = this.form.get('cantonNacimiento')?.value;
      if (canton) {
        const matchingCanton = this.cantonesDisponibles.find(
          c => c.nombre.toLowerCase() === canton.toLowerCase()
        );
        if (matchingCanton) {
          this.form.get('cantonNacimiento')?.setValue(matchingCanton.nombre, { emitEvent: false });
          this.form.get('cantonCodigo')?.setValue(matchingCanton.codigo, { emitEvent: false });
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

  onDiscapacidadChange() {
    const tieneDisc = this.form.get('tieneDiscapacidad')?.value;
    const descDetalle = this.form.get('discapacidadDetalle');
    const porcDisc = this.form.get('discapacidadPorcentaje');

    if (tieneDisc) {
      descDetalle?.enable();
      porcDisc?.enable();
      
      descDetalle?.setValidators([Validators.required, Validators.maxLength(150)]);
      porcDisc?.setValidators([Validators.required, Validators.min(0), Validators.max(100), Validators.pattern(/^[0-9]*$/)]);
    } else {
      descDetalle?.disable();
      porcDisc?.disable();
      
      descDetalle?.setValue('');
      porcDisc?.setValue(0);
      
      descDetalle?.clearValidators();
      porcDisc?.clearValidators();
    }
    descDetalle?.updateValueAndValidity();
    porcDisc?.updateValueAndValidity();
  }

  cleanAlfanumerico(controlName: string) {
    const control = this.form.get(controlName);
    if (control) {
      const cleaned = control.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ .,]/g, '');
      if (cleaned !== control.value) {
        control.setValue(cleaned, { emitEvent: false });
      }
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

  onlyNumbers(controlName: string) {
    const control = this.form.get(controlName);
    if (control) {
      const cleaned = control.value.replace(/[^0-9]/g, '');
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

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isValid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.valid && (control.dirty || control.touched) && control.value !== '' && control.value !== null);
  }

  toUpperCase(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value) {
      const sanitized = control.value.toUpperCase().replace(/\s+/g, ' ');
      control.setValue(sanitized, { emitEvent: false });
    }
  }

  onDateChange() {
    this.calcularEdad();
  }

  isInvalidVacuna(): boolean {
    const error = this.form.errors?.['minVaccinesRequired'];
    const touched = !!(this.form.get('vacunaCovid1')?.touched || this.form.get('vacunaCovid2')?.touched);
    return !!(touched && error);
  }

  validateVacunas() {
    this.form.get('vacunaCovid1')?.markAsTouched();
    this.form.get('vacunaCovid2')?.markAsTouched();
  }

  calcularEdad() {
    const fechaNac = this.form.get('fechaNacimiento')?.value;
    if (fechaNac) {
      const today = new Date();
      const birthDate = new Date(fechaNac);
      
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      let days = today.getDate() - birthDate.getDate();

      if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      const totalAge = years >= 0 ? years : 0;
      const totalMonths = months >= 0 ? months : 0;
      
      this.form.get('edad')?.setValue(totalAge, { emitEvent: false });
      this.edadTexto = `${totalAge} años y ${totalMonths} meses`;

      // Alerta para menores de 18
      if (totalAge < 18) {
        this.mostrarAlertaMenor = true;
        let remYears = 17 - totalAge;
        let remMonths = 11 - totalMonths;
        let remDays = 0;

        // Cálculo simplificado para "cuanto falta"
        // Si hoy es 2024-03-19 y nació 2010-05-10
        // Cumple 18 el 2028-05-10
        const date18 = new Date(birthDate);
        date18.setFullYear(birthDate.getFullYear() + 18);
        
        let diffYears = date18.getFullYear() - today.getFullYear();
        let diffMonths = date18.getMonth() - today.getMonth();
        let diffDays = date18.getDate() - today.getDate();

        if (diffDays < 0) {
          diffMonths--;
          const lastMonth = new Date(date18.getFullYear(), date18.getMonth(), 0);
          diffDays += lastMonth.getDate();
        }
        if (diffMonths < 0) {
          diffYears--;
          diffMonths += 12;
        }

        this.tiempoPara18 = `${diffYears} años, ${diffMonths} meses y ${diffDays} días`;
      } else {
        this.mostrarAlertaMenor = false;
        this.tiempoPara18 = '';
      }
    } else {
      this.edadTexto = '0 años';
      this.mostrarAlertaMenor = false;
    }
  }
}
