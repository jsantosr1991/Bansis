import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos-educativos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="card mb-4 shadow-sm border-0 animate-fade">
      <div class="card-header bg-primary text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-mortarboard me-2"></i>7. Datos Educativos <small class="ms-2 fw-normal opacity-75">(Opcional)</small></h5>
      </div>
      <div class="card-body p-4">
        
        <!-- NIVEL MÁXIMO ALCANZADO (Categorización Ecuatoriana) -->
        <div class="p-4 bg-light border-start border-5 border-primary rounded-4 mb-4 shadow-sm">
          <label class="form-label fw-bold d-flex align-items-center mb-3 text-primary fs-5">
            <i class="bi bi-award-fill me-2"></i> ¿Cuál es el nivel educativo máximo alcanzado? <span class="text-danger ms-1 small">*</span>
          </label>
          <select class="form-select form-select-lg border-primary border-opacity-25 shadow-sm" formControlName="nivel_maximo" 
                  (change)="onNivelMaximoChange()" [class.is-invalid]="isInvalid('nivel_maximo')"
                  [attr.disabled]="isReadOnly ? true : null">
            <option value="">Seleccione el nivel más alto...</option>
            <option value="NINGUNO">No tiene estudios / Sin instrucción</option>
            
            <optgroup label="Educación Inicial (Hasta los 5 años)">
              <option value="INICIAL">Educación Inicial / Inicial 2</option>
            </optgroup>

            <optgroup label="Educación General Básica (EGB)">
              <option value="BASICA_INCOMPLETA">EGB Incompleta (1ero a 9no)</option>
              <option value="BASICA_COMPLETA">EGB Completa (10mo Grado)</option>
            </optgroup>

            <optgroup label="Bachillerato (BGU)">
              <option value="BACHILLERATO_INCOMPLETO">Bachillerato Incompleto (1ero o 2do BGU)</option>
              <option value="BACHILLERATO_COMPLETO">Bachillerato Completo (3ero BGU / Graduado)</option>
            </optgroup>

            <optgroup label="Educación Superior - GRADO">
              <option value="TECNICO_TECNOLOGO">Técnico o Tecnólogo Superior</option>
              <option value="TERCER_NIVEL">Tercer Nivel (Licenciatura / Ingeniería)</option>
              <option value="ESPECIALISTA">Especialista (Grado)</option>
            </optgroup>

            <optgroup label="Educación Superior - POSGRADO">
              <option value="MAESTRIA">Maestría (Cuarto Nivel)</option>
              <option value="DOCTORADO">Doctorado (PhD)</option>
            </optgroup>
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
          <div class="col-12" formGroupName="inicial" *ngIf="isSectionVisible('INICIAL')">
            <div class="p-3 border rounded-3 bg-white border-primary border-opacity-25 shadow-sm animate-fade">
              <h6 class="fw-bold text-primary mb-3"><i class="bi bi-balloon me-2"></i> EDUCACIÓN INICIAL</h6>
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
          <div class="col-12" formGroupName="basica" *ngIf="isSectionVisible('BASICA')">
            <div class="p-3 border rounded-3 bg-white border-primary border-opacity-25 shadow-sm animate-fade">
              <h6 class="fw-bold text-primary mb-3"><i class="bi bi-book me-2"></i> EDUCACIÓN GENERAL BÁSICA (EGB)</h6>
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
          <div class="col-12" formGroupName="bachillerato" *ngIf="isSectionVisible('BACHILLERATO')">
            <div class="p-3 border rounded-3 bg-white border-primary border-opacity-25 shadow-sm animate-fade">
              <h6 class="fw-bold text-primary mb-3"><i class="bi bi-mortarboard me-2"></i> BACHILLERATO (BGU)</h6>
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

          <!-- EDUCACIÓN SUPERIOR (GRADO / POSGRADO) -->
          <div class="col-12" formGroupName="superior" *ngIf="isSectionVisible('SUPERIOR')">
            <div class="p-3 border border-success border-opacity-25 rounded-3 bg-success bg-opacity-10 shadow-sm animate-fade">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold text-success mb-0"><i class="bi bi-mortarboard-fill me-2 fs-5"></i> EDUCACIÓN SUPERIOR</h6>
                <div class="d-flex gap-2">
                  <span class="badge bg-success bg-opacity-75 px-3 py-2 rounded-pill fw-bold">{{ form.get('superior.tipo')?.value }}</span>
                  <span class="badge bg-primary bg-opacity-75 px-3 py-2 rounded-pill fw-bold">{{ form.get('superior.nivel')?.value }}</span>
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

          <!-- CURSOS Y SEMINARIOS -->
          <div class="col-12 mt-4">
             <!-- (Manteniendo mismo diseño de cursos previo para consistencia) -->
             <div class="p-4 border border-warning border-opacity-25 rounded-4 bg-white shadow-sm">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h6 class="fw-bold text-dark mb-0 fs-5"><i class="bi bi-patch-check-fill text-warning me-2"></i>Cursos y Seminarios Realizados</h6>
                  <small class="text-primary fw-semibold"><i class="bi bi-info-circle me-1"></i> Recomendación: Ingrese un máximo de 5 cursos para un formato de impresión óptimo.</small>
                </div>
                <button type="button" class="btn btn-warning btn-sm fw-bold px-4 rounded-pill shadow-sm text-dark d-flex align-items-center" (click)="addCurso()" *ngIf="!isReadOnly">
                  <i class="bi bi-plus-circle me-2 fs-6"></i> Agregar Curso
                </button>
              </div>

              <div *ngIf="cursos.length === 0" class="text-center py-5 border border-dashed rounded-3 bg-light opacity-75">
                <i class="bi bi-journal-text fs-1 text-muted mb-3 d-block"></i>
                <p class="mb-0 text-muted fw-semibold">No ha registrado capacitaciones adicionales.</p>
                <small class="text-secondary">Si posee cursos relevantes, agréguelos aquí.</small>
              </div>

              <div class="cursos-list" formArrayName="cursos">
                <div *ngFor="let curso of cursos.controls; let i=index" [formGroupName]="i" class="curso-card p-3 border rounded-3 bg-light bg-opacity-25 mb-3 shadow-sm animate-fade">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge bg-warning text-dark border border-warning border-opacity-50 px-3 rounded-pill fw-bold">CAPACITACIÓN #{{i+1}}</span>
                    <button type="button" class="btn btn-link text-danger text-decoration-none fw-bold d-flex align-items-center p-0" (click)="removeCurso(i)" *ngIf="!isReadOnly">
                      <i class="bi bi-trash3-fill me-2 fs-6"></i>
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

  constructor(private fb: FormBuilder) { }

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
  }

  removeCurso(index: number) {
    this.cursos.removeAt(index);
  }

  onNivelMaximoChange() {
    const nivelMax = this.form.get('nivel_maximo')?.value;
    const superiorGroup = this.form.get('superior');
    const bachilleratoGroup = this.form.get('bachillerato');

    if (this.isSuperiorVisible()) {
      // Autocompletado inteligente de bachillerato al seleccionar superior
      bachilleratoGroup?.patchValue({
        titulo: 'Bachillerato Completo',
        institucion: bachilleratoGroup.get('institucion')?.value || 'No registrada'
      }, { emitEvent: false });

      superiorGroup?.get('tipo')?.setValue(this.getTipoSuperior());
      superiorGroup?.get('nivel')?.setValue(this.getSelectedNivelLabel());
    }
    this.updateSectionValidators();
  }

  private updateSectionValidators() {
    const nivel = this.form.get('nivel_maximo')?.value;
    const sections = ['inicial', 'basica', 'bachillerato', 'superior'];

    // Limpiar todos primero
    sections.forEach(s => {
      const group = this.form.get(s) as FormGroup;
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
      this.setRequired('superior', ['institucion', 'carrera_programa', 'estado', 'anio']);
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

  isSectionVisible(section: 'INICIAL' | 'BASICA' | 'BACHILLERATO' | 'SUPERIOR'): boolean {
    const nivel = this.form.get('nivel_maximo')?.value;
    if (!nivel || nivel === 'NINGUNO') return false;

    if (section === 'INICIAL') return nivel === 'INICIAL';
    if (section === 'BASICA') return nivel.startsWith('BASICA');
    if (section === 'BACHILLERATO') return nivel.startsWith('BACHILLERATO');
    if (section === 'SUPERIOR') return this.isSuperiorVisible();

    return false;
  }

  isSuperiorVisible(): boolean {
    const nivel = this.form.get('nivel_maximo')?.value;
    const nivelesSuperiores = ['TECNICO_TECNOLOGO', 'TERCER_NIVEL', 'ESPECIALISTA', 'MAESTRIA', 'DOCTORADO'];
    return nivelesSuperiores.includes(nivel);
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
