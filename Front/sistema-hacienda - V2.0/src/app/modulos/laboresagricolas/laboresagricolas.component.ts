import { Component } from '@angular/core';
import { LaboresService } from '../../services/labores.service';
import { AuthserviceService } from '../../services/authservice.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { FiltroHaciendaComponent } from "../../shared/filtro-hacienda/filtro-hacienda.component";
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadisticasService } from '../../services/estadisticas.service';
import { LoaderComponent } from "../../shared/spinner/loader/loader.component";

@Component({
  selector: 'app-laboresagricolas',
  standalone: true,
  imports: [FiltroHaciendaComponent, CommonModule, FormsModule, NgFor, NgIf, LoaderComponent],
  templateUrl: './laboresagricolas.component.html',
  styleUrl: './laboresagricolas.component.css'
})
export class LaboresagricolasComponent {
  today: any[] = [];
  detalleAgrupado: any[] = [];
  origenGuardadas: boolean = false;
  usuariosCerrados: string[] = [];
  usuarioCerro = false;
  laboresCompartidasGuardadas: number[] = [];
  imprimirData: any[] = [];

  ESTADO_FILA = {
    HISTORICO: 'HISTORICO',   // viene de guardadas
    EDITABLE: 'EDITABLE',     // nuevo del SP
    BLOQUEADO: 'BLOQUEADO'    // opcional (cerrado semana)
  };

  // 🔥 CONFIG FILTRO HACIENDA
  CONFIG_FILTRO = {
    grupoOcultar: ['mayordomo', 'fitosanitario'],
    gruposPermitidos: ['administradores', 'gerencia']
  };

  // 🔥 HACIENDAS
  idhaciendaSeleccionada!: number;
  namehacienda: any = null;

  haciendas: any[] = [];

  haciendaCatalogo = [
    { id: 1, name: 'AGRICOLA E INDUSTRIAL PRIMOBANANO S.A.' },
    { id: 3, name: 'SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A.' },
  ];

  // 🔥 DATA
  detalle: any[] = [];
  cabecera: any = null;

  loading = false;

  // 🔥 TIPO
  tipoSeleccionado: 'FITO' | 'MMEDIOS' = 'FITO';

  // 🔥 FILTROS
  filtro = {
    anio: new Date().getFullYear(),
    semana: 0,
    codhac: 0,
    periodo: 0
  };

  constructor(
    protected permisoService: AuthserviceService,
    private userService: UserService,
    private alert: AlertService,
    private service: LaboresService,
    private cintaService: EstadisticasService
  ) { }

  ngOnInit(): void {

    this.loading = true;

    this.idhaciendaSeleccionada = Number(
      this.userService.getCodEmpresa()
    );


    this.namehacienda = this.userService.getNomEmpresa();


    this.filtro.codhac = Number(this.idhaciendaSeleccionada);

    /*
    |------------------------------------------------------------------
    | DEFINIR TIPO SEGÚN GRUPO
    |------------------------------------------------------------------
    */

    if (!this.esAdmin()) {

      // 🚜 MAYORDOMO
      if (this.permisoService.tieneGrupo('mayordomo')) {

        this.tipoSeleccionado = 'MMEDIOS';

      }

      // 👨‍🌾 FITOSANITARIO
      else if (this.permisoService.tieneGrupo('fitosanitario')) {

        this.tipoSeleccionado = 'FITO';

      }

    }

    // 👑 ADMIN
    else {

      this.tipoSeleccionado = 'FITO';

    }

    // 🔥 OBTENER SEMANA
    this.getsemana();

  }


  getsemana() {


    const hoy = new Date();

    const data = {
      fecha: hoy
    };
    this.loading = true;
    this.cintaService.getSemanaActual(data).subscribe({


      next: (r: any) => {

        this.today = r;

        const idcalendar = String(r[0].idcalendar);

        const anioCorto = Number(idcalendar.substring(0, 3));

        const anioReal = anioCorto + 1800;

        this.filtro.anio = anioReal;

        this.filtro.semana = Number(r[0].semana);

        this.filtro.periodo = Number(r[0].periodo);

        /*
|--------------------------------------------------------------------------
| USUARIO NORMAL
|--------------------------------------------------------------------------
| Consulta automática
|--------------------------------------------------------------------------
*/

        if (!this.esAdmin()) {

          if (this.filtro.codhac > 0) {
            this.cargarDatos();
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

  // ADMIN / GERENCIA
  esAdmin(): boolean {

    return this.permisoService.tieneGrupo('administradores')
      || this.permisoService.tieneGrupo('gerencia');

  }
  get bloqueado(): boolean {

    return this.usuarioCerro
      || this.cabecera?.estado === 'CERRADO';

  }

  //CAMBIO HACIENDA
  onHaciendaChange(event: any) {

    this.idhaciendaSeleccionada = Number(event.id);

    this.namehacienda = event.name;

    this.filtro.codhac = Number(event.id);

    this.cargarDatos();

  }
  //  PAYLOAD
  getPayload() {

    // 🔥 REGLA ESPECIAL
    // EMPRESA 8 CONSULTA COMO 3
    let codhac = this.filtro.codhac;

    return {
      ...this.filtro,
      codhac,
      tipo: this.tipoSeleccionado
    };

  }
  // CONSULTAR
  cargarDatos() {

    this.loading = true;

    const payload = this.getPayload();

    // RESET
    this.origenGuardadas = false;

    this.service.getGuardadas(payload).subscribe({

      next: (res: any) => {

        this.usuarioCerro = res.usuario_cerrado || false;

        this.usuariosCerrados = res.usuarios_cerrados || [];

        this.cabecera = res.cabecera || null;

        // 🔥 NUEVO
        this.laboresCompartidasGuardadas =
          (res.labores_compartidas || [])
            .map((x: any) => Number(x));

        /*
        |--------------------------------------------------------------
        | FITO
        |--------------------------------------------------------------
        | SI EXISTE DETALLE → MOSTRAR GUARDADO
        |--------------------------------------------------------------
        */

        if (
          this.tipoSeleccionado === 'FITO'
          && res.detalle
          && res.detalle.length > 0
        ) {

          this.detalle = res.detalle;

          this.origenGuardadas = true;

          this.agruparDetalle();

          this.loading = false;

          return;

        }

        /*
        |--------------------------------------------------------------
        | MMEDIOS
        |--------------------------------------------------------------
        | SI EL USUARIO YA CERRÓ → VER SUS DATOS
        |--------------------------------------------------------------
        */

        if (
          this.tipoSeleccionado === 'MMEDIOS'
          && this.usuarioCerro
        ) {

          this.detalle = res.detalle || [];

          this.origenGuardadas = true;

          this.agruparDetalle();

          this.loading = false;

          return;

        }

        /*
        |--------------------------------------------------------------
        | SI EL USUARIO YA CERRÓ
        |--------------------------------------------------------------
        */

        if (this.usuarioCerro) {

          this.detalle = res.detalle || [];

          this.origenGuardadas = true;

          this.agruparDetalle();

          this.loading = false;

          return;

        }

        /*
        |--------------------------------------------------------------
        | NO TIENE DATOS → CONSULTAR SP
        |--------------------------------------------------------------
        */

        this.service.getSP(payload).subscribe({

          next: (sp: any) => {

            this.detalle = sp.data || [];

            this.agruparDetalle();

            this.loading = false;

          },

          error: err => {

            console.error(err);

            this.alert.error('Error al consultar labores');

            this.loading = false;

          }

        });

      },

      error: err => {

        console.error(err);

        this.loading = false;

      }

    });

  }
  // 💾 GUARDAR
  guardar() {

    this.alert.loading('Guardando información...');

    /*
    |--------------------------------------------------------------
    | MMEDIOS
    |--------------------------------------------------------------
    | SOLO GUARDAR FERTILIZANTES
    |--------------------------------------------------------------
    */

    const detalleBase =
      this.tipoSeleccionado === 'MMEDIOS'
        ? this.detalleAgrupado.filter((x: any) => {

          const cod =
            Number(x.cod_labor || x.codlabor || 0);

          /*
          |--------------------------------------------------------------
          | FERTILIZANTES
          |--------------------------------------------------------------
          | SIEMPRE GUARDAR
          |--------------------------------------------------------------
          */

          if (cod === 1082) {
            return true;
          }

          /*
          |--------------------------------------------------------------
          | LABORES COMPARTIDAS
          |--------------------------------------------------------------
          */

          const compartidas = [2112, 2116];

          /*
          |--------------------------------------------------------------
          | SI YA EXISTE EN BD
          |--------------------------------------------------------------
          | NO VOLVER A GUARDAR
          |--------------------------------------------------------------
          */

          if (
            compartidas.includes(cod)
            &&
            this.laboresCompartidasGuardadas.includes(cod)
          ) {
            return false;
          }

          return true;

        })
        : this.detalleAgrupado;

    /*
    |--------------------------------------------------------------
    | FORMATEAR DETALLE
    |--------------------------------------------------------------
    */

    const detalleGuardar = detalleBase.map((x: any) => ({

      codlabor: Number(x.cod_labor || x.codlabor || 0),

      nombre_labor: String(x.nombre || '').trim(),

      producto: String(x.producto || '').trim(),

      cantidad_hecha: Number(x.cantidad || 0),

      has_hechas: Number(x.has_hechas || 0),

      medida_labor: String(x.medida || '').trim(),

      seccion: x.seccion || ''

    }));

    const payload = {

      ...this.getPayload(),

      detalle: detalleGuardar

    };

    this.service.guardar(payload).subscribe({

      next: (res: any) => {

        this.alert.close();

        if (res.success) {

          // 🔥 CREAR CABECERA LOCAL
          this.cabecera = {

            idCabLab: res.idCabLab,

            estado: 'BORRADOR'

          };

          // 🔥 PREGUNTAR SI DESEA CERRAR
          this.alert.confirm(
            'Información guardada',
            '¿Desea cerrar la semana ahora?'
          ).then((r: any) => {

            if (r.isConfirmed) {

              this.cerrarSemana();

            } else {

              this.alert.success('Guardado correctamente');

              this.cargarDatos();

            }

          });

        }

      },

      error: err => {

        console.error(err);

        this.alert.close();

        this.alert.error(
          err.error?.message || 'Error al guardar'
        );

      }

    });

  }

  guardarYCerrar() {

    this.alert.loading('Guardando información...');

    /*
    |--------------------------------------------------------------
    | MMEDIOS
    |--------------------------------------------------------------
    | SOLO GUARDAR FERTILIZANTES
    |--------------------------------------------------------------
    */

    const detalleBase =
      this.tipoSeleccionado === 'MMEDIOS'
        ? this.detalleAgrupado.filter((x: any) => {

          const cod =
            Number(x.cod_labor || x.codlabor || 0);

          /*
          |--------------------------------------------------------------
          | FERTILIZANTES
          |--------------------------------------------------------------
          | SIEMPRE GUARDAR
          |--------------------------------------------------------------
          */

          if (cod === 1082) {
            return true;
          }

          /*
          |--------------------------------------------------------------
          | LABORES COMPARTIDAS
          |--------------------------------------------------------------
          */

          const compartidas = [2112, 2116];

          /*
          |--------------------------------------------------------------
          | SI YA EXISTE EN BD
          |--------------------------------------------------------------
          | NO VOLVER A GUARDAR
          |--------------------------------------------------------------
          */

          if (
            compartidas.includes(cod)
            &&
            this.laboresCompartidasGuardadas.includes(cod)
          ) {
            return false;
          }

          return true;

        })
        : this.detalleAgrupado;

    /*
    |--------------------------------------------------------------
    | FORMATEAR DETALLE
    |--------------------------------------------------------------
    */

    const detalleGuardar = detalleBase.map((x: any) => ({

      codlabor: Number(x.cod_labor || x.codlabor || 0),

      nombre_labor: String(x.nombre || '').trim(),

      producto: String(x.producto || '').trim(),

      cantidad_hecha: Number(x.cantidad || 0),

      has_hechas: Number(x.has_hechas || 0),

      medida_labor: String(x.medida || '').trim(),

      seccion: x.seccion || ''

    }));

    const payload = {

      ...this.getPayload(),

      detalle: detalleGuardar

    };

    this.service.guardar(payload).subscribe({

      next: (res: any) => {

        this.cabecera = {

          idCabLab: res.idCabLab,

          estado: 'BORRADOR'

        };

        this.alert.close();

        this.cerrarSemana();

      },

      error: err => {

        console.error(err);

        this.alert.close();

        this.alert.error(
          err.error?.message || 'Error al guardar'
        );

      }

    });

  }
  // 🔒 CERRAR
  async cerrarSemana() {

    /*
    |--------------------------------------------------------------
    | SI NO EXISTE CABECERA
    |--------------------------------------------------------------
    */

    if (!this.cabecera?.idCabLab) {

      this.alert.error('No existe cabecera para cerrar');

      return;

    }

    const result = await this.alert.confirm(
      'Cerrar Semana',
      '¿Desea cerrar la semana actual?'
    );

    if (!result.isConfirmed) return;

    this.alert.loading('Cerrando semana...');

    const payload: any = {

      idCabLab: this.cabecera.idCabLab,

      tipo: this.tipoSeleccionado

    };

    this.service.cerrar(payload).subscribe({

      next: () => {

        this.alert.close();

        this.alert.success('Semana cerrada correctamente');

        this.cargarDatos();

      },

      error: err => {

        console.error(err);

        this.alert.close();

        this.alert.error(
          err.error?.message || 'Error al cerrar semana'
        );

      }

    });

  }
  // 🔥 TOTALES
  totalCantidad() {

    if (!this.detalleAgrupado || !Array.isArray(this.detalleAgrupado)) {
      return 0;
    }

    return this.detalleAgrupado
      .filter((x: any) =>
        Number(x.cod_labor || x.codlabor || 0) === 1082
      )
      .reduce(
        (sum, x) => sum + Number(x.cantidad || 0),
        0
      );

  }
  totalHas() {

    if (!this.detalleAgrupado || !Array.isArray(this.detalleAgrupado)) {
      return 0;
    }

    return this.detalleAgrupado
      .filter((x: any) =>
        Number(x.cod_labor || x.codlabor || 0) === 1082
      )
      .reduce(
        (sum, x) => sum + Number(x.has_hechas || 0),
        0
      );

  }
  onCambioSemana() {

    // 🔥 VALIDAR
    if (!this.filtro.semana) return;

    // 🔥 RECARGAR
    this.cargarDatos();

  }
  // ✏️ ACTIVAR EDICIÓN
  activarEdicionSeccion(l: any) {

    l.editandoSeccion = true;

    l.seccionTemp = l.seccion;

  }

  // 💾 GUARDAR SECCIÓN
  guardarSeccion(l: any) {

    l.seccion = l.seccionTemp;

    l.editandoSeccion = false;

  }

  // ❌ CANCELAR
  cancelarSeccion(l: any) {

    l.editandoSeccion = false;

    l.seccionTemp = l.seccion;

  }
  detalleFiltrado() {

    // 🔥 SI EXISTE AGRUPADO
    if (this.detalleAgrupado && this.detalleAgrupado.length > 0) {

      return this.detalleAgrupado;

    }

    // 🔥 FALLBACK NORMAL
    if (!this.detalle) return [];

    return this.detalle.filter((x: any) =>
      Number(x.cantidad || x.cantidad_hecha || 0) > 0
    );

  }
  // 🔥 MOSTRAR / OCULTAR CÁLCULO
  toggleCalculo(l: any) {

    l.mostrarCalculo = !l.mostrarCalculo;

  }

  // 🔥 CALCULAR RENDIMIENTO
  calcularRendimiento(l: any): number {

    const cantidad = Number(l.cantidad || 0);

    const has = Number(l.has_hechas || 0);

    if (has <= 0) return 0;

    return Number((cantidad / has).toFixed(2));

  }

  // ✏️ ACTIVAR EDICIÓN HAS
  activarEdicionHas(l: any) {

    l.editandoHas = true;

    l.hasTemp = l.has_hechas;

  }

  // 💾 GUARDAR HAS
  guardarHas(l: any) {

    l.has_hechas = Number(l.hasTemp || 0);

    l.editandoHas = false;

  }

  // ❌ CANCELAR HAS
  cancelarHas(l: any) {

    l.hasTemp = l.has_hechas;

    l.editandoHas = false;

  }
  agruparDetalle() {

    if (!this.detalle || !Array.isArray(this.detalle)) {

      this.detalleAgrupado = [];

      return;

    }

    const agrupado: any = {};

    this.detalle.forEach((item: any) => {

      const cantidad = Number(
        item.cantidad || item.cantidad_hecha || 0
      );

      if (cantidad <= 0) return;

      const codLabor = Number(
        item.cod_labor || item.codlabor || 0
      );

      const esCompartida =
        codLabor === 2112 || codLabor === 2116;

      /*
      |--------------------------------------------------------------
      | KEY ORIGINAL
      |--------------------------------------------------------------
      | NO CAMBIAR
      |--------------------------------------------------------------
      */

      const key =
        String(codLabor) + '_' +
        String(item.nombre || '').trim();

      /*
      |--------------------------------------------------------------
      | CREAR GRUPO
      |--------------------------------------------------------------
      */

      if (!agrupado[key]) {

        agrupado[key] = {

          ...item,

          nombre: String(item.nombre || '').trim(),

          cantidad: 0,

          has_hechas: 0,

          detalleProductos: [],

          bloqueado: this.origenGuardadas,

          expandible: this.origenGuardadas,

          expandido: false,

          esCompartida,

          yaReportada:
            esCompartida
            && this.laboresCompartidasGuardadas.includes(codLabor)

        };

      }

      /*
      |--------------------------------------------------------------
      | SUMAS
      |--------------------------------------------------------------
      */

      agrupado[key].cantidad += cantidad;

      agrupado[key].has_hechas += Number(
        item.has_hechas || 0
      );

      /*
      |--------------------------------------------------------------
      | DETALLE
      |--------------------------------------------------------------
      | SOLO AGREGAR SECCION
      |--------------------------------------------------------------
      */

      agrupado[key].detalleProductos.push({

        producto: item.producto || '',

        cantidad: cantidad,

        medida: item.medida || item.medida_labor || '',

        seccion: item.seccion || '',

        has_hechas: Number(item.has_hechas || 0)

      });

    });

    this.detalleAgrupado = Object.values(agrupado);

  }
  toggleDetalle(l: any) {

    // ❌ SI NO ES EXPANDIBLE, NO HACE NADA
    if (!l.expandible) return;

    l.expandido = !l.expandido;
  }


  // 🔥 TOTAL DE TIPOS ESPERADOS
  get totalUsuariosEsperados(): number {

    // FITO + MMEDIOS
    return 2;

  }

  // 🔥 CUANTOS YA CERRARON
  get totalCerrados(): number {

    return this.usuariosCerrados?.length || 0;

  }

  // 🔥 CUANTOS FALTAN
  get totalPendientes(): number {

    return this.totalUsuariosEsperados - this.totalCerrados;

  }

  // 🔥 PROGRESO %
  get progresoCierre(): number {

    return Math.round(
      (this.totalCerrados / this.totalUsuariosEsperados) * 100
    );

  }

  // 🔥 ESTADO VISUAL
  get estadoVisual(): string {

    if (this.cabecera?.estado === 'CERRADO') {
      return 'CERRADO';
    }

    if (this.totalCerrados > 0) {
      return 'PARCIAL';
    }

    return 'PENDIENTE';

  }

  imprimirLabores() {

    const payload = {

      codhac: this.filtro.codhac,

      semana: this.filtro.semana,

      anio: this.filtro.anio

    };

    this.alert.loading('Generando reporte...');

    this.service.getReporte(payload).subscribe({

      next: (res: any) => {
        console.log(res);

        this.alert.close();

        this.imprimirData = res.data || [];

        setTimeout(() => {

          window.print();

        }, 300);

      },

      error: err => {

        console.error(err);

        this.alert.close();

        this.alert.error('Error al generar reporte');

      }

    });

  }
}
