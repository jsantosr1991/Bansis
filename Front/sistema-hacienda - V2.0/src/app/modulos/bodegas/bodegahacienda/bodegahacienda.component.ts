import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { BodegahaciendaService } from '../../../services/bodegahacienda.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { LoaderComponent } from '../../../shared/spinner/loader/loader.component';
import { AuthserviceService } from '../../../services/authservice.service';
import { UserService } from '../../../services/user.service';
import { FiltroHaciendaComponent } from '../../../shared/filtro-hacienda/filtro-hacienda.component';

declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-bodegahacienda',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf,
    NgClass,
    FormsModule,
    LoaderComponent,
    FiltroHaciendaComponent
  ],
  templateUrl: './bodegahacienda.component.html',
  styleUrl: './bodegahacienda.component.css'
})
export class BodegahaciendaComponent implements OnInit, OnDestroy {

  loading = false;
  solicitudes: any[] = [];
  solicitudSeleccionada: any = null;

  idhaciendaSeleccionada: number | null = null;
  namehacienda: string | null = null;

  private dataTable: any = null;
  dataOriginal: any[] = [];

  CONFIG_FILTRO = {
    grupoOcultar: 'bodega',
    gruposPermitidos: ['gerencia', 'administradores']
  };

  constructor(
    private solicitudService: BodegahaciendaService,
    private cdr: ChangeDetectorRef,
    protected permisoService: AuthserviceService,
    private userService: UserService
  ) { }

  /* =========================
   * CICLO DE VIDA
   * ========================= */
  ngOnInit(): void {

    const modalEl = document.getElementById('modalDetalle');

    modalEl?.addEventListener('hidden.bs.modal', () => {
      document.body.classList.remove('modal-open');
      document.querySelectorAll('.modal-backdrop')
        .forEach(el => el.remove());

      this.solicitudSeleccionada = null;
    });


  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy(true);
      this.dataTable = null;
    }
  }

  /* =========================
   * DATA
   * ========================= */
  cargarSolicitudes(): void {
    this.loading = true;

    let idhacienda = Number(this.idhaciendaSeleccionada);

    if (idhacienda === 8) {
      idhacienda = 3;
    }

    this.solicitudService.obtenerSolicitudes().subscribe({
      next: (data) => {

        const dataProcesar = data.filter(x =>
          x.idhacienda === idhacienda
        );

        if (this.dataTable) {
          this.dataTable.destroy(true);
          this.dataTable = null;
        }

        this.solicitudes = [];
        this.cdr.detectChanges();

        this.solicitudes = this.agruparSolicitudes(dataProcesar);

        setTimeout(() => {
          if (this.solicitudes.length > 0) {
            this.inicializarDataTable();
          }
        }, 0);

        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  inicializarDataTable(): void {
    this.dataTable = $('#tablaSolicitudes').DataTable({
      dom: '<"top d-flex justify-content-between align-items-center"lf>rt<"bottom"ip>',
      autoWidth: false,
      responsive: false,
      ordering: true,
      destroy: true,
      order: [[1, 'desc']],
      columnDefs: [{ targets: [5], orderable: false }],
      language: {
        emptyTable: 'No hay datos',
        zeroRecords: 'No se encontraron resultados',
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ registros',
        info: 'Mostrando _START_ a _END_ de _TOTAL_',
        infoEmpty: 'Mostrando 0',
        paginate: {
          next: 'Siguiente',
          previous: 'Anterior'
        }
      }
    });
  }

  /* =========================
   * AGRUPACIÓN
   * ========================= */
  agruparSolicitudes(data: any[]): any[] {

    const mapa = new Map<string, any>();

    data.forEach(item => {

      const key = `${item.Documento?.trim()}-${item.usuario?.trim()}`;

      const estado = Number(item.estado ?? 0);

      const pendienteItem = Math.max(
        (Number(item.CantidadDigitada) || 0) -
        (Number(item.TotalDespachado) || 0),
        0
      );

      if (!mapa.has(key)) {
        mapa.set(key, {
          Documento: item.Documento?.trim(),
          FechaEmision: item.FechaEmision,
          usuario: item.usuario?.trim(),
          estado,
          despachado: item.totalItems,
          detalle: [],
          itemsPendientes: item.itemsPendientes
        });
      }

      const grupo = mapa.get(key);

      grupo.detalle.push({
        Documento: item.Documento?.trim(),
        linea: item.linea,
        codProd: item.codProd,
        producto: item.producto,
        Solicitante: item.Solicitante,
        hacienda: item.hacienda,
        cantidadSolicitada: Number(item.CantidadDigitada) || 0,
        TotalDespachado: Number(item.TotalDespachado) || 0,
        pendiente: pendienteItem,
        completo: true,
        cantidadDespachar: pendienteItem,
        comentario: ''
      });

      if (pendienteItem > 0) {
        grupo.itemsPendientes++;
      }
    });

    return Array.from(mapa.values());
  }

  /* =========================
   * DETALLE
   * ========================= */
  verDetalle(s: any): void {

    const esCerrado = Number(s.estado ?? 0) === 3;

    this.solicitudService.getDetalle(s.Documento, s.usuario)
      .subscribe((detalle: any[]) => {

        const detalleProcesado = detalle.map(d => {

          const solicitada = Number(d.CantidadDigitada) || 0;
          const despachada = Number(d.TotalDespachado) || 0;
          const pendiente = Math.max(solicitada - despachada, 0);

          return {
            Documento: d.Documento?.trim(),
            linea: d.linea,
            codProd: d.codProd,
            producto: d.producto,
            Solicitante: d.Solicitante,
            hacienda: d.hacienda,
            cantidadSolicitada: solicitada,
            TotalDespachado: despachada,
            pendiente,
            completo: true,
            cantidadDespachar: pendiente,
            comentario: ''
          };
        });

        this.solicitudSeleccionada = {
          ...s,
          estado: Number(s.estado ?? 0),
          esCerrado,
          hacienda: detalle[0]?.hacienda || 'N/A',
          detalle: detalleProcesado
        };

        const modal = new bootstrap.Modal(
          document.getElementById('modalDetalle')!,
          { backdrop: 'static', keyboard: false }
        );

        modal.show();
      });
  }

  onCheckItem(d: any): void {

    if (this.solicitudSeleccionada?.estado === 3) return;

    if (d.completo) {
      d.cantidadDespachar = d.pendiente;
      d.comentario = '';
    } else {
      d.cantidadDespachar = 0;
    }
  }

  /* =========================
   * DESPACHO
   * ========================= */
  confirmarDespacho(): void {

    const detalle = this.solicitudSeleccionada.detalle;

    const invalido = detalle.some((d: any) =>
      d.cantidadDespachar < 0 || d.cantidadDespachar > d.pendiente
    );

    if (invalido) {
      Swal.fire({ icon: 'warning', title: 'Cantidad inválida' });
      return;
    }

    const sinComentario = detalle.some((d: any) =>
      !d.completo && (!d.comentario || d.comentario.trim() === '')
    );

    if (sinComentario) {
      Swal.fire({
        icon: 'warning',
        title: 'Comentario requerido'
      });
      return;
    }

    const hayPendientes = detalle.some((d: any) =>
      (d.pendiente - d.cantidadDespachar) > 0
    );

    if (hayPendientes) {
      this.confirmarCierreParcial();
    } else {
      this.enviarDespacho(false, true);
    }
  }

  confirmarCierreParcial(): void {

    Swal.fire({
      icon: 'question',
      title: 'Despacho incompleto',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Cerrar',
      denyButtonText: 'Pendiente'
    }).then(result => {

      if (result.isConfirmed) {
        this.enviarDespacho(true);
      } else if (result.isDenied) {
        this.enviarDespacho(false);
      }
    });
  }

  enviarDespacho(cerrar: boolean, completo: boolean = false): void {

    const payload = {
      Documento: this.solicitudSeleccionada.Documento,
      cerrar,
      detalle: this.solicitudSeleccionada.detalle.map((d: any) => ({
        linea: d.linea,
        CantidadDespachada: Number(d.cantidadDespachar || 0),
        comentario: d.comentario || ''
      }))
    };

    this.solicitudService.despachar(payload).subscribe({
      next: () => {

        this.cerrarModal();

        setTimeout(() => {

          this.cargarSolicitudes();

          Swal.fire({
            icon: 'success',
            title: completo
              ? 'Despacho completo'
              : cerrar
                ? 'Despacho cerrado'
                : 'Guardado como pendiente',
            timer: 1200,
            showConfirmButton: false
          });

        }, 300);
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Error en despacho'
        });
      }
    });
  }

  cerrarModal(): void {

    const modal = bootstrap.Modal.getInstance(
      document.getElementById('modalDetalle')!
    );

    modal?.hide();

    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop')
      .forEach(b => b.remove());

    this.solicitudSeleccionada = null;
  }

  /* =========================
   * FILTRO HACIENDA
   * ========================= */
  onHaciendaChange(hacienda: any): void {

    this.idhaciendaSeleccionada = hacienda.id;
    this.namehacienda = hacienda.name;


    this.cargarSolicitudes();
  }
}