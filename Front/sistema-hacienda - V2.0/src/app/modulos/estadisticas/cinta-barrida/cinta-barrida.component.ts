import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { formatDate, NgFor, NgForOf, NgIf, NgStyle } from '@angular/common';
import { LoaderComponent } from '../../../shared/spinner/loader/loader.component';
import { FormsModule } from '@angular/forms';

import { EstadisticasService } from '../../../services/estadisticas.service';
import { jwtDecode } from 'jwt-decode';
import jsPDF from 'jspdf';

import { Modal } from 'bootstrap';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-cinta-barrida',
  standalone: true,
  imports: [
    NgIf,
    LoaderComponent,
    FormsModule,
    NgStyle,
    NgForOf, NgFor
  ],
  templateUrl: './cinta-barrida.component.html',
  styleUrl: './cinta-barrida.component.css'
})
export class CintaBarridaComponent implements OnInit, AfterViewInit, OnDestroy {

  loading = false;
  private charts: { [key: string]: Chart } = {};

  selectedEmpresaName: string = '';
  selectedHaciendaName: string = ''; // Nombre de la hacienda
  title = 'Cinta Barrida';

  // Variable para almacenar los colores obtenidos de la API
  coloresIds: any[] = [];
  DatosEnfunde: any[] = [];
  // Año seleccionado, por defecto será el año actual
  anioSeleccionado: number = new Date().getFullYear() - 1;
  //año consulta actual
  anioDefault: number = new Date().getFullYear();
  // Año digitado por el usuario (por defecto vacío)
  anioIngresado: number | null = null;
  selectedColorId: string = '';  // Almacena el ID del color seleccionado
  selectedLote: any = '';  // Almacena el Lote
  selectedColorHex: string = '#FFFFFF'; // Color por defecto al inicio
  selectedColorName: string = ''; // Nombre del color seleccionado
  selectedSemanaColor: string = ''; // Nombre de la semana seleccionado
  selectedTextColor: string = '#000000'; // Default text color (black)
  selectedId: number | null = null;  // Variable para el ID seleccionado
  selectedCodigo: number | null = null;  // Variable para el código seleccionado

  // Diccionario de colores que asocia el nombre del color con su valor hexadecimal
  colorHexadecimales: { [key: string]: string } = {
    'lila': 'rgba(138,43,226,0.85)',
    'rojo': '#ff0000',
    'verde': '#0cab03',
    'amarillo': '#FFFF00',
    'azul': 'rgba(0,87,255,0.71)',
    'cafe': '#C56E18BA',
    'naranja': '#FF4500',
    'negro': '#030303',
    'blanco': '#fdfbfb',
  };
  datos: any[] = []; // Almacena los datos a mostrar en la tabla
  encabezados: string[] = []; // Encabezados de la tabla
  public today: any;
  totalFutura: number = 0; // Variable para el total
  totalPresente: number = 0; // Variable para el total
  constructor(private cintaService: EstadisticasService) {
  }

  hacienda = [
    { id: '1', name: 'AGRICOLA E INDUSTRIAL PRIMOBANANO S.A.' },
    { id: '3', name: 'SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A.' }
  ]
  //@ViewChild('dTable', {static: false}) dataTable: any;
  @ViewChild('dTable') dataTable!: ElementRef;
  private tableInstance: any;
  private clickHandler: any;
  private modalInstances = new Map<string, Modal>();

  ngAfterViewInit() {
    this.initDataTable();
    // Botones que abren modales desde otros modales
    document.getElementById('btnAbrirDetalleModal')?.addEventListener('click', () =>
      this.abrirModalAnidado('loteModal', 'detalleModal')
    );

    document.getElementById('btnAbrirDetalleLibras')?.addEventListener('click', () =>
      this.abrirModalAnidado('librasModal', 'detalleModalLibras'));

    //limpieza global al cerrar cualquier modal
    document.addEventListener('hidden.bs.modal', () => this.resetModalState())


  }
  ngOnDestroy(): void {
    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler);
    }
    if (this.tableInstance) {
      this.tableInstance.destroy();
    }
    // Limpiar instancias de modales
    this.modalInstances.forEach(modal => modal.dispose());
    this.modalInstances.clear();
  }

  // =========================
  // DataTable
  // =========================
  private initDataTable() {
    this.tableInstance = ($(this.dataTable.nativeElement) as any).DataTable({
      "destroy": true,
      "paging": true,
      "lengthChange": true,
      "searching": true,
      "ordering": true,
      "info": true,
      "order": [[3, 'asc']],  // Establece el orden por defecto (por ejemplo, la primera columna ordenada de manera ascendente)

      "pageLength": 50, // Establecer 50 filas por defecto
      autoWidth: true,
      responsive: true,
      layout: {
        topStart: {
          buttons: [
            {
              extend: 'excelHtml5',
              text: '<i class="bi bi-file-earmark-excel-fill"></i>',
              titleAttr: 'Exportar a Excel',
              title: function () {
                // Concatenar el nombre de la hacienda al título
                const selectedHaciendaName = $('#hacienda').text(); // Usamos un valor por defecto si no se ha seleccionado ninguna hacienda
                const colorcinta = $('#color').text();

                return 'Cinta Barrida - ' + selectedHaciendaName + " | Color de cinta: " + colorcinta;

              },
              className: 'text-success',
              // Configuración del nombre del archivo con la fecha
              filename: function () {
                var date = new Date();
                var formattedDate = date.toLocaleDateString('es-ES').replace(/\//g, '-'); // Cambiar '/' por '-'
                return 'Cintabarrida_' + formattedDate;  // Nombre del archivo Excel
              },
              exportOptions: {
                targets: [0, 1, 2, 3, 6, 7, 8, 11],
                columns: ':visible' // Esta opción asegura que solo se exporten las columnas visibles
              },

            },
            {
              extend: 'pdfHtml5',
              text: '<i class="bi bi-file-pdf-fill"></i>',
              titleAttr: 'Exportar a PDF',
              title: 'Cinta Barrida ',
              className: 'text-danger',
              pageSize: 'A4', // Establecer el tamaño de la página (A4)
              // Configuración del nombre del archivo con la fecha
              filename: function () {
                // Obtener la fecha actual en formato 'YYYY-MM-DD'
                var date = new Date();
                var formattedDate = date.toLocaleDateString('es-ES').replace(/\//g, '-'); // Cambiar '/' por '-'
                return 'Cintabarrida_' + formattedDate;  // Nombre del archivo PDF
              },
              exportOptions: {
                columns: [0, 1, 2, 3, 6, 7, 8, 9, 12] // Aquí especificas qué columnas incluir en el PDF (puedes omitir las 4, 9 y 10)
              },
              customize: function (doc: any) {
                // Cambiar el estilo del título
                doc.content[0].text = doc.content[0].text.toUpperCase(); // Opcional: poner el título en mayúsculas
                doc.content[0].style = {
                  fontSize: 12, // Aumentar el tamaño de la fuente
                  bold: true,   // Poner el título en negrita
                  alignment: 'center' // Centrar el título
                };

                // Centrar los datos de cada columna
                doc.content[1].table.body.forEach((row: any) => {
                  row.forEach((cell: any) => {
                    cell.alignment = 'center'; // Centrar cada celda
                  });
                });
                // Agregar numeración de páginas al pie de página
                doc['footer'] = function (currentPage: number, pageCount: number) {
                  return {
                    text: `Página ${currentPage} de ${pageCount}`,
                    alignment: 'center',
                    fontSize: 10,
                    margin: [0, 10]  // Margen inferior
                  };
                };

                var namehacienda = $('#hacienda').text();
                var colorcinta = $('#color').text();
                var semanacinta = $('#semana').text();
                // Obtener la fecha y hora exacta
                var date = new Date();
                // Obtener el nombre de la máquina (puedes obtener más información si lo deseas)
                var machineName = navigator.platform;  // Puedes usar `navigator.platform` para obtener la plataforma

                var formattedTime = date.toLocaleString('es-ES', { hour12: false });
                // Obtener el token de localStorage (asegurándote de que lo has almacenado ahí)

                var token = localStorage.getItem('userData');  // Asegúrate de que el nombre de la clave sea correcto
                var username = 'Desconocido';  // Valor por defecto en caso de que no se pueda obtener el username
                if (token) {
                  try {
                    // Decodificar el token para extraer el username
                    var decodedToken: any = jwtDecode(token);
                    username = decodedToken.username || 'Desconocido';  // Usamos el campo 'username' del token
                  } catch (e) {
                    console.error('Error al decodificar el token:', e);
                  }
                }
                // Agregar esta información al documento PDF
                doc['header'] = function () {
                  return {
                    columns: [
                      {
                        text: [
                          { text: 'Hacienda: ', bold: true },  // "Hacienda" en negrita
                          { text: namehacienda, bold: false },  // El valor de la variable namehacienda
                          { text: '\nColor de Cinta: ', bold: true },  // "Color de Cinta" en negrita
                          { text: colorcinta, bold: false },  // El valor de la variable colorcinta
                          { text: '\nSemana: ', bold: true },  // "Color de Cinta" en negrita
                          { text: semanacinta, bold: false },  // El valor de la variable colorcinta
                        ],
                        style: 'headerInfo',
                        alignment: 'left',
                        fontSize: 8,
                        margin: [10, 5, 0, 0]  // Márgenes alrededor del texto
                      },


                      {
                        text: [{ text: 'Usuario:', bold: true },
                        { text: username, bold: false },
                        { text: '\nFecha Impresión: ', bold: true },
                        { text: formattedTime, bold: false },
                        { text: '\nMáquina Impresión: ', bold: true },
                        { text: machineName, bold: false },
                        ],
                        style: 'headerInfo',
                        alignment: 'right',
                        fontSize: 8,
                        margin: [0, 5, 10, 0] // Márgenes alrededor del logo
                      },


                    ],
                    margin: [10, 1] // Ajustar márgenes del encabezado
                  }
                }
              }

            },
            {
              extend: 'copyHtml5',
              text: '<i class="bi bi-files"></i>',
              titleAttr: 'Copiar',
              className: ''
            },
            {
              extend: 'print',
              text: '<i class="bi bi-printer-fill"></i>',
              title: function () {

                // Concatenar el nombre de la hacienda al título
                const selectedHaciendaName = $('#hacienda').text(); // Usamos un valor por defecto si no se ha seleccionado ninguna hacienda
                return 'Cinta Barrida - ' + selectedHaciendaName;

              },
              titleAttr: 'Imprimir',
              className: 'fw-bolder',
              pageSize: 'A4', // Establecer el tamaño de la página (A4)
              exportOptions: {
                // Solo exportar las columnas visibles
                columns: ':visible'
              },
              customize: function (win: any) {
                // Reducir el tamaño del título de la impresión
                $(win.document.body).find('h1').css({
                  'font-size': '18px',  // Tamaño más pequeño para el título
                  'text-align': 'center', // Centrado del título
                  'font-weight': 'bold'  // Hacer el título en negrita
                });
                // Personalización de la impresión (por ejemplo, tamaño de fuente, márgenes, etc.)
                $(win.document.body).find('table')
                  .addClass('compact')
                  .css('font-size', '12px')
                  .css('text-align', 'center'); // Opcional: Para centrar los datos de la tabla
              }

            }
            ,

          ],
        },
        topEnd: {
          pageLength: {
            menu: [5, 10, 25, 50, 100]
          }
        },
        top2Start: {}
      },

      "language": {
        "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },

      columns: [
        { data: "mayordomo", title: 'Mayordomo', className: "text-center fw-semibold" },
        { data: "peso_prom", title: 'Peso Prom', className: "text-center fw-semibold" },
        { data: "peso_max", title: 'Peso Max', className: "text-center fw-semibold" },
        {
          data: "lote", title: 'Prom. Lote', className: "text-center fw-semibold",
          render: function (data: any, type: any, row: any) {
            return `<button id="` + data + `" value="lote" type="button" class="btn btn-primary btn-xs accionesTabla" title="Bloqueado" data-bs-toggle="modal" data-bs-target="#loteModal">
           ${data}
              </button>`;
          }
        },
        {
          data: "lote", title: 'Total Libras', className: "text-center fw-semibold",
          render: function (data: any, type: any, row: any) {
            return `<button id="` + data + `" value="libras" type="button" class="btn btn-success btn-xs accionesTabla" title="Bloqueado" data-bs-toggle="modal" data-bs-target="#librasModal">
         <i class="bi bi-clipboard-data"></i>
              </button>`;
          }
        },
        {
          data: "lote", title: 'Lotero', className: "text-center fw-semibold",
          render: function (data: any, type: any, row: any) {
            return `<button id="` + data + `" value="lotero" type="button" class="btn btn-info btn-xs accionesTabla" title="Bloqueado" data-bs-toggle="modal" data-bs-target="#loteroModal">
         <i class="bi bi-person-rolodex"></i>
              </button>`;
          }
        },
        { data: "enfunde", title: 'Enfude', className: "text-center fw-semibold" },
        { data: "caidas", title: 'M. Caidas', className: "text-center fw-semibold" },
        { data: "cosechado", title: 'Cosechado', className: "text-center fw-semibold" },
        { data: "total", title: 'Saldo', className: "text-center fw-semibold" },
        { data: "codigo", title: 'codigo', className: "text-center fw-semibold" },
        { data: "peso_min", title: 'Peso Minimo', className: "text-center fw-semibold" },
        {
          // Nueva columna para el porcentaje
          data: null, // Se calculará dinámicamente
          title: 'Recobro',
          className: "text-center fw-semibold",
          render: function (data: any, type: any, row: any) {
            const enfunde = parseFloat(row.enfunde) || 0; // Convertir a número, si no es válido usar 0
            const total = parseFloat(row.total) || 1; // Evitar división por 0
            const total1 = (enfunde - total);
            const porcentaje = (total1 / enfunde) * 100; // Cálculo del porcentaje
            return `${porcentaje.toFixed(2)}%`; // Formatear con 2 decimales
          }
        },
        { data: "has", title: 'Has', className: "text-center fw-semibold" }
      ],

      "createdRow": function (row: any, data: any) {
        if (data.total < 0) {
          $('td', row).css({
            'font-weight': 'bold',
            'color': '#ff0000',
          });
        }


      },
      footerCallback: function (row: any, data: any, start: any, end: any, display: any) {
        let totalPesoProm = 0;
        let totalPesoMax = 0;
        let totalEnfunde = 0;
        let totalCaidas = 0;
        let totalCosechado = 0;
        let totalSaldo = 0;
        let totalRecobro = 0;
        let totalHas = 0;

        let count = 0;

        // Calcular totales y conteo
        data.forEach(function (rowData: any) {
          const pesoProm = parseFloat(rowData.peso_prom) || 0; // Validar numérico
          const pesoMax = parseFloat(rowData.peso_max) || 0;
          const enfunde = parseFloat(rowData.enfunde) || 0;
          const caidas = parseFloat(rowData.caidas) || 0;
          const cosechado = parseFloat(rowData.cosechado) || 0;
          const saldo = parseFloat(rowData.total) || 0;
          const has = parseFloat(rowData.has) || 0;

          totalPesoProm += pesoProm;
          totalPesoMax += pesoMax;
          totalEnfunde += enfunde;
          totalCaidas += caidas;
          totalCosechado += cosechado;
          totalSaldo += saldo;
          totalRecobro = 100 - ((totalSaldo / totalEnfunde) * 100);
          totalHas += has

          count++;
        });

        // Calcular promedios
        const averagePesoProm = totalPesoProm / count;
        const averagePesoMax = totalPesoMax / count;

        // Insertar los promedios en el pie de la tabla
        $(this.api().column(1).footer()).html(averagePesoProm.toFixed(2)); // Columna "Peso Prom"
        $(this.api().column(2).footer()).html(averagePesoMax.toFixed(2)); // Columna "Peso Max"
        // Insertar los totales de las otras columnas en el pie de la tabla
        $(this.api().column(6).footer()).html(totalEnfunde.toFixed(0)); // Columan Enfunde
        $(this.api().column(7).footer()).html(totalCaidas.toFixed(0)); // Columan Caidas
        $(this.api().column(8).footer()).html(totalCosechado.toFixed(0)); // Columan Cosechado
        $(this.api().column(9).footer()).html(totalSaldo.toFixed(0)); // Saldo
        $(this.api().column(12).footer()).html(totalRecobro.toFixed(2) + "%"); // Recobro
        $(this.api().column(13).footer()).html(totalHas.toFixed(2)); // Has
      },
      columnDefs: [
        {
          targets: [0],
          visible: true,
          width: '20%'   // Ancho de la columna 1 (20% del ancho total)
        },
        {
          targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13],
          visible: true,
          width: '5%'   // Ancho de la columna 1 (20% del ancho total)
        },

        {
          targets: [10, 11],
          visible: false

        },
      ],

    })

    this.tableInstance.on('draw', () => {
      const dataCount = this.tableInstance.rows({ search: 'applied' }).data().length;
      const buttons = this.tableInstance.buttons();
      dataCount === 0 ? buttons.disable() : buttons.enable();
    });

    this.tableInstance.trigger('draw');

    // Listener para botones
    this.clickHandler = (event: any) => {
      const button = event.target.closest('button');
      if (!button) return;

      switch (button.value) {
        case 'lote': this.handleLote(button); break;
        case 'libras': this.handleLibras(button); break;
        case 'lotero': this.handleLotero(button); break;
      }
    };

    document.addEventListener('click', this.clickHandler);
  }

  // =========================
  // Manejo de modales
  // =========================
  private getModalInstance(id: string, options?: any): Modal {
    let modal = this.modalInstances.get(id);
    const modalEl = document.getElementById(id);
    if (!modalEl) throw new Error(`Modal con id ${id} no encontrado`);
    if (!modal) {
      modal = new Modal(modalEl, options);
      this.modalInstances.set(id, modal);
    }
    return modal;
  }

  abrirModal(id: string) {
    const modal = this.getModalInstance(id);
    modal.show();
  }

  // Abrir modal dentro de otro modal (modales anidados)
  abrirModalAnidado(modalPadreId: string, modalHijoId: string) {
    const modalPadreEl = document.getElementById(modalPadreId);
    const modalHijoEl = document.getElementById(modalHijoId);

    if (!modalPadreEl || !modalHijoEl) return;

    // Crear o reutilizar instancia del padre
    let modalPadreInstance = (modalPadreEl as any)._bsModalInstance;
    if (!modalPadreInstance) {
      modalPadreInstance = new Modal(modalPadreEl);
      (modalPadreEl as any)._bsModalInstance = modalPadreInstance;
    }

    // Crear o reutilizar instancia del hijo
    let modalHijoInstance = (modalHijoEl as any)._bsModalInstance;
    if (!modalHijoInstance) {
      modalHijoInstance = new Modal(modalHijoEl, { backdrop: 'static', keyboard: false });
      (modalHijoEl as any)._bsModalInstance = modalHijoInstance;
    }

    // Ocultar el padre (solo visualmente)
    modalPadreEl.classList.add('modal-stack-hidden');

    // Mostrar el hijo
    modalHijoInstance.show();

    // Restaurar padre cuando se cierra el hijo
    const restoreParent = () => {
      modalPadreEl.classList.remove('modal-stack-hidden');
      modalHijoEl.removeEventListener('hidden.bs.modal', restoreParent);
    };
    modalHijoEl.addEventListener('hidden.bs.modal', restoreParent);
  }
  private resetModalState() {
    //Eliminar clases ocultas de cualquier modal
    document.querySelectorAll('.modal-stack-hidden').forEach(el => {
      el.classList.remove('modal-stack-hidden');
    });

    //Si no hay ningun modal visible, quita backdrop y clase del body
    const visibleModals = document.querySelectorAll('.modal.show');
    if (visibleModals.length == 0) {
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelectorAll('.modal-backdrop');
      backdrop.forEach(b => b.remove());
    }
  }
  // =========================
  // Handlers de botones
  // =========================
  private handleLote(button: HTMLElement) {
    const data = this.getRowData(button);
    if (!data) return;

    const lote = data.lote;
    const has = data.has;
    const empresaId = data.idhacienda;

    const empresa = this.hacienda.find(e => e.id === empresaId);
    this.selectedEmpresaName = empresa ? empresa.name : 'No definida';
    this.selectedLote = lote;

    // Actualizar contenido en modal
    $('#modalEmpresaName').text(this.selectedEmpresaName);
    $('#modalEmpresaName2').text(this.selectedEmpresaName);
    $('#modalLoteInfo').text(lote);
    $('#modalLoteInfo2').text(lote);
    $('#modalLoteHas').text(has);
    $('#modalLoteHas2').text(has);

    // ✅ Lógica original de consultas y gráficos
    this.consultarIndicadores('racimos', lote);

    // Mostrar modal principal
    this.abrirModal('loteModal');

  }

  private handleLibras(button: HTMLElement) {
    const data = this.getRowData(button);
    if (!data) return;

    const lote = data.lote;
    const has = data.has;
    const empresaId = data.idhacienda;

    const empresa = this.hacienda.find(e => e.id === empresaId);
    this.selectedEmpresaName = empresa ? empresa.name : 'No definida';
    this.selectedLote = lote;

    $('#modalLibrasEmpresaName').text(this.selectedEmpresaName);
    $('#modalEmpresaName3').text(this.selectedEmpresaName);
    $('#modalLibrasInfo').text(lote);
    $('#modalLoteInfo3').text(lote);
    $('#modalLoteHas3').text(has);

    // ✅ Lógica original de consultas y gráficos
    this.consultarIndicadores('libras', lote);

    this.abrirModal('librasModal');

  }

  private handleLotero(button: HTMLElement) {
    const data = this.getRowData(button);
    if (!data) return;
    const lote = data.lote;
    const empresaId = data.idhacienda;

    const empresa = this.hacienda.find(e => e.id === empresaId);
    this.selectedEmpresaName = empresa ? empresa.name : 'No definida';
    this.selectedLote = lote;

    $('#modalLoteroEmpresaName').text(this.selectedEmpresaName);
    $('#modalLoteroInfo').text(lote);

    // ✅ Lógica original
    this.getLoteros(lote);

    this.abrirModal('loteroModal');
  }
  // =========================
  // Utilitarios
  // =========================
  private getRowData(button: HTMLElement) {
    const row = $(button).closest('tr');
    return this.tableInstance.row(row).data();
  }

  private getEmpresaName(id: number) {
    const empresa = this.hacienda.find(e => e.id === id.toString());
    return empresa ? empresa.name : 'No definida';
  }
  ngOnInit(): void {
    this.loading = true; // 🔹 Mostrar spinner

    // Ejecuta ambas funciones y espera que terminen
    Promise.all([
      this.getsemana(),
      this.cargarColoresPorAño()
    ])
      .then(() => {
        // 🔹 Ocultar spinner cuando ambas terminan correctamente
        this.loading = false;
      })
      .catch((error) => {
        console.error('Error al cargar los datos:', error);
        this.loading = false; // 🔹 Oculta aunque falle
      });
  }


  getsemana() {
    const hoy = new Date();
    this.today = formatDate(hoy, 'yyyy-MM-dd', 'en-US');
    const data = { fecha: this.today };
    this.cintaService.getSemanaActual(data).subscribe((r) => {
      this.today = r;
    });
  }

  cargarColoresPorAño() {
    const anio = this.anioIngresado || this.anioSeleccionado;

    this.cintaService.calendar(anio).subscribe(
      (colores) => {
        this.coloresIds = colores.map(color => ({
          id: Number(color.codigo), // 🔥 IMPORTANTE
          colorName: color.color,
          hex: this.colorHexadecimales[color.color.toLowerCase()] || '#FFFFFF',
          semana: color.semana
        }));
      },
      (error) => {
        console.error('Error al obtener los colores:', error);
      }
    );
  }
  onColorChange(colorId: any) {

    const id = Number(colorId);

    const selectedColor = this.coloresIds.find(color => color.id === id);

    if (selectedColor) {
      this.selectedColorHex = selectedColor.hex;
      this.selectedColorName = selectedColor.colorName;
      this.selectedSemanaColor = selectedColor.semana;
      this.selectedTextColor = this.getTextColorForBackground(selectedColor.hex);
    }

    // 🔥 AGREGA ESTO
    this.onSelectChange();
  }
  // Función para determinar el color de texto adecuado (oscuro o claro)
  getTextColorForBackground(hex: string): string {
    const color = hex.replace('#', '');
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Usamos la fórmula de luminancia para calcular el brillo
    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Si el brillo es bajo (oscuro), usamos texto blanco; si es alto (claro), usamos texto negro
    return brightness < 128 ? '#FFFFFF' : '#000000';
  }

  // Esta función se ejecuta cuando uno de los select cambia
  onSelectChange() {
    console.log('ID:', this.selectedId);
    console.log('CODIGO:', this.selectedCodigo);

    if (this.selectedId != null && this.selectedCodigo != null) {

      const selectedHacienda = this.hacienda.find(
        dm => Number(dm.id) === Number(this.selectedId)
      );

      console.log(selectedHacienda)

      this.selectedHaciendaName = selectedHacienda
        ? selectedHacienda.name
        : 'No disponible';

      this.realizarConsulta();
    }
  }

  // Función para realizar la consulta al backend con los parámetros seleccionados
  realizarConsulta() {
    this.loading = true;
    if (this.selectedId && this.selectedCodigo) {
      const data = {
        id: this.selectedId,
        codigo: this.selectedCodigo
      };
      this.cintaService.consultarConId(this.selectedId, this.selectedCodigo).subscribe(
        ([respuesta1, respuesta2]) => {

          var obj = respuesta1;
          this.DatosEnfunde = respuesta2
          // console.log("consulta con ID",respuesta2)
          // @ts-ignore
          var table = $('#example').DataTable();
          table.clear();
          table.rows.add(obj).draw();
          // Manejar ambas respuestas aquí
          this.loading = false;
        },
        (error) => {
          console.error('Error al hacer las consultas:', error);
          this.loading = false;
        }
      );
    } else {
      console.log('Selecciona ambos parámetros antes de realizar la consulta.');
    }
  }

  onAnioChange() {
    if (this.anioIngresado) {
      this.anioSeleccionado = this.anioIngresado;
      this.cargarColoresPorAño();
    }
  }

  // 🔹 Genera PDF del modal principal (Racimos o Libras)
  async generatePDF() {
    const posiblesIds = ['modalLoteInfo', 'modalLoteInfo2', 'modalLoteInfo3', 'modalLoteInfo4'];

    let loteName = 'lote';


    const doc = new jsPDF('l', 'mm', 'a4');

    const chart1 = document.getElementById('myChart') as HTMLCanvasElement;
    const chart2 = document.getElementById('chartAnterior') as HTMLCanvasElement;

    for (const id of posiblesIds) {
      const el = document.getElementById(id);
      if (el && el.innerText && el.innerText.trim() !== 'No definido') {
        loteName = el.innerText.trim();
        break; // sale al encontrar el primero válido
      }
    }


    if (chart1 && chart2) {
      const imgData1 = chart1.toDataURL('image/png', 1.0);
      const imgData2 = chart2.toDataURL('image/png', 1.0);

      const pdfWidth = 280;
      const pdfHeight = (chart1.height / chart1.width) * pdfWidth;

      doc.text(`Reporte de Promedio del Lote: ${loteName}`, 10, 10);
      doc.addImage(imgData1, 'PNG', 10, 20, pdfWidth, pdfHeight);
      doc.addPage();
      doc.addImage(imgData2, 'PNG', 10, 20, pdfWidth, pdfHeight);

      // Quita espacios y caracteres raros del nombre
      const safeName = loteName.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
      doc.save(`Promedio_del_lote_${safeName}.pdf`);
    } else {
      console.error('No se encontraron los gráficos');
    }
  }

  // 🔹 Genera PDF del modal comparativo
  async generatePDFComparativo() {
    let loteName = 'lote';
    const posiblesIds = ['modalLoteInfo', 'modalLoteInfo2', 'modalLoteInfo3', 'modalLoteInfo4'];

    const doc = new jsPDF('l', 'mm', 'a4');

    const chart1 = document.getElementById('comparativoModal') as HTMLCanvasElement;
    const chart2 = document.getElementById('comparativoModalAnterior') as HTMLCanvasElement;

    for (const id of posiblesIds) {
      const el = document.getElementById(id);
      if (el && el.innerText && el.innerText.trim() !== 'No definido') {
        loteName = el.innerText.trim();
        break; // sale al encontrar el primero válido
      }
    }

    if (chart1 && chart2) {
      const imgData1 = chart1.toDataURL('image/png', 1.0);
      const imgData2 = chart2.toDataURL('image/png', 1.0);

      const pdfWidth = 280;
      const aspectRatio1 = chart1.width / chart1.height;
      const aspectRatio2 = chart2.width / chart2.height;
      const pdfHeight1 = pdfWidth / aspectRatio1;
      const pdfHeight2 = pdfWidth / aspectRatio2;

      doc.text(`Reporte Comparativo del Lote: ${loteName}`, 10, 10);
      doc.addImage(imgData1, 'PNG', 10, 20, pdfWidth, pdfHeight1);
      doc.addPage();
      doc.addImage(imgData2, 'PNG', 10, 20, pdfWidth, pdfHeight2);

      const safeName = loteName.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
      doc.save(`reporte_comparativo_${safeName}.pdf`);
    }
  }

  getLoteros(lote: string): void {
    this.loading = true;
    if (this.selectedId && this.selectedCodigo) {
      const data = {
        id: this.selectedId,
        codigo: this.selectedCodigo
      }
      this.cintaService.loteros(this.selectedId, this.selectedCodigo, this.selectedLote).subscribe(
        response => {
          if (response.length > 0) {
            this.datos = response;
            this.encabezados = Object.keys(response[0]); // Extraer encabezados dinámicamente
            this.calcularTotales(); // Calcula el total
          }

        }
      )
      this.loading = false;
    }
  }
  // Mapeo de títulos personalizados
  encabezadosPersonalizados: { [key: string]: string } = {
    'nombres': 'Empleado',
    'alias': 'Lote',
    'nomreelevo': 'Reelevo',
    'cant_pre': 'Presente',
    'cantfut': 'Futura',

  };
  obtenerTitulo(header: string): string {
    return this.encabezadosPersonalizados[header] || header; // Usa el mapeo o deja el original
  }
  calcularTotales() {

    this.totalPresente = 0;
    this.totalFutura = 0;

    this.datos.forEach(item => {
      //   console.log(this.datos)

      // Calcular total de Peso Procesado (asumiendo un campo de "Peso Procesado")
      const pesoPresente = parseFloat(item['cant_pre'].replace('kg', '').trim());
      if (!isNaN(pesoPresente)) this.totalPresente += pesoPresente;

      // Calcular total de Peso Estimado (asumiendo un campo de "Peso Estimado")
      const pesoFutura = parseFloat(item['cantfut'].replace('kg', '').trim());
      if (!isNaN(pesoFutura)) this.totalFutura += pesoFutura;
    });
  }

  consultarIndicadores(tipo: 'racimos' | 'libras', lote: string): void {
    this.loading = true;

    if (this.selectedId && this.selectedCodigo) {
      this.cintaService.consultarLote(this.selectedId, this.selectedCodigo, this.selectedLote).subscribe(
        ([response, response2, response3, response4]) => {
          const data = this.procesarDatos(tipo, response, response2, response3, response4);
          //  console.log(tipo)
          // console.log("4",response4);

          // Configuración dinámica según el tipo
          const config = tipo === 'racimos'
            ? {
              titulo: 'Promedio del Lote - Últimas 52 Semanas',
              yLabel: 'Racimos por Hectárea',
              y2Label: 'Peso Promedio',
              maxY: 90,
              maxY2: 90
            }
            : {
              titulo: 'Promedio Racimos y Libras del Lote  - Últimas 52 Semanas',
              yLabel: 'Racimos por Hectárea',
              y2Label: 'Libras por Hectárea',
              maxY: 90,
              maxY2: 5000
            };

          this.crearGraficosGenerales(tipo, data, config);
          console.log(data)
          console.log("tipo", tipo)
          this.loading = false;
        },
        (error) => {
          console.error('Error al consultar datos:', error);
          this.loading = false;
        }
      );
    }
  }

  private procesarDatos(tipo: 'racimos' | 'libras', response: any[], response2: any[], response3: any[], response4: any[]) {
    const promedio = (arr: any[], campo: string) => {
      const valores = arr.map(v => parseFloat(v[campo] || 0));
      return valores.length ? parseFloat((valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2)) : 0;
    };
    // 👇 Aquí decides los nombres de los campos según el tipo
    const campoLinea = tipo === 'libras' ? 'pesoxha' : 'peso';
    const campoLinea2 = tipo === 'libras' ? 'pesoxha' : 'peso_prom';

    return {
      labels: response.map(i => `${i.color} | ${i.codigo} | Sem:${i.semana}`),
      labels2: response3.map(i => `${i.color} | ${i.codigo} | Sem:${i.semana}`),
      labelsComparativo: response.map(i => `Cinta: ${i.codigo} | Sem:${i.semana} | ${i.anio}`),

      dataBar1: response.map(i => i.racxha),
      dataBar2: response2.map(i => i.racimosporhectarea),
      dataBar3: response3.map(i => i.racxha),
      dataBar4: response4.map(i => i.racimosporhectarea),

      // 👇 Aquí usas el campo dinámico según el tipo
      dataLine1: response.map(i => i[campoLinea]),
      dataLine2: response2.map(i => i[campoLinea2]),
      dataLine3: response3.map(i => i[campoLinea]),
      dataLine4: response4.map(i => i[campoLinea2]),

      /* dataLine1: response.map(i => i.racxha),
       dataLine2: response2.map(i => i.peso_prom),
       dataLine3: response3.map(i => i.racxha),
       dataLine4: response4.map(i => i.peso_prom),*/

      lastDataBar1: promedio(response, 'racxha'),
      lastDataBar2: promedio(response2, 'racimosporhectarea'),
      lastDataBar3: promedio(response3, 'racxha'),
      lastDataBar4: promedio(response4, 'racimosporhectarea'),

      // 👇 Promedios usando los campos correctos según el tipo
      lastLine1: promedio(response, campoLinea),
      lastLine2: promedio(response2, campoLinea2),
      lastLine3: promedio(response3, campoLinea),
      lastLine4: promedio(response4, campoLinea2),

      /*     lastLine1: promedio(response, 'peso'), //aqui hacer cambios
           lastLine2: promedio(response2, 'peso_prom'),
           lastLine3: promedio(response3, 'peso'),
           lastLine4: promedio(response4, 'peso_prom'),*/

      labelColors: response.map(i => this.colorEtiqueta(i.color)),
      labelColors2: response3.map(i => this.colorEtiqueta(i.color))
    };


  }

  private colorEtiqueta(color: string): string {
    switch (color?.toUpperCase()) {
      case 'AMARILLO': return '#CCCC00';
      case 'ROJO': return 'red';
      case 'CAFE': return 'brown';
      case 'AZUL': return 'blue';
      case 'LILA': return 'purple';
      case 'VERDE': return 'green';
      case 'BLANCO': return '#AAAAAA';
      default: return 'black';
    }
  }

  private crearGraficosGenerales(
    tipo: 'racimos' | 'libras',
    data: any,
    config: { titulo: string; yLabel: string; y2Label: string; maxY: number; maxY2: number }
  ): void {
    const suffix = tipo === 'racimos' ? '' : 'Libras';
    const ids = {
      actual: `myChart${suffix}`,
      anterior: `chartAnterior${suffix}`,
      comparativo: `comparativoModal${suffix}`,
      comparativoAnterior: `comparativoModalAnterior${suffix}`
    };

    // Destruir los gráficos previos si existen
    Object.values(ids).forEach((id: string) => {
      const chart = this.charts[id];
      if (chart) {
        try {
          chart.destroy();
          delete this.charts[id];
          console.log(`Gráfico con id ${id} destruido correctamente.`);
        } catch (error) {
          console.warn(`Error destruyendo gráfico con id ${id}:`, error);
        }
      }
    });

    // Crear y guardar nuevas instancias de los gráficos
    const chartActual = this.crearGrafico(ids.actual, data.labels, data, config, data.labelColors, tipo);
    if (chartActual) this.charts[ids.actual] = chartActual;

    const chartAnterior = this.crearGrafico(ids.anterior, data.labels2, data, config, data.labelColors2, tipo, true);
    if (chartAnterior) this.charts[ids.anterior] = chartAnterior;

    const chartComparativo = this.crearGraficoComparativo(ids.comparativo, data, config, data.labelColors, tipo);
    if (chartComparativo) this.charts[ids.comparativo] = chartComparativo;

    const chartComparativoAnterior = this.crearGraficoComparativo(ids.comparativoAnterior, data, config, data.labelColors, tipo, true);
    if (chartComparativoAnterior) this.charts[ids.comparativoAnterior] = chartComparativoAnterior;

  }

  private crearGrafico(
    canvasId: string,
    labels: string[],
    data: any,
    config: any,
    labelColors: string[],
    tipo: 'racimos' | 'libras',
    anterior = false
  ): Chart | undefined {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: `(${anterior ? data.lastDataBar3 : data.lastDataBar1}) Rac. Por Ha del Lote${anterior ? ' (Periodo Anterior)' : ''}`,
            data: anterior ? data.dataBar3 : data.dataBar1,
            borderColor: anterior ? 'rgba(255, 159, 64, 1)' : 'rgba(255, 99, 132, 1)',
            backgroundColor: anterior ? 'rgba(255, 159, 64, 0.2)' : 'rgba(255, 99, 132, 0.2)',
            yAxisID: 'y'
          },
          {
            label: `(${anterior ? data.lastDataBar4 : data.lastDataBar2}) Rac. por Ha por Cinta${anterior ? ' (Periodo Anterior)' : ''}`,
            data: anterior ? data.dataBar4 : data.dataBar2,
            borderColor: anterior ? 'rgba(153, 102, 255, 1)' : 'rgba(54, 162, 235, 1)',
            backgroundColor: anterior ? 'rgba(153, 102, 255, 0.2)' : 'rgba(54, 162, 235, 0.2)',
            yAxisID: 'y'
          },
          {
            label: `(${anterior ? data.lastLine3 : data.lastLine1}) ${tipo === 'libras' ? 'Libras' : 'Peso Promedio'} del lote${anterior ? ' (Periodo Anterior)' : ''}`,
            data: anterior ? data.dataLine3 : data.dataLine1,
            borderColor: anterior ? 'rgba(255, 159, 64, 1)' : 'rgba(255, 99, 132, 1)',
            type: 'line',
            fill: false,
            yAxisID: 'y2'
          },
          {
            label: `(${anterior ? data.lastLine4 : data.lastLine2}) ${tipo === 'libras' ? 'Libras' : 'Peso Promedio'} por Cinta${anterior ? ' (Periodo Anterior)' : ''}`,
            data: anterior ? data.dataLine4 : data.dataLine2,
            borderColor: anterior ? 'rgba(153, 102, 255, 1)' : 'rgba(54, 162, 235, 1)',
            type: 'line',
            fill: false,
            yAxisID: 'y2'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: config.titulo,
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          x: {
            ticks: { color: (ctx: any) => labelColors[ctx.index] }
          },
          y: {
            beginAtZero: true,
            max: config.maxY,
            title: { display: true, text: config.yLabel }
          },
          y2: {
            beginAtZero: true,
            max: config.maxY2,
            position: 'left',
            grid: { drawOnChartArea: false },
            title: { display: true, text: config.y2Label }
          }
        }
      }
    });
  }

  private crearGraficoComparativo(
    canvasId: string,
    data: any,
    config: any,
    labelColors: string[],
    tipo: 'racimos' | 'libras',
    mostrarPesos = false,// 👈 nuevo parámetro
    anterior = false
  ): Chart | undefined {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    // 🧹 Destruir gráfico previo si ya existe (evita duplicados)
    if (this.charts[canvasId]) {
      try {
        this.charts[canvasId].destroy();
        delete this.charts[canvasId];
        console.log(`🧹 Gráfico con id ${canvasId} destruido antes de recrearse.`);
      } catch (error) {
        console.warn(`Error destruyendo gráfico con id ${canvasId}:`, error);
      }
    }

    // 👇 elegir datasets según mostrarPesos
    let datasets: any[] = [];
    if (!mostrarPesos) {
      datasets = [
        { label: `(${data.lastDataBar1}) Rac. Por Ha del Lote`, data: data.dataBar1, borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)', tension: 0.3, fill: false },
        { label: `(${data.lastDataBar2}) Rac. por Ha por Cinta`, data: data.dataBar2, borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)', tension: 0.3, fill: false },
        { label: `(${data.lastDataBar3}) Rac. Por Ha del Lote (Periodo Anterior)`, data: data.dataBar3, borderColor: 'rgba(255, 159, 64, 1)', borderDash: [5, 5], fill: false },
        { label: `(${data.lastDataBar4}) Rac. por Ha por Cinta (Periodo Anterior)`, data: data.dataBar4, borderColor: 'rgba(153, 102, 255, 1)', borderDash: [5, 5], fill: false }
      ];
    } else {
      datasets = [
        { label: `(${data.lastLine1}) Peso del Lote`, data: data.dataLine1, borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)', tension: 0.3, fill: false },
        { label: `(${data.lastLine2}) Peso por Cinta`, data: data.dataLine2, borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)', tension: 0.3, fill: false },
        { label: `(${data.lastLine3}) Peso del Lote (Periodo Anterior)`, data: data.dataLine3, borderColor: 'rgba(255, 159, 64, 1)', borderDash: [5, 5], fill: false },
        { label: `(${data.lastLine4}) Peso por Cinta (Periodo Anterior)`, data: data.dataLine4, borderColor: 'rgba(153, 102, 255, 1)', borderDash: [5, 5], fill: false }
      ];
    }

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labelsComparativo, datasets

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: mostrarPesos
              ? `Comparativo de ${tipo === 'libras' ? 'racimos' : 'Pesos'} por Ha (Periodo Anterior)`
              : `Comparativo de ${tipo === 'libras' ? 'racimos' : 'Racimos'} por Ha - Últimas 52 Semanas`
          }
        },
        scales: {
          x: { ticks: { color: (ctx: any) => labelColors[ctx.index] } },
          y: { beginAtZero: true, suggestedMax: config.maxY }
        }
      }
    });
  }


}

