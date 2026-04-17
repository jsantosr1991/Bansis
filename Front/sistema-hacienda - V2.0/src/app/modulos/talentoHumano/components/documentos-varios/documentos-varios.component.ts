import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-documentos-varios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [],
  encapsulation: ViewEncapsulation.None, // Permitir estilos globales para controlar la impresión
  template: `
    <div class="card mb-3 shadow-sm border-0 section-to-hide-on-print">
      <div class="card-header bg-dark text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-file-earmark-pdf me-2"></i>14. Documentos Varios</h5>
      </div>
      <div class="card-body p-4">
        <div class="row g-3">
          <!-- Alerta de condición -->
          <div class="col-12" *ngIf="!mostrarAcumulacion">
            <div class="alert alert-light border-0 py-3 shadow-none bg-light bg-opacity-75">
              <i class="bi bi-info-circle text-primary me-2"></i>
              Los documentos se habilitarán según las opciones seleccionadas en las secciones anteriores.
            </div>
          </div>

          <!-- Documento: Solicitud de Acumulación -->
          <div class="col-md-6" *ngIf="mostrarAcumulacion">
            <div class="document-card p-3 border rounded-3 bg-white hover-shadow transition-all d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <div class="icon-box bg-primary-subtle text-primary rounded-circle me-3">
                  <i class="bi bi-cash-stack fs-4"></i>
                </div>
                <div>
                  <h6 class="mb-1 fw-bold">Solicitud de Acumulación de Décimos</h6>
                  <p class="mb-0 small text-muted">Documento para cobro anual de beneficios.</p>
                </div>
              </div>
              <button class="btn btn-primary rounded-pill btn-sm px-4" (click)="imprimirAcumulacion()">
                <i class="bi bi-printer me-1"></i> Imprimir
              </button>
            </div>
          </div>

          <!-- Documento: Comunicado Cobertura IESS -->
          <div class="col-md-6">
            <div class="document-card p-3 border rounded-3 bg-white hover-shadow transition-all d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <div class="icon-box bg-info-subtle text-info rounded-circle me-3">
                  <i class="bi bi-shield-check fs-4"></i>
                </div>
                <div>
                  <h6 class="mb-1 fw-bold">Comunicado Condiciones IESS</h6>
                  <p class="mb-0 small text-muted">Información sobre cobertura y accidentes.</p>
                </div>
              </div>
              <button class="btn btn-info text-white rounded-pill btn-sm px-4" (click)="imprimirIESS()">
                <i class="bi bi-printer me-1"></i> Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SECCIÓN DE IMPRESIÓN ACUMULACIÓN (OCULTA EN PANTALLA) -->
    <div id="print-acumulacion" class="print-accumulation-container">
      <div class="print-content">
        <div class="header-section text-center mb-5">
          <h2 class="fw-bold mb-0" style="font-size: 16pt;">SOLICITUD DE ACUMULACION DE</h2>
          <h2 class="fw-bold" style="font-size: 16pt;">DECIMO TERCER Y DECIMO CUARTO SUELDOS</h2>
        </div>

        <div class="date-section text-start" style="margin-top: 2rem; margin-bottom: 2.5rem;">
          <p>Guayaquil, {{ getFechaManual() }}</p>
        </div>

        <div class="recipient-section" style="margin-bottom: 3.5rem;">
          <p class="mb-0">Señores.</p>
          <p class="mb-0 text-uppercase">Recursos Humanos</p>
          <p class="mb-0 text-uppercase">{{ getEmpresa() }}</p>
          <p class="mb-0">Ciudad, Marcelino Maridueña</p>
        </div>

        <div class="body-section text-justify" style="line-height: 1.6; margin-bottom: 3.5rem;">
          <p>
            Por medio de la presente, yo <span class="fw-bold">{{ getNombreAspirante() }}</span>, 
            con C.I. # <span class="fw-bold">{{ getCedula() }}</span> quiero dar a conocer mi deseo de acumular los valores 
            correspondientes al décimo tercero y décimo cuarto sueldo para que sean pagados anualmente, 
            según reglamenta el nuevo registro oficial No. 483, del jueves 22 de mayo.
          </p>
          <p class="mt-4">
            Me queda claro que esta solicitud es indefinida, por tal, no será necesaria ninguna 
            actualización posterior, y que, en caso de querer cambiar la modalidad de pago acumulado 
            a pago mensual, deberé solicitar por escrito la actualización dentro de los primeros quince días de cada año.
          </p>
        </div>

        <div class="closing-section" style="margin-bottom: 4rem;">
          <p>Particular que comunico para los fines pertinentes.</p>
          <p style="margin-top: 3.5rem;">Atentamente</p>
        </div>

        <div class="signature-section">
          <div class="signature-block">
            <div class="signature-line mb-3"></div>
            <p class="mb-0 fw-bold">{{ getNombreAspirante() }}</p>
            <p class="mb-0 fw-bold">C.I. {{ getCedula() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SECCIÓN DE IMPRESIÓN COMUNICADO IESS (OCULTA EN PANTALLA) -->
    <div id="print-iess" class="print-iess-container">
      <div class="print-content">
        <div class="header-section text-center mb-4">
          <h2 class="fw-bold mb-0" style="font-size: 16pt;">COMUNICADO SOBRE</h2>
          <h2 class="fw-bold" style="font-size: 16pt;">CONDICIONES DE COBERTURA IESS</h2>
        </div>

        <div class="date-section text-start mb-3">
          <p>Marcelino Maridueña, {{ getFechaManual() }}</p>
        </div>

        <div class="salutation-section mb-2">
          <p class="fw-bold">Estimado aspirante:</p>
        </div>

        <div class="body-section text-justify" style="line-height: 1.4;">
          <p class="mb-2">
            Por medio del presente, <span class="fw-bold">{{ getEmpresa() }}</span> pone en su conocimiento las disposiciones legales vigentes en materia de seguridad y salud en el trabajo, conforme a la <span class="fw-bold">Ley de Seguridad Social del Ecuador</span>, respecto a la cobertura de accidentes laborales por parte del Instituto Ecuatoriano de Seguridad Social (IESS).
          </p>
          <p class="mb-1">En este sentido, se informa lo siguiente:</p>
          
          <div class="points-section ms-2 mt-1">
            <ol class="ps-3 mb-0">
              <li class="mb-1">De conformidad con la <span class="fw-bold">Ley de Seguridad Social del Ecuador</span>, el empleador tiene la obligación de precautelar la seguridad e integridad de los trabajadores en el desempeño de sus actividades laborales.</li>
              <li class="mb-1">La empresa proporciona transporte (expreso) como una medida de seguridad para el traslado del personal.</li>
              <li class="mb-1">En caso de que el aspirante o trabajador decida no hacer uso del transporte expreso proporcionado por la empresa, cualquier accidente ocurrido durante su movilización será evaluado por el IESS conforme a la normativa vigente, pudiendo no ser considerado como accidente laboral si no cumple con las condiciones establecidas para su reconocimiento.</li>
              <li class="mb-1">Es responsabilidad del aspirante o trabajador cumplir con la normativa de transito vigente y portar la licencia de conducir correspondiente al tipo de vehículo que opere.</li>
              <li class="mb-1">En el caso de poseer licencia tipo B, se deja constancia de que, para actividades que requieran licencia tipo A, el trabajador deberá contar con dicha habilitación; caso contrario, el siniestro podría no ser reconocido por el IESS.</li>
            </ol>
          </div>

          <p class="mt-2">
            Se deja constancia de que el presente documento ha sido leído y comprendido por el aspirante, quien acepta las condiciones aquí establecidas.
          </p>
        </div>

        <div class="receipt-section mt-5 pt-3">
          <h6 class="fw-bold mb-2">CONSTANCIA DE RECEPCIÓN</h6>
          <div class="row gx-4 gy-1">
            <div class="col-12">
              <p class="mb-0"><span class="fw-bold">Nombre del aspirante:</span> {{ getNombreAspirante() }}</p>
            </div>
            <div class="col-12">
              <p class="mb-0"><span class="fw-bold">Cédula de identidad:</span> {{ getCedula() }}</p>
            </div>
          </div>
          
          <div class="signature-section-iess mt-5 pt-4">
            <div class="signature-block">
              <div class="signature-line mb-2" style="width: 200px; border-bottom: 1px solid #000 !important;"></div>
              <p class="mb-0 fw-bold" style="font-size: 11pt;">FIRMA DEL ASPIRANTE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos de Pantalla */
    .document-card { transition: all 0.2s ease; border: 1px solid #eee; }
    .document-card:hover { border-color: #0d6efd; background-color: #f8fbff !important; transform: translateY(-2px); }
    .icon-box { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; }
    .print-accumulation-container, .print-iess-container { display: none; }

    /* ESTILOS DE IMPRESIÓN GLOBALES (Gracias a ViewEncapsulation.None) */
    @media print {
      /* 1. Ocultar la Ficha Principal de VerSolicitud y otros elementos globales */
      body.printing-accumulation #print-section,
      body.printing-accumulation .header-glass,
      body.printing-accumulation footer,
      body.printing-accumulation .btn,
      body.printing-accumulation .alert,
      body.printing-iess #print-section,
      body.printing-iess .header-glass,
      body.printing-iess footer,
      body.printing-iess .btn,
      body.printing-iess .alert {
        display: none !important;
      }

      /* 2. Forzar que los PADRES de nuestro componente sean visibles para que el navegador llegue al contenido */
      body.printing-accumulation .accordion-container,
      body.printing-accumulation .accordion-item,
      body.printing-accumulation .accordion-content,
      body.printing-accumulation app-documentos-varios,
      body.printing-iess .accordion-container,
      body.printing-iess .accordion-item,
      body.printing-iess .accordion-content,
      body.printing-iess app-documentos-varios {
        visibility: visible !important;
        display: block !important;
        background: transparent !important;
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* 3. Ocultar el CONTENIDO de pantalla de nuestro propio componente y de otros hermanos */
      body.printing-accumulation .accordion-content > *:not(app-documentos-varios),
      body.printing-accumulation .section-to-hide-on-print,
      body.printing-accumulation .accordion-header,
      body.printing-iess .accordion-content > *:not(app-documentos-varios),
      body.printing-iess .section-to-hide-on-print,
      body.printing-iess .accordion-header {
        display: none !important;
      }

      /* 4. Mostrar y posicionar el documento de acumulación */
      body.printing-accumulation .print-accumulation-container {
        display: block !important;
        visibility: visible !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: auto !important;
        background: white !important;
        z-index: 9999 !important;
        padding: 2.5cm 2.5cm !important; /* Margen de carta */
      }

      /* 5. Mostrar y posicionar el comunicado IESS */
      body.printing-iess .print-iess-container {
        display: block !important;
        visibility: visible !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: auto !important;
        background: white !important;
        z-index: 9999 !important;
        padding: 1.5cm 2.0cm !important; /* Reducción de margen superior para ganar espacio */
      }

      body.printing-accumulation .print-accumulation-container *,
      body.printing-iess .print-iess-container * {
        visibility: visible !important;
      }

      body.printing-accumulation .print-content,
      body.printing-iess .print-content { 
        font-size: 11.5pt !important; 
        color: black !important;
        font-family: 'Arial', sans-serif !important;
      }

      body.printing-iess .print-content p,
      body.printing-iess .print-content li {
        font-size: 11.5pt !important; 
      }

      body.printing-accumulation .text-justify,
      body.printing-iess .text-justify { text-align: justify !important; }
      
      body.printing-accumulation .signature-section,
      body.printing-iess .signature-section-iess {
        margin-top: 4rem !important;
        display: flex !important;
        justify-content: center !important;
        width: 100% !important;
      }

      body.printing-accumulation .signature-block,
      body.printing-iess .signature-block { 
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        text-align: center !important;
        width: 100% !important;
      }

      body.printing-accumulation .signature-line,
      body.printing-iess .signature-line { 
        border-bottom: 1px solid #000 !important; 
      }
      
      body.printing-accumulation .signature-line {
        width: 200px !important; 
      }
      
      @page { 
        size: A4; 
        margin: 0; 
      }
    }
  `]
})
export class DocumentosVariosComponent {
  @Input() form!: FormGroup;

  hoy = new Date();

  get mostrarAcumulacion(): boolean {
    return this.form.get('datosAdministrativos.condiciones.acumulacion_decimos')?.value === true;
  }

  getNombreAspirante(): string {
    const dp = this.form.get('datosPersonales')?.value;
    if (!dp) return 'N/A';
    const nombres = dp.nombres || '';
    const ap1 = dp.apellidoPaterno || '';
    const ap2 = dp.apellidoMaterno || '';
    // Formato: Apellidos Nombres
    return `${ap1} ${ap2} ${nombres}`.trim().toUpperCase() || 'ASPIRANTE';
  }

  getCedula(): string {
    return this.form.get('datosPersonales.cedula')?.value || '---';
  }

  getEmpresa(): string {
    // Intentar sacar el nombre de la empresa
    const companyName = this.form.get('datosAdministrativos.company_name')?.value;
    if (companyName) return companyName.toUpperCase();

    // Si no está el nombre, devolver el ID o un placeholder (en Nueva Solicitud puede no estar cargado el nombre aún)
    return 'LA EMPRESA SELECCIONADA';
  }

  getFechaManual(): string {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const d = this.hoy.getDate();
    const m = meses[this.hoy.getMonth()];
    const a = this.hoy.getFullYear();
    return `${d} de ${m} de ${a}`;
  }

  imprimirAcumulacion() {
    // 1. Agregar clase al body para disparar los estilos de impresión específicos
    document.body.classList.add('printing-accumulation');

    // 2. Cambiar el título temporalmente para que el PDF se descargue con un nombre coherente
    const originalTitle = document.title;
    document.title = 'Solicitud_Acumulacion_' + (this.getCedula() || 'Formato');

    // 3. Pequeño delay para que el navegador procese el cambio de clase/título
    setTimeout(() => {
      window.print();

      // 4. Limpiar después de imprimir
      document.body.classList.remove('printing-accumulation');
      document.title = originalTitle;
    }, 150);
  }

  imprimirIESS() {
    // 1. Agregar clase al body para disparar los estilos de impresión específicos
    document.body.classList.add('printing-iess');

    // 2. Cambiar el título temporalmente
    const originalTitle = document.title;
    document.title = 'Comunicado_IESS_' + (this.getCedula() || 'Formato');

    // 3. Pequeño delay
    setTimeout(() => {
      window.print();

      // 4. Limpiar después de imprimir
      document.body.classList.remove('printing-iess');
      document.title = originalTitle;
    }, 150);
  }
}
