import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgForOf, NgIf, UpperCasePipe } from '@angular/common';
import { BodegahaciendaService } from '../../../services/bodegahacienda.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { LoaderComponent } from '../../../shared/spinner/loader/loader.component';
import { AuthserviceService } from '../../../services/authservice.service';
import { UserService } from '../../../services/user.service';

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
    LoaderComponent
  ],
  templateUrl: './bodegahacienda.component.html',
  styleUrl: './bodegahacienda.component.css'
})
export class BodegahaciendaComponent implements OnInit, OnDestroy {
  loading = false;
  solicitudes: any[] = [];
  solicitudSeleccionada: any = null;
  idhaciendaSeleccionada: any = null;  // Guarda el valor seleccionado del select
  namehacienda: any = null;
  private dataTable: any = null;
  dataOriginal: any[] = [];
  empresas: any[] = [];
  solicitud = {
    fecha: '',
    idhacienda: ''
  };
  hacienda = [
    { id: 1, name: 'AGRICOLA E INDUSTRIAL PRIMOBANANO S.A.' },
    { id: 3, name: 'SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A.' },

  ]
  constructor(
    private solicitudService: BodegahaciendaService, private cdr: ChangeDetectorRef,
    protected permisoService: AuthserviceService, private userService: UserService
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

    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();

    this.namehacienda = this.userService.getNomEmpresa();
    const esGerencia = this.permisoService.tieneGrupo('gerencia');
    const esAdmin = this.permisoService.tieneGrupo('administradores');
    if (esGerencia || esAdmin) {
      this.cargarhacienda()
    }
    this.cargarSolicitudes();
  }

  cargarhacienda() {
    this.empresas = this.hacienda
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

    const esMayordomo = this.permisoService.tieneGrupo('bodega');

    let idhacienda: number | null = null;

    if (esMayordomo) {
      idhacienda = Number(this.idhaciendaSeleccionada);
      if (idhacienda == 8) {
        idhacienda = 3
      }

    } else {
      // Gerencia y otros usuarios usan la hacienda seleccionada en el select
      idhacienda = this.solicitud.idhacienda
        ? Number(this.solicitud.idhacienda) : null;
      if (idhacienda == 1) {
        this.namehacienda = 'AGRICOLA E INDUSTRIAL PRIMOBANANO S.A.'
      } else {
        this.namehacienda = 'SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A.'
      }



    }

    this.solicitudService.obtenerSolicitudes().subscribe({
      next: (data) => {
        this.dataOriginal = data;

        let dataProcesar = this.dataOriginal.filter(x => x.idhacienda
          === idhacienda);
        // 1?? destruir DataTable si existe
        if (this.dataTable) {
          this.dataTable.destroy(true);
          this.dataTable = null;
        }

        // 2?? limpiar array
        this.solicitudes = [];

        // 3?? forzar Angular
        this.cdr.detectChanges();

        // 4?? cargar datos
        this.solicitudes = this.agruparSolicitudes(dataProcesar);


        // 5?? esperar a que Angular pinte la tabla
        setTimeout(() => {
          if (this.solicitudes.length > 0) {
            this.inicializarDataTable();

          }
        }, 0);
        this.loading = false;
      },

      error: err => console.error(err)
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

      columnDefs: [
        { targets: [5], orderable: false }
      ],
      language: {
        emptyTable: 'No hay datos para la fecha seleccionada',
        zeroRecords: 'No se encontraron resultados',
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ registros',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        infoEmpty: 'Mostrando 0 registros',
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

      const key = `${item.Documento.trim()}-${item.usuario.trim()}`;

      if (!mapa.has(key)) {
        mapa.set(key, {
          Documento: item.Documento.trim(),
          FechaEmision: item.FechaEmision,
          usuario: item.usuario.trim(),
          hacienda: item.hacienda.trim(),
          estado: item.estado,
          despachado: item.despachado,
          detalle: [],
          itemsPendientes: 0   // ?? OBLIGATORIO
        });
      }

      const cantidadSolicitada = Number(item.CantidadDigitada) || 0;
      const totalDespachado = Number(item.TotalDespachado) || 0;
      const pendiente = Math.max(cantidadSolicitada - totalDespachado, 0);

      const grupo = mapa.get(key);

      grupo.detalle.push({
        Documento: item.Documento.trim(),
        linea: item.linea,
        codProd: item.codProd,
        producto: item.producto,
        Solicitante: item.Solicitante?.trim(),
        hacienda: item.hacienda?.trim(),
        // cantidad: Number(item.CantidadDigitada),
        // ?? DATOS REALES DESDE EL BACK
        cantidadSolicitada,
        TotalDespachado: totalDespachado,

        itemsPendientes: 0,  // ?? CONTADOR DE ÍTEMS
        pendiente,
        // UI
        completo: true,
        cantidadDespachar: pendiente
      });
      // ? CONTAR ÍTEMS, NO CANTIDADES
      if (pendiente > 0) {
        grupo.itemsPendientes++;
      }
      console.log(grupo);
    });

    return Array.from(mapa.values());
  }

  /* =========================
   * MODAL
   * ========================= */
  verDetalle(s: any): void {

    const esCerrado = s.estado_documento === 'CERRADO';

    this.solicitudSeleccionada = {
      ...s,
      esCerrado,
      detalle: s.detalle.map((d: any) => ({
        ...d,
        completo: true,
        cantidadDespachar: d.pendiente,
        comentario: '' // 🔥 NUEVO
      }))
    };

    this.cdr.detectChanges();

    const modalEl = document.getElementById('modalDetalle');
    const modal = new bootstrap.Modal(modalEl!, {
      backdrop: 'static',
      keyboard: false
    });
    modal.show();
  }

  onCheckItem(d: any): void {

    if (this.solicitudSeleccionada?.esCerrado) return;

    if (d.completo) {
      d.cantidadDespachar = d.pendiente;
      d.comentario = ''; // 🔥 limpiar comentario
    } else {
      d.cantidadDespachar = 0;
      // 🔥 aquí se habilita comentario
    }
  }
  /* =========================
   * DESPACHO
   * ========================= */
  /* confirmarDespacho(): void {
    const invalido = this.solicitudSeleccionada.detalle.some((d: any) =>
      d.cantidadDespachar < 0 || d.cantidadDespachar > d.pendiente
    );

    if (invalido) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad inválida',
        text: 'Verifique las cantidades a despachar'
      });
      return;
    }

    const payload = {
      Documento: this.solicitudSeleccionada.Documento,
      detalle: this.solicitudSeleccionada.detalle.map((d: any) => ({
        linea: d.linea,
        CantidadDespachada: Number(d.cantidadDespachar || 0)
      }))
    };

    this.solicitudService.despachar(payload).subscribe({
      next: () => {

        // 1?? cerrar modal
        this.cerrarModal();
        // 2?? esperar cierre REAL
        setTimeout(() => {
          // 3?? recargar tabla
          this.cargarSolicitudes();
          // 4?? mensaje
          Swal.fire({
            icon: 'success',
            title: 'Despacho registrado',
            timer: 1200,
            showConfirmButton: false
          });
        }, 300);
      },

      error: err => {
        const msg =
          err?.error?.message ||
          'No due posible registrar el despacho';
        Swal.fire({
          icon: 'error',
          title: 'Error en el despacho',
          text: msg,
        })
      }
    });
  }
 */

  confirmarDespacho(): void {

    const detalle = this.solicitudSeleccionada.detalle;

    const invalido = detalle.some((d: any) =>
      d.cantidadDespachar < 0 || d.cantidadDespachar > d.pendiente
    );

    if (invalido) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad inválida'
      });
      return;
    }

    // 🔥 VALIDAR COMENTARIOS
    const sinComentario = detalle.some((d: any) =>
      !d.completo && (!d.comentario || d.comentario.trim() === '')
    );

    if (sinComentario) {
      Swal.fire({
        icon: 'warning',
        title: 'Comentario requerido',
        text: 'Debe ingresar un comentario en los ítems incompletos'
      });
      return;
    }

    const hayPendientes = detalle.some((d: any) =>
      (d.pendiente - d.cantidadDespachar) > 0
    );

    if (hayPendientes) {
      this.confirmarCierreParcial();
    } else {
      this.enviarDespacho(false);
    }
  }

  confirmarCierreParcial(): void {
    Swal.fire({
      icon: 'question',
      title: 'Despacho incompleto',
      text: '¿Deseas cerrar el despacho o dejarlo pendiente?',
      showCancelButton: true,
      confirmButtonText: 'Cerrar despacho',
      cancelButtonText: 'Dejar pendiente'
    }).then((result) => {

      if (result.isConfirmed) {
        this.enviarDespacho(true);
      } else {
        this.enviarDespacho(false);
      }

    });
  }

  enviarDespacho(cerrar: boolean): void {

    const payload = {
      Documento: this.solicitudSeleccionada.Documento,
      cerrar: cerrar,
      detalle: this.solicitudSeleccionada.detalle.map((d: any) => ({
        linea: d.linea,
        CantidadDespachada: Number(d.cantidadDespachar || 0),
        comentario: d.comentario || '' // 🔥 NUEVO
      }))
    };

    this.solicitudService.despachar(payload).subscribe({
      next: () => {
        this.cerrarModal();

        setTimeout(() => {
          this.cargarSolicitudes();

          Swal.fire({
            icon: 'success',
            title: cerrar ? 'Despacho cerrado' : 'Guardado como pendiente',
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
    const modalEl = document.getElementById('modalDetalle');
    const modal = bootstrap.Modal.getInstance(modalEl!);
    modal?.hide();

    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());

    this.solicitudSeleccionada = null;
  }


}

