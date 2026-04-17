import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-documentacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="card mb-3 shadow-sm border-0">
      <div class="card-header bg-primary text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-file-earmark-check me-2"></i>3. Documentación Entregada</h5>
      </div>
      <div class="card-body p-4">
        
        <div class="alert alert-info py-2 small mb-4" role="alert">
          <i class="bi bi-info-circle me-2"></i> Ingrese la <strong>cantidad</strong> de documentos entregados físicamente por cada tipo. Use 0 si no entregó ninguno.
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-4" *ngFor="let doc of docsConfig">
            <div class="p-3 border rounded-3 bg-light h-100" [class.border-danger]="isInvalid(doc.control)">
              <label class="form-label fw-bold d-block mb-2">
                {{doc.label}} <span class="text-danger" *ngIf="doc.required">*</span>
              </label>
              
              <div class="input-group">
                <span class="input-group-text bg-white"><i class="bi" [ngClass]="doc.icon"></i></span>
                <input type="number" 
                       [formControlName]="doc.control" 
                       class="form-control" 
                       min="0"
                       (keypress)="onlyNumbers($event)"
                       placeholder="Cantidad"
                       [readonly]="isReadOnly">
                <button type="button" class="btn btn-outline-secondary" (click)="adjustCount(doc.control, -1)" *ngIf="!isReadOnly">-</button>
                <button type="button" class="btn btn-outline-secondary" (click)="adjustCount(doc.control, 1)" *ngIf="!isReadOnly">+</button>
              </div>
              
              <div class="text-danger small mt-1 fw-bold" *ngIf="isInvalid(doc.control)">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> 
                {{ doc.required && form.get(doc.control)?.value === 0 ? 'Este documento es obligatorio (mínimo 1).' : 'Cantidad no válida.' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upload-container { transition: all 0.2s ease; border: 2px solid transparent; }
    .upload-container:hover { border-color: var(--bs-primary-border-subtle); background-color: #fff !important; }
    .photo-preview img { transition: transform 0.2s; }
    .photo-preview:hover img { transform: scale(1.05); }
    .border-dashed { border: 2px dashed #0d6efd !important; background: rgba(13, 110, 253, 0.05); transition: background 0.2s; }
    .border-dashed:hover { background: rgba(13, 110, 253, 0.1); }
  `]
})
export class DocumentacionComponent {
  @Input() form!: FormGroup;
  @Input() isReadOnly: boolean = false;

  docsConfig = [
    { label: 'Cédula de Identidad', control: 'cedula_cant', required: true, icon: 'bi-person-vcard' },
    { label: 'Certificado de Votación', control: 'certificado_votacion_cant', required: true, icon: 'bi-check2-square' },
    { label: 'Libreta Militar', control: 'libreta_militar_cant', required: false, icon: 'bi-shield-shaded' },
    { label: 'IESS (Último año)', control: 'certificado_iess_cant', required: false, icon: 'bi-hospital' },
    { label: 'Certificado Laboral', control: 'certificado_laboral_cant', required: false, icon: 'bi-briefcase' },
    { label: 'Fotos', control: 'fotos_cant', required: false, icon: 'bi-camera' },
  ];

  adjustCount(controlName: string, delta: number) {
    const control = this.form.get(controlName);
    const newVal = Math.max(0, (control?.value || 0) + delta);
    control?.setValue(newVal);
  }

  onlyNumbers(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
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
