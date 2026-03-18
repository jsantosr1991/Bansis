import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { TalentoHumanoService } from '../../services/talentoHumano.service';
import { DatosAdministrativosComponent } from '../../components/datos-administrativos/datos-administrativos.component';
import { DatosPersonalesComponent } from '../../components/datos-personales/datos-personales.component';
import { DocumentacionComponent } from '../../components/documentacion/documentacion.component';
import { DatosReferencialesComponent } from '../../components/datos-referenciales/datos-referenciales.component';
import { EstadoCivilComponent } from '../../components/estado-civil/estado-civil.component';
import { DatosFamiliaresComponent } from '../../components/datos-familiares/datos-familiares.component';
import { DatosEducativosComponent } from '../../components/datos-educativos/datos-educativos.component';
import { ExperienciaLaboralComponent } from '../../components/experiencia-laboral/experiencia-laboral.component';
import { ReferenciasLaboralesComponent } from '../../components/referencias-laborales/referencias-laborales.component';
import { ReferenciasPersonalesComponent } from '../../components/referencias-personales/referencias-personales.component';
import { SaludPersonalComponent } from '../../components/salud-personal/salud-personal.component';
import { ObservacionesComponent } from '../../components/observaciones/observaciones.component';
import { EvaluacionInternaComponent } from '../../components/evaluacion-interna/evaluacion-interna.component';
import { Router } from '@angular/router';
// FIX: Usar el servicio oficial de la aplicación para mantener la sesión real del usuario
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import { CustomValidators } from '../../utils/custom-validators';

@Component({
  selector: 'app-nueva-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatosAdministrativosComponent,
    DatosPersonalesComponent,
    DocumentacionComponent,
    DatosReferencialesComponent,
    EstadoCivilComponent,
    DatosFamiliaresComponent,
    DatosEducativosComponent,
    ExperienciaLaboralComponent,
    ReferenciasLaboralesComponent,
    ReferenciasPersonalesComponent,
    SaludPersonalComponent,
    ObservacionesComponent,
    EvaluacionInternaComponent
  ],
  template: `
    <div class="container-fluid fade-in p-4 py-5">
      <div class="header-glass mb-3 p-3 d-flex justify-content-between align-items-center rounded-4 shadow-sm">
        <div class="d-flex flex-column">
          <div class="d-flex align-items-center">
            <img src="assets/images/SistemaHac/Logo/bananas.svg" alt="Logo Central" class="me-3" style="max-height: 35px;">
            <h1 class="h4 mb-0 fw-bold text-primary">Nueva Solicitud de Empleo</h1>
          </div>
          <p class="text-muted mb-0 ms-5 ps-3 small">Complete la información de forma progresiva. Cada sección se guarda de manera independiente.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-warning btn-sm rounded-pill px-4 shadow-sm" (click)="guardarBorrador()" [disabled]="savingDraft">
            <i class="bi" [ngClass]="savingDraft ? 'bi-hourglass-split' : 'bi-save'"></i>
            {{ savingDraft ? 'Borrador' : 'Guardar Borrador' }}
          </button>
          <button class="btn btn-outline-secondary btn-sm rounded-pill px-4" (click)="cancelar()">
            <i class="bi bi-x-circle me-2"></i>Cancelar
          </button>
        </div>
      </div>

      <div class="accordion-container shadow-sm rounded-4 overflow-hidden">
        <form [formGroup]="form">
          <div *ngFor="let section of sections" class="accordion-item border-0 border-bottom">
            <div class="accordion-header d-flex justify-content-between align-items-center p-3 px-4 bg-white" 
                 [class.active]="isSectionOpen(section.id)"
                 (click)="toggleSection(section.id)">
              <div class="d-flex align-items-center">
                <div class="icon-circle me-3" [class.saved]="isSectionSaved(section.id)">
                  <i *ngIf="section.icon" class="bi" [ngClass]="section.icon" style="font-size: 1.2rem;"></i>
                  <img *ngIf="section.image" [src]="section.image" alt="Section Logo" style="max-height: 24px;">
                </div>
                <h5 class="mb-0 fw-semibold">{{ section.title }}</h5>
              </div>
              <div class="d-flex align-items-center">
                <span *ngIf="isSectionSaved(section.id)" class="badge bg-success-subtle text-success border border-success-subtle rounded-pill me-3">
                  <i class="bi bi-check-circle-fill me-1"></i> Guardado
                </span>
                <i class="bi transition" [ngClass]="isSectionOpen(section.id) ? 'bi-chevron-up text-primary' : 'bi-chevron-down'"></i>
              </div>
            </div>

            <div class="accordion-content p-4" [class.show]="isSectionOpen(section.id)">
              <!-- Contenido Dinámico según la Sección -->
              <ng-container [ngSwitch]="section.id">
                <app-datos-administrativos *ngSwitchCase="'datosAdministrativos'"
                  [form]="getGroup('datosAdministrativos')"
                  [nombres]="form.get('datosPersonales.nombres')?.value"
                  [apellidoPaterno]="form.get('datosPersonales.apellidoPaterno')?.value"
                  [apellidoMaterno]="form.get('datosPersonales.apellidoMaterno')?.value">
                </app-datos-administrativos>

                <app-datos-personales *ngSwitchCase="'datosPersonales'" [form]="getGroup('datosPersonales')"></app-datos-personales>
                <app-documentacion *ngSwitchCase="'documentacion'" [form]="getGroup('documentacion')"></app-documentacion>
                <app-datos-referenciales *ngSwitchCase="'datosReferenciales'" [form]="getGroup('datosReferenciales')"></app-datos-referenciales>
                <app-estado-civil *ngSwitchCase="'estadoCivil'" [form]="getGroup('estadoCivil')"></app-estado-civil>
                <app-datos-familiares *ngSwitchCase="'datosFamiliares'" [form]="getGroup('datosFamiliares')" [mainForm]="form"></app-datos-familiares>
                <app-datos-educativos *ngSwitchCase="'datosEducativos'" [form]="getGroup('datosEducativos')"></app-datos-educativos>
                <app-experiencia-laboral *ngSwitchCase="'experienciaLaboral'" [form]="getGroup('experienciaLaboral')"></app-experiencia-laboral>
                <app-referencias-laborales *ngSwitchCase="'referenciasLaborales'" [parentForm]="form" [controlName]="'referenciasLaborales'"></app-referencias-laborales>
                <app-referencias-personales *ngSwitchCase="'referenciasPersonales'" [parentForm]="form"></app-referencias-personales>
                <app-salud-personal *ngSwitchCase="'saludPersonal'" [form]="getGroup('saludPersonal')"></app-salud-personal>
                <app-observaciones *ngSwitchCase="'observaciones'" [parentForm]="form" [currentUser]="userService.getUsername() || 'SISTEMA'"></app-observaciones>
                <app-evaluacion-interna *ngSwitchCase="'datosEntrevistador'" [form]="getGroup('datosEntrevistador')"></app-evaluacion-interna>
              </ng-container>

              <div class="d-flex justify-content-end mt-4 pt-3 border-top" *ngIf="section.id !== 'datosEntrevistador' && shouldShowSaveButton(section.id)">
                <button type="button" 
                        class="btn btn-primary rounded-pill px-5 py-2 shadow-sm d-flex align-items-center justify-content-center min-w-150" 
                        (click)="guardarSeccion(section.id)"
                        [disabled]="savingSection === section.id">
                  <span *ngIf="savingSection !== section.id">
                    <i class="bi bi-save2 me-2"></i> Guardar esta Sección
                  </span>
                  <span *ngIf="savingSection === section.id" class="spinner-border spinner-border-sm me-2"></span>
                  <span *ngIf="savingSection === section.id">Guardando...</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="d-flex justify-content-center mt-5">
        <button class="btn btn-success btn-lg rounded-pill px-5 shadow-lg fw-bold" (click)="finalizarTodo()">
          <i class="bi bi-check-all me-2"></i> Finalizar y Salir
        </button>
      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .header-glass {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      position: sticky;
      top: 0;
      z-index: 1020;
      margin-top: -2rem;
      border-radius: 0 0 1.5rem 1.5rem !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important;
    }

    .accordion-container {
      background: #ffffff;
      border: 1px solid #eef0f2;
    }

    .accordion-header {
      cursor: pointer;
      transition: all 0.3s ease;
      user-select: none;
    }

    .accordion-header:hover {
      background-color: #f8f9fa !important;
    }

    .accordion-header.active {
      background-color: #f0f7ff !important;
      border-left: 4px solid #0d6efd;
    }

    .icon-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f1f3f5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6c757d;
      transition: all 0.3s ease;
    }

    .icon-circle.saved {
      background: #d1e7dd;
      color: #0f5132;
    }

    .active .icon-circle {
      background: #0d6efd;
      color: white;
    }

    .accordion-content {
      max-height: 0;
      overflow: hidden;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      transition: all 0.4s cubic-bezier(0, 1, 0, 1);
      background: #fff;
    }

    .accordion-content.show {
      max-height: 5000px;
      padding-top: 1.5rem !important;
      padding-bottom: 1.5rem !important;
      transition: all 0.4s cubic-bezier(1, 0, 1, 0);
    }

    .transition { transition: transform 0.3s ease; }
    .min-w-150 { min-width: 150px; }
  `]
})
export class NuevaSolicitudComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  activeSections: Set<string> = new Set(['datosAdministrativos']);
  savedSections: Set<string> = new Set();
  savingSection: string | null = null;
  savingDraft: boolean = false;
  solicitudId: number | null = null;
  private autoSaveSub: any;
  private LOCAL_STORAGE_KEY = 'nueva_solicitud_draft';

  sections: { id: string; title: string; icon?: string; image?: string; }[] = [
    { id: 'datosAdministrativos', title: '1. Datos Administrativos', icon: 'bi-building' },
    { id: 'datosPersonales', title: '2. Datos Personales', icon: 'bi-person' },
    { id: 'documentacion', title: '3. Documentación', icon: 'bi-file-earmark-text' },
    { id: 'datosReferenciales', title: '4. Datos Referenciales', icon: 'bi-geo-alt' },
    { id: 'estadoCivil', title: '5. Estado Civil', icon: 'bi-heart' },
    { id: 'datosFamiliares', title: '6. Datos Familiares', icon: 'bi-people' },
    { id: 'datosEducativos', title: '7. Datos Educativos', icon: 'bi-book' },
    { id: 'experienciaLaboral', title: '8. Experiencia Laboral', icon: 'bi-briefcase' },
    { id: 'referenciasLaborales', title: '9. Referencias Laborales', icon: 'bi-person-badge' },
    { id: 'referenciasPersonales', title: '10. Referencias Personales', icon: 'bi-person-lines-fill' },
    { id: 'saludPersonal', title: '11. Salud Personal', icon: 'bi-heart' },
    { id: 'observaciones', title: '12. Observaciones', icon: 'bi-chat-left-text' },
    { id: 'datosEntrevistador', title: '13. Evaluación Interna', icon: 'bi-check2-square' }
  ];

  constructor(
    private fb: FormBuilder,
    private thService: TalentoHumanoService,
    private router: Router,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.initForm();
    this.setupExperienceWatcher();
    this.setupCedulaWatcher();
    this.setupAutoSave();
    this.checkSavedDraft();
    this.setupEstadoCivilWatcher();
    this.cargarGrupos();
  }

  private listaGruposDB: any[] = [];

  private cargarGrupos() {
    this.userService.getGrupo().subscribe({
      next: (grupos) => {
        this.listaGruposDB = grupos;
        // Actualizar el grupo en el formulario una vez cargados los datos reales de la DB
        const groupName = this.getGroupName();
        this.form.get('datosAdministrativos.control_interno.responsable_grupo')?.setValue(groupName);
        this.form.get('datosEntrevistador.entrevistador.grupo')?.setValue(groupName);
        
        console.log('Grupos cargados y departamento asignado:', groupName);
      },
      error: (err) => console.error('Error cargando grupos:', err)
    });
  }

  private getLocalDateTimeISO(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 19);
  }

  ngOnDestroy() {
    if (this.autoSaveSub) {
      this.autoSaveSub.unsubscribe();
    }
  }

  private setupAutoSave() {
    this.autoSaveSub = this.form.valueChanges.subscribe(value => {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify({
        data: value,
        timestamp: new Date().getTime()
      }));
    });
  }

  private checkSavedDraft() {
    const saved = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (saved && !this.solicitudId) {
      const { data, timestamp } = JSON.parse(saved);
      const date = new Date(timestamp).toLocaleString();

      Swal.fire({
        title: 'Borrador detectado',
        text: `Se encontró información de una sesión anterior (${date}). ¿Desea recuperarla?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, recuperar',
        cancelButtonText: 'No, empezar de cero',
        confirmButtonColor: '#0d6efd'
      }).then(result => {
        if (result.isConfirmed) {
          this.form.patchValue(data);
          Swal.fire({
            icon: 'success',
            title: 'Recuperado',
            text: 'Se han restaurado los datos guardados en el navegador.',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        } else {
          localStorage.removeItem(this.LOCAL_STORAGE_KEY);
        }
      });
    }
  }

  private setupExperienceWatcher() {
    this.form.get('experienciaLaboral.sin_experiencia')?.valueChanges.subscribe(sinExp => {
      const refs = this.form.get('referenciasLaborales') as FormArray;
      if (sinExp) {
        while (refs.length) {
          refs.removeAt(0);
        }
        refs.clearValidators();
      } else {
        refs.setValidators([CustomValidators.minArrayLength(1)]);
      }
      refs.updateValueAndValidity();
    });
  }

  private setupCedulaWatcher() {
    this.form.get('datosPersonales.cedula')?.valueChanges.subscribe(cedula => {
      if (cedula && cedula.length === 10) {
        this.validarDuplicadoCedula(cedula);
      }
    });
  }

  private validarDuplicadoCedula(cedula: string) {
    Swal.fire({
      title: 'Validando Identificación...',
      html: 'Consultando bases de datos locales y SRI. Por favor, espere.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.thService.validarCedula(cedula).subscribe({
      next: (res) => {
        Swal.close();
        // 1. Validar Error Algorítmico
        if (!res.valid) {
          Swal.fire({
            icon: 'error',
            title: 'Cédula Inválida',
            text: res.message || 'El número de cédula no es válido.',
            confirmButtonColor: '#d33'
          });
          this.form.get('datosPersonales.cedula')?.setValue('', { emitEvent: false });
          return;
        }

        // 2. Validar Existencia Local
        if (res.exists) {
          Swal.fire({
            title: '¡Cédula Ya Registrada!',
            html: `Se encontró una solicitud existente para este número de cédula:<br><br>
                   <b>Aspirante:</b> ${res.solicitud.nombre_completo}<br>
                   <b>Código:</b> ${res.solicitud.codigo}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '<i class="bi bi-eye"></i> Ver Ficha Existente',
            cancelButtonText: 'Corregir Cédula',
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#6c757d',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/solicitud-empleo/pages/verSolicitud', res.solicitud.id]);
            } else {
              this.form.get('datosPersonales.cedula')?.setValue('', { emitEvent: false });
            }
          });
        } 
        // 3. Autocompletar desde SRI si está disponible
        else if (res.sri_data && res.sri_data.exists && res.sri_data.full_name) {
          this.autocompleteFromSri(res.sri_data.full_name);
        }
      }
    });
  }

  private autocompleteFromSri(fullName: string) {
    // SRI suele devolver: APELLIDO1 APELLIDO2 NOMBRE1 NOMBRE2
    const parts = fullName.split(' ').filter(p => p.length > 0);
    let apePat = '';
    let apeMat = '';
    let noms = '';

    if (parts.length >= 4) {
      apePat = parts[0];
      apeMat = parts[1];
      noms = parts.slice(2).join(' ');
    } else if (parts.length === 3) {
      apePat = parts[0];
      apeMat = parts[1];
      noms = parts[2];
    } else if (parts.length === 2) {
      apePat = parts[0];
      noms = parts[1];
    } else {
      noms = fullName;
    }

    Swal.fire({
      title: 'Datos Encontrados (SRI)',
      html: `Se encontró información asociada a esta cédula:<br><br><b>${fullName}</b><br><br>¿Desea autocompletar nombres y apellidos?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Autocompletar',
      cancelButtonText: 'No, Manual',
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
    }).then(result => {
      if (result.isConfirmed) {
        this.form.get('datosPersonales')?.patchValue({
          apellidoPaterno: apePat,
          apellidoMaterno: apeMat,
          nombres: noms
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Campos Actualizados',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    });
  }

  initForm() {
    this.form = this.fb.group({
      datosAdministrativos: this.fb.group({
        company_id: [null, Validators.required],
        area: ['', Validators.required],
        labor: ['', Validators.required],
        fechaIngreso: ['', Validators.required],
        banking_info: this.fb.group({
          usa_banco_guayaquil: [null, Validators.required],
          numero_cuenta: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d{10,13}$/)]],
          confirmacion_cuenta: [{ value: '', disabled: true }, Validators.required],
          tipo_cuenta: [{ value: '', disabled: true }, Validators.required],
          titular: [{ value: '', disabled: true }, [
            Validators.required,
            Validators.maxLength(120),
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/),
            CustomValidators.noWhitespace
          ]]
        }, { validators: CustomValidators.mustMatch('numero_cuenta', 'confirmacion_cuenta') }),
        fechas_control: this.fb.group({
          fecha_revision_guayaquil: [null, Validators.required],
          reingreso_fecha: [null],
          fecha_salida: [null]
        }),
        condiciones: this.fb.group({
          tipo_contrato: ['', Validators.required],
          transporte: [null, Validators.required],
          recorrido: [{ value: '', disabled: true }, Validators.required],
          recorrido_otro: [{ value: '', disabled: true }, [
            Validators.required,
            Validators.maxLength(100),
            Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.]*$/)
          ]],
          vehiculo: [null, Validators.required],
          licencia: [null, Validators.required],
          licencia_tipo: [{ value: '', disabled: true }, Validators.required],
          acumulacion_decimos: [null, Validators.required],
          semana_completa: [null, Validators.required],
          solo_proceso: [null, Validators.required],
          almuerzo: [null, Validators.required]
        }),
        control_interno: this.fb.group({
          fecha_entrevista: [{ value: this.getLocalDateTimeISO(), disabled: true }],
          responsable_id: [Number(this.userService.getCodEmpleado())], // Asegurar formato numérico
          responsable_nombre: [{ value: this.userService.getUsername(), disabled: true }],
          responsable_grupo: [{ value: this.getGroupName(), disabled: true }]
        })
      }),
      datosPersonales: this.fb.group({
        cedula: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        apellidoPaterno: ['', [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
          CustomValidators.noWhitespace
        ]],
        apellidoMaterno: ['', [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
          CustomValidators.noWhitespace
        ]],
        nombres: ['', [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
          CustomValidators.noWhitespace
        ]],
        apodo: ['', [
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
          CustomValidators.noWhitespace
        ]],
        genero: ['', Validators.required],
        tieneDiscapacidad: [false],
        discapacidadDetalle: [{ value: '', disabled: true }, [
            Validators.maxLength(150),
            CustomValidators.noWhitespace
        ]],
        discapacidadPorcentaje: [0, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern(/^[0-9]*$/)]],
        paisNacimiento: ['', Validators.required],
        paisNacimientoOtro: ['', [
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
          CustomValidators.noWhitespace
        ]],
        provinciaNacimiento: ['', Validators.required],
        provinciaNacimientoOtro: ['', [
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
          CustomValidators.noWhitespace
        ]],
        cantonNacimiento: ['', Validators.required],
        cantonNacimientoOtro: ['', [
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
          CustomValidators.noWhitespace
        ]],
        cantonCodigo: [null],
        fechaNacimiento: ['', Validators.required],
        edad: [{ value: '', disabled: true }],
        tipoSangre: ['', Validators.required],
        estatura: ['', [Validators.required, Validators.min(1.00), Validators.max(2.50)]],
        peso: ['', [Validators.required, Validators.min(60), Validators.max(500)]],
        religion: ['', [
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ,.()]*$/),
          CustomValidators.noWhitespace
        ]],
        correo: ['', [Validators.required, Validators.email]],
        vacunaCovid1: [false],
        vacunaCovid2: [false],
        vacunaCovid3: [false],
        afiliadoIess: ['', Validators.required]
      }, { validators: CustomValidators.covidVaccineValidator }),
      documentacion: this.fb.group({
        cedula_cant: [0, [Validators.required, Validators.min(1)]],
        certificado_votacion_cant: [0, [Validators.required, Validators.min(1)]],
        libreta_militar_cant: [0, [Validators.min(0)]],
        certificado_iess_cant: [0, [Validators.min(0)]],
        certificado_laboral_cant: [0, [Validators.min(0)]],
        fotos_cant: [0, [Validators.min(0)]]
      }),
      datosReferenciales: this.fb.group({
        direccion: ['', [Validators.required, Validators.maxLength(200), CustomValidators.noWhitespace]],
        provincia: ['', Validators.required],
        provinciaOtro: ['', [
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
          CustomValidators.noWhitespace
        ]],
        ciudad: ['', Validators.required],
        ciudadOtro: ['', [
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
          CustomValidators.noWhitespace
        ]],
        ciudadCodigo: [null],
        telefono_principal: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]],
        telefono_secundario: ['', [Validators.pattern(/^[0-9]{7,10}$/)]],
        vivienda_material: ['', Validators.required],
        vivienda_condicion: ['', Validators.required],
        cantidad_familiares: [0, [Validators.required, Validators.min(0), Validators.max(20)]],
        familiares_relacion: ['', [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.]*$/),
          CustomValidators.noWhitespace
        ]],
        telefono_emergencia: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]],
        nombre_contacto_emergencia: ['', [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
          CustomValidators.noWhitespace
        ]],
        servicios_basicos: this.fb.group({
          agua: [false],
          luz: [false],
          telefono: [false]
        })
      }),
      estadoCivil: this.fb.group({
        estado_civil: ['', Validators.required],
        tiempo_estado_civil_valor: [null],
        tiempo_estado_civil_unidad: ['ANIOS'],
        tipo_matrimonio: [null],
        demandas: ['', [
          Validators.required,
          Validators.maxLength(250),
          CustomValidators.noWhitespace
        ]],
        compromisos_anteriores: [0, [Validators.required, Validators.min(0)]]
      }),
      datosFamiliares: this.fb.group({
        padre: this.fb.group({
          nombre: ['', [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
            CustomValidators.noWhitespace
          ]],
          estado: ['VIVO', Validators.required],
          edad: [null],
          domicilio: ['', [Validators.required, CustomValidators.noWhitespace]],
          ocupacion: ['', [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
            CustomValidators.noWhitespace
          ]]
        }),
        madre: this.fb.group({
          nombre: ['', [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
            CustomValidators.noWhitespace
          ]],
          estado: ['VIVO', Validators.required],
          edad: [null],
          domicilio: ['', [Validators.required, CustomValidators.noWhitespace]],
          ocupacion: ['', [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
            CustomValidators.noWhitespace
          ]]
        }),
        conyuge_actual: this.fb.group({
          nombre: ['', [
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
            CustomValidators.noWhitespace
          ]],
          estado: ['VIVO'],
          edad: [null],
          domicilio: ['', [CustomValidators.noWhitespace]],
          ocupacion: ['', [
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
            CustomValidators.noWhitespace
          ]]
        }),
        hermanos: this.fb.array([]),
        hijos: this.fb.array([]),
        conyuges_anteriores: this.fb.array([])
      }),
      datosEducativos: this.fb.group({
        nivel_maximo: ['', Validators.required],
        inicial: this.fb.group({
          institucion: [''],
          anio: [null, [Validators.pattern(/^\d{4}$/)]]
        }),
        basica: this.fb.group({
          institucion: [''],
          ultimo_grado: [''],
          anio: [null, [Validators.pattern(/^\d{4}$/)]]
        }),
        bachillerato: this.fb.group({
          institucion: [''],
          titulo: [''],
          anio: [null, [Validators.pattern(/^\d{4}$/)]]
        }),
        superior: this.fb.group({
          institucion: [''],
          tipo: [''],
          nivel: [''],
          carrera_programa: [''],
          estado: [''],
          anio: [null, [Validators.pattern(/^\d{4}$/)]]
        }),
        cursos: this.fb.array([])
      }, { validators: this.educationMinValidator }),
      experienciaLaboral: this.fb.group({
        sin_experiencia: [false],
        experiencias: this.fb.array([]),
        descripcion_labores: ['', [Validators.required, CustomValidators.noWhitespace]]
      }, { validators: this.minExperienceArrayValidator }),
      referenciasLaborales: this.fb.array([], [CustomValidators.minArrayLength(1)]),
      referenciasPersonales: this.fb.array([], [CustomValidators.minArrayLength(1)]),
      familiaresEnEmpresa: this.fb.array([]),
      saludPersonal: this.fb.group({
        operaciones: this.fb.group({ aplica: [false], detalle: [''] }),
        fracturas: this.fb.group({ aplica: [false], detalle: [''] }),
        quemaduras: this.fb.group({ aplica: [false], detalle: [''] }),
        accidentes_laborales: this.fb.group({ aplica: [false], detalle: [''] }),
        otros_antecedentes: [''],
        deporte: [''],
        actividad_social: ['']
      }),
      observaciones: this.fb.array([]),
      datosEntrevistador: this.fb.group({
        entrevistador: this.fb.group({
          nombre: [{ value: this.userService.getUsername(), disabled: true }],
          grupo: [{ value: this.getGroupName(), disabled: true }],
          fecha: [{ value: this.getLocalDateTimeISO(), disabled: true }]
        }),
        aprobacion: this.fb.group({
          estado: ['PENDIENTE'],
          aprobado_por: [''],
          grupo: [''],
          fecha: [null]
        })
      })
    });
  }

  getGroup(name: string): FormGroup {
    return this.form.get(name) as FormGroup;
  }

  toggleSection(sectionId: string) {
    if (this.activeSections.has(sectionId)) {
      this.activeSections.delete(sectionId);
    } else {
      this.activeSections.add(sectionId);
    }
  }

  isSectionOpen(sectionId: string): boolean {
    return this.activeSections.has(sectionId);
  }

  isSectionSaved(sectionId: string): boolean {
    return this.savedSections.has(sectionId);
  }

  shouldShowSaveButton(sectionId: string): boolean {
    if (sectionId === 'referenciasLaborales') {
      const sinExp = this.form.get('experienciaLaboral.sin_experiencia')?.value;
      return sinExp === false;
    }
    return true;
  }

  guardarSeccion(sectionId: string) {
    const controlsToValidate = [sectionId];

    // CASO ESPECIAL: La sección 10 incluye dos arrays independientes en el formulario
    if (sectionId === 'referenciasPersonales') {
      controlsToValidate.push('familiaresEnEmpresa');
    }

    let isInvalid = false;
    const invalidFields: string[] = [];

    controlsToValidate.forEach(id => {
      const control = this.form.get(id);
      if (control && control.invalid) {
        isInvalid = true;
        control.markAllAsTouched();
        this.getInvalidFieldsFromControl(control, id, invalidFields);
      }
    });

    if (isInvalid) {
      const fieldsList = invalidFields.length > 0
        ? `\n\nCampos faltantes o inválidos:\n• ${[...new Set(invalidFields)].join('\n• ')}`
        : '';

      Swal.fire({
        icon: 'warning',
        title: 'Formulario Incompleto',
        text: 'Por favor complete todos los campos obligatorios de esta sección.' + fieldsList,
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    this.savingSection = sectionId;

    // Obtener los datos crudos incluyendo campos deshabilitados (como responsable_id)
    const formValue = this.form.getRawValue();
    const dataToSend: any = {
      [sectionId]: formValue[sectionId]
    };

    // Manejar casos especiales de FormArrays que no están dentro de un grupo
    const specialArrays = ['referenciasLaborales', 'referenciasPersonales', 'familiaresEnEmpresa', 'observaciones'];
    if (specialArrays.includes(sectionId)) {
      dataToSend[sectionId] = formValue[sectionId];
      // FIX: La sección 10 (referenciasPersonales) incluye el array de familiares en la empresa
      if (sectionId === 'referenciasPersonales') {
        dataToSend['familiaresEnEmpresa'] = formValue['familiaresEnEmpresa'];
      }
    }

    // FIX: Al crear una solicitud nueva guardando una sección distinta a la 1,
    // incluir control_interno (fecha_entrevista, responsable) para que siempre se registre.
    if (!this.solicitudId && sectionId !== 'datosAdministrativos') {
      if (!dataToSend['datosAdministrativos']) {
        dataToSend['datosAdministrativos'] = {};
      }
      dataToSend['datosAdministrativos']['control_interno'] = formValue['datosAdministrativos']['control_interno'];
    }

    const operation = this.solicitudId
      ? this.thService.actualizarSolicitud(this.solicitudId, dataToSend)
      : this.thService.guardarSolicitud(dataToSend);

    operation.subscribe({
      next: (res: any) => {
        this.savingSection = null;
        this.savedSections.add(sectionId);
        if (!this.solicitudId && res && res.id) {
          this.solicitudId = res.id;
        }

        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: 'La sección se ha guardado correctamente.',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });

        // Colapsar la sección guardada para limpiar la UI
        if (this.activeSections.has(sectionId)) {
          this.activeSections.delete(sectionId);
        }

        console.log('Sección guardada:', sectionId, res);
      },
      error: (err) => {
        this.savingSection = null;
        console.error('Error al guardar sección:', err);

        Swal.fire({
          icon: 'error',
          title: 'Error al Guardar',
          text: err.error?.message || 'No se pudo guardar la información. Verifique su conexión o intente más tarde.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  guardarBorrador() {
    this.savingDraft = true;

    // Obtener todos los datos actuales ignorando validaciones
    const formValue = this.form.getRawValue();
    const dataToSend = {
      ...formValue,
      estado_solicitud: 'BORRADOR'
    };

    const operation = this.solicitudId
      ? this.thService.actualizarSolicitud(this.solicitudId, dataToSend)
      : this.thService.guardarSolicitud(dataToSend);

    operation.subscribe({
      next: (res: any) => {
        this.savingDraft = false;
        if (!this.solicitudId && res && res.id) {
          this.solicitudId = res.id;
        }

        Swal.fire({
          icon: 'success',
          title: 'Borrador Guardado',
          text: 'Se ha guardado un borrador de su progreso. Puede continuar en cualquier momento.',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });

        // Limpiar el draft local si se guardó exitosamente en servidor
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
      },
      error: (err) => {
        this.savingDraft = false;
        console.error('Error al guardar borrador:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al Guardar Borrador',
          text: 'No se pudo guardar el borrador parcial.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  finalizarTodo() {
    if (this.solicitudId) {
      this.router.navigate(['/solicitud-empleo/pages/listaSolicitudes']);
    } else {
      Swal.fire({
        title: '¿Salir sin guardar?',
        text: 'Aún no ha guardado ninguna sección. ¿Desea salir de todas formas?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Continuar editando'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/solicitud-empleo/pages/listaSolicitudes']);
        }
      });
    }
  }

  private setupEstadoCivilWatcher() {
    this.form.get('estadoCivil.estado_civil')?.valueChanges.subscribe(estado => {
      const conyugeGroup = this.form.get('datosFamiliares.conyuge_actual') as FormGroup;
      const isMandatory = ['CASADO', 'UNION LIBRE', 'UNIÓN LIBRE'].includes(estado?.toUpperCase());

      const fields = ['nombre', 'estado', 'edad', 'domicilio', 'ocupacion'];
      
      fields.forEach(field => {
        const control = conyugeGroup.get(field);
        if (control) {
          if (isMandatory) {
            control.setValidators([Validators.required, CustomValidators.noWhitespace]);
          } else {
            control.clearValidators();
          }
          control.updateValueAndValidity({ emitEvent: false });
        }
      });
    });
  }

  cancelar() {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Se perderán todos los cambios que no hayan sido guardados por sección.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, seguir aquí'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/solicitud-empleo/pages/listaSolicitudes']);
      }
    });
  }

  confirmarCuentaNuevaValidator(group: FormGroup) {
    const cuenta = group.get('numero_cuenta')?.value;
    const confirmacion = group.get('confirmacion_cuenta')?.value;
    return cuenta === confirmacion ? null : { mismatch: true };
  }

  private educationMinValidator(group: any) {
    const nivel = group.get('nivel_maximo')?.value;
    const cursos = group.get('cursos') as FormArray;

    if (cursos && cursos.length === 0) {
      const allowedNivels = [
        'NINGUNO', 'INICIAL',
        'BASICA_INCOMPLETA', 'BASICA_COMPLETA',
        'BACHILLERATO_INCOMPLETO', 'BACHILLERATO_COMPLETO',
        'TECNICO_TECNOLOGO', 'TERCER_NIVEL', 'ESPECIALISTA',
        'MAESTRIA', 'DOCTORADO'
      ];
      if (nivel && !allowedNivels.includes(nivel)) {
        return { minEducationRequired: true };
      }
    }
    return null;
  }

  private minExperienceArrayValidator(group: any) {
    const sinExp = group.get('sin_experiencia')?.value;
    const experiencias = group.get('experiencias') as FormArray;
    if (sinExp === false && experiencias && experiencias.length === 0) {
      return { minExperienceRequired: true };
    }
    return null;
  }

  getGroupName(): string {
    const groupId = this.userService.getGroupId();
    if (this.listaGruposDB.length > 0) {
      // Intentar encontrar el grupo por ID (insensible a mayúsculas en las keys)
      const g = this.listaGruposDB.find(x => (x.id || x.ID) == groupId);
      if (g) {
        // Priorizar el campo 'nombre' como solicita el usuario
        return g.nombre || g.NOMBRE || g.grupo || g.GRUPO || g.descripcion || g.DESCRIPCION || 'N/A';
      }
    }
    
    // Mapa de respaldo mientras carga la base de datos o si el ID no se encuentra
    const groups: { [key: number]: string } = {
      1: 'ADMINISTRACION',
      2: 'SISTEMAS',
      3: 'TALENTO HUMANO',
      4: 'OPERACIONES'
    };
    return groups[groupId] || 'SIN GRUPO';
  }

  private getInvalidFieldsFromControl(control: any, key: string, results: string[]) {
    const label = this.fieldLabels[key] || key;
    if (control.invalid) {
      if (control instanceof FormGroup) {
        this.getInvalidFields(control, label + ' > ', results);
      } else if (control instanceof FormArray) {
        results.push(label);
      } else {
        results.push(label);
      }
    }
  }

  private getInvalidFields(group: FormGroup, prefix: string, results: string[]) {
    Object.keys(group.controls).forEach(key => {
      const control = group.get(key);
      const label = this.fieldLabels[key] || key;
      if (control?.invalid) {
        if (control instanceof FormGroup) {
          this.getInvalidFields(control, label + ' > ', results);
        } else {
          results.push(label);
        }
      }
    });

    if (group.errors?.['mismatch']) {
      results.push('Confirmación de Cuenta (no coincide)');
    }
  }

  private fieldLabels: { [key: string]: string } = {
    company_id: 'Compañía',
    area: 'Área',
    labor: 'Labor',
    fechaIngreso: 'Fecha de Ingreso',
    usa_banco_guayaquil: '¿Tiene cuenta en Banco Guayaquil?',
    numero_cuenta: 'Número de Cuenta',
    confirmacion_cuenta: 'Confirmación de Cuenta',
    tipo_cuenta: 'Tipo de Cuenta',
    titular: 'Titular de Cuenta',
    fecha_revision_guayaquil: 'Fecha Revisión Guayaquil',
    tipo_contrato: 'Tipo de Contrato',
    transporte: '¿Usará Expreso?',
    recorrido: 'Recorrido',
    recorrido_otro: 'Especifique Recorrido',
    vehiculo: '¿Tiene Vehículo Particular?',
    licencia: '¿Tiene Licencia?',
    licencia_tipo: 'Tipo de Licencia',
    acumulacion_decimos: '¿Acumulación de Décimos?',
    semana_completa: '¿Semana Completa?',
    solo_proceso: '¿Solo Proceso?',
    almuerzo: '¿Almuerzo?',
    cedula: 'Cédula',
    apellidoPaterno: 'Apellido Paterno',
    apellidoMaterno: 'Apellido Materno',
    nombres: 'Nombres',
    apodo: 'Apodo',
    paisNacimiento: 'País de Nacimiento',
    provinciaNacimiento: 'Provincia de Nacimiento',
    fechaNacimiento: 'Fecha de Nacimiento',
    edad: 'Edad',
    tipoSangre: 'Tipo de Sangre',
    estatura: 'Estatura',
    peso: 'Peso',
    religion: 'Religión',
    correo: 'Correo Electrónico',
    telefono_principal: 'Teléfono Principal',
    telefono_secundario: 'Teléfono Secundario',
    telefono_emergencia: 'Teléfono de Emergencia',
    nombre_contacto_emergencia: 'Nombre de Contacto de Emergencia',
    parentesco_contacto_emergencia: 'Parentesco de Contacto de Emergencia',
    cedula_cant: 'Cantidad de Cédulas',
    certificado_votacion_cant: 'Cantidad de Certificados de Votación',
    libreta_militar_cant: 'Cantidad de Libretas Militares',
    certificado_iess_cant: 'Cantidad de Certificados IESS',
    certificado_laboral_cant: 'Cantidad de Certificados Laborales',
    fotos_cant: 'Cantidad de Fotos',
    padre: 'Datos del Padre',
    madre: 'Datos de la Madre',
    conyuge_actual: 'Cónyuge Actual',
    nombre: 'Nombre/Nombres Completos',
    estado: 'Estado (Vivo/Finado)',
    domicilio: 'Domicilio',
    ocupacion: 'Ocupación',
    cargo: 'Cargo/Profesión/Labor',
    empresa: 'Empresa/Lugar de Trabajo',
    telefono: 'Teléfono',
    parentesco: 'Parentesco/Relación',
    referenciasLaborales: 'Referencias Laborales',
    referenciasPersonales: 'Referencias Personales',
    familiaresEnEmpresa: 'Vínculos en la Empresa'
  };
}
