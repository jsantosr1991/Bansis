import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { HojasaldosService } from '../../../services/hojasaldos.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/spinner/loader/loader.component';
import { EstadisticasService } from '../../../services/estadisticas.service';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import Swal from 'sweetalert2';

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
    { id: 1, nombre: 'PRIMOBANANO' },
    { id: 3, nombre: 'SOFCABANANO' }
  ];

  filtroForm: FormGroup;

  constructor(
    private saldosService: HojasaldosService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private cintaService: EstadisticasService,
    private userService: UserService,
    private alertService: AlertService // 🔥 AGREGAR
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
      const idNmu = Number(id);
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
  cargarCodigo(anio: number): void {
    this.loading = true;
    this.cintaService.calendar(anio).subscribe({
      next: (data: any) => {
        this.codigos = data;
        this.loading = false
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
      next: ({ saldos, metas, caidas }) => {
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

    // Cosecha
    this.datos.forEach(item => {
      if (item.cs_seccion) seccionesSet.add(item.cs_seccion);
    });

    // Enfunde
    this.datosEnfunde.forEach(item => {
      if (item.cs_seccion) seccionesSet.add(item.cs_seccion);
    });

    // Caídas
    this.datosCaidas.forEach(item => {
      if (item.pe_seccion) seccionesSet.add(item.pe_seccion);
    });

    this.secciones = Array.from(seccionesSet).sort();
  }

  procesarDatos() {

    const agrupado: { [color: string]: any[] } = {};
    const totalesPorColor: { [color: string]: any } = {};

    // ==================================================
    // UNIFICAR COLORES
    // ==================================================

    const coloresSet = new Set<string>();

    this.datos.forEach(d => coloresSet.add(d.color));
    this.datosEnfunde.forEach(d => coloresSet.add(d.color));
    this.datosCaidas.forEach(d => coloresSet.add(d.color));

    const colores = Array.from(coloresSet).sort((a, b) => {

      const codigoA =
        parseInt(
          this.datos.find(d => d.color === a)?.codigo || '0',
          10
        );

      const codigoB =
        parseInt(
          this.datos.find(d => d.color === b)?.codigo || '0',
          10
        );

      // 🔥 DESCENDENTE
      return codigoB - codigoA;
    });

    // ==================================================
    // AGRUPAR COSECHA
    // ==================================================

    this.datos.forEach(item => {

      const color = item.color;
      const fecha = item.cs_fecha;

      // 🔥 ESTOS FALTABAN
      const semana = item.semana;
      const edad = item.edad;

      const cantidad = parseInt(item.cantidad, 10);

      if (!agrupado[color]) {
        agrupado[color] = [];
      }

      let fila =
        agrupado[color].find(f => f.fecha === fecha);

      if (!fila) {

        fila = {
          fecha,

          // 🔥 GUARDARLOS EN LA FILA
          semana,
          edad,

          totalFecha: 0
        };

        this.secciones.forEach(sec => {
          fila[sec] = 0;
        });

        agrupado[color].push(fila);
      }

      fila[item.cs_seccion] += cantidad;
      fila.totalFecha += cantidad;

      if (!totalesPorColor[color]) {

        totalesPorColor[color] = {
          totalColor: 0
        };

        this.secciones.forEach(sec => {
          totalesPorColor[color][sec] = 0;
        });
      }

      totalesPorColor[color][item.cs_seccion] += cantidad;
      totalesPorColor[color].totalColor += cantidad;

    });

    this.datosPivotados = [];

    // ==================================================
    // RECORRER COLORES
    // ==================================================

    colores.forEach(color => {

      if (!agrupado[color]) {
        agrupado[color] = [];
      }

      const codigoColor =
        this.datos.find(d => d.color === color)?.codigo ||
        this.datosEnfunde.find(d => d.color === color)?.codigo ||
        '';

      const totalesColor =
        totalesPorColor[color] || { totalColor: 0 };

      const totalDatos =
        totalesColor.totalColor || 0;

      // ==================================================
      // CABECERA
      // ==================================================

      const filaCabeceraInicial: any = {
        color,
        codigo: codigoColor,
        fecha: '',
        esCabecera: true,
        total: ''
      };

      this.secciones.forEach(sec => {
        filaCabeceraInicial[sec] = '';
      });

      this.datosPivotados.push(filaCabeceraInicial);

      // ==================================================
      // ENFUNDE
      // ==================================================

      const metasPorColor =
        this.datosEnfunde.filter(m => m.color === color);

      let totalMeta = 0;

      if (metasPorColor.length) {

        const filaMeta: any = {
          color,
          fecha: 'ENFUNDE',
          total: metasPorColor.reduce(
            (sum, m) => sum + parseInt(m.enfunde, 10),
            0
          )
        };

        totalMeta = filaMeta.total;

        this.secciones.forEach(sec => {

          const metaSeccion =
            metasPorColor.find(
              m => m.cs_seccion === sec
            );

          filaMeta[sec] =
            metaSeccion
              ? parseInt(metaSeccion.enfunde, 10)
              : 0;
        });

        this.datosPivotados.push(filaMeta);
      }

      // ==================================================
      // CAIDAS
      // ==================================================

      const caidasPorColor =
        this.datosCaidas.filter(c => c.color === color);

      if (caidasPorColor.length) {

        const filaCaidas: any = {
          color,
          fecha: 'CAIDAS',
          total: caidasPorColor.reduce(
            (sum, c) => sum + parseInt(c.cantidad, 10),
            0
          )
        };

        this.secciones.forEach(sec => {

          const item =
            caidasPorColor.find(
              c => c.pe_seccion === sec
            );

          filaCaidas[sec] =
            item
              ? parseInt(item.cantidad, 10)
              : 0;
        });

        this.datosPivotados.push(filaCaidas);
      }

      // ==================================================
      // DATOS COSECHA
      // ==================================================

      agrupado[color]
        .sort((a, b) =>
          new Date(a.fecha).getTime() -
          new Date(b.fecha).getTime()
        )
        .forEach(fila => {

          fila.total = fila.totalFecha;

          this.datosPivotados.push({
            color,
            codigo: codigoColor,
            ...fila
          });
        });

      // ==================================================
      // TOTAL COSECHA
      // ==================================================

      this.datosPivotados.push({
        color,
        fecha: 'TOTAL COSECHA',
        ...totalesColor,
        total: totalDatos
      });

      // ==================================================
      // SALDO + RECOBRO
      // ==================================================

      if (totalMeta > 0) {

        const totalCaidas =
          caidasPorColor.reduce(
            (sum, c) =>
              sum + parseInt(c.cantidad, 10),
            0
          );

        const totalTrabajo =
          totalDatos + totalCaidas;

        // ============================
        // SALDO
        // ============================

        const filaSaldo: any = {
          color,
          fecha: 'SALDO',
          total: totalMeta - totalTrabajo
        };

        this.secciones.forEach(sec => {

          const cosechaSeccion =
            totalesColor[sec] || 0;

          const caidaObj =
            caidasPorColor.find(
              c => c.pe_seccion === sec
            );

          const caidaSeccion =
            caidaObj
              ? parseInt(caidaObj.cantidad, 10)
              : 0;

          const metaSeccionObj =
            this.datosEnfunde.find(
              m =>
                m.color === color &&
                m.cs_seccion === sec
            );

          const metaSeccion =
            metaSeccionObj
              ? parseInt(metaSeccionObj.enfunde, 10)
              : 0;

          filaSaldo[sec] =
            metaSeccion -
            (cosechaSeccion + caidaSeccion);

        });

        this.datosPivotados.push(filaSaldo);

        // ============================
        // RECOBRO %
        // ============================

        const filaPorcentaje: any = {
          color,
          fecha: 'RECOBRO',
          total:
            totalMeta > 0
              ? (
                (totalTrabajo / totalMeta) * 100
              ).toFixed(2) + '%'
              : '0%'
        };

        this.secciones.forEach(sec => {

          const cosechaSeccion =
            totalesColor[sec] || 0;

          const caidaObj =
            caidasPorColor.find(
              c => c.pe_seccion === sec
            );

          const caidaSeccion =
            caidaObj
              ? parseInt(caidaObj.cantidad, 10)
              : 0;

          const metaSeccionObj =
            this.datosEnfunde.find(
              m =>
                m.color === color &&
                m.cs_seccion === sec
            );

          const metaSeccion =
            metaSeccionObj
              ? parseInt(metaSeccionObj.enfunde, 10)
              : 0;

          filaPorcentaje[sec] =
            metaSeccion > 0
              ? (
                (
                  (cosechaSeccion + caidaSeccion)
                  / metaSeccion
                ) * 100
              ).toFixed(2) + '%'
              : '0%';

        });

        this.datosPivotados.push(filaPorcentaje);

        // ==================================================
        // FILA VACÍA SEPARADORA
        // ==================================================

        const filaEspacio: any = {
          color: '',
          fecha: '',
          total: '',
          esSeparador: true
        };

        this.secciones.forEach(sec => {
          filaEspacio[sec] = '';
        });

        this.datosPivotados.push(filaEspacio);

        // ==================================================
        // CABECERA REPETIDA
        // ==================================================

        const filaCabeceraExcel: any = {
          color: 'Color',
          fecha: '',
          total: 'Total',
          esCabeceraExcel: true
        };

        this.secciones.forEach(sec => {
          filaCabeceraExcel[sec] = sec;
        });

        // 🔥 SOLO agregar cabecera si NO es el último color
        const esUltimoColor = color === colores[colores.length - 1];

        if (!esUltimoColor) {
          this.datosPivotados.push(filaCabeceraExcel);
        }

      }

    });

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

            const semana =
              row.semana
                ? `${row.semana} `
                : '';

            const edad =
              row.edad
                ? ` ${row.edad}`
                : '';

            return `
    <div style="
      font-size:0.80em;
      color:${colorTexto};
      background-color:${colorFondo};
      padding:2px 6px;
      border-radius:4px;
      display:inline-block;
      white-space:nowrap;
      line-height:1.2;
    ">
      ${semana}
      ${row.fecha || ''}
      ${edad}
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
      lengthMenu: [[75, 100, -1], [75, 100, "Todos"]],
      data: this.datosPivotados,
      columns: columns,
      columnDefs: [{ targets: 0, orderable: false }],
      buttons: [
        {
          extend: 'copyHtml5',
          text: '<i class="bi bi-clipboard"></i>',
          className: 'btn btn-primary btn-sm me-1',
          titleAttr: 'Copiar'
        },

        {
          extend: 'excelHtml5',
          text: '<i class="bi bi-file-earmark-excel"></i>',
          className: 'btn btn-success btn-sm me-1',
          titleAttr: 'Exportar Excel',

          action: (e: any, dt: any, button: any, config: any) => {

            this.alertService.loading('Generando Excel...');

            setTimeout(() => {
              $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, button, config);

              setTimeout(() => {
                this.alertService.close();
                this.alertService.success('Excel generado correctamente');
              }, 700);

            }, 100);
          },

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
            const styles = xlsx.xl['styles.xml'];

            // =====================================================
            // CREAR ESTILOS
            // =====================================================

            const fills = styles.getElementsByTagName('fills')[0];
            const borders = styles.getElementsByTagName('borders')[0];
            const cellXfs = styles.getElementsByTagName('cellXfs')[0];

            // 🔥 Fill amarillo
            fills.innerHTML += `
    <fill>
      <patternFill patternType="solid">
        <fgColor rgb="FFFF00"/>
        <bgColor indexed="64"/>
      </patternFill>
    </fill>
  `;

            const fillId = fills.children.length - 1;

            // 🔥 Border completo
            borders.innerHTML += `
    <border>
      <left style="thin"><color auto="1"/></left>
      <right style="thin"><color auto="1"/></right>
      <top style="thin"><color auto="1"/></top>
      <bottom style="thin"><color auto="1"/></bottom>
    </border>
  `;

            const borderId = borders.children.length - 1;

            // 🔥 estilo borde normal
            cellXfs.innerHTML += `
    <xf numFmtId="0"
        fontId="0"
        fillId="0"
        borderId="${borderId}"
        applyBorder="1"/>
  `;

            const estiloBorde =
              (cellXfs.children.length - 1).toString();

            // 🔥 estilo amarillo + borde
            cellXfs.innerHTML += `
    <xf numFmtId="0"
        fontId="0"
        fillId="${fillId}"
        borderId="${borderId}"
        applyFill="1"
        applyBorder="1"/>
  `;

            const estiloAmarillo =
              (cellXfs.children.length - 1).toString();

            // =====================================================
            // MOVER FILAS
            // =====================================================

            const filasExtras = 5;

            for (let i = rows.length - 1; i >= 0; i--) {

              const row = rows[i];

              const r =
                parseInt(row.getAttribute('r') || '0');

              row.setAttribute(
                'r',
                (r + filasExtras).toString()
              );

              const cells =
                row.getElementsByTagName('c');

              for (let j = 0; j < cells.length; j++) {

                const ref =
                  cells[j].getAttribute('r');

                if (ref) {

                  const col =
                    ref.replace(/\d+/g, '');

                  cells[j].setAttribute(
                    'r',
                    col + (r + filasExtras)
                  );
                }
              }
            }

            // =====================================================
            // CABECERA
            // =====================================================

            const fecha = new Date();

            const fechaStr =
              fecha.toLocaleDateString();

            const horaStr =
              fecha.toLocaleTimeString();

            const nuevasFilas = `
    <row r="1">
  <c t="inlineStr">
    <is>
      <r>
        <rPr><b/></rPr>
        <t>ENFUNDE VS RECOBRO SEMANAL POR LOTES</t>
      </r>
    </is>
  </c>
</row>

    <row r="2">
  <c t="inlineStr">
    <is>
      <r>
        <rPr><b/></rPr>
        <t>Hacienda:</t>
      </r>
      <r>
        <t>${this.haciendaSeleccionada || 'N/A'}</t>
      </r>
    </is>
  </c>
</row>

    <row r="3">
      <c t="inlineStr">
        <is><t>Usuario:</t></is>
      </c>
      <c t="inlineStr">
        <is><t>${this.usuarioActual}</t></is>
      </c>
    </row>

    <row r="4">
      <c t="inlineStr">
        <is><t>Fecha:</t></is>
      </c>
      <c t="inlineStr">
        <is><t>${fechaStr} ${horaStr}</t></is>
      </c>
    </row>

    <row r="5"></row>
  `;

            sheetData.insertAdjacentHTML(
              'afterbegin',
              nuevasFilas
            );

            // =====================================================
            // APLICAR ESTILOS
            // =====================================================

            const todasLasFilas =
              sheet.getElementsByTagName('row');

            for (let i = 0; i < todasLasFilas.length; i++) {

              const row = todasLasFilas[i];

              const cells =
                row.getElementsByTagName('c');


              let esSaldo = false;
              let esRecobro = false;

              // detectar fila SALDO
              for (let j = 0; j < cells.length; j++) {

                const texto =
                  cells[j].textContent || '';

                if (texto.includes('SALDO')) {

                  esSaldo = true;
                  break;
                }
                if (texto.includes('RECOBRO')) {

                  esRecobro = true;
                }
              }

              // recorrer celdas
              for (let j = 0; j < cells.length; j++) {

                const cell = cells[j];

                const texto =
                  cell.textContent?.trim() || '';

                // ocultar ceros
                if (
                  texto === '0' ||
                  texto === '0.00'
                ) {

                  cell.textContent = '';
                }

                // ==================================
                // FILA RECOBRO
                // ==================================

                if (esSaldo) {

                  // 🔥 aplicar amarillo + bordes SIEMPRE
                  cell.setAttribute(
                    's',
                    estiloAmarillo
                  );

                  // 🔥 si la celda está vacía crear valor vacío
                  // para que Excel pinte el borde
                  if (!cell.textContent || cell.textContent.trim() === '') {

                    cell.setAttribute('t', 'inlineStr');

                    cell.innerHTML = `
                                <is><t>0</t></is>
                              `;
                  }

                  continue;
                }

                // ==================================
                // RESTO TABLA = BORDES
                // ==================================

                const estiloActual =
                  cell.getAttribute('s');

                // 🔥 conservar fechas y formatos
                if (!estiloActual) {

                  cell.setAttribute(
                    's',
                    estiloBorde
                  );
                }
              }
            }

            // ============================================
            // ESPACIO VISUAL ENTRE TABLAS
            // ============================================

            for (let i = 0; i < todasLasFilas.length; i++) {

              const row = todasLasFilas[i];

              const textoFila =
                row.textContent || '';


            }

            // ============================================
            // 🔥 AJUSTAR ANCHO DE COLUMNAS
            // ============================================

            const cols = sheet.getElementsByTagName('cols')[0];

            if (cols) {
              cols.innerHTML = '';

              // Primera columna (Color)
              cols.innerHTML += `
    <col min="1" max="1" width="18" customWidth="1"/>
  `;

              // Columnas de secciones
              for (let i = 0; i < this.secciones.length; i++) {

                cols.innerHTML += `
      <col min="${i + 2}" max="${i + 2}" width="8" customWidth="1"/>
    `;
              }

              // Última columna (Total)
              cols.innerHTML += `
    <col min="${this.secciones.length + 2}" 
         max="${this.secciones.length + 2}" 
         width="12" 
         customWidth="1"/>
  `;
            }

          }
        },
        /* 
                {
                  extend: 'pdfHtml5',
                  text: '<i class="bi bi-file-earmark-pdf"></i>',
                  className: 'btn btn-outline-danger btn-sm me-1',
                  titleAttr: 'Exportar PDF',
        
                  action: (e: any, dt: any, button: any, config: any) => {
        
                    this.alertService.loading('Generando PDF...');
        
                    // 🔥 dejar que DataTables haga su trabajo SOLO
                    setTimeout(() => {
                      try {
        
                        // 👉 EJECUCIÓN ORIGINAL (SIN TOCAR CONTEXTO)
                        (window as any).jQuery.fn.dataTable.ext.buttons.pdfHtml5.action(
                          e, dt, button, config
                        );
        
                        // 🔥 cerrar después de generar
                        setTimeout(() => {
                          this.alertService.close();
                          this.alertService.success('PDF generado correctamente');
                        }, 1000);
        
                      } catch (error) {
                        this.alertService.close();
                        this.alertService.success('PDF generado correctamente');
                        console.error(error);
                      }
                    }, 100);
                  },
        
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
        
                  customize: (doc: any) => {
                    const fecha = new Date();
                    const fechaStr = fecha.toLocaleDateString();
                    const horaStr = fecha.toLocaleTimeString();
        
                    doc.content.unshift({
                      margin: [0, 0, 0, 10],
                      alignment: 'left',
                      stack: [
                        { text: `Hacienda: ${this.haciendaSeleccionada || 'N/A'}`, bold: true },
                        { text: `Usuario: ${this.usuarioActual}`, bold: true },
                        { text: `Fecha: ${fechaStr} ${horaStr}`, bold: true },
                      ]
                    });
        
                    doc.pageMargins = [10, 10, 10, 10];
                    doc.defaultStyle = 7;
                    doc.styles.tableHeader.fontSize = 8;
        
                    const tabla = doc.content.find((c: any) => c.table);
        
                    if (tabla && tabla.table?.body?.length) {
                      const columnCount = tabla.table.body[0].length;
        
                      const widths = [];
                      for (let i = 0; i < columnCount; i++) {
                        if (i === 0) widths.push(60);
                        else if (i === columnCount - 1) widths.push(60);
                        else widths.push(35);
                      }
        
                      tabla.table.width = widths;
                    }
                  }
                }, */
        /* 
                {
                  extend: 'print',
                  text: '<i class="bi bi-printer"></i>',
                  className: 'btn btn-outline-primary btn-sm me-1',
                  titleAttr: 'Imprimir',
                  title: 'Hoja de saldos'
                } */
      ],

      createdRow: (row: any, data: any) => {
        if (data.esSeparador) {

          $(row).css({
            'height': '25px',
            'background-color': '#ffffff'
          });

          $(row).find('td').css({
            'border': 'none',
            'background-color': '#ffffff'
          });

          return;
        }

        // =======================================
        // 🔥 CABECERA REPETIDA
        // =======================================

        if (data.esCabeceraExcel) {

          $(row).find('td').css({
            'font-weight': 'bold',
            'background-color': '#d9d9d9',
            'border': '1px solid #000',
            'color': '#000'
          });

          return;
        }

        const $row = $(row);

        const $celdas = $row.find('td');
        const primeraCelda = $celdas.eq(0);

        // --- Estilos por fila ---
        if (data.fecha === 'ENFUNDE') $celdas.css({ 'background-color': '#6badef', 'font-weight': 'bold' });
        else if (data.fecha === 'TOTAL COSECHA') $row.addClass('fila-total');
        else if (data.fecha === 'SALDO') $celdas.css({ 'background-color': '#fff3cd', 'color': '#856404', 'font-weight': 'bold' });
        else if (data.fecha === 'CAIDAS') $celdas.css({ 'background-color': '#8f8d8d', 'font-weight': 'bold' });
        else if (data.fecha === 'RECOBRO') {

          // 🔥 ESPACIO DESPUÉS DEL BLOQUE
          $row.css({
            'border-bottom': '10px solid #000000ff'
          });

          $celdas.each((index: any, cell: any) => {
            if (index === 0) return;

            const val = parseFloat($(cell).text()) || 0;

            if (val > 100) {
              $(cell).css({ 'color': '#842029', 'font-weight': 'bold' });
            } else {
              $(cell).css({ 'color': '#090909', 'font-weight': 'bold' });
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
