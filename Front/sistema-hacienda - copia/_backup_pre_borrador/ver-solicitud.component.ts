import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TalentoHumanoService } from '../../services/talentoHumano.service';
import Swal from 'sweetalert2';
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

@Component({
  selector: 'app-ver-solicitud',
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
      <!-- Banner Informativo para Contratados -->
      <div class="alert alert-info border-0 shadow-sm rounded-4 mb-4 d-flex align-items-center animate-fade" *ngIf="isContratado">
        <i class="bi bi-info-circle-fill fs-3 me-3 text-info"></i>
        <div>
          <h6 class="mb-1 fw-bold">Registro de Trabajador Activo</h6>
          <p class="mb-0 small">Esta solicitud ya ha sido procesada como <strong>CONTRATADO</strong>. La edición y eliminación están deshabilitadas para preservar la integridad de los datos.</p>
        </div>
      </div>

      <div class="header-glass mb-4 p-4 d-flex justify-content-between align-items-center rounded-4 shadow-sm">
        <div>
          <div class="d-flex align-items-center mb-1">
            <h1 class="h2 mb-0 fw-bold text-primary">Solicitud #{{ solicitudId }}</h1>
            <span class="badge mx-3" [class.bg-primary]="!editMode" [class.bg-warning]="editMode">
              {{ editMode ? 'MODO EDICIÓN' : 'VISTA DE DETALLE' }}
            </span>
          </div>
          <p class="text-muted mb-0">Visualización detallada de la información del aspirante.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary rounded-pill px-4" (click)="regresar()">
            <i class="bi bi-arrow-left me-2"></i>Volver
          </button>
          <button class="btn btn-primary rounded-pill px-4 shadow-sm" *ngIf="!editMode" (click)="toggleEdit()" [disabled]="isContratado">
            <i class="bi bi-pencil-square me-2"></i>{{ isContratado ? 'Bloqueado' : 'Editar' }}
          </button>
          <button class="btn btn-danger rounded-pill px-4 shadow-sm" *ngIf="editMode" (click)="toggleEdit()">
            <i class="bi bi-x-circle me-2"></i>Cancelar Edición
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
                <div class="icon-circle me-3" [class.editing]="editMode">
                  <i class="bi" [ngClass]="section.icon"></i>
                </div>
                <h5 class="mb-0 fw-semibold">{{ section.title }}</h5>
              </div>
              <div class="d-flex align-items-center">
                <i class="bi transition" [ngClass]="isSectionOpen(section.id) ? 'bi-chevron-up text-primary' : 'bi-chevron-down'"></i>
              </div>
            </div>

            <div class="accordion-content p-4" [class.show]="isSectionOpen(section.id)">
              <ng-container [ngSwitch]="section.id">
                <app-datos-administrativos *ngSwitchCase="'datosAdministrativos'" [form]="getGroup('datosAdministrativos')" [isReadOnly]="!editMode"></app-datos-administrativos>
                <app-datos-personales *ngSwitchCase="'datosPersonales'" [form]="getGroup('datosPersonales')" [isReadOnly]="!editMode"></app-datos-personales>
                <app-documentacion *ngSwitchCase="'documentacion'" [form]="getGroup('documentacion')" [isReadOnly]="!editMode"></app-documentacion>
                <app-datos-referenciales *ngSwitchCase="'datosReferenciales'" [form]="getGroup('datosReferenciales')" [isReadOnly]="!editMode"></app-datos-referenciales>
                <app-estado-civil *ngSwitchCase="'estadoCivil'" [form]="getGroup('estadoCivil')" [isReadOnly]="!editMode"></app-estado-civil>
                <app-datos-familiares *ngSwitchCase="'datosFamiliares'" [form]="getGroup('datosFamiliares')" [mainForm]="form" [isReadOnly]="!editMode"></app-datos-familiares>
                <app-datos-educativos *ngSwitchCase="'datosEducativos'" [form]="getGroup('datosEducativos')" [isReadOnly]="!editMode"></app-datos-educativos>
                <app-experiencia-laboral *ngSwitchCase="'experienciaLaboral'" [form]="getGroup('experienciaLaboral')" [isReadOnly]="!editMode"></app-experiencia-laboral>
                <app-referencias-laborales *ngSwitchCase="'referenciasLaborales'" [parentForm]="form" [controlName]="'referenciasLaborales'" [isReadOnly]="!editMode"></app-referencias-laborales>
                <app-referencias-personales *ngSwitchCase="'referenciasPersonales'" [parentForm]="form" [isReadOnly]="!editMode"></app-referencias-personales>
                <app-salud-personal *ngSwitchCase="'saludPersonal'" [form]="getGroup('saludPersonal')" [isReadOnly]="!editMode"></app-salud-personal>
                <app-observaciones *ngSwitchCase="'observaciones'" [parentForm]="form" [isReadOnly]="!editMode"></app-observaciones>
                <app-evaluacion-interna *ngSwitchCase="'datosEntrevistador'" [form]="getGroup('datosEntrevistador')" [isReadOnly]="!editMode"></app-evaluacion-interna>
              </ng-container>

              <div *ngIf="editMode" class="d-flex justify-content-end mt-4 pt-3 border-top">
                <button type="button" 
                        class="btn btn-primary rounded-pill px-5 py-2 shadow-sm d-flex align-items-center justify-content-center min-w-150" 
                        (click)="guardarSeccion(section.id)"
                        [disabled]="savingSection === section.id || isContratado">
                  <span *ngIf="savingSection !== section.id">
                    <i class="bi bi-save2 me-2"></i> Guardar Cambios de Sección
                  </span>
                  <span *ngIf="savingSection === section.id" class="spinner-border spinner-border-sm me-2"></span>
                  <span *ngIf="savingSection === section.id">Guardando...</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .header-glass {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
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

    .icon-circle.editing {
      border: 2px dashed #ffc107;
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
export class VerSolicitudComponent implements OnInit {
  form!: FormGroup;
  solicitudId: number = 0;
  editMode: boolean = false;
  activeSections: Set<string> = new Set(['datosAdministrativos']);
  savingSection: string | null = null;
  isContratado: boolean = false;

  sections = [
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
    { id: 'saludPersonal', title: '11. Salud Personal', icon: 'bi-activity' },
    { id: 'observaciones', title: '12. Observaciones', icon: 'bi-chat-left-text' },
    { id: 'datosEntrevistador', title: '13. Evaluación Interna', icon: 'bi-check2-square' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private thService: TalentoHumanoService
  ) { }

  ngOnInit() {
    this.initForm();
    this.route.params.subscribe(params => {
      this.solicitudId = +params['id'];
      this.cargarSolicitud(this.solicitudId);
    });
  }

  toggleEdit() {
    if (this.isContratado) return;
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.form.enable();
    } else {
      this.form.disable();
      this.cargarSolicitud(this.solicitudId);
    }
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
          numero_cuenta: ['', [Validators.required, Validators.pattern(/^\d{10,13}$/)]],
          confirmacion_cuenta: [''],
          tipo_cuenta: ['', Validators.required],
          titular: ['', [
            Validators.required,
            Validators.maxLength(120),
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)
          ]]
        }),
        fechas_control: this.fb.group({
          fecha_revision_guayaquil: [null, Validators.required],
          reingreso_fecha: [null],
          fecha_salida: [null]
        }),
        condiciones: this.fb.group({
          tipo_contrato: ['', Validators.required],
          transporte: [null, Validators.required],
          recorrido: ['', Validators.required],
          recorrido_otro: ['', [
            Validators.required,
            Validators.maxLength(100),
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)
          ]],
          vehiculo: [null, Validators.required],
          licencia: [null, Validators.required],
          licencia_tipo: ['', Validators.required],
          acumulacion_decimos: [null, Validators.required],
          semana_completa: [null, Validators.required],
          solo_proceso: [null, Validators.required],
          almuerzo: [null, Validators.required]
        }),
        control_interno: this.fb.group({
          fecha_entrevista: [null],
          responsable_id: [null],
          responsable_nombre: [null],
          responsable_grupo: [null]
        })
      }),
      datosPersonales: this.fb.group({
        cedula: [''],
        apellidoPaterno: [''],
        apellidoMaterno: [''],
        nombres: [''],
        apodo: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)]],
        paisNacimiento: [''],
        paisNacimientoOtro: [''],
        provinciaNacimiento: [''],
        provinciaNacimientoOtro: [''],
        fechaNacimiento: [''],
        edad: [''],
        tipoSangre: [''],
        estatura: [''],
        peso: [''],
        religion: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)]],
        correo: [''],
        vacunaCovid1: [false],
        vacunaCovid2: [false],
        vacunaCovid3: [false],
        afiliadoIess: [null]
      }),
      documentacion: this.fb.group({
        cedula_cant: [0],
        certificado_votacion_cant: [0],
        libreta_militar_cant: [0],
        certificado_iess_cant: [0],
        certificado_laboral_cant: [0],
        fotos_cant: [0]
      }),
      datosReferenciales: this.fb.group({
        direccion: [''],
        ciudad: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)]],
        telefono_principal: [''],
        telefono_secundario: [''],
        vivienda_material: [''],
        vivienda_condicion: [''],
        cantidad_familiares: [0],
        familiares_relacion: ['', [Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.]*$/)]],
        telefono_emergencia: [''],
        nombre_contacto_emergencia: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)]],
        servicios_basicos: this.fb.group({
          agua: [false],
          luz: [false],
          telefono: [false]
        })
      }),
      estadoCivil: this.fb.group({
        estado_civil: [''],
        tiempo_estado_civil_valor: [null],
        tiempo_estado_civil_unidad: ['ANIOS'],
        tipo_matrimonio: [null],
        demandas: [''],
        compromisos_anteriores: [0]
      }),
      datosFamiliares: this.fb.group({
        padre: this.fb.group({ nombre: [''], estado: ['VIVO'], edad: [null], domicilio: [''], ocupacion: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)]] }),
        madre: this.fb.group({ nombre: [''], estado: ['VIVO'], edad: [null], domicilio: [''], ocupacion: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)]] }),
        conyuge_actual: this.fb.group({ nombre: [''], estado: ['VIVO'], edad: [null], domicilio: [''], ocupacion: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/)]] }),
        hermanos: this.fb.array([]),
        hijos: this.fb.array([]),
        conyuges_anteriores: this.fb.array([])
      }),
      datosEducativos: this.fb.group({
        nivel_maximo: ['', Validators.required],
        inicial: this.fb.group({ institucion: [''], anio: [null] }),
        basica: this.fb.group({ institucion: [''], ultimo_grado: [''], anio: [null] }),
        bachillerato: this.fb.group({ institucion: [''], titulo: [''], anio: [null] }),
        superior: this.fb.group({
          institucion: [''], tipo: [''], nivel: [''], carrera_programa: [''], estado: [''], anio: [null]
        }),
        cursos: this.fb.array([])
      }),
      experienciaLaboral: this.fb.group({
        sin_experiencia: [false],
        experiencias: this.fb.array([]),
        descripcion_labores: ['']
      }),
      referenciasLaborales: this.fb.array([]),
      referenciasPersonales: this.fb.array([]),
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
        entrevistador: this.fb.group({ nombre: [''], grupo: [''], fecha: [null] }),
        aprobacion: this.fb.group({ estado: ['PENDIENTE'], aprobado_por: [''], grupo: [''], fecha: [null] })
      })
    });
    this.form.disable();
  }

  cargarSolicitud(id: number) {
    this.thService.getSolicitud(id).subscribe(data => {
      if (data) {
        // Pre-poblar los FormArrays antes de hacer patchValue
        if (data.datosFamiliares) {
          this.populateArray('datosFamiliares.hermanos', data.datosFamiliares.hermanos, () => this.fb.group({
            nombre: [''], genero: ['MASCULINO'], estado: ['VIVO'], edad: [null], domicilio: [''], ocupacion: ['']
          }));
          this.populateArray('datosFamiliares.hijos', data.datosFamiliares.hijos, () => this.fb.group({
            nombre: [''], edad: [null], ocupacion: [''], discapacidad: [false], descripcion_discapacidad: ['']
          }));
          this.populateArray('datosFamiliares.conyuges_anteriores', data.datosFamiliares.conyuges_anteriores, () => this.fb.group({
            nombre: [''], edad: [null], ocupacion: ['']
          }));
        }
        if (data.datosEducativos?.cursos) {
          this.populateArray('datosEducativos.cursos', data.datosEducativos.cursos, () => this.fb.group({
            nombre: [''], institucion: [''], anio: [null]
          }));
        }
        if (data.experienciaLaboral?.experiencias) {
          this.populateArray('experienciaLaboral.experiencias', data.experienciaLaboral.experiencias, () => this.fb.group({
            empresa: [''], area: [''], jefe_inmediato: [''], fecha_inicio: [null], fecha_fin: [null], actualmente: [false], motivo_salida: ['']
          }));
        }
        if (data.referenciasLaborales) {
          this.populateArray('referenciasLaborales', data.referenciasLaborales, () => this.fb.group({
            empresa: [''], nombre: [''], cargo: [''], telefono: ['']
          }));
        }
        if (data.referenciasPersonales) {
          this.populateArray('referenciasPersonales', data.referenciasPersonales, () => this.fb.group({
            nombre: [''], profesion: [''], telefono_celular: ['']
          }));
        }
        if (data.familiaresEnEmpresa) {
          this.populateArray('familiaresEnEmpresa', data.familiaresEnEmpresa, () => this.fb.group({
            nombre: [''], parentesco: [''], area: ['']
          }));
        }
        if (data.observaciones) {
          this.populateArray('observaciones', data.observaciones, () => this.fb.group({
            tipo: [''], comentario: [''], fecha: [null], usuario: ['']
          }));
        }

        this.form.patchValue(data);
        this.isContratado = data.datosEntrevistador?.aprobacion?.estado === 'CONTRATADO';

        if (!this.editMode || this.isContratado) this.form.disable();
      }
    });
  }

  private populateArray(path: string, elements: any[], factory: () => FormGroup) {
    const array = this.form.get(path) as FormArray;
    if (!array || !elements) return;
    while (array.length) array.removeAt(0);
    elements.forEach(() => array.push(factory()));
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

  guardarSeccion(sectionId: string) {
    const sectionGroup = this.form.get(sectionId);
    if (sectionGroup && sectionGroup.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Incompleto',
        text: 'Por favor complete todos los campos obligatorios de esta sección.',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    this.savingSection = sectionId;
    const formValue = this.form.getRawValue();
    const dataToSend: any = { [sectionId]: formValue[sectionId] };

    const specialArrays = ['referenciasLaborales', 'referenciasPersonales', 'familiaresEnEmpresa', 'observaciones'];
    if (specialArrays.includes(sectionId)) dataToSend[sectionId] = formValue[sectionId];

    this.thService.actualizarSolicitud(this.solicitudId, dataToSend).subscribe({
      next: () => {
        this.savingSection = null;
        this.activeSections.delete(sectionId); // Auto-collapse on success
        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: 'La sección se ha actualizado correctamente.',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      },
      error: (err) => {
        this.savingSection = null;
        Swal.fire({
          icon: 'error',
          title: 'Error al Guardar',
          text: err.error?.message || 'No se pudo actualizar la información.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  regresar() {
    this.router.navigate(['/solicitud-empleo/pages/listaSolicitudes']);
  }
}
