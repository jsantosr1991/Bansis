import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TalentoHumanoService } from '../../services/talentoHumano.service';
import { CustomValidators } from '../../utils/custom-validators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-datos-administrativos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="card mb-3 shadow-sm border-0">
      <div class="card-header bg-primary text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-building me-2"></i>1. Datos Administrativos y Condiciones de Ingreso</h5>
      </div>
      <div class="card-body p-4">
        <div class="row g-3">
          <!-- Datos Generales -->
          <div class="col-md-6">
            <label class="form-label fw-semibold">Compañía <span class="text-danger">*</span></label>
            <select class="form-select custom-select" formControlName="company_id" [class.is-invalid]="isInvalid('company_id')" [class.is-valid]="isValid('company_id')" [attr.disabled]="isReadOnly ? true : null">
              <option [ngValue]="null">Seleccione...</option>
              <option *ngFor="let c of companias" [ngValue]="c.id">{{c.nombre}}</option>
            </select>
            <div class="invalid-feedback">La compañía es obligatoria.</div>
          </div>
          <div class="col-md-3">
            <label class="form-label fw-semibold">Área <span class="text-danger">*</span></label>
            <select class="form-select" formControlName="area" (change)="onAreaChange()"
                    [class.is-invalid]="isInvalid('area')" [class.is-valid]="isValid('area')" [attr.disabled]="isReadOnly ? true : null">
              <option value="">Seleccione...</option>
              <option *ngFor="let a of listaAreas" [value]="a">{{a}}</option>
            </select>
            <div class="invalid-feedback">El área es obligatoria.</div>
          </div>
          <div class="col-md-3">
            <label class="form-label fw-semibold">Labor <span class="text-danger">*</span></label>
            <select class="form-select" formControlName="labor"
                    [class.is-invalid]="isInvalid('labor')" [class.is-valid]="isValid('labor')" [attr.disabled]="isReadOnly ? true : null">
              <option value="">Seleccione...</option>
              <option *ngFor="let l of laboresDisponibles" [value]="l">{{l}}</option>
            </select>
            <div class="invalid-feedback">La labor es obligatoria.</div>
          </div>
          <div class="col-md-3">
            <label class="form-label fw-semibold">Fecha de Ingreso <span class="text-danger">*</span></label>
            <input type="date" class="form-control" formControlName="fechaIngreso" [min]="today" [class.is-invalid]="isInvalid('fechaIngreso')" [class.is-valid]="isValid('fechaIngreso')" [readonly]="isReadOnly">
            <div class="invalid-feedback">La fecha debe ser actual o futura.</div>
          </div>

          <hr class="my-3 text-muted">

          <!-- Banco Guayaquil -->
          <div [formGroupName]="'banking_info'" class="row g-3">
            <div class="col-12">
              <h6 class="text-primary fw-bold mb-3"><i class="bi bi-bank me-2"></i>Información Bancaria</h6>
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">¿Tiene cuenta en Banco Guayaquil? <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="usa_banco_guayaquil" (change)="onBancoGuayaquilChange()" [class.is-invalid]="isInvalidSub('banking_info', 'usa_banco_guayaquil')" [attr.disabled]="isReadOnly ? true : null">
                <option [ngValue]="null">Seleccione...</option>
                <option [ngValue]="true">Sí</option>
                <option [ngValue]="false">No</option>
              </select>
            </div>

            <ng-container *ngIf="form.get('banking_info.usa_banco_guayaquil')?.value === true">
              <div class="col-md-4 animate-fade">
                <label class="form-label fw-semibold">Tipo de Cuenta <span class="text-danger">*</span></label>
                <select class="form-select" formControlName="tipo_cuenta" [class.is-invalid]="isInvalidSub('banking_info', 'tipo_cuenta')" [attr.disabled]="isReadOnly ? true : null">
                  <option value="">Seleccione...</option>
                  <option value="Ahorro">Ahorro</option>
                  <option value="Corriente">Corriente</option>
                </select>
              </div>

              <div class="col-md-4 animate-fade">
                <label class="form-label fw-semibold">Número de Cuenta <span class="text-danger">*</span></label>
                <input type="tel" class="form-control" formControlName="numero_cuenta" 
                       placeholder="10 a 13 dígitos" maxlength="13"
                       (keypress)="onlyNumbers($event)"
                       [readonly]="isReadOnly"
                       [class.is-invalid]="isInvalidSub('banking_info', 'numero_cuenta')">
                <div class="invalid-feedback">Debe tener entre 10 y 13 dígitos numéricos.</div>
              </div>

              <div class="col-md-4 animate-fade">
                <label class="form-label fw-semibold">Confirmar Número de Cuenta <span class="text-danger">*</span></label>
                <input type="tel" class="form-control" formControlName="confirmacion_cuenta" 
                       placeholder="Repita el número" maxlength="13"
                       (keypress)="onlyNumbers($event)"
                       [readonly]="isReadOnly"
                       [class.is-invalid]="isInvalidSub('banking_info', 'confirmacion_cuenta') || form.get('banking_info')?.errors?.['mismatch']">
                <div class="invalid-feedback" *ngIf="form.get('banking_info.confirmacion_cuenta')?.touched && form.get('banking_info')?.errors?.['mismatch']">
                  Los números de cuenta no coinciden.
                </div>
              </div>

              <div class="col-md-8 animate-fade">
                <label class="form-label fw-semibold">Titular de la Cuenta <span class="text-danger">*</span></label>
                <input type="text" class="form-control" formControlName="titular" 
                       maxlength="120" placeholder="Nombre completo"
                       (input)="cleanLetters('banking_info.titular')"
                       (blur)="trimField('banking_info.titular')"
                       [class.is-invalid]="isInvalidSub('banking_info', 'titular')">
                <div class="invalid-feedback" *ngIf="form.get('banking_info.titular')?.errors?.['required']">
                  El titular es obligatorio.
                </div>
                <div class="invalid-feedback" *ngIf="form.get('banking_info.titular')?.errors?.['pattern']">
                  El nombre no puede iniciar con espacios o estar vacío.
                </div>
              </div>
            </ng-container>
          </div>

          <hr class="my-3 text-muted">

          <!-- Fechas de Control -->
          <div [formGroupName]="'fechas_control'" class="row g-3">
            <div class="col-12">
              <h6 class="text-primary fw-bold mb-3"><i class="bi bi-calendar-check me-2"></i>Fechas de Control</h6>
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">Fecha Revisión Guayaquil (Opcional)</label>
              <input type="date" class="form-control" formControlName="fecha_revision_guayaquil"
                     [class.is-invalid]="isInvalidSub('fechas_control', 'fecha_revision_guayaquil')">
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">Fecha Reingreso (Opcional)</label>
              <input type="date" class="form-control" formControlName="reingreso_fecha">
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">Fecha Salida (Opcional)</label>
              <input type="date" class="form-control" formControlName="fecha_salida">
            </div>
          </div>

          <hr class="my-3 text-muted">

          <!-- Condiciones -->
          <div [formGroupName]="'condiciones'" class="row g-3">
            <div class="col-12">
              <h6 class="text-primary fw-bold mb-3"><i class="bi bi-file-earmark-text me-2"></i>Condiciones</h6>
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">Tipo de Contrato <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="tipo_contrato" [class.is-invalid]="isInvalidSub('condiciones', 'tipo_contrato')">
                <option value="">Seleccione...</option>
                <option *ngFor="let t of contractTypes" [value]="t">{{t}}</option>
              </select>
              <div class="invalid-feedback">El tipo de contrato es obligatorio.</div>
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">¿Usará Expreso? <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="transporte" (change)="onTransporteChange()" [class.is-invalid]="isInvalidSub('condiciones', 'transporte')">
                <option [ngValue]="null">Seleccione...</option>
                <option [ngValue]="true">Sí</option>
                <option [ngValue]="false">No</option>
              </select>
            </div>

            <div class="col-md-4 animate-fade" *ngIf="form.get('condiciones.transporte')?.value === true">
              <label class="form-label fw-semibold">Recorrido <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="recorrido" (change)="onRecorridoChange()" [class.is-invalid]="isInvalidSub('condiciones', 'recorrido')">
                <option value="">Seleccione...</option>
                <option value="Naranjito">Naranjito</option>
                <option value="Milagro">Milagro</option>
                <option value="Marcelino Maridueña">Marcelino Maridueña</option>
                <option value="KM 26">KM 26</option>
                <option value="Puente Payo">Puente Payo</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div class="col-md-4 animate-fade" *ngIf="form.get('condiciones.transporte')?.value === true && form.get('condiciones.recorrido')?.value === 'Otros'">
              <label class="form-label fw-semibold">Especifique Recorrido <span class="text-danger">*</span></label>
              <input type="text" class="form-control" formControlName="recorrido_otro" 
                     placeholder="Especifique..." maxlength="100"
                     (input)="cleanAlphanumeric('condiciones.recorrido_otro')"
                     (blur)="trimField('condiciones.recorrido_otro')"
                     [class.is-invalid]="isInvalidSub('condiciones', 'recorrido_otro')">
              <div class="invalid-feedback" *ngIf="form.get('condiciones.recorrido_otro')?.errors?.['required']">
                Especifique el recorrido.
              </div>
              <div class="invalid-feedback" *ngIf="form.get('condiciones.recorrido_otro')?.errors?.['pattern']">
                El recorrido no puede iniciar con espacios o estar vacío (solo letras).
              </div>
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">¿Tiene Vehículo Particular? <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="vehiculo" [class.is-invalid]="isInvalidSub('condiciones', 'vehiculo')">
                <option [ngValue]="null">Seleccione...</option>
                <option [ngValue]="true">Sí</option>
                <option [ngValue]="false">No</option>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">¿Tiene Licencia? <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="licencia" (change)="onLicenciaChange()" [class.is-invalid]="isInvalidSub('condiciones', 'licencia')">
                <option [ngValue]="null">Seleccione...</option>
                <option [ngValue]="true">Sí</option>
                <option [ngValue]="false">No</option>
              </select>
            </div>

            <div class="col-md-4 animate-fade" *ngIf="form.get('condiciones.licencia')?.value === true">
              <label class="form-label fw-semibold">Tipo de Licencia <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="licencia_tipo" [class.is-invalid]="isInvalidSub('condiciones', 'licencia_tipo')">
                <option value="">Seleccione...</option>
                <option *ngFor="let l of tiposLicencia" [value]="l.val">{{l.val}} - {{l.desc}}</option>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">¿Acumulación de Décimos? <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="acumulacion_decimos" [class.is-invalid]="isInvalidSub('condiciones', 'acumulacion_decimos')">
                <option [ngValue]="null">Seleccione...</option>
                <option [ngValue]="true">Sí</option>
                <option [ngValue]="false">No</option>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">¿Semana Completa? <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="semana_completa" [class.is-invalid]="isInvalidSub('condiciones', 'semana_completa')">
                <option [ngValue]="null">Seleccione...</option>
                <option [ngValue]="true">Sí</option>
                <option [ngValue]="false">No</option>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">¿Solo Proceso? <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="solo_proceso" [class.is-invalid]="isInvalidSub('condiciones', 'solo_proceso')">
                <option [ngValue]="null">Seleccione...</option>
                <option [ngValue]="true">Sí</option>
                <option [ngValue]="false">No</option>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label fw-semibold">¿Almuerzo? <span class="text-danger">*</span></label>
              <select class="form-select" formControlName="almuerzo" [class.is-invalid]="isInvalidSub('condiciones', 'almuerzo')">
                <option [ngValue]="null">Seleccione...</option>
                <option [ngValue]="true">Sí</option>
                <option [ngValue]="false">No</option>
              </select>
            </div>
          </div>

          <hr class="my-4 text-muted">

          <!-- Control Interno (Audit Card Style) -->
          <div [formGroupName]="'control_interno'" class="col-12 mt-4">
            <div class="card border-0 bg-light bg-opacity-50 rounded-4 p-4 shadow-sm-hover transition-all border-start border-4 border-info">
              <div class="d-flex align-items-center mb-4">
                <div class="icon-circle bg-info text-white me-3">
                  <i class="bi bi-shield-check fs-4"></i>
                </div>
                <div>
                  <h6 class="mb-0 fw-bold text-info-emphasis text-uppercase">Control Interno Administrativo</h6>
                  <small class="text-muted">Trazabilidad del Registro</small>
                </div>
              </div>

              <div class="row g-4">
                <div class="col-md-4">
                  <div class="p-3 bg-white rounded-3 shadow-sm h-100">
                    <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Fecha de Registro</label>
                    <p class="form-control-plaintext py-0 text-dark mb-0">
                      <i class="bi bi-calendar3 me-2 text-info"></i>{{ (form.get('control_interno.fecha_entrevista')?.value | date:'dd/MM/yyyy HH:mm') || '---' }}
                    </p>
                    <small class="text-muted smaller">Generada automáticamente</small>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="p-3 bg-white rounded-3 shadow-sm h-100">
                    <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Responsable de Recepción</label>
                    <p class="form-control-plaintext py-0 fw-semibold text-dark mb-0 text-uppercase">{{ form.get('control_interno.responsable_nombre')?.value || '---' }}</p>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="p-3 bg-white rounded-3 shadow-sm h-100">
                    <label class="form-label small fw-bold text-secondary text-uppercase mb-1">Departamento</label>
                    <p class="form-control-plaintext py-0 text-dark mb-0 text-uppercase">{{ form.get('control_interno.responsable_grupo')?.value || '---' }}</p>
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
    .custom-select { height: 45px; }
    .btn-outline-primary { padding: 10px; }
    .animate-fade { animation: fadeIn 0.3s ease-in; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    input[type="text"], input[type="tel"] { text-transform: uppercase; }
    input[type="text"]::placeholder, input[type="tel"]::placeholder { text-transform: none; }
    
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
    .smaller { font-size: 0.75rem; }
  `]
})
export class DatosAdministrativosComponent implements OnInit, OnChanges {
  @Input() form!: FormGroup;
  @Input() isReadOnly: boolean = false;
  @Input() nombres = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isReadOnly'] && !changes['isReadOnly'].currentValue && this.form) {
      // Re-evaluar campos deshabilitados cuando entramos a edición
      setTimeout(() => {
        this.onBancoGuayaquilChange();
        this.onTransporteChange();
        this.onRecorridoChange();
        this.onLicenciaChange();
      });
    }
  }
  @Input() apellidoPaterno = '';
  @Input() apellidoMaterno = '';

  today = new Date().toISOString().split('T')[0];

  companias: any[] = [];
  listaAreas: string[] = ['Campo', 'Empacadora', 'Administración'];
  contractTypes: string[] = [
    'A PRUEBA',
    'CONTRATO PRODUCTIVO',
    'EVENTUAL',
    'PASANTE',
    'PLAZO FIJO',
    'POR TEMPORADA',
    'DESTAJO'
  ];
  laboresDisponibles: string[] = [];
  isLoadingLabores = false;

  constructor(private thService: TalentoHumanoService) { }

  ngOnInit() {
    this.cargarCompanias();

    const currentArea = this.form.get('area')?.value;
    if (currentArea) {
      this.cargarLabores(currentArea);
    }

    // Escuchar cambios para carga asíncrona
    this.form.get('area')?.valueChanges.subscribe(area => {
      if (area) this.cargarLabores(area);
      else this.laboresDisponibles = [];
    });

    // SUSCRIPCIONES PARA CAMPOS CONDICIONALES
    // Esto asegura que si el padre habilita el formulario, estos campos se vuelvan a deshabilitar si la condición no se cumple

    // 1. Banco Guayaquil
    this.form.get('banking_info.usa_banco_guayaquil')?.valueChanges.subscribe(() => this.onBancoGuayaquilChange());

    // 2. Transporte y Recorrido
    this.form.get('condiciones.transporte')?.valueChanges.subscribe(() => {
      this.onTransporteChange();
      this.onRecorridoChange();
    });
    this.form.get('condiciones.recorrido')?.valueChanges.subscribe(() => this.onRecorridoChange());

    // 3. Licencia
    this.form.get('condiciones.licencia')?.valueChanges.subscribe(() => this.onLicenciaChange());

    // Ejecución inicial para establecer estados correctos
    this.onBancoGuayaquilChange();
    this.onTransporteChange();
    this.onRecorridoChange();
    this.onLicenciaChange();
  }

  private cargarCompanias() {
    this.thService.getEmpresas().subscribe({
      next: (data) => {
        this.companias = data;
      },
      error: (err) => {
        console.error('Error cargando empresas:', err);
      }
    });
  }

  onAreaChange() {
    const area = this.form.get('area')?.value;
    this.form.get('labor')?.setValue('');
    if (area) {
      this.cargarLabores(area);
    } else {
      this.laboresDisponibles = [];
    }
  }

  private cargarLabores(area: string) {
    this.isLoadingLabores = true;
    this.thService.getLaboresPorArea(area).subscribe({
      next: (labores) => {
        this.laboresDisponibles = labores;
        this.isLoadingLabores = false;
      },
      error: (err) => {
        console.error('Error cargando labores:', err);
        this.laboresDisponibles = [];
        this.isLoadingLabores = false;
      }
    });
  }

  tiposLicencia = [
    { val: 'A', desc: 'Motos' },
    { val: 'B', desc: 'Autos' },
    { val: 'C', desc: 'Taxis/Livianos' },
    { val: 'D', desc: 'Buses' },
    { val: 'E', desc: 'Pesados' },
    { val: 'F', desc: 'Discapacidad' }
  ];

  isInvalid(control: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  isValid(control: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.valid && (c.dirty || c.touched) && c.value !== '' && c.value !== null);
  }

  isInvalidSub(group: string, control: string): boolean {
    const c = this.form.get(`${group}.${control}`);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  isValidSub(group: string, control: string): boolean {
    const c = this.form.get(`${group}.${control}`);
    return !!(c && c.valid && (c.dirty || c.touched) && c.value !== '' && c.value !== null);
  }

  onBancoGuayaquilChange() {
    const usaBanco = this.form.get('banking_info.usa_banco_guayaquil')?.value;
    const fields = ['numero_cuenta', 'confirmacion_cuenta', 'tipo_cuenta', 'titular'];

    fields.forEach(f => {
      const ctrl = this.form.get(`banking_info.${f}`);
      if (usaBanco === true) {
        ctrl?.enable();
        if (f === 'numero_cuenta') {
          ctrl?.setValidators([Validators.required, Validators.pattern(/^\d{10,13}$/)]);
        } else if (f === 'titular') {
          ctrl?.setValidators([
            Validators.required,
            Validators.maxLength(120),
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/),
            CustomValidators.noWhitespace
          ]);
        } else {
          ctrl?.setValidators([Validators.required]);
        }
      } else {
        ctrl?.disable();
        ctrl?.clearValidators();
        ctrl?.setValue('');
      }
      ctrl?.updateValueAndValidity({ emitEvent: false });
    });
  }

  onRecorridoChange() {
    const recorrido = this.form.get('condiciones.recorrido')?.value;
    const otroCtrl = this.form.get('condiciones.recorrido_otro');
    if (recorrido === 'Otros') {
      otroCtrl?.enable();
      otroCtrl?.setValidators([
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.]*$/)
      ]);
    } else {
      otroCtrl?.disable();
      otroCtrl?.clearValidators();
      otroCtrl?.setValue('');
    }
    otroCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  onTransporteChange() {
    const usaTransp = this.form.get('condiciones.transporte')?.value;
    const recc = this.form.get('condiciones.recorrido');
    const reccOtro = this.form.get('condiciones.recorrido_otro');

    if (usaTransp === true) {
      recc?.enable();
      recc?.setValidators([Validators.required]);
    } else {
      recc?.disable();
      recc?.clearValidators();
      recc?.setValue('');

      reccOtro?.disable();
      reccOtro?.clearValidators();
      reccOtro?.setValue('');
    }
    recc?.updateValueAndValidity({ emitEvent: false });
    reccOtro?.updateValueAndValidity({ emitEvent: false });
  }

  onLicenciaChange() {
    const tieneLic = this.form.get('condiciones.licencia')?.value;
    const licTipo = this.form.get('condiciones.licencia_tipo');

    if (tieneLic === true) {
      licTipo?.enable();
      licTipo?.setValidators([Validators.required]);
    } else {
      licTipo?.disable();
      licTipo?.clearValidators();
      licTipo?.setValue('');
    }
    licTipo?.updateValueAndValidity({ emitEvent: false });
  }

  onlyNumbers(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
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

  cleanAlphanumeric(controlName: string) {
    const control = this.form.get(controlName);
    if (control) {
      const cleaned = control.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, '');
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
