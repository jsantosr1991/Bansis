import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-salud-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="card mb-4 shadow-sm border-0 animate-fade-in">
      <div class="card-header bg-primary text-white py-3">
        <h5 class="mb-0 fw-bold">
          <i class="bi bi-heart me-2"></i>11. Salud y Antecedentes Físicos
        </h5>
      </div>
      
      <div class="card-body p-4">
        <!-- MENSAJE INFORMATIVO -->
        <div class="alert alert-info d-flex align-items-center mb-4 border-0 shadow-sm py-3" role="alert">
          <i class="bi bi-info-circle-fill me-3 fs-4 text-primary"></i>
          <div class="fw-medium">
            Marque si ha tenido alguna de las siguientes condiciones. Si responde <strong>sí</strong>, especifique brevemente.
          </div>
        </div>

        <div class="row g-4">
          <!-- ANTECEDENTES MÉDICOS (Operaciones, Fracturas, Quemaduras, Accidentes) -->
          <ng-container *ngFor="let item of medicalItems">
            <div class="col-12" [formGroupName]="item.control">
              <div class="p-3 border rounded-4 bg-light bg-opacity-25 transition-all">
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div class="d-flex align-items-center">
                    <div class="icon-box me-3 bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                      <i [class]="'bi ' + item.icon + ' fs-4'"></i>
                    </div>
                    <div>
                      <h6 class="mb-0 fw-bold">{{item.label}}</h6>
                      <small class="text-muted">{{item.sublabel}}</small>
                    </div>
                  </div>
                  
                  <div class="btn-group shadow-sm" role="group">
                    <input type="radio" class="btn-check" [id]="item.control + 'No'" [value]="false" formControlName="aplica" [attr.disabled]="isReadOnly ? true : null">
                    <label class="btn btn-outline-secondary px-4 fw-bold" [for]="item.control + 'No'">NO</label>

                    <input type="radio" class="btn-check" [id]="item.control + 'Si'" [value]="true" formControlName="aplica" [attr.disabled]="isReadOnly ? true : null">
                    <label class="btn btn-outline-primary px-4 fw-bold" [for]="item.control + 'Si'">SÍ</label>
                  </div>
                </div>

                <!-- CAMPO DE DETALLE CONDICIONAL -->
                <div class="mt-3 animate-fade-in" *ngIf="form.get(item.control + '.aplica')?.value === true">
                  <label class="form-label small fw-bold text-primary text-uppercase">Especifique detalles <span class="text-danger">*</span></label>
                  <textarea class="form-control border-primary border-opacity-25 shadow-sm" 
                            formControlName="detalle" 
                            [placeholder]="item.placeholder"
                            [readonly]="isReadOnly"
                            rows="2" maxlength="250"></textarea>
                  <div class="form-text d-flex justify-content-between">
                    <span>{{item.help}}</span>
                    <span [class.text-danger]="form.get(item.control + '.detalle')?.value?.length >= 240">
                      {{ form.get(item.control + '.detalle')?.value?.length || 0 }}/250
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ng-container>

          <!-- OTROS ANTECEDENTES RELEVANTES -->
          <div class="col-12">
            <div class="p-3 border rounded-4 bg-white shadow-sm">
              <label class="form-label fw-bold text-secondary d-flex align-items-center">
                <i class="bi bi-file-earmark-medical me-2 text-primary"></i>5. OTROS ANTECEDENTES RELEVANTES <small class="ms-2 fw-normal">(Opcional)</small>
              </label>
              <textarea class="form-control border-light-subtle" formControlName="otros_antecedentes" 
                        placeholder="Ej: Lesiones antiguas, enfermedades importantes, limitaciones físicas que debamos conocer..." 
                        [readonly]="isReadOnly"
                        rows="2" maxlength="250"></textarea>
            </div>
          </div>

          <!-- SECCIÓN: ACTIVIDAD FÍSICA Y SOCIAL -->
          <div class="col-12 mt-4">
            <h6 class="fw-bold border-bottom pb-2 mb-3 text-primary d-flex align-items-center">
              <i class="bi bi-bicycle me-2"></i>ACTIVIDAD FÍSICA Y PARTICIPACIÓN SOCIAL
            </h6>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold text-secondary small">6. ¿PRACTICA ALGÚN DEPORTE? <small class="ms-2 fw-normal">(Opcional)</small></label>
            <div class="input-group">
              <span class="input-group-text bg-light"><i class="bi bi-trophy text-primary"></i></span>
              <input type="text" class="form-control" formControlName="deporte" placeholder="Ej: Fútbol, Ciclismo, Natación (o Ninguno)" [readonly]="isReadOnly">
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold text-secondary small">7. PARTICIPACIÓN CÍVICO-SOCIAL <small class="ms-2 fw-normal">(Opcional)</small></label>
            <div class="input-group">
              <span class="input-group-text bg-light"><i class="bi bi-people text-primary"></i></span>
              <textarea class="form-control" formControlName="actividad_social" 
                        placeholder="Bomberos, Cruz Roja, Voluntariado..." rows="1" [readonly]="isReadOnly"></textarea>
            </div>
            <div class="form-text small">Indique si participa organizaciones comunitarias.</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transition-all { transition: all 0.3s ease; }
    .icon-box { transition: transform 0.3s ease; }
    .card:hover .icon-box { transform: scale(1.1); }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    textarea { resize: none; }
    input[type="text"], textarea { text-transform: uppercase; }
    input[type="text"]::placeholder, textarea::placeholder { text-transform: none; }
  `]
})
export class SaludPersonalComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;
  @Input() isReadOnly: boolean = false;

  medicalItems = [
    {
      control: 'operaciones',
      label: '1. OPERACIONES QUIRÚRGICAS',
      sublabel: 'Cirugías previas de cualquier tipo',
      icon: 'bi-scissors',
      placeholder: 'Ej: Apendicectomía en 2018',
      help: 'Indique el tipo de operación y el año aproximado.'
    },
    {
      control: 'fracturas',
      label: '2. FRACTURAS ÓSEAS',
      sublabel: 'Huesos rotos o fisuras importantes',
      icon: 'bi-activity',
      placeholder: 'Ej: Fractura de fémur derecho en 2015',
      help: 'Especifique el hueso afectado.'
    },
    {
      control: 'quemaduras',
      label: '3. QUEMADURAS GRAVES',
      sublabel: 'Quemaduras que requirieron tratamiento especializado',
      icon: 'bi-thermometer-high',
      placeholder: 'Ej: Quemadura de 2do grado en brazo izquierdo',
      help: 'Indique la zona y gravedad.'
    },
    {
      control: 'accidentes_laborales',
      label: '4. ACCIDENTES LABORALES',
      sublabel: 'Lesiones sufridas en empleos anteriores',
      icon: 'bi-bandaid',
      placeholder: 'Ej: Lesión lumbar por carga pesada en 2020',
      help: 'Especifique la lesión y consecuencias.'
    }
  ];

  private subs: Subscription[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Configurar validación reactiva para cada item médico
    this.medicalItems.forEach(item => {
      const group = this.form.get(item.control) as FormGroup;
      if (group) {
        const sub = group.get('aplica')?.valueChanges.subscribe(val => {
          const detailControl = group.get('detalle');
          if (val === true) {
            detailControl?.setValidators([Validators.required, Validators.maxLength(250)]);
          } else {
            detailControl?.clearValidators();
            detailControl?.setValue('');
          }
          detailControl?.updateValueAndValidity();
          this.cdr.detectChanges();
        });
        if (sub) this.subs.push(sub);
      }
    });
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
