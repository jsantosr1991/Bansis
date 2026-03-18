import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Asistencia, DiasCorteI} from '../../../interface/asistencia';
import { AsistenciaService } from '../../../services/asistencia.service';
import {FormsModule} from '@angular/forms';
import {LoaderComponent} from '../../../shared/spinner/loader/loader.component';
import {NgForOf, NgIf} from '@angular/common';
import {AuthserviceService} from '../../../services/authservice.service';
import {UserService} from '../../../services/user.service';
declare var $: any;
declare var bootstrap: any;
@Component({
  selector: 'app-mandosmedios',
  standalone: true,
  imports: [
    FormsModule,
    LoaderComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './mandosmedios.component.html',
  styleUrl: './mandosmedios.component.css'
})
export class MandosmediosComponent implements OnInit {
  loading = false;
  agrupados: any[] = [];
  agrupados2: any[] = [];
  totales: { faltas: number; permisos: number } = { faltas: 0, permisos: 0 };
  totales2: { faltas: number; permisos: number } = { faltas: 0, permisos: 0 };
  asistencia = {
    fecha: '',
    idhacienda: ''
  };
  idhaciendaSeleccionada: any = null;  // Guarda el valor seleccionado del select
  namehacienda: any = null;
  botonesHabilitados: boolean = false;
  columnsFaltasCantidad = [
    { data: "trabajador", title: "Empleado",className: "text-center fw-semibold" },
    {data: "faltas", title: 'Cantidad',className: "text-center fw-semibold"},
    {data: "listaFaltas", title: 'Observacion',className: "text-center fw-semibold",
      render: function (data: any[], type: any, row: any) {
        if (!data || data.length === 0) return "-";
        return data.map((item: any) =>
          `<div><b>${item.fecha}</b>: ${item.observacion}</div>`
        ).join("");
      }
    },


  ];
  columnsPermisosCantidad = [
    { data: "trabajador", title: "Empleado",className: "text-center fw-semibold" },
    {data: "justificados", title: 'Cantidad',className: "text-center fw-semibold"},
    {data: "listaJustificaciones", title: 'Observacion',className: "text-center fw-semibold",
      render: function (data: any[], type: any, row: any) {
        if (!data || data.length === 0) return "-";
        return data.map((item: any) =>
          `<div><b>${item.fecha}</b>: ${item.observacion}</div>`
        ).join("");
      }
    },


  ];
  mes: string = '';   // propiedad para el template
  estadoCorte: string | null = null;  // guardaremos solo el campo que necesitamos
  hacienda= [
    {id: '1', name: 'AGRICOLA E INDUSTRIAL PRIMOBANANO S.A.'},
    {id: '8', name: 'SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A.'},

  ]
  empresas: any[] = [];
  maxFecha: string = '';
  // Datos filtrados
  asistencias: Asistencia[] = [];
  faltas: Asistencia[] = [];
  permisos: Asistencia[] = [];
  vacaciones: Asistencia[] = [];
  sinMarcacion: Asistencia[] = [];

  // Referencias DataTables
  @ViewChild('tablaAsistencia') tablaAsistencia!: ElementRef;
  @ViewChild('tablaFaltas') tablaFaltas!: ElementRef;
  @ViewChild('tablaPermisos') tablaPermisos!: ElementRef;
  @ViewChild('tablaVacaciones') tablaVacaciones!: ElementRef;
  @ViewChild('tablaSinMarcacion') tablaSinMarcacion!: ElementRef;
  @ViewChild('tablaFaltasCantidad') tablaFaltaCantidad!: ElementRef;
  @ViewChild('tablaPermisoCantidad') tablaPermisoCantidad!: ElementRef;


  constructor(private service: AsistenciaService, protected permisoService: AuthserviceService, private userService: UserService,) {}

  ngOnInit(): void {
    const hoy = new Date();
    const hoyISO = hoy.toISOString().split('T')[0];

    this.asistencia.fecha = hoyISO;
    this.maxFecha = hoyISO;
    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();
    this.namehacienda = this.userService.getNomEmpresa();

    const esGerencia = this.permisoService.tieneGrupo('gerencia');
    const esAdmin = this.permisoService.tieneGrupo('administradores');

    if (esGerencia || esAdmin) {
      this.cargarEmpresas();
    }

    this.cargarAsistencia();
  }
  cargarEmpresas() {
    this.service.obtenerEmpresas().subscribe({
      next: (res: any) => {
        this.empresas = res;
      //  console.log(this.empresas)
      },
      error: (err) => console.error('Error cargando empresas', err)
    });
  }

  createdRow = (row: any, data: any) => {
    if (data.asis === 'N') {
      $('td', row).css({ 'background-color': '#ff0000', 'color': '#ffffff' });
    } else if (data.asis === 'V') {
      $('td', row).css({ 'background-color': '#bf00ff', 'color': '#ffffff' });
    } else if (data.asis === 'J') {
      $('td', row).css({ 'background-color': 'green', 'color': '#ffffff' });
    }

    const esLotero = parseInt(data.es_lotero);
    const soloCorte = parseInt(data.SOLO_CORTE);

    if (esLotero === 1) {
      $(row).find('td:eq(0)').css({ 'background': 'blue', 'color': 'white' });
    } else if (soloCorte === 1) {
      $(row).find('td:eq(0)').css({ 'background': 'yellow', 'color': 'black' });
    }
  };


/*  cargarAsistencia() {
    this.loading = true;
    this.botonesHabilitados = false; // desactivar hasta que termine
    // Usuarios mayordomo → deben tener idhaciendaSeleccionada
    if (this.permisoService.tieneGrupo('mayordomo') && !this.idhaciendaSeleccionada) {
      this.loading = false;
      return;
    }

    let idhacienda: any;
    let fecha: any;

    if (this.permisoService.tieneGrupo('mayordomo')) {
      idhacienda = this.idhaciendaSeleccionada;
      fecha = this.asistencia.fecha;
    } else {
      idhacienda = this.asistencia.idhacienda; // viene del select
      fecha = this.asistencia.fecha;
    }

    if (!idhacienda || !fecha) {
      this.loading = false;
      return;
    }
// convertir a Date
    const fechaDate = new Date(fecha);
// obtener nombre de mes en español
    this.mes = fechaDate.toLocaleString('es-ES', {month: 'long'})
    this.service.obtenerAsistenciaMM(idhacienda, fecha).subscribe({
      next: (res) => {

        // FILTROS
        this.asistencias   = res.filter(x => x.asis === 'A');
        this.faltas        = res.filter(x => x.asis === 'F');
        this.permisos      = res.filter(x => x.asis === 'J');
        this.vacaciones    = res.filter(x => x.asis === 'V');
        this.sinMarcacion  = res.filter(x => x.asis === 'N');

        // DATATABLES
        this.initDataTable(this.tablaAsistencia, this.asistencias, this.colsAsistencias);
        this.initDataTable(this.tablaFaltas, this.faltas, this.colsFaltas);
        this.initDataTable(this.tablaPermisos, this.permisos, this.colsPermisos);
        this.initDataTable(this.tablaVacaciones, this.vacaciones, this.colsVacaciones);
        this.initDataTable(this.tablaSinMarcacion, this.sinMarcacion, this.colsSinMarcacion);
        // 👉 ACTIVAR BOTONES si hubo resultados
        this.botonesHabilitados = true;
      },

      error: (error) => {
        console.log('Error en la consulta: ', error);
        this.loading = false;
        this.botonesHabilitados = false;
      },

      complete: () => {
        this.loading = false;
      }
    });
    this.service.obtenerFaltasPermisos(idhacienda,fecha).subscribe(re => {

      // @ts-ignore
      const faltas = re.filter(e => e.asis === 'F');
      // @ts-ignore
      const permisos = re.filter(e => e.asis === 'J');

      this.agrupados = this.getAgrupadosPorTrabajador(faltas)
      this.agrupados2 = this.getAgrupadosPorTrabajador(permisos)

      this.totales = this.getTotales(this.agrupados);

      this.totales2 = this.getTotales(this.agrupados2);

      // @ts-ignore
      $(this.tablaFaltaCantidad.nativeElement).DataTable({
        data: this.agrupados,
        columns: this.columnsFaltasCantidad,
        destroy: true
      });
      // @ts-ignore
      $(this.tablaPermisoCantidad.nativeElement).DataTable({
        data: this.agrupados2,
        columns: this.columnsPermisosCantidad,
        destroy: true
      });

    })
    this.service.obtenerDiasCorte(idhacienda,fecha).subscribe(re =>{
      this.estadoCorte = re.length > 0 ? re[0].estado : null;
    //  console.log("Estado corte:",this.estadoCorte);
    })

  }*/
  cargarAsistencia() {
    this.loading = true;
    this.botonesHabilitados = false;

    const fecha = this.asistencia.fecha;
    const esMayordomo = this.permisoService.tieneGrupo('mayordomo');
    const esGerencia = this.permisoService.tieneGrupo('gerencia');
    const esAdmin = this.permisoService.tieneGrupo('administradores');

    let idhacienda: any;

    if (esMayordomo) {
      idhacienda = this.idhaciendaSeleccionada;
    } else {
      // Gerencia y otros usuarios usan la hacienda seleccionada en el select
      idhacienda = this.asistencia.idhacienda;
    }

    if (!idhacienda || !fecha) {
      this.loading = false;
      return;
    }

    const fechaDate = new Date(fecha);
    this.mes = fechaDate.toLocaleString('es-ES', { month: 'long' });

    // Seleccionar consulta según grupo
    const esGerenciaOAdmin = esGerencia || esAdmin;
    const consulta = esGerenciaOAdmin
      ? this.service.obtenerAsistenciaGeneral(idhacienda, fecha)
      : this.service.obtenerAsistenciaMM(idhacienda, fecha);

    consulta.subscribe({
      next: (res: any[]) => {
        this.asistencias = res.filter(x => x.asis === 'A');
        this.faltas = res.filter(x => x.asis === 'F');
        this.permisos = res.filter(x => x.asis === 'J');
        this.vacaciones = res.filter(x => x.asis === 'V');
        this.sinMarcacion = res.filter(x => x.asis === 'N');

        this.initDataTable(this.tablaAsistencia, this.asistencias, this.colsAsistencias);
        this.initDataTable(this.tablaFaltas, this.faltas, this.colsFaltas);
        this.initDataTable(this.tablaPermisos, this.permisos, this.colsPermisos);
        this.initDataTable(this.tablaVacaciones, this.vacaciones, this.colsVacaciones);
        this.initDataTable(this.tablaSinMarcacion, this.sinMarcacion, this.colsSinMarcacion);

        this.botonesHabilitados = true;
      },
      error: () => {
        this.botonesHabilitados = false;
      },
      complete: () => {
        this.loading = false;
      }
    });

    this.service.obtenerFaltasPermisos(idhacienda, fecha).subscribe(re => {
      const faltas = re.filter(e => e.asis === 'F');
      const permisos = re.filter(e => e.asis === 'J');

      this.agrupados = this.getAgrupadosPorTrabajador(faltas);
      this.agrupados2 = this.getAgrupadosPorTrabajador(permisos);

      this.totales = this.getTotales(this.agrupados);
      this.totales2 = this.getTotales(this.agrupados2);

      $(this.tablaFaltaCantidad.nativeElement).DataTable({
        data: this.agrupados,
        columns: this.columnsFaltasCantidad,
        destroy: true
      });

      $(this.tablaPermisoCantidad.nativeElement).DataTable({
        data: this.agrupados2,
        columns: this.columnsPermisosCantidad,
        destroy: true
      });
    });

    this.service.obtenerDiasCorte(idhacienda, fecha).subscribe(re => {
      this.estadoCorte = re.length > 0 ? re[0].estado : null;
    });
  }

  // ===========================================
  //         DEFINICIÓN DE COLUMNAS
  // ===========================================
  colsAsistencias = [
    { title: "Empleado", data: "NOMBRE_CORTO" },
    { title: "Cod", data: "COD_TRABAJ" },
    { title: "Cargo", data: "nomcargo" },
    { title: "Fecha", data: "FECHA",   render: function (data: any) {
        if (data) {
          const [year, month, day] = data.split('-'); // Suponiendo que data está en formato "YYYY-MM-DD"
          return `${day}/${month}/${year}`; // Reordenar a DD/MM/YYYY
        }
        return '';}},
    {
      title: "Entrada",
      data: "HoraE",
      render: (d: any) => d ? `<span class="badge bg-success">${d}</span>` : ""
    },
    {
      title: "Salida",
      data: "HoraS",
      render: (d: any, type: any, row: any) => {
        if (row.HoraE === row.HoraS) return "";
        return d ? `<span class="badge bg-danger">${d}</span>` : "";
      }
    }
  ];

  colsFaltas = [
    { title: "Empleado", data: "NOMBRE_CORTO" },
    { title: "Cod", data: "COD_TRABAJ" },
    { title: "Cargo", data: "nomcargo" },
    { title: "Fecha", data: "FECHA" },
    { title: "Motivo", data: "OBSERVACION" }
  ];

  colsPermisos = [
    { title: "Empleado", data: "NOMBRE_CORTO" },
    { title: "Cod", data: "COD_TRABAJ" },
    { title: "Cargo", data: "nomcargo" },
    { title: "Inicio", data: "FechaI" },
    { title: "Fin", data: "FechaF" },
    { title: "Detalle", data: "OBSERVACION" }
  ];

  colsVacaciones = [
    { title: "Empleado", data: "NOMBRE_CORTO" },
    { title: "Cod", data: "COD_TRABAJ" },
    { title: "Cargo", data: "nomcargo" },
    { title: "Desde", data: "FechaI" },
    { title: "Hasta", data: "FechaF" }
  ];

  colsSinMarcacion = [
    { title: "Empleado", data: "NOMBRE_CORTO" },
    { title: "Cod", data: "COD_TRABAJ" },
    { title: "Cargo", data: "nomcargo" },
    { title: "Fecha", data: "FECHA" }
  ];

  // ===========================================
  //             FUNCIÓN DATATABLE
  // ===========================================
  initDataTable(ref: ElementRef, data: any[], columns: any[]) {
    $(ref.nativeElement).DataTable({
      data,
      columns,
      destroy: true,
      responsive: true,
      searching: true,
      paging: true,
      info: true,
      createdRow: this.createdRow,
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
      },
      columnDefs: [
        // Aplica la clase 'text-center' a todas las columnas excepto "Empleado"
        {
          targets: '_all',
          createdCell: (cell: any, cellData: any, rowData: any, rowIndex: number, colIndex: number) => {
            // No centramos la columna "Empleado" (índice 0)
            if (colIndex !== 0) {
              $(cell).css('text-align', 'center');
            }
          }
        }
      ]

    });
  }

  getAgrupadosPorTrabajador(data: Asistencia[]) {
    const agrupado = data.reduce((acc, item) => {
      const key = item.NOMBRE_CORTO.trim(); // 👈 usa id_trabajador si lo tienes

      if (!acc[key]) {
        acc[key] = {
          trabajador: item.NOMBRE_CORTO.trim(),
          empresa: item.EMPRESA?.trim() || '',
          cantidad: 0,
          faltas: 0,
          justificados: 0,
          listaFaltas: [] as { fecha: string; observacion: string }[],
          listaJustificaciones: [] as { fecha: string; observacion: string }[],
        };
      }

      acc[key].cantidad++;

      if (item.asis === 'F') {
        acc[key].faltas++;
        acc[key].listaFaltas.push({
          fecha: item.FechaI,
          observacion: item.OBSERVACION.trim().toUpperCase(),
        });
      } else if (item.asis === 'J') {
        acc[key].justificados++;
        acc[key].listaJustificaciones.push({
          fecha: item.FechaI,
          observacion: item.OBSERVACION.trim().toUpperCase(),
        });
      }

      return acc;
    }, {} as { [key: string]: any });
    //console.log(agrupado)
    return Object.values(agrupado);
  }

  getTotales(agrupados: any[]) {
    const total = {
      faltas: 0,
      permisos: 0
    };

    agrupados.forEach(t => {
      total.faltas += t.faltas;
      total.permisos += t.justificados;
    });

    return total;
  }

  abrirModalTabla1() {
    const modal1 = new bootstrap.Modal(document.getElementById('modalTabla1'));
    modal1.show();
  }

  abrirModalTabla2() {
    const modal2 = new bootstrap.Modal(document.getElementById('modalTabla2'));
    modal2.show();
  }
}
