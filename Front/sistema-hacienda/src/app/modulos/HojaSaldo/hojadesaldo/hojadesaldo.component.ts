import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { HojasaldosService } from '../../../services/hojasaldos.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/spinner/loader/loader.component';

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
  secciones: string[] = [];
  datosPivotados: any[] = [];
  dataTable: any;


  haciendas = [
    { id: 1, nombre: 'PRIMO' },
    { id: 2, nombre: 'SOFCA' }
  ];

  filtroForm: FormGroup;

  constructor(
    private saldosService: HojasaldosService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.filtroForm = this.fb.group({
      idhacienda: [''],
      codigo: ['', [Validators.required, Validators.pattern('^[0-9]{1,5}$')]] // Valida solo números y m
    });
  }
  // Obtener el control del código
  get codigoControl() {
    return this.filtroForm.get('codigo');
  }

  ngOnInit(): void {
    this.filtroForm.get('idhacienda')?.valueChanges.subscribe(() => {
      this.verificarYConsultar();
    });

    this.filtroForm.get('codigo')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.verificarYConsultar();
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
      next: ({ saldos, metas }) => {
        this.datos = saldos;
        this.datosEnfunde = metas;
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

    this.datos.forEach(item => {
      const color = item.color;
      const fecha = item.cs_fecha;
      const cantidad = parseInt(item.cantidad);

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
      agrupado[color].forEach(fila => {
        // Agregar total por fila
        fila.total = fila.totalFecha; // Este es el total por fila
        this.datosPivotados.push({ color, ...fila, esTotal: false });
      });
      // Agregar fila total por color
      this.datosPivotados.push({
        color,
        fecha: 'TOTAL',
        ...totalesPorColor[color],
        total: totalesPorColor[color].totalColor, // Total por color
        esTotal: true
      });
    }

    console.log(this.datosPivotados); // Verifica que los datos pivotados se procesen correctamente
  }

  reinicializarDataTable() {
    if (this.datosPivotados && this.datosPivotados.length > 0) {
      const columns = [
        { title: 'Color', data: 'color' },
        { title: 'Fecha', data: 'fecha' },
        ...this.secciones.map(sec => ({ title: sec, data: sec })),
        { title: 'Total', data: 'total', name:'total' } // Agregar columna de total
      ];

      // Si ya existe una tabla, destrúyela
      if ($.fn.DataTable.isDataTable('#tablaProduccion')) {
        $('#tablaProduccion').DataTable().clear().destroy();
        $('#tablaProduccion').empty();  // Limpiar completamente la tabla antes de crearla de nuevo
      }

      // Inicializar la tabla DataTable
      this.dataTable = $('#tablaProduccion').DataTable({
        paging: true,
        dom: '<"d-flex justify-content-between align-items-center mb-2"<"length-div"l><"search-div"f>>Brtip',
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Todos"]],
        data: this.datosPivotados,
        columns: columns,
        buttons: [
          {
            extend: 'copyHtml5',
            text: '<i class="bi bi-clipboard"></i>',
            className: 'btn btn-outline-primary btn-sm me-1',
            titleAttr: 'Copiar'
          },
          {
            extend: 'csvHtml5',
            text: '<i class="bi bi-file-earmark-text"></i>',
            className: 'btn btn-outline-success btn-sm me-1',
            titleAttr: 'Exportar CSV'
          },
          {
            extend: 'excelHtml5',
            text: '<i class="bi bi-file-earmark-excel"></i>',
            className: 'btn btn-outline-success btn-sm me-1',
            titleAttr: 'Exportar Excel'
          },
          {
            extend: 'pdfHtml5',
            text: '<i class="bi bi-file-earmark-pdf"></i>',
            className: 'btn btn-outline-danger btn-sm me-1',
            titleAttr: 'Exportar PDF'
          },
          {
            extend: 'print',
            text: '<i class="bi bi-printer"></i>',
            className: 'btn btn-outline-primary btn-sm me-1',
            titleAttr: 'Imprimir'
          }
        ],
        createdRow: (row: any, data: any) => {
          // Si es una fila de total, le aplicamos la clase 'fila-total'
          if (data.esTotal === true) {
            $(row).addClass('fila-total');
          } else {
            const colorCelda = $(row).find('td').eq(0);
            colorCelda.css('background-color', this.getColorByNombre(data.color));  // Color de fondo para las celdas
          }
        },
        footerCallback: (row: any, data: any, start: any, end: any, display: any) => {
          const api = $('#tablaProduccion').DataTable();

          // Sumar por cada sección
          this.secciones.forEach((sec: string, i: number) => {
            let total = 0;

            // Acceder a la columna de la sección correctamente
            api.column(i + 2, { page: 'current' }).nodes().each((cell: any) => {
              const val = parseInt($(cell).text()) || 0;
              total += val;
            });
            // Mostrar el total por sección en el pie de página
            $(api.column(i + 2).footer()).html(total);
          });

          // Sumar la columna "Total"
          let totalGeneral = 0;
          const totalColumn = api.column('total:name', { page: 'current' });

          if (totalColumn) {
            totalColumn.nodes().each((cell: any) => {
              const val = parseInt($(cell).text()) || 0;
              totalGeneral += val;
            });

            // Mostrar el total global en el pie de la columna "Total"
            $(api.column('total:name').footer()).html(totalGeneral);
          }
        }


      });

      // Aplicamos la clase sticky para fijar las cabeceras
      $('th').css('position', 'sticky');
      $('th').css('top', '0');
      $('th').css('background-color', '#f8f9fa');  // Asegura que la cabecera tenga color de fondo
      $('th').css('z-index', '10');  // Asegura que las cabeceras estén por encima de las filas
    }
  }


  getColorByNombre(color: string): string {
    switch ((color || '').toLowerCase()) {
      case 'rojo': return '#fdecea';
      case 'azul': return '#e7f1ff';
      case 'verde': return '#168104';
      case 'amarillo': return '#ffb319';
      case 'cafe': return '#85685a';
      case 'lila': return '#5a26dd';
      case 'negro': return '#1a110e';
      default: return 'transparent';
    }
  }

}
