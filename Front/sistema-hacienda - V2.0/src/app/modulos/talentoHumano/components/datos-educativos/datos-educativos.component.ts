import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-datos-educativos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="card mb-4 shadow-sm border-0 animate-fade">
      <div class="card-header bg-primary text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-mortarboard me-2"></i>7. Datos Educativos <small class="ms-2 fw-normal opacity-75"></small></h5>
      </div>
      <div class="card-body p-4">
        
        <!-- NIVEL MÁXIMO ALCANZADO (Categorización Ecuatoriana) -->
        <div class="p-4 bg-light border-start border-5 border-primary rounded-4 mb-4 shadow-sm">
          <label class="form-label fw-bold d-flex align-items-center mb-3 text-primary fs-5">
            <i class="bi bi-award-fill me-2"></i> Seleccione el nivel educativo <span class="text-danger ms-1 small">*</span>
          </label>          <select class="form-select form-select-lg border-2 border-primary border-opacity-25 rounded-4 shadow-sm" 
                  formControlName="nivel_maximo" (change)="onNivelMaximoChange()" [attr.disabled]="isReadOnly ? true : null">
            <option value="" disabled selected>Seleccione nivel educativo</option>
            <option value="NINGUNO">Sin estudios / No tiene instrucción</option>
            <option value="INICIAL">Educación Inicial</option>
            <option value="BASICA_COMPLETA">Educación General Básica (EGB)</option>
            <option value="BACHILLERATO_COMPLETO">Bachillerato (BGU)</option>
            <option value="TERCER_NIVEL">Educación Superior (Grado)</option>
            <option value="MAESTRIA">Educación Superior (Posgrado)</option>
          </select>
          <div class="invalid-feedback">Debe seleccionar su nivel educativo máximo para continuar.</div>
          <div class="form-text mt-3 alert alert-warning border-0 bg-transparent p-0 small">
            <i class="bi bi-info-circle-fill me-2"></i> El formulario mostrará solo la sección correspondiente a su nivel seleccionado.
          </div>
        </div>

        <!-- ALERTA DE VALIDACIÓN DE GRUPO -->
        <div class="alert alert-danger border-0 shadow-sm rounded-4 mb-4 d-flex align-items-center animate-shake" 
             *ngIf="form.errors?.['minEducationRequired'] && form.get('nivel_maximo')?.touched">
          <i class="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
          <div>
            <h6 class="mb-1 fw-bold">Inconsistencia en Datos Educativos</h6>
            <p class="mb-0 small">Ha seleccionado <strong>{{ getSelectedNivelLabel() }}</strong>, pero no ha ingresado los datos del título o registros correspondientes en los campos obligatorios superiores.</p>
          </div>
        </div>

        <div class="row g-4">
          
          <!-- EDUCACIÓN INICIAL -->
          <div class="col-12" formGroupName="inicial" *ngIf="shouldShowSection('inicial')">
            <div class="p-3 border rounded-3 bg-white border-primary border-opacity-25 shadow-sm animate-fade">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold text-primary mb-0"><i class="bi bi-balloon me-2"></i> EDUCACIÓN INICIAL</h6>
                <button type="button" class="btn btn-link text-danger p-0 border-0" *ngIf="!isReadOnly" 
                        (click)="limpiarSeccion('inicial')" title="Eliminar Educación Inicial">
                  <i class="bi bi-trash-fill fs-5"></i>
                </button>
              </div>
              <div class="row g-3">
                <div class="col-md-9">
                  <label class="form-label small fw-semibold">Nombre de la Institución (CIBV / CNH / Escuela) <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="institucion" placeholder="Ej: Jardín de Infantes..." 
                         (input)="sanitizeAndCapitalize('inicial.institucion')" (blur)="trimField('inicial.institucion')"
                         [class.is-invalid]="isInvalid('inicial.institucion')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">El nombre de la institución es obligatorio.</div>
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-semibold">Año <span class="text-danger">*</span></label>
                  <input type="number" class="form-control" formControlName="anio" placeholder="20XX"
                         (input)="cleanNumbers('inicial.anio', 4)" [class.is-invalid]="isInvalid('inicial.anio')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">Año obligatorio (4 dígitos).</div>
                </div>
              </div>
            </div>
          </div>

          <!-- EDUCACIÓN GENERAL BÁSICA (EGB) -->
          <div class="col-12" formGroupName="basica" *ngIf="shouldShowSection('basica')">
            <div class="p-3 border rounded-3 bg-white border-primary border-opacity-25 shadow-sm animate-fade">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold text-primary mb-0"><i class="bi bi-book me-2"></i> EDUCACIÓN GENERAL BÁSICA (EGB)</h6>
                <button type="button" class="btn btn-link text-danger p-0 border-0" *ngIf="!isReadOnly" 
                        (click)="limpiarSeccion('basica')" title="Eliminar Educación Básica">
                  <i class="bi bi-trash-fill fs-5"></i>
                </button>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Nombre de la Institución <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="institucion" placeholder="Ej: Unidad Educativa..." 
                         (input)="sanitizeAndCapitalize('basica.institucion')" (blur)="trimField('basica.institucion')"
                         [class.is-invalid]="isInvalid('basica.institucion')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">Institución obligatoria.</div>
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-semibold">Último Grado Aprobado <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="ultimo_grado" placeholder="Ej: 10mo EGB"
                         (blur)="trimField('basica.ultimo_grado')" [class.is-invalid]="isInvalid('basica.ultimo_grado')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">Grado obligatorio.</div>
                </div>
                <div class="col-md-2">
                  <label class="form-label small fw-semibold">Año <span class="text-danger">*</span></label>
                  <input type="number" class="form-control" formControlName="anio" placeholder="20XX"
                         (input)="cleanNumbers('basica.anio', 4)" [class.is-invalid]="isInvalid('basica.anio')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">Año obligatorio.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- BACHILLERATO (BGU) -->
          <div class="col-12" formGroupName="bachillerato" *ngIf="shouldShowSection('bachillerato')">
            <div class="p-3 border rounded-3 bg-white border-primary border-opacity-25 shadow-sm animate-fade">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold text-primary mb-0"><i class="bi bi-mortarboard me-2"></i> BACHILLERATO (BGU)</h6>
                <button type="button" class="btn btn-link text-danger p-0 border-0" *ngIf="!isReadOnly" 
                        (click)="limpiarSeccion('bachillerato')" title="Eliminar Bachillerato">
                  <i class="bi bi-trash-fill fs-5"></i>
                </button>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Nombre de la Institución <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="institucion" placeholder="Ej: Colegio Militar..." 
                         (input)="sanitizeAndCapitalize('bachillerato.institucion')" (blur)="trimField('bachillerato.institucion')"
                         [class.is-invalid]="isInvalid('bachillerato.institucion')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">Institución obligatoria.</div>
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-semibold">Título de Bachiller en... <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="titulo" 
                         placeholder="Ej: Ciencias / Técnico en Contabilidad" 
                         (input)="cleanLetters('bachillerato.titulo')" (blur)="trimField('bachillerato.titulo')"
                         [class.is-invalid]="isInvalid('bachillerato.titulo')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">Título obligatorio.</div>
                </div>
                <div class="col-md-2">
                  <label class="form-label small fw-semibold">Año <span class="text-danger">*</span></label>
                  <input type="number" class="form-control" formControlName="anio" placeholder="20XX"
                         (input)="cleanNumbers('bachillerato.anio', 4)" [class.is-invalid]="isInvalid('bachillerato.anio')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">Año obligatorio.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- EDUCACIÓN SUPERIOR - GRADO (TERCER NIVEL) -->
          <div class="col-12" formGroupName="superior" *ngIf="shouldShowSection('superior')">
            <div class="p-3 border border-success border-opacity-25 rounded-3 bg-success bg-opacity-10 shadow-sm animate-fade">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center">
                  <h6 class="fw-bold text-success mb-0"><i class="bi bi-mortarboard-fill me-2 fs-5"></i> EDUCACIÓN SUPERIOR (GRADO)</h6>
                  <button type="button" class="btn btn-link text-danger ms-3 p-0 border-0" *ngIf="!isReadOnly" 
                          (click)="limpiarSeccion('superior')" title="Eliminar Educación de Grado">
                    <i class="bi bi-trash-fill fs-5"></i>
                  </button>
                </div>
                <div class="d-flex gap-2">
                  <span class="badge bg-primary bg-opacity-75 px-3 py-2 rounded-pill fw-bold">{{ form.get('superior.nivel')?.value || 'GRADO' }}</span>
                </div>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Nombre de la Institución Superior <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="institucion" placeholder="Ej: Universidad de las Artes" 
                         (input)="sanitizeAndCapitalize('superior.institucion')" (blur)="trimField('superior.institucion')"
                         [class.is-invalid]="isInvalid('superior.institucion')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">Institución superior obligatoria.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Carrera / Programa de Estudio <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="carrera_programa" 
                         placeholder="Ej: Licenciatura en..." (input)="cleanLetters('superior.carrera_programa')" 
                         (blur)="trimField('superior.carrera_programa')" [class.is-invalid]="isInvalid('superior.carrera_programa')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">Carrera obligatoria.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Estado de Estudios <span class="text-danger">*</span></label>
                  <div class="d-flex gap-3 mt-1">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" value="GRADUADO" formControlName="estado" id="estGrad" [attr.disabled]="isReadOnly ? true : null">
                      <label class="form-check-label small" for="estGrad">Graduado/a</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" value="CURSANDO" formControlName="estado" id="estCurs" [attr.disabled]="isReadOnly ? true : null">
                      <label class="form-check-label small" for="estCurs">En curso</label>
                    </div>
                  </div>
                  <div class="text-danger extreme-small mt-1" *ngIf="isInvalid('superior.estado')">Debe seleccionar un estado.</div>
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-semibold">Año de Término / Graduación <span class="text-danger">*</span></label>
                  <input type="number" class="form-control" formControlName="anio" placeholder="20XX"
                         (input)="cleanNumbers('superior.anio', 4)" [class.is-invalid]="isInvalid('superior.anio')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">Año obligatorio.</div>
                  <div class="form-text small mt-1 text-primary" *ngIf="!isReadOnly">
                    <i class="bi bi-info-circle me-1"></i> Ingrese el año de graduación o la fecha tentativa si está cursando.
                  </div>
                </div>
                <div class="col-12" *ngIf="!isReadOnly">
                   <div class="form-text small alert alert-info py-2 px-3 border-0 bg-white bg-opacity-50 rounded-3">
                     <i class="bi bi-info-circle-fill me-2"></i> <strong>Nota:</strong> El registro de estudios superiores asume bachillerato completo.
                   </div>
                </div>
              </div>
            </div>
          </div>

          <!-- EDUCACIÓN SUPERIOR - POSGRADO (CUARTO NIVEL) -->
          <div class="col-12" formGroupName="superior_posgrado" *ngIf="shouldShowSection('superior_posgrado')">
            <div class="p-3 border border-dark border-opacity-25 rounded-3 bg-dark bg-opacity-10 shadow-sm animate-fade">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center">
                  <h6 class="fw-bold text-dark mb-0"><i class="bi bi-mortarboard-fill me-2 fs-5"></i> EDUCACIÓN SUPERIOR (POSGRADO)</h6>
                  <button type="button" class="btn btn-link text-danger ms-3 p-0 border-0" *ngIf="!isReadOnly" 
                          (click)="limpiarSeccion('superior_posgrado')" title="Eliminar Educación de Posgrado">
                    <i class="bi bi-trash-fill fs-5"></i>
                  </button>
                </div>
                <span class="badge bg-secondary px-3 py-2 rounded-pill fw-bold">POSGRADO / 4TO NIVEL</span>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Nombre de la Institución Superior <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="institucion" placeholder="Ej: Universidad..." 
                         (input)="sanitizeAndCapitalize('superior_posgrado.institucion')" (blur)="trimField('superior_posgrado.institucion')"
                         [class.is-invalid]="isInvalid('superior_posgrado.institucion')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">Institución obligatoria.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Maestría / Doctorado / Especialidad <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="carrera_programa" 
                         placeholder="Ej: Magíster en..." (input)="cleanLetters('superior_posgrado.carrera_programa')" 
                         (blur)="trimField('superior_posgrado.carrera_programa')" [class.is-invalid]="isInvalid('superior_posgrado.carrera_programa')" [readonly]="isReadOnly">
                  <div class="invalid-feedback">Programa obligatorio.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Estado de Estudios <span class="text-danger">*</span></label>
                  <div class="d-flex gap-3 mt-1">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" value="GRADUADO" formControlName="estado" id="posGrad" [attr.disabled]="isReadOnly ? true : null">
                      <label class="form-check-label small" for="posGrad">Título Obtenido</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" value="CURSANDO" formControlName="estado" id="posCurs" [attr.disabled]="isReadOnly ? true : null">
                      <label class="form-check-label small" for="posCurs">En curso / Tesis</label>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-semibold">Año de Término <span class="text-danger">*</span></label>
                  <input type="number" class="form-control" formControlName="anio" placeholder="20XX"
                         (input)="cleanNumbers('superior_posgrado.anio', 4)" [class.is-invalid]="isInvalid('superior_posgrado.anio')" [readonly]="isReadOnly">
                </div>
              </div>
            </div>
          </div>

          <!-- CURSOS Y SEMINARIOS -->
          <div class="col-12 mt-4">
             <!-- (Manteniendo mismo diseño de cursos previo para consistencia) -->
             <div class="p-4 border border-warning border-opacity-25 rounded-4 bg-white shadow-sm">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h6 class="fw-bold text-dark mb-0 fs-5"><i class="bi bi-patch-check-fill text-warning me-2"></i>Cursos y Seminarios Realizados</h6>
                  <small class="text-primary fw-semibold"><i class="bi bi-info-circle me-1"></i> Recomendación: Ingrese un máximo de 5 cursos para un formato de impresión óptimo.</small>
                </div>
                <button type="button" class="btn btn-primary btn-sm fw-bold px-4 rounded-pill shadow-sm d-flex align-items-center" (click)="addCurso()" *ngIf="!isReadOnly">
                  <i class="bi bi-plus-circle me-2 fs-6"></i> Agregar Curso
                </button>
              </div>

              <div *ngIf="cursos.length === 0" class="text-center py-5 border border-dashed rounded-3 bg-light opacity-75">
                <i class="bi bi-journal-text fs-1 text-muted mb-3 d-block"></i>
                <p class="mb-0 text-muted fw-semibold">No ha registrado capacitaciones adicionales.</p>
                <small class="text-secondary">Si posee cursos relevantes, agréguelos aquí.</small>
              </div>

              <div [formArrayName]="'cursos'">
                <div *ngFor="let curso of cursos.controls; let i=index" [formGroupName]="i" 
                     class="curso-card border rounded-4 p-4 mb-4 bg-white shadow-sm position-relative animate-fade animate-shake"
                     [class.border-warning]="isInvalidInArray(cursos, i, 'nombre') || isInvalidInArray(cursos, i, 'institucion')">
                  
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <span class="badge bg-warning text-dark border border-warning border-opacity-50 px-3 rounded-pill fw-bold">CAPACITACIÓN #{{i+1}}</span>
                    <button type="button" class="btn btn-link text-danger text-decoration-none fw-bold d-flex align-items-center p-0" (click)="removeCurso(i)" *ngIf="!isReadOnly">
                      <i class="bi bi-trash-fill me-2 fs-6"></i>
                      <span class="small">Eliminar Registro</span>
                    </button>
                  </div>
                  <div class="row g-3">
                    <div class="col-md-5">
                      <label class="form-label small fw-bold text-secondary">Nombre del Curso / Taller <span class="text-danger">*</span></label>
                       <input type="text" class="form-control form-control-sm" formControlName="nombre" 
                              placeholder="Ej: Atención al Cliente" (input)="cleanInArray(cursos, i, 'nombre', 'LETTERS')" 
                              (blur)="trimFieldInArray(cursos, i, 'nombre')"
                              [class.is-invalid]="isInvalidInArray(cursos, i, 'nombre')"
                              [readonly]="isReadOnly">
                       <div class="invalid-feedback">Nombre obligatorio.</div>
                    </div>
                    <div class="col-md-3">
                      <label class="form-label small fw-bold text-secondary">Institución <span class="text-danger">*</span></label>
                       <input type="text" class="form-control form-control-sm" formControlName="institucion" placeholder="Ej: SENA / SECAP" 
                              (blur)="trimFieldInArray(cursos, i, 'institucion')"
                              [class.is-invalid]="isInvalidInArray(cursos, i, 'institucion')"
                              [readonly]="isReadOnly">
                       <div class="invalid-feedback">Institución obligatoria.</div>
                    </div>
                    <div class="col-md-2">
                      <label class="form-label small fw-bold text-secondary">Duración (Hs) <span class="text-danger">*</span></label>
                       <input type="number" class="form-control form-control-sm" formControlName="duracion" 
                              placeholder="0" (input)="cleanInArray(cursos, i, 'duracion', 'NUMBERS')" 
                              [class.is-invalid]="isInvalidInArray(cursos, i, 'duracion')"
                              [readonly]="isReadOnly">
                       <div class="invalid-feedback">Obligatorio.</div>
                    </div>
                    <div class="col-md-2">
                      <label class="form-label small fw-bold text-secondary">Año <span class="text-danger">*</span></label>
                       <input type="number" class="form-control form-control-sm" formControlName="anio" 
                              placeholder="20XX" (input)="cleanInArray(cursos, i, 'anio', 'NUMBERS', 4)" 
                              [class.is-invalid]="isInvalidInArray(cursos, i, 'anio')"
                              [readonly]="isReadOnly">
                       <div class="invalid-feedback">Obligatorio.</div>
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
    .form-control:focus, .form-select:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, .1); }
    .animate-fade { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .border-dashed { border-style: dashed !important; border-width: 2px !important; }
    .curso-card { transition: all 0.2s ease; }
    .curso-card:hover { transform: scale(1.005); border-color: #ffc107 !important; }
    .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; transform: translate3d(0, 0, 0); backface-visibility: hidden; perspective: 1000px; }
    @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
    input[type="text"] { text-transform: uppercase; }
    input[type="text"]::placeholder { text-transform: none; }
    .extreme-small { font-size: 0.75rem; }
  `]
})
export class DatosEducativosComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() isReadOnly: boolean = false;

  private readonly LETTERS_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/;
  private readonly YEAR_PATTERN = /^\d{4}$/;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Escuchar cambios en nivel_maximo para actualizar validadores dinámicamente
    // Útil para cuando el formulario se carga vía patchValue (modo edición / borrador)
    this.form.get('nivel_maximo')?.valueChanges.subscribe(() => {
      this.updateSectionValidators();
    });

    // Ejecutar una vez al inicio
    this.updateSectionValidators();
  }

  get cursos() {
    return this.form.get('cursos') as FormArray;
  }

  addCurso() {
    const cursoGroup = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(this.LETTERS_PATTERN)]],
      institucion: ['', [Validators.required, Validators.maxLength(150)]],
      duracion: [null, [Validators.required, Validators.min(1)]],
      anio: [null, [Validators.required, Validators.pattern(this.YEAR_PATTERN)]]
    });
    this.cursos.push(cursoGroup);
    this.cdr.detectChanges();
    this.scrollToLast('.curso-card', 'Curso agregado al final de la lista');
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

  removeCurso(index: number) {
    this.cursos.removeAt(index);
    this.cdr.detectChanges();
  }

  onNivelMaximoChange() {
    const nivelMax = this.form.get('nivel_maximo')?.value;
    const superiorGroup = this.form.get('superior');
    const bachilleratoGroup = this.form.get('bachillerato');

    if (nivelMax === 'NINGUNO' || !nivelMax) {
      this.limpiarTodo();
      this.form.updateValueAndValidity();
    } else if (this.isSuperiorVisible()) {
      superiorGroup?.get('tipo')?.setValue(this.getTipoSuperior(), { emitEvent: false });
      superiorGroup?.get('nivel')?.setValue(this.getSelectedNivelLabel(), { emitEvent: false });
    }
    this.updateSectionValidators();
    this.cdr.detectChanges();
  }

  limpiarTodo() {
    const sections = ['inicial', 'basica', 'bachillerato', 'superior', 'superior_posgrado'];
    sections.forEach(s => {
      const group = this.form.get(s) as FormGroup;
      if (group) {
        group.patchValue({
          institucion: '',
          anio: null,
          grado: '',
          ultimo_grado: '',
          titulo: '',
          carrera_programa: '',
          estado: '',
          tipo: '',
          nivel: ''
        }, { emitEvent: false });
        group.reset(group.value, { emitEvent: false });
      }
    });
    const cursos = this.cursos;
    while (cursos.length) {
      cursos.removeAt(0);
    }
    this.cdr.detectChanges();
  }

  private updateSectionValidators() {
    const nivel = this.form.get('nivel_maximo')?.value;
    const sections = ['inicial', 'basica', 'bachillerato', 'superior', 'superior_posgrado'];

    // Limpiar todos primero
    sections.forEach(s => {
      const group = this.form.get(s) as FormGroup;
      if (!group) return;
      Object.keys(group.controls).forEach(key => {
        const control = group.get(key);
        control?.clearValidators();
        // Mantener patrones básicos si existen
        if (key === 'anio') control?.setValidators([Validators.pattern(this.YEAR_PATTERN)]);
        control?.updateValueAndValidity({ emitEvent: false });
      });
    });

    // Activar según nivel
    if (nivel === 'INICIAL') {
      this.setRequired('inicial', ['institucion', 'anio']);
    } else if (nivel === 'BASICA_INCOMPLETA' || nivel === 'BASICA_COMPLETA') {
      this.setRequired('basica', ['institucion', 'ultimo_grado', 'anio']);
    } else if (nivel === 'BACHILLERATO_INCOMPLETO' || nivel === 'BACHILLERATO_COMPLETO') {
      this.setRequired('bachillerato', ['institucion', 'titulo', 'anio']);
    } else if (this.isSuperiorVisible()) {
      if (['MAESTRIA', 'DOCTORADO'].includes(nivel)) {
        this.setRequired('superior_posgrado', ['institucion', 'carrera_programa', 'estado', 'anio']);
      } else {
        this.setRequired('superior', ['institucion', 'carrera_programa', 'estado', 'anio']);
      }
    }
  }

  private setRequired(groupName: string, fields: string[]) {
    const group = this.form.get(groupName) as FormGroup;
    fields.forEach(f => {
      const control = group.get(f);
      const existingValidators = control?.validator ? [control.validator] : [];
      control?.setValidators([Validators.required, ...existingValidators]);
      control?.updateValueAndValidity({ emitEvent: false });
    });
  }

  isSectionVisible(section: 'INICIAL' | 'BASICA' | 'BACHILLERATO' | 'SUPERIOR' | 'SUPERIOR_POSGRADO'): boolean {
    const nivel = this.form.get('nivel_maximo')?.value;
    if (!nivel || nivel === 'NINGUNO') return false;

    // Jerarquía de niveles para visibilidad acumulativa
    const jerarquia = {
      'INICIAL': 1,
      'BASICA_INCOMPLETA': 2,
      'BASICA_COMPLETA': 2,
      'BACHILLERATO_INCOMPLETO': 3,
      'BACHILLERATO_COMPLETO': 3,
      'TECNICO_TECNOLOGO': 4,
      'TERCER_NIVEL': 4,
      'ESPECIALISTA': 4,
      'MAESTRIA': 5,
      'DOCTORADO': 5
    };

    const nivelActual = (jerarquia as any)[nivel] || 0;

    if (section === 'INICIAL') return nivelActual >= 1;
    if (section === 'BASICA') return nivelActual >= 2;
    if (section === 'BACHILLERATO') return nivelActual >= 3;
    if (section === 'SUPERIOR') return nivelActual >= 4;
    if (section === 'SUPERIOR_POSGRADO') return nivelActual >= 5;

    return false;
  }

  isSuperiorVisible(): boolean {
    const nivel = this.form.get('nivel_maximo')?.value;
    const nivelesSuperiores = ['TECNICO_TECNOLOGO', 'TERCER_NIVEL', 'ESPECIALISTA', 'MAESTRIA', 'DOCTORADO'];
    return nivelesSuperiores.includes(nivel);
  }

  shouldShowSection(sectionName: string): boolean {
    const labelMapping: any = {
      'inicial': 'INICIAL',
      'basica': 'BASICA',
      'bachillerato': 'BACHILLERATO',
      'superior': 'SUPERIOR',
      'superior_posgrado': 'SUPERIOR_POSGRADO'
    };

    // 1. Si no tiene estudios, no mostrar nada
    const nivelActual = this.form.get('nivel_maximo')?.value;
    if (nivelActual === 'NINGUNO') return false;

    // 2. Mostrar siempre si tiene datos (tanto en lectura como en edición)
    const group = this.form.get(sectionName);
    const institucion = group?.get('institucion')?.value;
    if (institucion && typeof institucion === 'string' && institucion.trim() !== '') return true;

    // 3. Mostrar si es el nivel actualmente seleccionado en el dropdown
    if (sectionName === 'superior_posgrado') {
      return ['MAESTRIA', 'DOCTORADO'].includes(nivelActual);
    }

    if (sectionName === 'superior') {
      return ['TECNICO_TECNOLOGO', 'TERCER_NIVEL', 'ESPECIALISTA'].includes(nivelActual);
    }

    if (sectionName === 'bachillerato') {
      return nivelActual === 'BACHILLERATO_COMPLETO';
    }

    if (sectionName === 'basica') {
      return nivelActual === 'BASICA_COMPLETA';
    }

    if (sectionName === 'inicial') {
      return nivelActual === 'INICIAL';
    }

    return false;
  }

  limpiarSeccion(seccion: string) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar todos los datos registrados en la sección de ${seccion.replace('_', ' ').toUpperCase()}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '<i class="bi bi-trash-fill me-2"></i> Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.ejecutarLimpieza(seccion);
      }
    });
  }

  private ejecutarLimpieza(seccion: string) {
    const group = this.form.get(seccion) as FormGroup;
    if (group) {
      if (seccion === 'inicial') {
        group.patchValue({ institucion: '', anio: null }, { emitEvent: false });
      } else if (seccion === 'basica') {
        group.patchValue({ institucion: '', ultimo_grado: '', anio: null }, { emitEvent: false });
      } else if (seccion === 'bachillerato') {
        group.patchValue({ institucion: '', titulo: '', anio: null }, { emitEvent: false });
      } else if (seccion === 'superior') {
        group.patchValue({ institucion: '', tipo: '', nivel: '', carrera_programa: '', estado: '', anio: null }, { emitEvent: false });
      } else if (seccion === 'superior_posgrado') {
        group.patchValue({ institucion: '', carrera_programa: '', estado: '', anio: null }, { emitEvent: false });
      }

      group.reset(group.value, { emitEvent: false });

      const nivelMax = this.form.get('nivel_maximo')?.value;
      const mapping: any = {
        'inicial': ['INICIAL'],
        'basica': ['BASICA_INCOMPLETA', 'BASICA_COMPLETA'],
        'bachillerato': ['BACHILLERATO_INCOMPLETO', 'BACHILLERATO_COMPLETO'],
        'superior': ['TECNICO_TECNOLOGO', 'TERCER_NIVEL', 'ESPECIALISTA'],
        'superior_posgrado': ['MAESTRIA', 'DOCTORADO']
      };

      if (mapping[seccion] && mapping[seccion].includes(nivelMax)) {
        this.form.get('nivel_maximo')?.setValue('', { emitEvent: true });
      }

      this.updateSectionValidators();
      this.cdr.detectChanges();

      Swal.fire({
        icon: 'success',
        title: 'Sección Limpiada',
        text: `Los datos de ${seccion.replace('_', ' ').toUpperCase()} han sido eliminados correctamente.`,
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  }

  getTipoSuperior(): string {
    const nivel = this.form.get('nivel_maximo')?.value;
    const posgrados = ['MAESTRIA', 'DOCTORADO'];
    return posgrados.includes(nivel) ? 'POSGRADO' : 'GRADO';
  }

  getSelectedNivelLabel(): string {
    const nivel = this.form.get('nivel_maximo')?.value;
    const map: { [key: string]: string } = {
      'NINGUNO': 'Sin instrucción',
      'INICIAL': 'Educación Inicial',
      'BASICA_INCOMPLETA': 'EGB Incompleta',
      'BASICA_COMPLETA': 'EGB Completa',
      'BACHILLERATO_INCOMPLETO': 'Bachillerato Incompleto',
      'BACHILLERATO_COMPLETO': 'Bachillerato Completo',
      'TECNICO_TECNOLOGO': 'Técnico / Tecnólogo',
      'TERCER_NIVEL': 'Tercer Nivel',
      'ESPECIALISTA': 'Especialista',
      'MAESTRIA': 'Maestría',
      'DOCTORADO': 'Doctorado (PhD)'
    };
    return map[nivel] || nivel;
  }

  sanitizeAndCapitalize(controlPath: string) {
    const control = this.form.get(controlPath);
    if (control?.value) {
      let value = control.value.replace(/\s+/g, ' ');
      const words = value.split(' ');
      const capitalized = words
        .map((word: string) => {
          if (word.length <= 2 && /^(de|la|el|y|o|en|a|u)$/i.test(word)) return word.toLowerCase();
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');

      if (capitalized !== control.value) {
        control.setValue(capitalized, { emitEvent: false });
      }
    }
  }

  cleanLetters(controlPath: string) {
    const control = this.form.get(controlPath);
    if (control?.value) {
      const cleaned = control.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
      if (cleaned !== control.value) {
        control.setValue(cleaned, { emitEvent: false });
      }
      this.sanitizeAndCapitalize(controlPath);
    }
  }

  cleanNumbers(controlPath: string, maxLength?: number) {
    const control = this.form.get(controlPath);
    if (control?.value !== null && control?.value !== undefined) {
      let value = control.value.toString().replace(/\D/g, '');
      if (maxLength && value.length > maxLength) {
        value = value.slice(0, maxLength);
      }
      if (value !== control.value.toString()) {
        control.setValue(value ? parseInt(value) : null, { emitEvent: false });
      }
    }
  }

  cleanInArray(array: FormArray, index: number, controlName: string, type: 'LETTERS' | 'NUMBERS', maxLength?: number) {
    const control = array.at(index).get(controlName);
    if (control?.value !== null && control?.value !== undefined) {
      if (type === 'LETTERS') {
        const cleaned = control.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
        if (cleaned !== control.value) {
          control.setValue(cleaned, { emitEvent: false });
        }
      } else {
        let value = control.value.toString().replace(/\D/g, '');
        if (maxLength && value.length > maxLength) {
          value = value.slice(0, maxLength);
        }
        if (value !== control.value.toString()) {
          control.setValue(value ? parseInt(value) : null, { emitEvent: false });
        }
      }
    }
  }

  trimField(path: string) {
    const control = this.form.get(path);
    if (control?.value && typeof control.value === 'string') {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }

  trimFieldInArray(array: FormArray, index: number, controlName: string) {
    const control = array.at(index).get(controlName);
    if (control?.value && typeof control.value === 'string') {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }

  isInvalid(path: string): boolean {
    const control = this.form.get(path);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isInvalidInArray(array: FormArray, index: number, controlName: string): boolean {
    const control = array.at(index).get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

}
