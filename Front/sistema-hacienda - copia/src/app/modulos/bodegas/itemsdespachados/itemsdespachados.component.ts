import { Component, OnInit } from '@angular/core';
import { BodegahaciendaService } from '../../../services/bodegahacienda.service';
import { AuthserviceService } from '../../../services/authservice.service';
import { DatePipe, NgForOf, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/spinner/loader/loader.component';
import { UserService } from '../../../services/user.service';
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
    NgIf
  ],
  templateUrl: './itemsdespachados.component.html',
  styleUrl: './itemsdespachados.component.css'
})
export class ItemsdespachadosComponent implements OnInit {
  detalle: any[] = [];
  loading = false;
  fechaSeleccionada = '';
  documentoActual: string = '';
  comentariosAbiertos: { [key: number]: boolean } = {}; // 🔥 control por línea
  idhaciendaSeleccionada!: number;
  namehacienda: any = null;
  haciendas: any[] = [];
  haciendaCatalogo = [
    { id: 1, name: 'AGRICOLA E INDUSTRIAL PRIMOBANANO S.A.' },
    { id: 3, name: 'SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A.' },

  ]

  dataTable: any = null;

  hoy = new Date().toISOString().split('T')[0]; // ?? límite máximo

  constructor(
    protected permisoService: AuthserviceService,
    private serviceBodega: BodegahaciendaService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    //  this.cargarUltimaFechaDespacho();
    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();

    this.namehacienda = this.userService.getNomEmpresa();

    this.cargarHaciendas()
  }

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
            this.idhaciendaSeleccionada = 3
          }

          const haciendaUsuario = this.haciendas.find(
            h => h.idhacienda === this.idhaciendaSeleccionada
          );

          if (haciendaUsuario) {
            this.idhaciendaSeleccionada = haciendaUsuario.idhacienda;

            this.fechaSeleccionada = haciendaUsuario.fecha;

            this.cargarDespachados();

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

  cargarDespachados(): void {

    if (!this.fechaSeleccionada || !this.idhaciendaSeleccionada) return;

    this.loading = true;

    const payload = {
      fechai: this.fechaSeleccionada,
      idhacienda: this.idhaciendaSeleccionada,
    };

    this.serviceBodega.despachado(payload).subscribe({
      next: (data: any[]) => {

        if (this.dataTable) {
          this.dataTable.clear().destroy();
          this.dataTable = null;
        }

        this.dataTable = $('#tablaDespachos').DataTable({
          data: data ?? [],
          columns: [
            { data: 'Documento' },

            {
              data: 'FechaEmision',
              render: (data: any) =>
                data ? new Date(data).toLocaleDateString('es-ES') : ''
            },

            { data: 'usuario' },
            { data: 'hacienda' },
            { data: 'total_lineas' },
            { data: 'despachadas' },

            {
              data: 'fecha_despacho',
              render: (data: any) =>
                data ? new Date(data).toLocaleDateString('es-ES') : ''
            },

            // 🔥 ESTADO PRO
            {
              data: 'estado_documento',
              render: (data: any) => {

                if (data === 'PENDIENTE') {
                  return `
            <div class="estado estado-pendiente">
              <i class="bi bi-hourglass-split"></i>
              <span>Pendiente</span>
            </div>`;
                }

                if (data === 'PARCIAL') {
                  return `
            <div class="estado estado-parcial">
              <i class="bi bi-exclamation-circle"></i>
              <span>Parcial</span>
            </div>`;
                }

                if (data === 'COMPLETO') {
                  return `
            <div class="estado estado-completo">
              <i class="bi bi-check-circle"></i>
              <span>Completo</span>
            </div>`;
                }

                if (data === 'CERRADO') {
                  return `
            <div class="estado estado-cerrado">
              <i class="bi bi-lock"></i>
              <span>Cerrado</span>
            </div>`;
                }

                if (data === 'INCOMPLETO') {
                  return `
            <div class="estado estado-incompleto">
              <i class="bi bi-dash-circle"></i>
              <span>Incompleto</span>
            </div>`;
                }

                return data;
              }
            },

            // 🔥 BOTÓN INTELIGENTE
            {
              data: null,
              render: (data: any, type: any, row: any) => {

                const disabled = row.estado_documento === 'CERRADO'
                  ? 'enabled'
                  : '';

                return `
          <button class="btn btn-sm btn-primary ver-detalle" ${disabled}>
            <i class="bi bi-eye"></i>
          </button>
        `;
              }
            }
          ],

          // 🔥 RESALTAR FILA SEGÚN ESTADO
          rowCallback: function (row: any, data: any) {

            $(row).removeClass('row-pendiente row-parcial row-completo row-cerrado');

            if (data.estado_documento === 'PENDIENTE') {
              $(row).addClass('row-pendiente');
            }

            if (data.estado_documento === 'PARCIAL') {
              $(row).addClass('row-parcial');
            }

            if (data.estado_documento === 'COMPLETO') {
              $(row).addClass('row-completo');
            }

            if (data.estado_documento === 'CERRADO') {
              $(row).addClass('row-cerrado');
            }
            if (data.estado_documento === 'INCOMPLETO') {
              $(row).addClass('row-incompleto');
            }
          },

          destroy: true,
          ordering: true,

          language: {
            emptyTable: 'No hay datos para la fecha seleccionada'
          }
        });
        // 👉 EVENTO CLICK EN FILA
        $('#tablaDespachos tbody').off('click').on('click', '.ver-detalle', (event: any) => {

          const rowData = this.dataTable
            .row($(event.currentTarget).parents('tr'))
            .data();

          if (rowData) {
            this.abrirDetalle(rowData.Documento);
          }
        });

        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // 👉 CARGAR DETALLE Y ABRIR MODAL
  abrirDetalle(documento: string) {

    this.documentoActual = documento; // 🔥 guardar documento

    const payload = {
      fechai: this.fechaSeleccionada,
      idhac: this.idhaciendaSeleccionada,
      Document: documento
    };

    this.serviceBodega.detalleDespacho(payload).subscribe({
      next: (data: any[]) => {

        this.detalle = data ?? [];

        // 🔥 inicializar comentarios cerrados
        this.comentariosAbiertos = {};

        const modal = new (window as any).bootstrap.Modal(
          document.getElementById('modalDetalle')
        );
        modal.show();
      },
      error: err => console.error(err)
    });
  }

  onHaciendaChange(): void {

    const hacienda = this.haciendas.find(
      h => h.idhacienda == this.idhaciendaSeleccionada
    );

    if (!hacienda?.fecha) return;

    this.fechaSeleccionada = hacienda.fecha;

    this.cargarDespachados();
  }

  onFechaChange(): void {
    this.cargarDespachados();
  }


  toggleComentario(linea: number) {
    this.comentariosAbiertos[linea] = !this.comentariosAbiertos[linea];
  }

}

