import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {HojasaldosService} from '../../../services/hojasaldos.service';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CommonModule} from '@angular/common';
import {LoaderComponent} from '../../../shared/spinner/loader/loader.component';
import {EstadisticasService} from '../../../services/estadisticas.service';
import {UserService} from '../../../services/user.service';

declare var $: any;

@Component({
  selector: 'app-hojadesaldo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './hojadesaldo.component.html',
  styleUrl: './hojadesaldo.component.css'
})
export class HojadesaldoComponent implements OnInit {
  loading = false;
  datos: any[] = [];
  datosEnfunde: any[] = [];
  datosCaidas: any[] = [];
  secciones: string[] = [];
  datosPivotados: any[] = [];
  dataTable: any;
  codigos: any[] = [];
  anioDefault: number = new Date().getFullYear();

  usuarioActual: string = '';
  haciendaSeleccionada: string = '';

  haciendas = [
    {id: 1, nombre: 'PRIMOBANANO'},
    {id: 3, nombre: 'SOFCABANANO'}
  ];

  filtroForm: FormGroup;

  constructor(
    private saldosService: HojasaldosService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private cintaService: EstadisticasService,
    private userService: UserService,
  ) {
    this.filtroForm = this.fb.group({
      idhacienda: [''],
      anio: new FormControl(this.anioDefault, [
        Validators.required,
        Validators.min(2020),
        Validators.max(this.anioDefault)
      ]),

      codigo: ['', [Validators.required, Validators.pattern('^[0-9]{1,5}$')]]
    });

  }


  ngOnInit(): void {
    this.usuarioActual = this.userService.getUsername() ?? 'Invitado';
    //cargar codigos del año actual
    this.cargarCodigo(this.anioDefault);
    //cuando cambie el año
    this.filtroForm.get('anio')?.valueChanges
      .pipe(
        debounceTime(500),          // espera que el usuario deje de escribir
        distinctUntilChanged()      // evita repetir el mismo valor
      )
      .subscribe((anio: number) => {
        if (anio && anio.toString().length === 4) {
          this.cargarCodigo(anio);
          this.filtroForm.get('codigo')?.reset(); // limpiar selección
          this.verificarYConsultar();              // por si ya hay otros filtros
        }
      });

    this.filtroForm.get('idhacienda')?.valueChanges.subscribe((id: number) => {
      const idNmu= Number(id);
      const hacienda = this.haciendas.find(h => h.id === idNmu);

      this.haciendaSeleccionada = hacienda ? hacienda.nombre : '';

      this.verificarYConsultar();
    });


    this.filtroForm.get('codigo')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.verificarYConsultar();
      });
  }
  cargarCodigo(anio:number):void{
    this.cintaService.calendar(anio).subscribe({
      next: (data: any) => {
        this.codigos = data;

      },
      error: (error) => {
        this.codigos = [];
      }
    });
  }

  verificarYConsultar(): void {
    const idhacienda = this.filtroForm.get('idhacienda')?.value;
    const codigo = this.filtroForm.get('codigo')?.value;
    if (idhacienda && codigo && codigo.toString().length === 5) {
      this.obtenerDatos(idhacienda, codigo);
    }
  }

  obtenerDatos(idhacienda: number, codigo: number): void {
    this.loading = true;
    this.saldosService.obtenerEnfundeSaldos(idhacienda, codigo).subscribe({
      next: ({saldos, metas, caidas}) => {
        this.datos = saldos;
        this.datosEnfunde = metas;
        this.datosCaidas = caidas;
        this.procesarSecciones();
        this.procesarDatos();

        // Usamos ChangeDetectorRef para asegurar que Angular actualice la vista
        this.cdr.detectChanges(); // Forzar la actualización de la vista antes de crear la tabla

        // Esperar a que Angular haga su cambio y luego inicializamos la tabla
        setTimeout(() => {
          this.reinicializarDataTable();
          this.loading = false; // Apagar el loader
        }, 0); // Retardamos un poco la llamada a reinicializar la tabla
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  procesarSecciones() {
    const seccionesSet = new Set<string>();
    this.datos.forEach(item => seccionesSet.add(item.cs_seccion));
    this.secciones = Array.from(seccionesSet).sort();
  }

  procesarDatos() {
    const agrupado: { [color: string]: any[] } = {};
    const totalesPorColor: { [color: string]: any } = {};

    // Agrupar los datos normales
    this.datos.forEach(item => {
      const color = item.color;
      const fecha = item.cs_fecha;
      const cantidad = parseInt(item.cantidad, 10);

      if (!agrupado[color]) agrupado[color] = [];

      let fila = agrupado[color].find(f => f.fecha === fecha);
      if (!fila) {
        fila = { fecha, totalFecha: 0 };
        this.secciones.forEach(sec => (fila[sec] = 0));
        agrupado[color].push(fila);
      }

      fila[item.cs_seccion] += cantidad;
      fila.totalFecha += cantidad;

      if (!totalesPorColor[color]) {
        totalesPorColor[color] = { totalColor: 0 };
        this.secciones.forEach(sec => (totalesPorColor[color][sec] = 0));
      }

      totalesPorColor[color][item.cs_seccion] += cantidad;
      totalesPorColor[color].totalColor += cantidad;
    });

    this.datosPivotados = [];

    for (const color in agrupado) {
      const codigoColor = this.datos.find(d => d.color === color)?.codigo || '';

      // ------------------------------
      // ⭐ FILA CABECERA POR COLOR
      // ------------------------------
      const filaCabecera: any = {
        color,
        codigo: codigoColor,
        fecha: '',
        esCabecera: true,
        total: ''   // <-- agregar total vacío
      };

      this.secciones.forEach(sec => filaCabecera[sec] = '');  // <-- agregar columnas vacías

      this.datosPivotados.push(filaCabecera);


      // ------------------------------
      // ⭐ FILA ENFUNDE
      // ------------------------------
      const metasPorColor = this.datosEnfunde.filter(m => m.color === color);
      let totalMeta = 0;

      if (metasPorColor.length) {
        const filaMeta: any = {
          color,
          fecha: 'ENFUNDE',
          total: metasPorColor.reduce((sum, m) => sum + parseInt(m.enfunde, 10), 0)
        };
        totalMeta = filaMeta.total;

        this.secciones.forEach(sec => {
          const metaSeccion = metasPorColor.find(m => m.cs_seccion === sec);
          filaMeta[sec] = metaSeccion ? parseInt(metaSeccion.enfunde, 10) : 0;
        });

        this.datosPivotados.push(filaMeta);
      }

      // ------------------------------
      // ⭐ FILA CAIDAS
      // ------------------------------
      const caidasPorColor = this.datosCaidas.filter(c => c.color === color);

      if (caidasPorColor.length) {
        const filaCaidas: any = {
          color,
          fecha: 'CAIDAS',
          total: caidasPorColor.reduce((sum, c) => sum + parseInt(c.cantidad, 10), 0)
        };

        this.secciones.forEach(sec => {
          const item = caidasPorColor.find(c => c.pe_seccion === sec);
          filaCaidas[sec] = item ? parseInt(item.cantidad, 10) : 0;
        });

        this.datosPivotados.push(filaCaidas);
      }

      // ------------------------------
      // ⭐ DATOS NORMALES
      // ------------------------------
      agrupado[color]
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        .forEach(fila => {
          fila.total = fila.totalFecha;
          this.datosPivotados.push({ color, codigo: codigoColor, ...fila });
        });

      // ------------------------------
      // ⭐ TOTAL COSECHA
      // ------------------------------
      const totalDatos = totalesPorColor[color].totalColor;
      this.datosPivotados.push({
        color,
        fecha: 'TOTAL COSECHA',
        ...totalesPorColor[color],
        total: totalDatos
      });

      // ------------------------------
      // ⭐ SALDO = ENFUNDE - (COSECHA + CAIDAS)
      // ------------------------------
      if (totalMeta > 0) {
        const totalCaidas = caidasPorColor.reduce((sum, c) => sum + parseInt(c.cantidad, 10), 0);
        const totalTrabajo = totalDatos + totalCaidas;

        const filaDiferencia: any = {
          color,
          fecha: 'SALDO',
          total: totalMeta - totalTrabajo
        };
        this.secciones.forEach(sec => {
          const cosechaSeccion = totalesPorColor[color][sec] || 0;
          const caidaObj = caidasPorColor.find(c => c.pe_seccion === sec);
          const caidaSeccion = caidaObj ? parseInt(caidaObj.cantidad, 10) : 0;
          const metaSeccionObj = this.datosEnfunde.find(
            m => m.color === color && m.cs_seccion === sec
          );
          const metaSeccion = metaSeccionObj ? parseInt(metaSeccionObj.enfunde, 10) : 0;

          filaDiferencia[sec] = metaSeccion - (cosechaSeccion + caidaSeccion);
        });

        this.datosPivotados.push(filaDiferencia);

        if (totalMeta > 0) {
          // totalCaidas y totalTrabajo ya calculados en la fila SALDO
          const filaPorcentaje: any = {
            color,
            fecha: 'RECOBRO',
            total: ((totalDatos + totalCaidas) / totalMeta * 100).toFixed(2) + '%'
          };

          this.secciones.forEach(sec => {
            const cosechaSeccion = totalesPorColor[color][sec] || 0;
            const caidaObj = caidasPorColor.find(c => c.pe_seccion === sec);
            const caidaSeccion = caidaObj ? parseInt(caidaObj.cantidad, 10) : 0;
            const metaSeccionObj = this.datosEnfunde.find(
              m => m.color === color && m.cs_seccion === sec
            );
            const metaSeccion = metaSeccionObj ? parseInt(metaSeccionObj.enfunde, 10) : 0;

            filaPorcentaje[sec] =
              metaSeccion > 0 ? ((cosechaSeccion + caidaSeccion) / metaSeccion * 100).toFixed(2) + '%' : '0%';
          });

          this.datosPivotados.push(filaPorcentaje);
        }
      }

    }
  }

  reinicializarDataTable() {
    if (!this.datosPivotados || this.datosPivotados.length === 0) return;

    // --- MARCAR FILAS DONDE MOSTRAR COLOR Y CÓDIGO ---
    let colorVisto: { [color: string]: boolean } = {};
    this.datosPivotados.forEach(row => {
      if (!['ENFUNDE', 'TOTAL COSECHA', 'SALDO', 'CAIDAS', 'RECOBRO'].includes(row.fecha)) {
        if (!colorVisto[row.color]) {
          row.mostrarColor = true; // primera fila del color
          colorVisto[row.color] = true;
        } else {
          row.mostrarColor = false; // filas siguientes solo mostrar fecha
        }
      } else {
        row.mostrarColor = true; // siempre mostrar filas especiales
      }
    });

    const columns = [
      {
        title: 'Color',
        data: null,
        render: (data: any, type: any, row: any) => {
          const colorFondo = this.getColorByNombre(row.color);
          const colorTexto = this.getContrasteColor(colorFondo);

          // --- FILAS ESPECIALES ---
          if (row.fecha === 'ENFUNDE') return `<div style="font-weight:bold; padding:2px 6px; border-radius:4px; display:inline-block;">ENFUNDE</div>`;
          if (row.fecha === 'CAIDAS') return `<div style="font-weight:bold; padding:2px 6px; border-radius:4px; display:inline-block;">CAIDAS</div>`;
          if (['TOTAL COSECHA', 'SALDO', 'RECOBRO'].includes(row.fecha)) return `<div style="font-weight:bold;">${row.fecha}</div>`;

          // --- FILAS NORMALES ---
          if (row.mostrarColor) {
            return `
            <div style="
              font-weight:bold;
              color:${colorTexto};
              background-color:${colorFondo};
              padding:3px 6px;
              border-radius:4px;
              display:inline-block;
              white-space:nowrap;
              line-height:1.1;
            ">
              ${row.color} ${row.codigo || ''}
            </div>
          `;
          } else {
            return `
            <div style="
              font-size: 0.85em;
              color: ${colorTexto};
              background-color: ${colorFondo};
              padding: 2px 6px;
              border-radius: 4px;
              display: inline-block;
            ">
              ${row.fecha}
            </div>
          `;
          }
        }
      },

      // Columnas de secciones
      ...this.secciones.map(sec => ({ title: sec, data: sec, defaultContent: '' })),
      { title: 'Total', data: 'total', name: 'total' }
    ];

    if ($.fn.DataTable.isDataTable('#tablaProduccion')) {
      $('#tablaProduccion').DataTable().clear().destroy();
      $('#tablaProduccion').empty();
    }

    this.dataTable = $('#tablaProduccion').DataTable({
      paging: true,
      ordering: false,
      dom: '<"d-flex justify-content-between align-items-center mb-2"<"length-div"l><"search-div"f>>Brtip',
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Todos"]],
      data: this.datosPivotados,
      columns: columns,
      columnDefs: [{ targets: 0, orderable: false }],
      buttons: [
        { extend: 'copyHtml5', text: '<i class="bi bi-clipboard"></i>', className: 'btn btn-outline-primary btn-sm me-1', titleAttr: 'Copiar' },
        { extend: 'excelHtml5', text: '<i class="bi bi-file-earmark-excel"></i>', className: 'btn btn-outline-success btn-sm me-1', titleAttr: 'Exportar Excel',
          filename: () => {
            const fecha = new Date();
            const dd = String(fecha.getDate()).padStart(2, '0');
            const mm = String(fecha.getMonth() + 1).padStart(2, '0');
            const yyyy = fecha.getFullYear();
            return `Hojadesaldo_${dd}${mm}${yyyy}`;
          },
          title: null,
          customize: (xlsx: any) => {

            const sheet = xlsx.xl.worksheets['sheet1.xml'];
            const sheetData = sheet.getElementsByTagName('sheetData')[0];
            const rows = sheetData.getElementsByTagName('row');

            const filasExtras = 5; // cuántas filas nuevas agregas arriba

            // 1️⃣ Desplazar filas existentes hacia abajo
            for (let i = rows.length - 1; i >= 0; i--) {
              const row = rows[i];
              const r = parseInt(row.getAttribute('r') || '0');
              row.setAttribute('r', (r + filasExtras).toString());

              // actualizar referencias de celdas (A1, B1, C1, etc.)
              const cells = row.getElementsByTagName('c');
              for (let j = 0; j < cells.length; j++) {
                const ref = cells[j].getAttribute('r');
                if (ref) {
                  const col = ref.replace(/\d+/g, '');
                  cells[j].setAttribute('r', col + (r + filasExtras));
                }
              }
            }

            // 2️⃣ Crear filas nuevas correctamente
            const fecha = new Date();
            const fechaStr = fecha.toLocaleDateString();
            const horaStr = fecha.toLocaleTimeString();

            const hacienda = this.haciendaSeleccionada || 'N/A';
            const usuario = this.usuarioActual || 'N/A';

            const nuevasFilas = `
    <row r="1">
      <c t="inlineStr"><is><t>HOJA DE SALDOS</t></is></c>
    </row>
    <row r="2">
      <c t="inlineStr"><is><t>Hacienda:</t></is></c>
      <c t="inlineStr"><is><t>${hacienda}</t></is></c>
    </row>
    <row r="3">
      <c t="inlineStr"><is><t>Usuario:</t></is></c>
      <c t="inlineStr"><is><t>${usuario}</t></is></c>
    </row>
    <row r="4">
      <c t="inlineStr"><is><t>Fecha:</t></is></c>
      <c t="inlineStr"><is><t>${fechaStr} ${horaStr}</t></is></c>
    </row>
    <row r="5"></row>
  `;

            sheetData.insertAdjacentHTML('afterbegin', nuevasFilas);
          }


        },

        {extend: 'pdfHtml5',
        text: '<i class="bi bi-file-earmark-pdf"></i>',
        className: 'btn btn-outline-danger btn-sm me-1',
        titleAttr: 'Exportar PDF',
        filename: () => {
        const fecha = new Date();
        const dd = String(fecha.getDate()).padStart(2, '0');
        const mm = String(fecha.getMonth() + 1).padStart(2, '0');
        const yyyy = fecha.getFullYear();
        return `Hojadesaldo_${dd}${mm}${yyyy}`;
        },
         title: 'HOJA DE SALDOS',
         orientation: 'landscape',
         pageSize: 'A2',
         exportOptions: { columns: ':visible' },
      /*  customize: function (doc:any) {
          // Reducir márgenes al mínimo
          doc.pageMargins = [10, 10, 10, 10]; // [izquierda, arriba, derecha, abajo] en puntos

          // Ajustar el tamaño de la fuente
          doc.defaultStyle.fontSize = 7; // puedes subirlo si los márgenes permiten
          doc.styles.tableHeader.fontSize = 8;

          // Ajustar el ancho de columnas de forma uniforme
          var columnCount = doc.content[1].table.body[0].length;
          doc.content[1].table.widths = Array(columnCount).fill('*');
        }*/
          customize: (doc:any) => {
            const fecha = new Date();
            const fechaStr= fecha.toLocaleDateString();
            const horaStr = fecha.toLocaleTimeString();

            doc.content.unshift({
              margin:[0,0,0,10],
              alignment:'left',
              stack:[
                { text:`Hacienda: ${this.haciendaSeleccionada || 'N/A'}`, bold:true},
                { text:`Usuario: ${this.usuarioActual }`, bold:true},
                { text:`Fecha: ${fechaStr} ${horaStr}`, bold:true},
              ]
            });

            doc.pageMargins = [10,10,10,10];
            doc.defaultStyle = 7;
            doc.styles.tableHeader.fontSize = 8;

            //buscar la tabla dinamicamente
            const tabla = doc.content.find((c:any) => c.table);

            if (tabla && tabla.table && tabla.table.body?.length) {
              const columnCount = tabla.table.body[0].length;

              const widths = [];
              for (let i = 0; i < columnCount; i++) {
                if(i === 0) widths.push(60); //color
                else if (i === columnCount - 1) widths.push(60); //total
                else widths.push(35);
              }
              tabla.table.width = widths;

            }

          }
        },

        { extend: 'print', text: '<i class="bi bi-printer"></i>', className: 'btn btn-outline-primary btn-sm me-1', titleAttr: 'Imprimir',
        title: 'Hoja de saldos'}
          ],
          createdRow: (row: any, data: any) => {
            const $row = $(row);
            const $celdas = $row.find('td');
            const primeraCelda = $celdas.eq(0);

            // --- Estilos por fila ---
            if (data.fecha === 'ENFUNDE') $celdas.css({ 'background-color': '#6badef', 'font-weight': 'bold' });
            else if (data.fecha === 'TOTAL COSECHA') $row.addClass('fila-total');
            else if (data.fecha === 'SALDO') $celdas.css({ 'background-color': '#fff3cd', 'color': '#856404', 'font-weight': 'bold' });
            else if (data.fecha === 'CAIDAS') $celdas.css({ 'background-color': '#8f8d8d', 'font-weight': 'bold' });
            else if (data.fecha === 'RECOBRO') {
              $celdas.each((index: any, cell: any) => {
                if (index === 0) return; // saltar la primera columna
                const val = parseFloat($(cell).text()) || 0;
                if (val > 100) {
                  $(cell).css({'color': '#842029', 'font-weight': 'bold'}); // rojo si >100%
                } else {
                  $(cell).css({'color': '#090909', 'font-weight': 'bold'}); // negro normal
                }
              });
            }
            else primeraCelda.css({ 'background-color': this.getColorByNombre(data.color) });

            // Colorear valores negativos y positivos
            $celdas.each((index: any, cell: any) => {
              if (index === 0) return;
              if (index === $celdas.length - 1) return;
              const text = $(cell).text().trim();
              if (!text.endsWith('%')) {
                const val = parseInt(text) || 0;
                if (val < 0) $(cell).css({ 'color': '#842029', 'font-weight': 'bold' });
                else if (val > 0) $(cell).css({ 'color': '#090909', 'font-weight': 'bold' });
                else $(cell).css({ 'color': 'inherit', 'font-weight': 'normal' });
              }
            });
          },
          footerCallback: (row: any, data: any, start: any, end: any, display: any) => {
            const api = $('#tablaProduccion').DataTable();

            // Totales por sección
            this.secciones.forEach((sec: string, i: number) => {
              let total = 0;
              api.column(i + 2, { page: 'current' }).nodes().each((cell: any) => {
                const text = $(cell).text().trim();
                if (!text.endsWith('%')) total += parseInt(text) || 0;
              });
              $(api.column(i + 2).footer()).html(total);
            });

            // Total general
            let totalGeneral = 0;
            const totalColumn = api.column('total:name', { page: 'current' });
            if (totalColumn) {
              totalColumn.nodes().each((cell: any) => {
                const text = $(cell).text().trim();
                if (!text.endsWith('%')) totalGeneral += parseInt(text) || 0;
              });
              $(api.column('total:name').footer()).html(totalGeneral);
            }
          }
    });

    // Sticky headers
    $('th').css({ position: 'sticky', top: '0', 'background-color': '#f8f9fa', 'z-index': '10' });
  }

  getColorByNombre(color: string): string {
    switch ((color || '').toLowerCase()) {
      case 'rojo':
        return '#fa1f06';
      case 'azul':
        return '#025bdf';
      case 'verde':
        return '#168104';
      case 'amarillo':
        return '#ffb319';
      case 'cafe':
        return '#6e5244';
      case 'lila':
        return '#5a26dd';
      case 'negro':
        return '#1a110e';
      case 'blanco':
        return '#ffffff';
      default:
        return 'transparent';
    }
  }

  getContrasteColor(colorHex: string): string {
    if (!colorHex) return 'black';
    // Quitar #
    const hex = colorHex.replace('#', '');
    // Separar en RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Calcular luminancia
    const luminancia = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminancia > 186 ? 'black' : 'white'; // >186 = fondo claro → usar negro
  }




}
