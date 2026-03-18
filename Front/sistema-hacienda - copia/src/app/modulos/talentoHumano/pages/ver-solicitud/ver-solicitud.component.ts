import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TalentoHumanoService } from '../../services/talentoHumano.service';
import Swal from 'sweetalert2';
import { CustomValidators } from '../../utils/custom-validators';
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
// FIX: Usar el servicio oficial de la aplicación para mantener la sesión real del usuario
import { UserService } from '../../../../services/user.service';

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
      <!-- Banner Informativo para Aprobados -->
      <div class="alert alert-info border-0 shadow-sm rounded-4 mb-4 d-flex align-items-center animate-fade" *ngIf="isAprobado">
        <i class="bi bi-info-circle-fill fs-3 me-3 text-info"></i>
        <div>
          <h6 class="mb-1 fw-bold">Registro de Trabajador Activo</h6>
          <p class="mb-0 small">Esta solicitud ya ha sido procesada como <strong>APROBADO</strong>. La edición y eliminación están deshabilitadas para preservar la integridad de los datos.</p>
        </div>
      </div>

      <div class="header-glass mb-3 p-3 d-flex justify-content-between align-items-center rounded-4 shadow-sm">
        <div class="d-flex flex-column">
          <div class="d-flex align-items-center mb-1">
            <img src="assets/images/SistemaHac/Logo/bananas.svg" alt="Logo Central" class="me-3" style="max-height: 35px;">
            <div class="d-flex flex-column">
              <h1 class="h5 mb-0 fw-bold text-primary">
                {{ form.get('codigo_solicitud')?.value || 'Solicitud #' + solicitudId }}
              </h1>
              <small class="text-muted fw-semibold x-small" *ngIf="form.get('codigo_solicitud')?.value">ID Interno: #{{ solicitudId }}</small>
            </div>
            <span class="badge mx-3" [class.bg-primary]="!editMode" [class.bg-warning]="editMode">
              {{ editMode ? 'MODO EDICIÓN' : 'VISTA DE DETALLE' }}
            </span>
          </div>
          <div class="applicant-name mt-1">
            <div class="d-flex flex-column">
              <span class="text-dark fw-bold h4 mb-0" *ngIf="nombreAspirante">
                <i class="bi bi-person-fill text-muted me-2"></i>{{ nombreAspirante }}
              </span>
              <span class="text-muted small ms-4 fw-semibold" *ngIf="form.get('datosPersonales.cedula')?.value">
                C.I.: {{ form.get('datosPersonales.cedula')?.value }}
              </span>
            </div>
            <p class="text-muted mb-0 small" *ngIf="!nombreAspirante">Cargando información del aspirante...</p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-success rounded-pill px-4 shadow-sm" *ngIf="!editMode && canPrint" (click)="imprimirFicha()">
            <i class="bi bi-printer me-2"></i>Imprimir Ficha
          </button>
          <button class="btn btn-outline-secondary rounded-pill px-4" *ngIf="!editMode" (click)="regresar()">
            <i class="bi bi-arrow-left me-2"></i>Volver
          </button>
          <button class="btn btn-primary rounded-pill px-4 shadow-sm" *ngIf="!editMode" (click)="toggleEdit()" [disabled]="isAprobado">
            <i class="bi bi-pencil-square me-2"></i>{{ isAprobado ? 'Bloqueado' : 'Editar' }}
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
                  <i *ngIf="section.icon" class="bi" [ngClass]="section.icon"></i>
                  <img *ngIf="section.image" [src]="section.image" alt="Section Logo" style="max-height: 24px;">
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
                <app-observaciones *ngSwitchCase="'observaciones'" [parentForm]="form" [isReadOnly]="!editMode" [currentUser]="userService.getUsername() || 'SISTEMA'"></app-observaciones>
                <app-evaluacion-interna *ngSwitchCase="'datosEntrevistador'" [form]="getGroup('datosEntrevistador')" [isReadOnly]="!editMode"></app-evaluacion-interna>
              </ng-container>

              <div *ngIf="editMode && section.id !== 'datosEntrevistador' && shouldShowSaveButton(section.id)" class="d-flex justify-content-end mt-4 pt-3 border-top">
                <button type="button" 
                        class="btn btn-primary rounded-pill px-5 py-2 shadow-sm d-flex align-items-center justify-content-center min-w-150" 
                        (click)="guardarSeccion(section.id)"
                        [disabled]="savingSection === section.id || isAprobado">
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

      <!-- SECCIÓN DE IMPRESIÓN COMPLETA (100% de campos, optimizada para 2 páginas) -->
      <div id="print-section" class="d-none-screen">
        <!-- PÁGINA 1: Cara A -->
        <div class="print-page">
          <!-- Barra de Auditoría Superior -->
          <div class="print-audit-bar d-flex justify-content-between mb-2 pb-1 border-bottom">
            <span><strong>RR.HH.</strong></span>
            <span><strong>Fecha de Impresión:</strong> {{ currentDate | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>

          <div class="print-header d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex align-items-center flex-grow-1">
              <img src="assets/images/SistemaHac/Logo/bananas.svg" style="height: 50px;" class="me-4">
              <div class="text-center flex-grow-1">
                <h2 class="mb-0 fw-bold" style="font-size: 16pt; letter-spacing: 1px;">FICHA DE SOLICITUD DE EMPLEO</h2>
                <h4 class="text-primary fw-bold mb-1" style="font-size: 13pt;">{{ form.get('codigo_solicitud')?.value || 'ID: #' + solicitudId }}</h4>
                <div class="mt-2">
                  <h3 class="mb-0 fw-bold text-dark" style="font-size: 15pt;">{{ nombreAspirante }}</h3>
                  <span class="text-muted fw-bold" style="font-size: 10pt;">C.I.: {{ form.get('datosPersonales.cedula')?.value }}</span>
                </div>
              </div>
            </div>
            <div class="photo-box-container ms-4">
              <div class="photo-box">FOTO CARNET</div>
            </div>
          </div>

          <div class="print-grid-3">
            <!-- COLUMNA 1 -->
            <div class="print-col">
              <div class="print-section-title">1. DATOS ADMINISTRATIVOS</div>
              <div class="print-field"><span class="label">Empresa:</span> {{ form.get('datosAdministrativos.company_name')?.value }}</div>
              <div class="print-field"><span class="label">Área/Labor:</span> {{ form.get('datosAdministrativos.area')?.value }} / {{ form.get('datosAdministrativos.labor')?.value }}</div>
              <div class="print-field"><span class="label">F. Ingreso:</span> {{ form.get('datosAdministrativos.fechaIngreso')?.value | date:'dd/MM/yyyy' }}</div>
              
              <div class="small-box mt-2">
                <div class="fw-bold border-bottom mb-1 italic">Cuentas Bancarias</div>
                <div class="print-field"><span class="label">Banco Gye:</span> {{ form.get('datosAdministrativos.banking_info.usa_banco_guayaquil')?.value ? 'SÍ' : 'NO' }}</div>
                <div class="print-field"><span class="label">Número de Cuenta:</span> {{ form.get('datosAdministrativos.banking_info.numero_cuenta')?.value || 'N/A' }}</div>
                <div class="print-field"><span class="label">Tipo:</span> {{ form.get('datosAdministrativos.banking_info.tipo_cuenta')?.value || 'N/A' }} | <span class="label">Titular:</span> {{ form.get('datosAdministrativos.banking_info.titular')?.value || 'N/A' }}</div>
              </div>

              <div class="small-box mt-2">
                <div class="fw-bold border-bottom mb-1 italic">Contingencia/Control</div>
                <div class="print-field"><span class="label">Rev. Gye:</span> {{ (form.get('datosAdministrativos.fechas_control.fecha_revision_guayaquil')?.value | date:'dd/MM/yy') || 'N/A' }}</div>
                <div class="print-field"><span class="label">Reingreso F.:</span> {{ (form.get('datosAdministrativos.fechas_control.reingreso_fecha')?.value | date:'dd/MM/yy') || 'N/A' }}</div>
                <div class="print-field"><span class="label">F. Salida:</span> {{ (form.get('datosAdministrativos.fechas_control.fecha_salida')?.value | date:'dd/MM/yy') || 'N/A' }}</div>
              </div>
            </div>

            <!-- COLUMNA 2 -->
            <div class="print-col">
              <div class="print-section-title">2. DATOS PERSONALES</div>
              <div class="print-field"><span class="label">Postulante:</span> {{ form.get('datosPersonales.nombres')?.value }} {{ form.get('datosPersonales.apellidoPaterno')?.value }} {{ form.get('datosPersonales.apellidoMaterno')?.value }}</div>
              <div class="print-field"><span class="label">Apodo:</span> {{ form.get('datosPersonales.apodo')?.value || 'N/A' }} | <span class="label">Género:</span> {{ form.get('datosPersonales.genero')?.value }}</div>
              <div class="print-field"><span class="label">Cédula:</span> {{ form.get('datosPersonales.cedula')?.value }}</div>
              <div class="print-field"><span class="label">F. Nac:</span> {{ (form.get('datosPersonales.fechaNacimiento')?.value | date:'dd/MM/yyyy') || 'N/A' }} ({{ form.get('datosPersonales.edad')?.value }} años)</div>
              <div class="print-field">
                <span class="label">Origen:</span> 
                {{ (form.get('datosPersonales.paisNacimiento')?.value?.toUpperCase() === 'OTROS' || form.get('datosPersonales.paisNacimiento')?.value === 'Otros') ? form.get('datosPersonales.paisNacimientoOtro')?.value : form.get('datosPersonales.paisNacimiento')?.value }}, 
                {{ (form.get('datosPersonales.provinciaNacimiento')?.value?.toUpperCase() === 'OTROS' || form.get('datosPersonales.provinciaNacimiento')?.value === 'Otros') ? form.get('datosPersonales.provinciaNacimientoOtro')?.value : form.get('datosPersonales.provinciaNacimiento')?.value }},
                {{ (form.get('datosPersonales.cantonNacimiento')?.value?.toUpperCase() === 'OTROS' || form.get('datosPersonales.cantonNacimiento')?.value === 'Otros') ? form.get('datosPersonales.cantonNacimientoOtro')?.value : form.get('datosPersonales.cantonNacimiento')?.value }}
              </div>
              <div class="print-field"><span class="label">Medidas:</span> Sangre: {{ form.get('datosPersonales.tipoSangre')?.value }} | Est.: {{ form.get('datosPersonales.estatura')?.value }}m | Peso: {{ form.get('datosPersonales.peso')?.value }}lb</div>
              <div class="print-field"><span class="label">Religión:</span> {{ form.get('datosPersonales.religion')?.value || 'N/A' }}</div>
              <div class="print-field"><span class="label">Correo:</span> {{ form.get('datosPersonales.correo')?.value }}</div>
              <div class="print-field"><span class="label">Afiliado IESS por primera vez:</span> {{ form.get('datosPersonales.afiliadoIess')?.value ? 'SÍ' : 'NO' }}</div>
              <div class="print-field">
                <span class="label">Discapacidad:</span> {{ form.get('datosPersonales.tieneDiscapacidad')?.value ? 'SÍ' : 'NO' }}
                <span *ngIf="form.get('datosPersonales.tieneDiscapacidad')?.value"> ({{ form.get('datosPersonales.discapacidadDetalle')?.value || 'Sin detalle' }}) - <strong>{{ form.get('datosPersonales.discapacidadPorcentaje')?.value || 0 }}%</strong></span>
              </div>
              <div class="print-field d-flex gap-2"><span class="label">Vacunas:</span> 
                <span [class.fw-bold]="form.get('datosPersonales.vacunaCovid1')?.value">1° dosis [{{ form.get('datosPersonales.vacunaCovid1')?.value ? 'X' : '' }}]</span>
                <span [class.fw-bold]="form.get('datosPersonales.vacunaCovid2')?.value">2° dosis [{{ form.get('datosPersonales.vacunaCovid2')?.value ? 'X' : '' }}]</span>
                <span [class.fw-bold]="form.get('datosPersonales.vacunaCovid3')?.value">3° dosis [{{ form.get('datosPersonales.vacunaCovid3')?.value ? 'X' : '' }}]</span>
              </div>
            </div>

            <!-- COLUMNA 3 -->
            <div class="print-col">
              <div class="print-section-title">3. DOCUMENTACIÓN</div>
              <div class="print-grid-2">
                <div class="x-small">Cédula: {{ form.get('documentacion.cedula_cant')?.value }}</div>
                <div class="x-small">Votación: {{ form.get('documentacion.certificado_votacion_cant')?.value }}</div>
                <div class="x-small">Militar: {{ form.get('documentacion.libreta_militar_cant')?.value }}</div>
                <div class="x-small">IESS: {{ form.get('documentacion.certificado_iess_cant')?.value }}</div>
                <div class="x-small">Laboral: {{ form.get('documentacion.certificado_laboral_cant')?.value }}</div>
                <div class="x-small">Fotos: {{ form.get('documentacion.fotos_cant')?.value }}</div>
              </div>

              <div class="print-section-title mt-2">4. CONDICIONES LABORALES</div>
              <div class="print-field"><span class="label">Contrato:</span> {{ form.get('datosAdministrativos.condiciones.tipo_contrato')?.value }}</div>
              <div class="print-field"><span class="label">Semana completa:</span> {{ form.get('datosAdministrativos.condiciones.semana_completa')?.value ? 'SÍ' : 'NO' }}</div>
              <div class="print-field"><span class="label">Solo proceso:</span> {{ form.get('datosAdministrativos.condiciones.solo_proceso')?.value ? 'SÍ' : 'NO' }}</div>
              <div class="print-field">
                <span class="label">Transporte:</span> 
                Propio: {{ form.get('datosAdministrativos.condiciones.vehiculo')?.value ? 'SÍ' : 'NO' }} | 
                Expreso: {{ form.get('datosAdministrativos.condiciones.transporte')?.value ? 'SÍ' : 'NO' }} 
                ({{ (form.get('datosAdministrativos.condiciones.recorrido')?.value?.toUpperCase() === 'OTROS' || form.get('datosAdministrativos.condiciones.recorrido')?.value === 'Otros') ? form.get('datosAdministrativos.condiciones.recorrido_otro')?.value : (form.get('datosAdministrativos.condiciones.recorrido')?.value || 'N/A') }})
              </div>
              <div class="print-field"><span class="label">Acumulacion de decimos:</span> {{ form.get('datosAdministrativos.condiciones.acumulacion_decimos')?.value ? 'SÍ' : 'NO' }}</div>
              <div class="print-field"><span class="label">Licencia:</span> {{ form.get('datosAdministrativos.condiciones.licencia_tipo')?.value || 'NINGUNA' }}</div>
              <div class="print-field"><span class="label">Almuerzo:</span> {{ form.get('datosAdministrativos.condiciones.almuerzo')?.value ? 'SÍ' : 'NO' }}</div>
            </div>
          </div>

          <div class="print-grid-2 border-top mt-3 pt-2">
            <div class="print-col">
              <div class="print-section-title">5. CONTACTO Y VIVIENDA</div>
              <div class="print-field">
                <span class="label">Residencia:</span> 
                {{ (form.get('datosReferenciales.provincia')?.value?.toUpperCase() === 'OTROS' || form.get('datosReferenciales.provincia')?.value === 'Otros') ? form.get('datosReferenciales.provinciaOtro')?.value : form.get('datosReferenciales.provincia')?.value }}, 
                {{ (form.get('datosReferenciales.ciudad')?.value?.toUpperCase() === 'OTROS' || form.get('datosReferenciales.ciudad')?.value === 'Otros') ? form.get('datosReferenciales.ciudadOtro')?.value : form.get('datosReferenciales.ciudad')?.value }} - 
                {{ form.get('datosReferenciales.direccion')?.value }}
              </div>
              <div class="print-field"><span class="label">Telfs:</span> {{ form.get('datosReferenciales.telefono_principal')?.value || 'N/A' }} / {{ form.get('datosReferenciales.telefono_secundario')?.value || 'N/A' }}</div>
              <div class="print-field"><span class="label">Vivienda:</span> {{ form.get('datosReferenciales.vivienda_condicion')?.value }} (Material: {{ form.get('datosReferenciales.vivienda_material')?.value }})</div>
              <div class="print-field"><span class="label">Carga Fam:</span> {{ form.get('datosReferenciales.cantidad_familiares')?.value || '0' }} personas | <span class="label">Relación:</span> {{ form.get('datosReferenciales.familiares_relacion')?.value || 'N/A' }}</div>
              <div class="print-field"><span class="label">Servicios Básicos:</span> {{ form.get('datosReferenciales.servicios_basicos.agua')?.value ? 'Agua ' : '' }}{{ form.get('datosReferenciales.servicios_basicos.luz')?.value ? 'Luz ' : '' }}{{ form.get('datosReferenciales.servicios_basicos.telefono')?.value ? 'Teléfono' : '' }}{{ !(form.get('datosReferenciales.servicios_basicos.agua')?.value || form.get('datosReferenciales.servicios_basicos.luz')?.value || form.get('datosReferenciales.servicios_basicos.telefono')?.value) ? 'N/A' : '' }}</div>
              
              <div class="print-section-title mt-2">6. EMERGENCIA</div>
              <div class="print-field"><span class="label">Contacto:</span> {{ form.get('datosReferenciales.nombre_contacto_emergencia')?.value }} ({{ form.get('datosReferenciales.telefono_emergencia')?.value }})</div>
            </div>
            <div class="print-col">
              <div class="print-section-title">7. ESTADO CIVIL Y EDUCACIÓN</div>
              <div class="print-field">
                <span class="label">E. Civil:</span> {{ form.get('estadoCivil.estado_civil')?.value }} 
                <span class="x-small">({{ form.get('estadoCivil.tiempo_estado_civil_valor')?.value }} {{ (form.get('estadoCivil.tiempo_estado_civil_unidad')?.value === 'ANIOS' || !form.get('estadoCivil.tiempo_estado_civil_unidad')?.value) ? 'AÑOS' : 'MESES' }})</span>
              </div>
              <div class="print-field"><span class="label">Detalles:</span> Matrimonio: {{ form.get('estadoCivil.tipo_matrimonio')?.value || 'N/A' }} | Comp. Ant: {{ form.get('estadoCivil.compromisos_anteriores')?.value }}</div>
              <div class="print-field"><span class="label">Demandas:</span> {{ form.get('estadoCivil.demandas')?.value }}</div>
              <div class="print-field border-top pt-1 mt-1"><span class="label">Instrucción:</span> {{ form.get('datosEducativos.nivel_maximo')?.value }}</div>
              <div class="x-small"><strong>Bachiller:</strong> {{ form.get('datosEducativos.bachillerato.institucion')?.value || 'N/A' }} 
                <span *ngIf="form.get('datosEducativos.bachillerato.titulo')?.value"> - {{ form.get('datosEducativos.bachillerato.titulo')?.value }}</span>
                {{ form.get('datosEducativos.bachillerato.anio')?.value ? '(' + form.get('datosEducativos.bachillerato.anio')?.value + ')' : '' }}
              </div>
              <div class="x-small" *ngIf="form.get('datosEducativos.superior.institucion')?.value || form.get('datosEducativos.nivel_maximo')?.value === 'TERCER_NIVEL'"><strong>Superior:</strong> {{ form.get('datosEducativos.superior.institucion')?.value || 'N/A' }} - {{ form.get('datosEducativos.superior.carrera_programa')?.value || 'N/A' }} ({{ form.get('datosEducativos.superior.estado')?.value || 'N/A' }} - {{ form.get('datosEducativos.superior.anio')?.value || 'N/A' }})</div>

              <div class="print-section-title mt-2">8. PADRES Y PAREJA</div>
              <div class="print-field border-bottom pb-1 mb-1">
                <span class="label">Padre:</span> {{ form.get('datosFamiliares.padre.nombre')?.value }} 
                <span class="x-small ms-1">
                  ({{ form.get('datosFamiliares.padre.estado')?.value }}{{ form.get('datosFamiliares.padre.estado')?.value === 'FINADO' ? ' ✝' : '' }})
                  <strong *ngIf="form.get('datosFamiliares.padre.edad')?.value"> - {{ form.get('datosFamiliares.padre.edad')?.value }} años</strong>
                </span>
                <div class="x-small italic" *ngIf="form.get('datosFamiliares.padre.domicilio')?.value"><strong>Dom:</strong> {{ form.get('datosFamiliares.padre.domicilio')?.value }}</div>
                <div class="x-small"><strong>Ocupación:</strong> {{ form.get('datosFamiliares.padre.ocupacion')?.value || 'N/A' }}</div>
              </div>
              <div class="print-field border-bottom pb-1 mb-1">
                <span class="label">Madre:</span> {{ form.get('datosFamiliares.madre.nombre')?.value }} 
                <span class="x-small ms-1">
                  ({{ form.get('datosFamiliares.madre.estado')?.value }}{{ form.get('datosFamiliares.madre.estado')?.value === 'FINADO' ? ' ✝' : '' }})
                  <strong *ngIf="form.get('datosFamiliares.madre.edad')?.value"> - {{ form.get('datosFamiliares.madre.edad')?.value }} años</strong>
                </span>
                <div class="x-small italic" *ngIf="form.get('datosFamiliares.madre.domicilio')?.value"><strong>Dom:</strong> {{ form.get('datosFamiliares.madre.domicilio')?.value }}</div>
                <div class="x-small"><strong>Ocupación:</strong> {{ form.get('datosFamiliares.madre.ocupacion')?.value || 'N/A' }}</div>
              </div>
              <div class="print-field">
                <span class="label">Pareja Actual:</span> {{ form.get('datosFamiliares.conyuge_actual.nombre')?.value || 'N/A' }}
                <span class="x-small fw-bold" *ngIf="form.get('datosFamiliares.conyuge_actual.edad')?.value"> - {{ form.get('datosFamiliares.conyuge_actual.edad')?.value }} años</span>
                <div class="x-small italic" *ngIf="form.get('datosFamiliares.conyuge_actual.domicilio')?.value"><strong>Dom:</strong> {{ form.get('datosFamiliares.conyuge_actual.domicilio')?.value }}</div>
              </div>
            </div>
          </div>

          <div class="footer-note mt-auto text-center border-top pt-2 italic x-small" style="font-size: 8pt;">
            Página 1 de 2 (Cara A) - Documento institucional registrado para el proceso de contratación.
          </div>
        </div>

        <div class="page-break"></div>

        <!-- PÁGINA 2: Cara B -->
        <div class="print-page">
          <div class="print-grid-2">
            <!-- COLUMNA 1 -->
            <div class="print-col">
              <div class="print-section-title">9. HIJOS Y HERMANOS</div>
              <table class="print-table-mini w-100 mb-1" style="font-size: 8pt;">
                <thead>
                  <tr>
                    <th style="width: 55%">Vínculo / Nombre</th>
                    <th style="width: 15%">Edad</th>
                    <th style="width: 30%">Ocupación / Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let h of form.get('datosFamiliares.hermanos')?.value">
                    <td>
                      <div>HERMANO: {{ h.nombre }}<span *ngIf="h.estado === 'FINADO'" class="text-danger fw-bold small"> (FINADO ✝)</span></div>
                      <div class="x-small italic opacity-75" *ngIf="h.domicilio">Dom: {{ h.domicilio }}</div>
                    </td>
                    <td>{{ h.edad ? h.edad + ' años' : 'N/A' }}</td>
                    <td>{{ h.ocupacion || 'N/A' }}</td>
                  </tr>
                  <tr *ngIf="!form.get('datosFamiliares.hermanos')?.value?.length">
                    <td colspan="3" class="text-center italic text-muted">Sin hermanos registrados</td>
                  </tr>
                  <tr *ngFor="let h of form.get('datosFamiliares.hijos')?.value">
                    <td>
                      <div>HIJO: {{ h.nombre }}<span *ngIf="h.discapacidad" class="text-primary fw-bold small"> [DISC.]</span></div>
                      <div class="x-small italic opacity-75" *ngIf="h.domicilio">Dom: {{ h.domicilio }}</div>
                    </td>
                    <td>{{ h.edad ? h.edad + ' años' : 'N/A' }}</td>
                    <td>
                      <div>{{ h.ocupacion || 'N/A' }}</div>
                      <div class="x-small text-primary fw-bold" *ngIf="h.discapacidad && h.descripcion_discapacidad">Obs: {{ h.descripcion_discapacidad }}</div>
                    </td>
                  </tr>
                  <tr *ngIf="!form.get('datosFamiliares.hijos')?.value?.length">
                    <td colspan="3" class="text-center italic text-muted">Sin hijos registrados</td>
                  </tr>
                </tbody>
              </table>

              <div class="mt-1" *ngIf="form.get('datosFamiliares.conyuges_anteriores')?.value?.length">
                <div class="fw-bold border-bottom mb-1" style="font-size: 8.5pt;">CÓNYUGES ANTERIORES</div>
                <table class="print-table-mini w-100" style="font-size: 8pt;">
                  <tbody>
                    <tr *ngFor="let c of form.get('datosFamiliares.conyuges_anteriores')?.value">
                      <td>• {{ c.nombre }}</td><td>{{ c.edad }} años</td><td>{{ c.ocupacion }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="print-section-title mt-1">10. CURSOS Y CAPACITACIÓN</div>
              <table class="print-table-mini w-100 mb-1" style="font-size: 8pt;">
                <tr *ngFor="let c of form.get('datosEducativos.cursos')?.value">
                  <td>{{ c.nombre | slice:0:30 }}</td><td>{{ c.institucion | slice:0:20 }}</td><td>{{ c.anio || 'N/A' }}</td>
                </tr>
                <tr *ngIf="!form.get('datosEducativos.cursos')?.value?.length">
                  <td colspan="3" class="text-center italic text-muted py-1">Sin cursos registrados</td>
                </tr>
              </table>
            </div>

            <!-- COLUMNA 2 -->
            <div class="print-col">
              <div class="print-section-title mt-1">11. REFERENCIAS</div>
              
              <div class="fw-bold text-primary" style="font-size: 7pt; margin-bottom: 1px;">LABORALES</div>
              <table class="print-table-mini w-100" style="font-size: 7pt; margin-bottom: 2px;">
                <tr *ngFor="let r of form.get('referenciasLaborales')?.value">
                  <td style="width: 35%; padding: 0px 2px;">• {{ r.nombre }}</td>
                  <td style="width: 20%; padding: 0px 2px;">{{ r.cargo || 'N/A' }}</td>
                  <td style="width: 25%; padding: 0px 2px;">{{ r.empresa || 'N/A' }}</td>
                  <td style="width: 20%; padding: 0px 2px;">{{ r.telefono || 'N/A' }}</td>
                </tr>
                <tr *ngIf="!form.get('referenciasLaborales')?.value?.length">
                  <td colspan="4" class="text-center italic text-muted">Sin referencias laborales</td>
                </tr>
              </table>

              <div class="fw-bold text-primary" style="font-size: 7pt; margin-bottom: 1px;">PERSONALES</div>
              <table class="print-table-mini w-100" style="font-size: 7pt; margin-bottom: 2px;">
                <tr *ngFor="let r of form.get('referenciasPersonales')?.value">
                  <td style="width: 35%; padding: 0px 2px;">• {{ r.nombre }}</td>
                  <td style="width: 20%; padding: 0px 2px;">{{ r.cargo || 'N/A' }}</td>
                  <td style="width: 25%; padding: 0px 2px;">{{ r.empresa || 'PERSONAL' }}</td>
                  <td style="width: 20%; padding: 0px 2px;">{{ r.telefono || 'N/A' }}</td>
                </tr>
                <tr *ngIf="!form.get('referenciasPersonales')?.value?.length">
                  <td colspan="4" class="text-center italic text-muted">Sin referencias personales</td>
                </tr>
              </table>

              <div *ngIf="form.get('familiaresEnEmpresa')?.value?.length">
                <div class="fw-bold text-primary" style="font-size: 7pt; margin-bottom: 1px;">VÍNCULOS EN EMPRESA</div>
                <table class="print-table-mini w-100" style="font-size: 7pt; margin-bottom: 2px;">
                  <tr *ngFor="let f of form.get('familiaresEnEmpresa')?.value">
                    <td style="width: 30%; padding: 0px 2px;">• {{ f.nombre }}</td>
                    <td style="width: 20%; padding: 0px 2px;">{{ f.parentesco }}</td>
                    <td style="width: 20%; padding: 0px 2px;">{{ f.empresa }}</td>
                    <td style="width: 15%; padding: 0px 2px;">{{ f.cargo }}</td>
                    <td style="width: 15%; padding: 0px 2px;">{{ f.telefono }}</td>
                  </tr>
                </table>
              </div>

              <div class="print-section-title mt-2">12. EXPERIENCIA LABORAL</div>
              <div style="font-size: 8pt;">
                <div *ngFor="let exp of form.get('experienciaLaboral.experiencias')?.value" class="print-exp-item border-bottom mb-1 pb-1">
                  <div class="fw-bold">{{ exp.empresa }} ({{ exp.area }})</div>
                  <div>Motivo: {{ exp.motivo_salida }} | Jefe: {{ exp.jefe_inmediato }} | Periodo: {{ exp.fecha_inicio | date:'dd/MM/yy' }} - {{ exp.actualmente ? 'Hoy' : (exp.fecha_fin | date:'dd/MM/yy') }}</div>
                </div>
                <div class="mt-1"><strong>Labores que domina o le gustaría realizar:</strong> {{ form.get('experienciaLaboral.descripcion_labores')?.value }}</div>
              </div>

              <div class="print-section-title mt-2">13. SALUD Y ANTECEDENTES</div>
              <div style="font-size: 8pt;">
                <div><strong>Cirugías/Fract/Accid/Quem:</strong> 
                  {{ form.get('saludPersonal.operaciones.detalle')?.value || 'N/A' }} / 
                  {{ form.get('saludPersonal.fracturas.detalle')?.value || 'N/A' }} / 
                  {{ form.get('saludPersonal.accidentes_laborales.detalle')?.value || 'N/A' }} /
                  {{ form.get('saludPersonal.quemaduras.detalle')?.value || 'N/A' }}
                </div>
                <div><strong>Otros Antecedentes:</strong> {{ form.get('saludPersonal.otros_antecedentes')?.value || 'Ninguno' }}</div>
                <div><strong>Ocio:</strong> Deporte: {{ form.get('saludPersonal.deporte')?.value || 'N/A' }} | Actividad Social: {{ form.get('saludPersonal.actividad_social')?.value || 'N/A' }}</div>
              </div>

              <div class="print-section-title mt-1">14. OBSERVACIONES (Últimas 5)</div>
              <div *ngIf="form.get('observaciones')?.value?.length">
                <div *ngFor="let obs of getObservacionesSlice()" class="border-bottom mb-1 pb-1" style="font-size: 8pt; line-height: 1.1;">
                  <div class="d-flex justify-content-between x-small" style="font-size: 7.5pt; color: #555;">
                    <span class="fw-bold">{{ obs.fecha | date:'dd/MM/yy' }} | {{ obs.tipo }}</span>
                    <span class="italic">Por: {{ obs.usuario }}</span>
                  </div>
                  <div style="word-break: break-all; margin-top: 1px;">{{ obs.comentario }}</div>
                </div>
              </div>
              <div class="x-small italic text-muted" *ngIf="!form.get('observaciones')?.value?.length">Sin observaciones registradas.</div>

              <!-- NUEVA SECCIÓN 13: AUDITORÍA -->
              <div class="print-section-title mt-1" style="font-size: 7.5pt; padding: 1px 6px; margin-bottom: 2px;">15. AUDITORÍA (CONTROL INTERNO)</div>
              <div class="small-box bg-light border-info-subtle p-1" style="font-size: 7pt; margin-bottom: 1px; line-height: 1.1;">
                <div class="print-field mb-0">
                  <span class="label">REGISTRO:</span> {{ (form.get('datosEntrevistador.entrevistador.nombre')?.value) || 'PENDIENTE' }} | 
                  <span class="label">Dep:</span> {{ (form.get('datosEntrevistador.entrevistador.grupo')?.value) || '---' }} | 
                  <span class="label">Fecha:</span> {{ (form.get('datosEntrevistador.entrevistador.fecha')?.value | date:'dd/MM/yy HH:mm') || '---' }}
                </div>
                
                <div class="border-top pt-1 mt-1" *ngIf="form.get('datosEntrevistador.aprobacion.estado')?.value === 'APROBADO'">
                  <div class="print-field mb-0">
                    <span class="label">APROBÓ:</span> {{ (form.get('datosEntrevistador.aprobacion.aprobado_por')?.value) || '---' }} | 
                    <span class="label">Dep:</span> {{ (form.get('datosEntrevistador.aprobacion.grupo')?.value) || '---' }} | 
                    <span class="label">Fecha:</span> {{ (form.get('datosEntrevistador.aprobacion.fecha')?.value | date:'dd/MM/yy HH:mm') || '---' }}
                  </div>
                </div>
                <div class="border-top pt-1 mt-1" *ngIf="form.get('datosEntrevistador.aprobacion.estado')?.value !== 'APROBADO'">
                  <div class="print-field italic text-muted x-small mb-0" style="font-size: 6.5pt;">
                    Estado: {{ (form.get('datosEntrevistador.aprobacion.estado')?.value) || 'PENDIENTE' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="print-signatures mt-auto pt-2 border-top">
            <div class="row text-center px-2">
              <div class="col-3">
                <div class="signature-line mx-auto mb-1"></div>
                <div class="x-small fw-bold">ADMINISTRADOR</div>
              </div>
              <div class="col-3">
                <div class="signature-line mx-auto mb-1"></div>
                <div class="x-small fw-bold">MANDO MEDIO</div>
                <div class="x-small">(Prueba)</div>
              </div>
              <div class="col-3">
                <div class="signature-line mx-auto mb-1"></div>
                <div class="x-small fw-bold">RR.HH.</div>
              </div>
              <div class="col-3">
                <div class="signature-line mx-auto mb-1"></div>
                <div class="x-small fw-bold">GERENTE</div>
              </div>
            </div>
          </div>

          <div class="print-footer mt-3 pt-2 border-top d-flex justify-content-between x-small" style="font-size: 8pt;">
            <span>Talento Humano</span>
            <strong>Página 2 de 2 (Cara B)</strong>
            <span>{{ form.get('codigo_solicitud')?.value }}</span>
          </div>
        </div>
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
    .x-small { font-size: 0.75rem; }

    /* ESTILOS DE IMPRESIÓN MEJORADOS */
    @media screen {
      .d-none-screen { display: none !important; }
    }

    @media print {
      body * { visibility: hidden; }
      #print-section, #print-section * { visibility: visible; }
      #print-section {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background: white !important;
        color: #000 !important;
      }
      .accordion-container, .header-glass, .btn, .alert, .nav-tabs, footer, header { display: none !important; }
      
      .print-page {
        min-height: 290mm;
        width: 210mm;
        padding: 8mm 15mm; /* Margen más relajado */
        display: flex;
        flex-direction: column;
        background: white !important;
      }
      
      .page-break { page-break-after: always; }
      
      .print-section-title {
        background: #e9ecef !important;
        -webkit-print-color-adjust: exact;
        font-weight: bold;
        padding: 3px 10px;
        margin-bottom: 6px;
        border-left: 5px solid #0d6efd;
        font-size: 10pt;
        text-transform: uppercase;
      }
      
      .print-field { margin-bottom: 4px; font-size: 9.5pt; line-height: 1.4; }
      .print-field .label { font-weight: bold; color: #000; }
      
      .print-grid-3 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 25px;
        margin-bottom: 25px;
      }
      
      .print-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 25px;
      }
 
      .small-box {
        border: 1px solid #ccc;
        padding: 8px;
        border-radius: 8px;
        font-size: 10pt;
        background: #fdfdfd !important;
        margin-bottom: 8px;
        -webkit-print-color-adjust: exact;
      }
      
      .print-table-mini { border-collapse: collapse; font-size: 9.5pt; width: 100%; }
      .print-table-mini th, .print-table-mini td {
        border-bottom: 1px solid #ddd;
        padding: 4px 6px;
        text-align: left;
        word-break: break-word;
      }
      .print-table-mini th { background: #f8f9fa !important; font-weight: bold; -webkit-print-color-adjust: exact; }
      
      .signature-line {
        width: 140px;
        border-bottom: 2px solid #000;
        margin-top: 25px;
      }
 
      .photo-box {
        width: 32mm;
        height: 42mm;
        border: 1px dashed #666;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 7pt;
        font-weight: bold;
        text-align: center;
        background: #fafafa !important;
        -webkit-print-color-adjust: exact;
      }
      
      .print-audit-bar {
        font-size: 8pt;
        color: #333;
        text-transform: uppercase;
      }

      .x-small { font-size: 8.5pt; }
      .italic { font-style: italic; }

      @page {
        size: A4;
        margin: 8mm;
      }
    }
  `]
})
export class VerSolicitudComponent implements OnInit {
  form!: FormGroup;
  solicitudId: number = 0;
  editMode: boolean = false;
  activeSections: Set<string> = new Set(['datosAdministrativos']);
  savingSection: string | null = null;
  isAprobado: boolean = false;
  currentDate: Date = new Date();

  get canPrint(): boolean {
    return true; // Habilitado para todos los estados sin restricciones
  }

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

  get nombreAspirante(): string {
    if (!this.form) return '';
    const dpCtrl = this.form.get('datosPersonales');
    if (!dpCtrl) return '';
    const dp = (dpCtrl as FormGroup).getRawValue();
    const full = `${dp.nombres || ''} ${dp.apellidoPaterno || ''} ${dp.apellidoMaterno || ''}`.trim();
    return full.toUpperCase();
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private thService: TalentoHumanoService,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.initForm();
    this.setupExperienceWatcher();
    this.setupCedulaWatcher();
    this.route.params.subscribe(params => {
      this.solicitudId = +params['id'];
      this.editMode = false; // Forzar vista de solo lectura al cambiar de ficha
      this.activeSections = new Set(['datosAdministrativos']); // Resetear acordeón
      this.cargarSolicitud(this.solicitudId);
    });
    this.setupEstadoCivilWatcher();
  }

  private setupExperienceWatcher() {
    this.form.get('experienciaLaboral.sin_experiencia')?.valueChanges.subscribe(sinExp => {
      const refLaborales = this.form.get('referenciasLaborales') as FormArray;
      if (sinExp) {
        refLaborales.setValidators(null);
        if (refLaborales.length > 0) {
          // Si marca que NO tiene experiencia, limpiamos las referencias si las hubiera
          while (refLaborales.length) refLaborales.removeAt(0);
        }
      } else {
        refLaborales.setValidators([CustomValidators.minArrayLength(1)]);
      }
      refLaborales.updateValueAndValidity();
    });
  }

  private setupCedulaWatcher() {
    this.form.get('datosPersonales.cedula')?.valueChanges.subscribe(cedula => {
      if (cedula && cedula.length === 10 && this.editMode) {
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

    this.thService.validarCedula(cedula, this.solicitudId).subscribe({
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
          // Restaurar valor original
          this.thService.getSolicitud(this.solicitudId).subscribe(s => {
            if (s && s.datosPersonales) {
              this.form.get('datosPersonales.cedula')?.setValue(s.datosPersonales.cedula, { emitEvent: false });
            }
          });
          return;
        }

        // 2. Validar Existencia Local
        if (res.exists) {
          Swal.fire({
            title: '¡Cédula en Uso!',
            html: `Este número de cédula ya pertenece a otra solicitud:<br><br>
                   <b>Aspirante:</b> ${res.solicitud.nombre_completo}<br>
                   <b>Código:</b> ${res.solicitud.codigo}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '<i class="bi bi-eye"></i> Ir a esa Ficha',
            cancelButtonText: 'Mantener actual',
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#6c757d',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/solicitud-empleo/pages/verSolicitud', res.solicitud.id]);
            } else {
              this.thService.getSolicitud(this.solicitudId).subscribe(s => {
                if (s && s.datosPersonales) {
                  this.form.get('datosPersonales.cedula')?.setValue(s.datosPersonales.cedula, { emitEvent: false });
                }
              });
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

  shouldShowSaveButton(sectionId: string): boolean {
    if (sectionId === 'referenciasLaborales') {
      return this.form.get('experienciaLaboral.sin_experiencia')?.value === false;
    }
    return true;
  }

  toggleEdit() {
    if (this.isAprobado) return;
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.form.enable();
      // Bloquear campos que siempre deben ser de solo lectura
      this.form.get('codigo_solicitud')?.disable();
      this.form.get('datosAdministrativos.control_interno')?.disable();
      this.form.get('datosEntrevistador')?.disable();
    } else {
      this.form.disable();
      this.cargarSolicitud(this.solicitudId);
    }
  }

  initForm() {
    this.form = this.fb.group({
      codigo_solicitud: [''],
      datosAdministrativos: this.fb.group({
        company_id: [null, Validators.required],
        company_name: [''],
        area: ['', Validators.required],
        labor: ['', Validators.required],
        fechaIngreso: ['', Validators.required],
        banking_info: this.fb.group({
          usa_banco_guayaquil: [null, Validators.required],
          numero_cuenta: ['', [Validators.required, Validators.pattern(/^\d{10,13}$/)]],
          confirmacion_cuenta: ['', Validators.required],
          tipo_cuenta: ['', Validators.required],
          titular: ['', [
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
          recorrido: ['', Validators.required],
          recorrido_otro: ['', [
            Validators.required,
            Validators.maxLength(100),
            Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.]*$/)
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
        cantonNacimiento: ['', Validators.required],
        cantonNacimientoOtro: ['', [
            Validators.maxLength(100),
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/),
            CustomValidators.noWhitespace
        ]],
        cantonCodigo: [null],
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
        fechaNacimiento: ['', Validators.required],
        edad: [''],
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
        afiliadoIess: [null, Validators.required]
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
      referenciasLaborales: this.fb.array([]),
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
          nombre: [''],
          grupo: [''],
          fecha: [null]
        }),
        aprobacion: this.fb.group({
          estado: ['PENDIENTE'],
          aprobado_por: [''],
          grupo: [''],
          fecha: [null]
        })
      })
    });
    this.form.disable();
  }

  cargarSolicitud(id: number) {
    this.thService.getSolicitud(id).subscribe(data => {
      if (data) {
        // Pre-poblar los FormArrays antes de hacer patchValue
        if (data.datosFamiliares) {
          this.populateArray('datosFamiliares.hermanos', data.datosFamiliares.hermanos, (h) => this.fb.group({
            nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/), CustomValidators.noWhitespace]],
            genero: [h?.genero || 'MASCULINO', Validators.required],
            estado: [h?.estado || 'VIVO', Validators.required],
            edad: [h?.edad || null],
            domicilio: [h?.domicilio || ''],
            ocupacion: [h?.ocupacion || '']
          }));
          this.populateArray('datosFamiliares.hijos', data.datosFamiliares.hijos, () => this.fb.group({
            nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/), CustomValidators.noWhitespace]],
            edad: [null, [Validators.required, Validators.min(0), Validators.max(120)]],
            ocupacion: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/), CustomValidators.noWhitespace]],
            discapacidad: [false, Validators.required],
            descripcion_discapacidad: ['']
          }));
          this.populateArray('datosFamiliares.conyuges_anteriores', data.datosFamiliares.conyuges_anteriores, () => this.fb.group({
            nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/), CustomValidators.noWhitespace]],
            edad: [null, [Validators.required, Validators.min(0), Validators.max(120)]],
            ocupacion: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/), CustomValidators.noWhitespace]]
          }));
        }
        if (data.datosEducativos?.cursos) {
          this.populateArray('datosEducativos.cursos', data.datosEducativos.cursos, () => this.fb.group({
            nombre: ['', [Validators.required, Validators.maxLength(150)]],
            institucion: ['', [Validators.required, Validators.maxLength(150)]],
            duracion: [null, [Validators.required, Validators.min(1)]],
            anio: [null, [Validators.required, Validators.pattern(/^\d{4}$/)]]
          }));
        }
        if (data.experienciaLaboral?.experiencias) {
          this.populateArray('experienciaLaboral.experiencias', data.experienciaLaboral.experiencias, () => this.fb.group({
            empresa: ['', [Validators.required, Validators.maxLength(100)]],
            area: ['', [Validators.required]],
            jefe_inmediato: ['', [Validators.maxLength(80)]],
            fecha_inicio: [null, Validators.required],
            fecha_fin: [null],
            actualmente: [false],
            motivo_salida: ['', [Validators.required, Validators.maxLength(200)]]
          }));
        }
        if (data.referenciasLaborales) {
          this.populateArray('referenciasLaborales', data.referenciasLaborales, () => this.fb.group({
            empresa: ['', [Validators.required, CustomValidators.noWhitespace]],
            nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/), CustomValidators.noWhitespace]],
            cargo: ['', [Validators.required, CustomValidators.noWhitespace]],
            telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]]
          }));
        }
        if (data.referenciasPersonales) {
          this.populateArray('referenciasPersonales', data.referenciasPersonales, () => this.fb.group({
            nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/), CustomValidators.noWhitespace]],
            cargo: ['', [Validators.required, CustomValidators.noWhitespace]],
            empresa: ['', [Validators.required, CustomValidators.noWhitespace]],
            telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]]
          }));
        }
        if (data.familiaresEnEmpresa) {
          this.populateArray('familiaresEnEmpresa', data.familiaresEnEmpresa, () => this.fb.group({
            nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/), CustomValidators.noWhitespace]],
            empresa: ['', [Validators.required, CustomValidators.noWhitespace]],
            cargo: ['', [Validators.required, CustomValidators.noWhitespace]],
            parentesco: ['', [Validators.required, CustomValidators.noWhitespace]],
            telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]]
          }));
        }
        if (data.observaciones) {
          this.populateArray('observaciones', data.observaciones, () => this.fb.group({
            id: [null], tipo: [''], comentario: [''], fecha: [null], usuario: ['']
          }));
        }

        this.form.patchValue(data);

        // FIX: Poblar campo de confirmación para que el validador no marque error en modo lectura
        if (data.datosAdministrativos?.banking_info?.numero_cuenta) {
          this.form.get('datosAdministrativos.banking_info.confirmacion_cuenta')?.setValue(
            data.datosAdministrativos.banking_info.numero_cuenta,
            { emitEvent: false }
          );
        }
        this.isAprobado = data.datosEntrevistador?.aprobacion?.estado === 'APROBADO';

        // Asegurar que el formulario esté en el estado correcto
        if (!this.editMode || this.isAprobado) {
          this.form.disable();
        } else {
          this.form.enable();
          this.form.get('codigo_solicitud')?.disable();
          this.form.get('datosAdministrativos.control_interno')?.disable();
          this.form.get('datosEntrevistador')?.disable();
        }

        this.form.markAsPristine();
      }
    });
  }

  private populateArray(path: string, elements: any[], factory: (data?: any) => FormGroup) {
    const array = this.form.get(path) as FormArray;
    if (!array || !elements) return;
    while (array.length) array.removeAt(0);
    elements.forEach(item => array.push(factory(item)));
  }

  getGroup(name: string): FormGroup {
    return this.form.get(name) as FormGroup;
  }

  getObservacionesSlice() {
    const obs = this.form.get('observaciones')?.value;
    if (!Array.isArray(obs)) return [];
    
    // Clonar para no mutar el original
    const sorted = [...obs].sort((a, b) => {
      // Prioridad 1: Fecha (ISO string comparison)
      const dateA = a.fecha || '';
      const dateB = b.fecha || '';
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      
      // Prioridad 2: ID (Numérico)
      return (a.id || 0) - (b.id || 0);
    });

    return sorted.slice(-5);
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
    const controlsToValidate = [sectionId];

    // CASO ESPECIAL: La sección 10 incluye dos arrays independientes en el formulario
    if (sectionId === 'referenciasPersonales') {
      controlsToValidate.push('familiaresEnEmpresa');
    }

    let invalidFields: string[] = [];
    let isInvalid = false;

    controlsToValidate.forEach(id => {
      const control = this.form.get(id);
      if (control && control.invalid) {
        isInvalid = true;
        control.markAllAsTouched();
        this.getInvalidFieldsFromControl(control, id, invalidFields);
      }
    });

    if (isInvalid) {
      const fieldsList = `\n\nCampos faltantes o inválidos:\n• ${invalidFields.join('\n• ')}`;

      Swal.fire({
        icon: 'warning',
        title: 'Formulario Incompleto',
        text: 'Por favor complete todos los campos obligatorios de esta sección.' + fieldsList,
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    this.savingSection = sectionId;
    const formValue = this.form.getRawValue();
    const dataToSend: any = { [sectionId]: formValue[sectionId] };

    // Para secciones con arrays que no están anidados en un grupo (aunque sectionId ya lo cubra)
    const specialArrays = ['referenciasLaborales', 'referenciasPersonales', 'familiaresEnEmpresa', 'observaciones'];
    if (specialArrays.includes(sectionId)) {
      dataToSend[sectionId] = formValue[sectionId];
    }

    if (sectionId === 'referenciasPersonales') {
      dataToSend['familiaresEnEmpresa'] = formValue['familiaresEnEmpresa'];
    }

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
        });
      }
    });
  }

  imprimirFicha() {
    // Obtener el código de la solicitud o un nombre genérico
    const codigo = this.form.get('codigo_solicitud')?.value || `Solicitud_${this.solicitudId}`;
    
    // Guardar el título original de la página
    const originalTitle = document.title;
    
    // Cambiar temporalmente el título al código para la descarga PDF
    document.title = codigo;
    
    // Activar impresión (con un pequeño delay para que el navegador registre el DOM title)
    setTimeout(() => {
      this.currentDate = new Date();
      window.print();
      
      // Restaurar el título después de cerrar el diálogo de impresión
      document.title = originalTitle;
    }, 50);
  }

  accountMatchValidator(group: FormGroup) {
    const cuenta = group.get('numero_cuenta')?.value;
    const confirmacion = group.get('confirmacion_cuenta')?.value;
    return (cuenta && confirmacion && cuenta === confirmacion) ? null : { mismatch: true };
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

    // Validaciones de grupo (mismatch)
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
    tieneDiscapacidad: '¿Tiene Discapacidad?',
    discapacidadDetalle: 'Detalle de Discapacidad',
    discapacidadPorcentaje: 'Porcentaje de Discapacidad',
    correo: 'Correo Electrónico',
    telefono_principal: 'Teléfono Principal',
    telefono_secundario: 'Teléfono Secundario',
    telefono_emergencia: 'Teléfono de Emergencia',
    nombre_contacto_emergencia: 'Nombre de Contacto de Emergencia',
    parentesco_contacto_emergencia: 'Parentesco de Contacto de Emergencia',
    nivel_maximo: 'Nivel de Instrucción Máximo',
    institucion: 'Institución',
    anio: 'Año',
    titulo: 'Título',
    ultimo_grado: 'Último Grado Aprobado',
    carrera_programa: 'Carrera / Programa',
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

  regresar() {
    this.router.navigate(['/solicitud-empleo/pages/listaSolicitudes']);
  }
}
