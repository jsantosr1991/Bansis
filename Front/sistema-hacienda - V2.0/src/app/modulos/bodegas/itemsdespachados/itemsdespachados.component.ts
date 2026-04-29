import { Component, OnInit } from '@angular/core';
import { BodegahaciendaService } from '../../../services/bodegahacienda.service';
import { AuthserviceService } from '../../../services/authservice.service';
import { DatePipe, NgForOf, NgIf, NgClass, NgSwitch, NgSwitchCase, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/spinner/loader/loader.component';
import { UserService } from '../../../services/user.service';
import { FiltroHaciendaComponent } from '../../../shared/filtro-hacienda/filtro-hacienda.component';

declare var $: any;

@Component({
  selector: 'app-itemsdespachados',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgClass,
    LoaderComponent,
    NgForOf,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    UpperCasePipe,
    FiltroHaciendaComponent
  ],
  templateUrl: './itemsdespachados.component.html',
  styleUrl: './itemsdespachados.component.css'
})
export class ItemsdespachadosComponent implements OnInit {

  //SE CONFIGURA LOS GRUPOS PARA EL FILTRO ESCOGER HACIENDA
  CONFIG_FILTRO = {
    grupoOcultar: 'bodega',
    gruposPermitidos: ['gerencia', 'administradores']
  };
  detalle: any[] = [];
  loading = false;

  fechaSeleccionada = ''; // 🔥 SE MANTIENE (NO ROMPE NADA)
  documentoActual: string = '';
  comentariosAbiertos: { [key: number]: boolean } = {};

  idhaciendaSeleccionada!: number;
  namehacienda: any = null;
  haciendas: any[] = [];

  // 🔥 NUEVO: FILTROS
  filtros = {
    tipo: 'ultimo', // ultimo | hoy | semana | mes | rango
    desde: '',
    hasta: '',
    estado: [] as string[] // 🔥 MULTIPLE
  };

  dataOriginal: any[] = [];

  haciendaCatalogo = [
    { id: 1, name: 'AGRICOLA E INDUSTRIAL PRIMOBANANO S.A.' },
    { id: 3, name: 'SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A.' },
  ];

  dataTable: any = null;

  hoy = new Date().toISOString().split('T')[0];

  constructor(
    protected permisoService: AuthserviceService,
    private serviceBodega: BodegahaciendaService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();
    this.namehacienda = this.userService.getNomEmpresa();
    this.cargarHaciendas();
  }

  /* =========================
     CARGA INICIAL (NO CAMBIA)
  ========================= */

  cargarHaciendas(): void {

    this.loading = true;

    this.serviceBodega.getUltimaFechaDespachoPorHacienda().subscribe({
      next: res => {

        this.haciendas = res.map(h => {
          const haciendaInfo = this.haciendaCatalogo.find(
            x => x.id === h.idhacienda
          );

          return {
            ...h,
            name: haciendaInfo?.name ?? 'Hacienda desconocida'
          };
        });

        const esMayordomo = this.permisoService.tieneGrupo('bodega');

        if (esMayordomo) {

          if (this.idhaciendaSeleccionada == 8) {
            this.idhaciendaSeleccionada = 3;
          }

          const haciendaUsuario = this.haciendas.find(
            h => h.idhacienda === this.idhaciendaSeleccionada
          );

          if (haciendaUsuario) {

            // 🔥 COMPORTAMIENTO ORIGINAL
            this.fechaSeleccionada = haciendaUsuario.fecha;

            // 🔥 TAMBIÉN PARA FILTRO
            this.filtros.desde = haciendaUsuario.fecha;
            this.filtros.hasta = '';

            this.cargarDespachados(); // 🔥 sigue igual
          }
        }

        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  /* =========================
     FILTROS
  ========================= */

  aplicarFiltroRapido() {

    const hoy = new Date();

    if (this.filtros.tipo === 'ultimo') {
      this.filtros.desde = this.fechaSeleccionada;
      this.filtros.hasta = '';
      this.cargarDespachados();
      return;
    }

    if (this.filtros.tipo === 'hoy') {
      const f = this.formatDate(hoy);
      this.filtros.desde = f;
      this.filtros.hasta = f;
    }

    if (this.filtros.tipo === 'semana') {
      const inicio = new Date(hoy);
      inicio.setDate(hoy.getDate() - hoy.getDay());

      const fin = new Date(inicio);
      fin.setDate(inicio.getDate() + 6);

      this.filtros.desde = this.formatDate(inicio);
      this.filtros.hasta = this.formatDate(fin);
    }

    if (this.filtros.tipo === 'mes') {
      const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

      this.filtros.desde = this.formatDate(inicio);
      this.filtros.hasta = this.formatDate(fin);
    }

    if (this.filtros.tipo === 'rango') return;

    this.cargarDespachados();
    // 🔥 SI YA HAY DATA, SOLO FILTRA (NO CONSULTA)
    if (this.dataOriginal.length > 0) {
      const dataFiltrada = this.filtrarData();
      this.renderTable(dataFiltrada);
    }
  }

  filtrarData() {

    let data = [...this.dataOriginal];

    // 🔥 FILTRO MULTIPLE POR ESTADO
    if (this.filtros.estado.length > 0) {
      data = data.filter(d =>
        this.filtros.estado.includes(d.estado_documento)
      );
    }

    return data;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /* =========================
     CARGA DATA (MEJORADA)
  ========================= */

  cargarDespachados(): void {

    if (!this.idhaciendaSeleccionada) return;

    this.loading = true;

    const payload = {
      fechai: this.filtros.desde || this.fechaSeleccionada,
      fechaf: this.filtros.hasta || null, // 🔥 CLAVE
      idhacienda: this.idhaciendaSeleccionada,
    };

    this.serviceBodega.despachado(payload).subscribe({
      next: (data: any[]) => {

        this.dataOriginal = data ?? [];

        const dataFiltrada = this.filtrarData();

        this.renderTable(dataFiltrada);

        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  /* =========================
     DATATABLE (TUYO)
  ========================= */

  renderTable(data: any[]) {

    if (this.dataTable) {
      this.dataTable.clear().destroy();
      this.dataTable = null;
    }

    this.dataTable = $('#tablaDespachos').DataTable({
      data: data,
      columns: [
        { data: 'Documento' },

        {
          data: 'FechaEmision',
          render: (d: any) =>
            d ? new Date(d).toLocaleDateString('es-ES') : ''
        },

        { data: 'usuario' },
        { data: 'hacienda' },
        { data: 'total_lineas' },
        { data: 'despachadas' },

        {
          data: 'fecha_despacho',
          render: (d: any) =>
            d ? new Date(d).toLocaleDateString('es-ES') : ''
        },

        {
          data: 'estado_documento',
          render: (data: any) => {

            const estados: any = {
              PENDIENTE: 'pendiente',
              PARCIAL: 'parcial',
              COMPLETO: 'completo',
              CERRADO: 'cerrado',
              INCOMPLETO: 'incompleto'
            };

            return `<span class="estado-badge ${estados[data]}">${data}</span>`;
          }
        },

        {
          data: null,
          render: () => `
            <button class="btn btn-sm btn-primary ver-detalle">
              <i class="bi bi-eye"></i>
            </button>
          `
        }
      ],

      rowCallback: function (row: any, data: any) {
        $(row).removeClass('row-pendiente row-parcial row-completo row-cerrado row-incompleto');
        $(row).addClass(`row-${data.estado_documento.toLowerCase()}`);
      },

      destroy: true,
      ordering: true,

      language: {
        emptyTable: 'No hay datos para el filtro seleccionado'
      }
    });

    $('#tablaDespachos tbody').off('click').on('click', '.ver-detalle', (event: any) => {

      const rowData = this.dataTable
        .row($(event.currentTarget).parents('tr'))
        .data();

      if (rowData) {
        this.abrirDetalle(rowData.Documento);
      }
    });
  }

  /* =========================
     DETALLE (IGUAL)
  ========================= */

  abrirDetalle(documento: string) {

    this.documentoActual = documento;

    const payload = {
      fechai: this.filtros.desde || this.fechaSeleccionada,
      idhac: this.idhaciendaSeleccionada,
      Document: documento
    };

    this.serviceBodega.detalleDespacho(payload).subscribe({
      next: (data: any[]) => {

        this.detalle = data ?? [];
        this.comentariosAbiertos = {};

        const modal = new (window as any).bootstrap.Modal(
          document.getElementById('modalDetalle')
        );
        modal.show();
      },
      error: err => console.error(err)
    });
  }

  /* =========================
     EVENTOS (SE RESPETAN)
  ========================= */



  onFechaChange(): void {
    this.filtros.tipo = 'rango';
    this.filtros.desde = this.fechaSeleccionada;
    this.filtros.hasta = '';
    this.cargarDespachados();
  }

  toggleComentario(linea: number) {
    this.comentariosAbiertos[linea] = !this.comentariosAbiertos[linea];
  }

  toggleEstado(estado: string) {

    const index = this.filtros.estado.indexOf(estado);

    if (index > -1) {
      this.filtros.estado.splice(index, 1); // quitar
    } else {
      this.filtros.estado.push(estado); // agregar
    }

    const dataFiltrada = this.filtrarData();
    this.renderTable(dataFiltrada);
  }
  limpiarEstados() {
    this.filtros.estado = [];
    this.renderTable(this.dataOriginal);
  }

  /* =========================
  * FILTRO HACIENDA
  * ========================= */
  onHaciendaChange(hacienda: any): void {

    this.idhaciendaSeleccionada = hacienda.id;
    this.namehacienda = hacienda.name;

    this.cargarDespachados();
  }
}