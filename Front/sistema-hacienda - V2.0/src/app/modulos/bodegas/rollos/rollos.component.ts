import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { UserService } from '../../../services/user.service';
import { LoaderComponent } from "../../../shared/spinner/loader/loader.component";
import { FiltroHaciendaComponent } from "../../../shared/filtro-hacienda/filtro-hacienda.component";
import { BodegahaciendaService } from '../../../services/bodegahacienda.service';
import { DecimalPipe, NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { debounceTime, Subject } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rollos',
  standalone: true,
  imports: [
    LoaderComponent,
    FiltroHaciendaComponent,
    NgClass,
    NgFor,
    NgIf,
    DecimalPipe,
    FormsModule,
    UpperCasePipe,
    NgSelectModule

  ],
  templateUrl: './rollos.component.html',
  styleUrl: './rollos.component.css'
})
export class RollosComponent implements OnInit {
  esPromedio: boolean = false;
  tieneCambios = false;   // 🔥 controla botón recalcular
  loading = false;
  namehacienda: any = null;
  private triggerBusqueda$ = new Subject<void>();
  totalBD: number = 0;
  totalGenerado: number = 0;
  grupoPendiente: any = null;
  motivoSeleccionado: string = '';
  motivoTexto: string = '';
  puedeGenerarSemana = false;
  lotesSeleccionados: any[] = [];
  personasDisponibles: any[] = [];
  loteSeleccionado: any = null;
  personaSeleccionada: number | null = null;


  // 🔥 REEMPLAZO
  controlSeleccionado: any = null;

  reemplazoSeleccionado: number | null = null;

  motivoReemplazo: string = '';



  CONFIG_FILTRO = {
    grupoOcultar: ['bodega'],
    gruposPermitidos: ['gerencia', 'administradores']
  };
  dataAgrupada: any[] = [];
  idhaciendaSeleccionada!: number;

  modo: 'auto' | 'manual' = 'auto';
  fecha: string = '';

  semana: number = 0;
  periodo: number = 0;
  anio: number = new Date().getFullYear();

  estadoSemana: 'abierta' | 'cerrada' | null = null;

  data: any[] = [];
  constructor(private router: Router,
    private rollosService: BodegahaciendaService,
    private alert: AlertService,
    private permisoService: AuthserviceService, private route: ActivatedRoute, // 👈 AÑADE ESTO
  ) {

  }

  cambiarSemana(dias: number) {

    if (!this.fecha) return;

    const nuevaFecha = new Date(this.fecha);

    nuevaFecha.setDate(nuevaFecha.getDate() + dias);

    this.fecha = nuevaFecha.toISOString().substring(0, 10);

    // 🔥 reutilizas tu lógica existente
    this.calcularDesdeFecha();
  }

  ngOnInit(): void {

    const params = this.route.snapshot.queryParams;

    const vieneDeHistorial = params['fromHistorial'] == 1;

    if (vieneDeHistorial) {

      // 🔥 RESTAURAR CONTEXTO
      this.semana = +params['semana'];
      this.anio = +params['anio'];
      this.periodo = +params['periodo'];
      this.idhaciendaSeleccionada = +params['idhacienda'];

      // 🔥 CLAVE: reconstruir fecha para que funcionen botones
      this.fecha = this.construirFechaDesdeSemana(this.semana, this.anio);

      // 🔥 BUSCAR SIN TOCAR TU FLUJO
      this.buscar();

    } else {

      // 🔵 FLUJO NORMAL (NO TOCAR)
      this.fecha = new Date().toISOString().substring(0, 10);
      this.calcularDesdeFecha();

    }

    // 🔐 PERMISOS (igual que ya tienes)
    this.puedeGenerarSemana =
      this.permisoService.tieneGrupo('administradores') ||
      this.permisoService.tieneGrupo('sistemas');

    // 🔍 AUTO BUSQUEDA (igual que ya tienes)
    this.triggerBusqueda$
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.autoBuscar();
      });

  }
  autoBuscar() {

    if (!this.idhaciendaSeleccionada) return;
    if (!this.semana || !this.periodo) return;

    this.buscar();
  }
  onHaciendaChange(hacienda: any): void {
    this.idhaciendaSeleccionada = hacienda.id;
    this.namehacienda = hacienda.name;

    this.triggerBusqueda$.next();
    // limpiar data
    this.data = [];
    this.estadoSemana = null;
  }
  onFiltroChange() {
    this.triggerBusqueda$.next();
  }
  onModoChange() {
    if (this.modo === 'auto') {
      this.fecha = new Date().toISOString().substring(0, 10);
      this.calcularDesdeFecha();
    }
  }

  calcularDesdeFecha() {
    this.loading = true;

    this.rollosService.getSemana(this.fecha)
      .subscribe({
        next: (res: any) => {
          this.semana = res?.semana ?? 0;
          this.periodo = res?.periodo ?? 0;

          this.triggerBusqueda$.next();
        },
        complete: () => this.loading = false,
        error: () => this.loading = false
      });
  }

  consultarEstadoSemana() {
    this.rollosService.getEstadoSemana({
      semana: this.semana,
      periodo: this.periodo,
      anio: this.anio,
      idhacienda: this.idhaciendaSeleccionada
    }).subscribe((res: any) => {

      this.estadoSemana = res?.estado ?? null;

      // 🔥 ESTE SIGUE IGUAL (NO TOCAR)
      this.esPromedio = res?.es_promedio == 1;

      // 🔥 NUEVO → ESTO ES LO QUE DEFINE SI ES REAL
      const esRealEnfunde = res?.es_real_enfunde === true;

      // 🔥 FIX: SI NO ES REAL → FORZAR A PROMEDIO VISUALMENTE
      if (!esRealEnfunde) {
        this.esPromedio = true;
      }

    });
  }

  buscar() {
    if (!this.semana || !this.periodo || !this.idhaciendaSeleccionada) return; this.loading = true; this.consultarEstadoSemana(); this.rollosService.getEstado({ semana: this.semana, periodo: this.periodo, anio: this.anio, idhacienda: this.idhaciendaSeleccionada }).subscribe({
      next: (res) => {

        this.data = res.map((item: any) => ({

          id: item.id ?? null,

          idlotero: item.idlotero ?? null,

          nombre: item.nombre ?? null,

          // 🔥 REEMPLAZO
          reemplazo_idlotero: item.reemplazo_idlotero ?? null,

          reemplazo_nombre: item.reemplazo_nombre ?? null,

          tiene_reemplazo: item.tiene_reemplazo == 1,

          seccion: item.seccion,

          fundas: Number(item.fundas),

          rollos_entregados: Number(item.rollos_entregados),

          entregado_real: Number(item.entregado_real ?? 0),

          diferencia: Number(item.diferencia ?? 0),

          arrastre_anterior: Number(item.arrastre_anterior ?? 0),

          nuevo: null
        }));



        this.dataAgrupada = this.agruparPorPersona(this.data); this.loading = false;
      }, error: () => this.loading = false
    });
  }


  generarSemana() {

    // 🔒 SI YA EXISTE SEMANA
    if (this.estadoSemana === 'abierta') {

      if (this.esPromedio) {
        this.alert.modalInfo(
          'Semana ya generada',
          'Esta semana ya fue creada con <b>datos promedios</b>.'
        );
      } else {
        this.alert.modalInfo(
          'Datos reales detectados',
          'Esta semana ya tiene datos reales.<br><b>Usa "Recalcular"</b> si hubo cambios.'
        );
      }

      return;
    }

    if (this.estadoSemana === 'cerrada') {
      this.alert.modalWarning(
        'Semana cerrada',
        'No puedes generar una semana ya cerrada'
      );
      return;
    }

    // 🚀 GENERAR
    this.loading = true;

    this.rollosService.crearSemana({
      semana: this.semana,
      periodo: this.periodo,
      anio: this.anio,
      idhacienda: this.idhaciendaSeleccionada
    }).subscribe({
      next: () => {
        this.alert.success('Semana generada correctamente');
        this.buscar();
      },
      error: () => {
        this.loading = false;
        this.alert.modalError('Error', 'No se pudo generar la semana');
      }
    });
  }

  cerrarSemana() {

    this.alert.confirm(
      '¿Cerrar semana?',
      'No podrás registrar más entregas'
    ).then(result => {

      if (!result.isConfirmed) return;

      this.loading = true;

      this.rollosService.cerrarSemana({
        semana: this.semana,
        periodo: this.periodo,
        anio: this.anio,
        idhacienda: this.idhaciendaSeleccionada
      }).subscribe({
        next: () => {
          this.alert.success('Semana cerrada');
          this.buscar();
        },
        error: () => {
          this.loading = false;
          this.alert.modalError('Error', 'No se pudo cerrar');
        }
      });

    });
  }
  // 🔥 TOTALES
  get totalFundas(): number {
    return this.data.reduce((acc, item) => {
      return acc + Number(item.fundas ?? 0);
    }, 0);
  }

  get totalRollos(): number {
    return this.data.reduce((acc, item) => {
      return acc + Number(item.rollos_entregados ?? 0);
    }, 0);
  }
  recalcularSiEsNecesario() {

    if (this.estadoSemana !== 'abierta') return;

    this.loading = true;

    this.rollosService.crearSemana({
      semana: this.semana,
      periodo: this.periodo,
      anio: this.anio,
      idhacienda: this.idhaciendaSeleccionada
    }).subscribe({
      next: () => {
        this.alert.success('Datos recalculados correctamente');
        this.buscar();
      },
      error: () => {
        this.loading = false;
        this.alert.modalError('Error', 'No se pudo recalcular');
      }
    });
  }
  get mostrarRecalcular(): boolean {
    return this.tieneCambios;
  }
  get totalEntregado(): number {
    return this.dataAgrupada.reduce((acc, g) => {
      return acc + Number(g.totalEntregado ?? 0);
    }, 0);
  }

  get totalDiferencia(): number {
    return this.dataAgrupada.reduce((acc, g) => {
      return acc + Number(g.totalDiferencia ?? 0);
    }, 0);
  }
  registrar(item: any) {

    const cantidad = Number(item.nuevo);

    if (!cantidad || cantidad <= 0) {
      this.alert.modalWarning('Valor inválido', 'Ingrese una cantidad válida');
      return;
    }

    const payload = {
      seccion: item.seccion,
      fecha: new Date().toISOString().substring(0, 10),
      rollos: cantidad,
      semana: this.semana,
      periodo: this.periodo,
      anio: this.anio,
      idhacienda: this.idhaciendaSeleccionada
    };

    this.rollosService.registrarMovimiento(payload)
      .subscribe({
        next: () => {
          this.alert.success('Entrega registrada');
          item.nuevo = null;
          this.buscar();
        },
        error: () => {
          this.alert.modalError('Error', 'No se pudo registrar');
        }
      });
  }



  agruparPorPersona(data: any[]) {
    const map: any = {}; data.forEach(item => {

      // 🔥 SI TIENE PERSONA → AGRUPAR POR PERSONA
      // 🔥 SI NO TIENE → AGRUPAR POR LOTE
      const key = item.idlotero
        ? `PERSONA_${item.idlotero}`
        : `LOTE_${item.seccion}`;


      if (!map[key]) {
        map[key] = {

          nombre: item.idlotero
            ? item.nombre
            : `SIN ASIGNACIÓN (${item.seccion})`,

          idlotero: item.idlotero,

          // 🔥 CLAVE NUEVA
          seccion: item.seccion,



          // 🔥 REEMPLAZO
          tieneReemplazo: item.tiene_reemplazo,

          nombreReemplazo: item.reemplazo_nombre,

          idreemplazo: item.reemplazo_idlotero,

          totalFundas: 0,
          totalEstimado: 0,
          totalEntregado: 0,
          arrastre: 0,
          debeEntregar: 0,
          totalDiferencia: 0,
          avanceReal: 0,
          lotes: [],
          expanded: false,
          nuevoDespacho: null,
          _arrastreAsignado: false,
          _totalRealAsignado: false

        };
      } map[key].lotes.push(item); map[key].totalFundas += Number(item.fundas ?? 0); map[key].totalEstimado += Number(item.rollos_entregados ?? 0); if (!map[key]._totalRealAsignado) { map[key].totalEntregado = Number(item.entregado_real ?? 0); map[key]._totalRealAsignado = true; } if (!map[key]._arrastreAsignado) { const arrastreBD = Number(item.arrastre_anterior ?? 0); map[key].arrastre = arrastreBD < 0 ? Math.abs(arrastreBD) : -arrastreBD; map[key]._arrastreAsignado = true; }
    });

    Object.values(map).forEach((g: any) => { g.debeEntregar = g.totalEstimado + g.arrastre; g.totalDiferencia = g.totalEntregado - g.debeEntregar; g.avanceReal = g.debeEntregar > 0 ? (g.totalEntregado / g.debeEntregar) * 100 : 0; }); return Object.values(map);

  }

  despacharPersona(grupo: any) {

    const cantidad = Number(grupo.nuevoDespacho);

    if (!cantidad || cantidad <= 0) {
      this.alert.modalWarning('Valor inválido', 'Ingrese una cantidad válida');
      return;
    }

    if (!grupo.nombre || grupo.nombre.trim() === 'SIN ASIGNACIÓN') {
      this.alert.modalWarning('Sin asignación', 'Este grupo no tiene persona asignada');
      return;
    }

    const restante = Number(grupo.totalEstimado ?? 0) - Number(grupo.totalEntregado ?? 0);


    // 🔥 SI SE PASA → ABRIR MODAL
    if (cantidad > restante) {
      this.grupoPendiente = grupo;

      const modal = new (window as any).bootstrap.Modal(
        document.getElementById('modalMotivo')
      );

      modal.show();
      return;
    }

    // ✅ flujo normal
    this.ejecutarDespacho(grupo, null);
  }

  ejecutarDespacho(grupo: any, motivo: string | null) {

    const cantidad = Number(grupo.nuevoDespacho);

    const payload = {

      idhacienda: this.idhaciendaSeleccionada,

      // 🔥 DATOS PERSONA
      idlotero: grupo.idlotero,
      nombre: grupo.nombre,

      // 🔥 REEMPLAZO
      idreemplazo: grupo.idreemplazo ?? null,

      // 🔥 MOVIMIENTO
      rollos: cantidad,

      semana: this.semana,
      periodo: this.periodo,
      anio: this.anio,

      motivo: motivo
    };

    this.rollosService.despachoPorPersona(payload)
      .subscribe({

        next: () => {

          this.alert.success('Despacho distribuido correctamente');

          grupo.nuevoDespacho = null;

          this.limpiarModal();

          this.buscar();
        },

        error: (err) => {

          console.error(err);

          this.alert.modalError(
            'Error',
            err.error?.error || 'No se pudo despachar'
          );
        }
      });
  }



  confirmarDespacho() {

    if (!this.grupoPendiente) return;

    let motivoFinal = this.motivoSeleccionado;

    if (this.motivoTexto) {
      motivoFinal += ' - ' + this.motivoTexto.toUpperCase();
    }

    this.ejecutarDespacho(this.grupoPendiente, motivoFinal || null);

    this.cerrarModal();
  }
  cerrarModal() {
    const modalEl = document.getElementById('modalMotivo');
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal?.hide();

    this.limpiarModal();
  }

  limpiarModal() {
    this.motivoSeleccionado = '';
    this.motivoTexto = '';
    this.grupoPendiente = null;
  }

  abrirAsignacion(item: any) {

    this.loteSeleccionado = item;
    this.personaSeleccionada = null;

    // 🔥 CARGAR PERSONAS DESDE BACKEND
    this.rollosService.getPersonas(this.idhaciendaSeleccionada)
      .subscribe((res: any) => {

        this.personasDisponibles = res;

        const modal = new (window as any).bootstrap.Modal(
          document.getElementById('modalAsignarPersona')
        );

        modal.show();
      });
  }

  guardarAsignacion() {

    if (!this.personaSeleccionada) {
      this.alert.modalWarning('Seleccione', 'Debe seleccionar una persona');
      return;
    }

    const persona = this.personasDisponibles.find(
      p => p.idlotero == this.personaSeleccionada
    );

    // 🔥 SUMAR SOLO LOS SELECCIONADOS
    const totalRollos = this.lotesSeleccionados.reduce((acc, l) => {
      return acc + Number(l.rollos_entregados ?? 0);
    }, 0);

    if (totalRollos <= 0) {
      this.alert.modalWarning('Sin datos', 'No hay rollos válidos');
      return;
    }

    const payload = {
      idhacienda: this.idhaciendaSeleccionada,
      semana: this.semana,
      periodo: this.periodo,
      anio: this.anio,

      idlotero: this.personaSeleccionada,
      nombre: persona?.nombre ?? '',
      rollos: totalRollos
    };

    this.rollosService.asignarPersona(payload)
      .subscribe({
        next: () => {

          this.alert.success('Asignación múltiple realizada');

          this.lotesSeleccionados = []; // 🔥 limpiar selección
          this.cerrarModalAsignacion();
          this.buscar();

        },
        error: (err) => {
          console.error(err);
          this.alert.modalError('Error', err.error?.error || 'No se pudo asignar');
        }
      });
  }

  cerrarModalAsignacion() {

    const modalEl = document.getElementById('modalAsignarPersona');
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal?.hide();

    this.loteSeleccionado = null;
    this.personaSeleccionada = null;
  }
  buscarPersona(term: string, item: any): boolean {

    if (!term) return true;

    const texto = term.toLowerCase();

    const nombre = (item.nombre || '').toLowerCase();
    const id = (item.idlotero || '').toString();

    return nombre.includes(texto) || id.includes(texto);
  }
  abrirAsignacionGrupo(grupo: any) {

    this.grupoPendiente = grupo;
    this.personaSeleccionada = null;

    this.rollosService.getPersonas(this.idhaciendaSeleccionada)
      .subscribe((res: any) => {

        this.personasDisponibles = res;

        const modal = new (window as any).bootstrap.Modal(
          document.getElementById('modalAsignarPersona')
        );

        modal.show();
      });
  }

  toggleLote(item: any, event: any) {

    if (item.idlotero) return; // 🔥 seguridad extra

    if (event.target.checked) {
      this.lotesSeleccionados.push(item);
    } else {
      this.lotesSeleccionados = this.lotesSeleccionados.filter(l => l !== item);
    }
  }

  abrirAsignacionMultiple() {

    if (this.lotesSeleccionados.length === 0) {
      this.alert.modalWarning('Seleccione', 'Debe seleccionar al menos un lote');
      return;
    }

    this.personaSeleccionada = null;

    this.rollosService.getPersonas(this.idhaciendaSeleccionada)
      .subscribe((res: any) => {

        this.personasDisponibles = res;

        const modal = new (window as any).bootstrap.Modal(
          document.getElementById('modalAsignarPersona')
        );

        modal.show();
      });
  }

  verHistorial(grupo: any) {

    this.router.navigate(['bodegas/historial-persona'], {
      queryParams: {
        idlotero: grupo.idlotero,
        nombre: grupo.nombre,
        idhacienda: this.idhaciendaSeleccionada,

        // 🔥 CONTEXTO
        semana: this.semana,
        anio: this.anio,
        periodo: this.periodo,

        // 🔥 FLAG PRO
        fromRollos: 1
      }
    });

  }
  private construirFechaDesdeSemana(semana: number, anio: number): string {

    const simple = new Date(anio, 0, 1 + (semana - 1) * 7);
    const diaSemana = simple.getDay();

    const ISOweekStart = simple;

    if (diaSemana <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());

    return ISOweekStart.toISOString().substring(0, 10);
  }


  // 🔥 ABRIR MODAL REEMPLAZO
  abrirModalReemplazo(grupo: any) {

    this.controlSeleccionado = grupo;

    this.reemplazoSeleccionado = null;

    this.motivoReemplazo = '';

    this.rollosService.getPersonas(this.idhaciendaSeleccionada)
      .subscribe((res: any) => {

        // 🔥 EXCLUIR TITULAR
        this.personasDisponibles = res.filter(
          (p: any) => p.idlotero != grupo.idlotero
        );

        const modal = new (window as any).bootstrap.Modal(
          document.getElementById('modalReemplazo')
        );

        modal.show();
      });
  }

  // 🔥 GUARDAR REEMPLAZO
  guardarReemplazo() {

    if (!this.reemplazoSeleccionado) {

      this.alert.modalWarning(
        'Seleccione',
        'Debe seleccionar una persona'
      );

      return;
    }
    if (!this.controlSeleccionado?.lotes?.length) {
      this.alert.modalError('Error', 'No existe control asociado');
      return;
    }

    const payload = {

      idhacienda: this.idhaciendaSeleccionada,
      semana: this.semana,
      periodo: this.periodo,
      anio: this.anio,
      idlotero: this.controlSeleccionado.idlotero,
      reemplazo_idlotero: this.reemplazoSeleccionado,
      motivo_reemplazo: this.motivoReemplazo
    };

    this.rollosService.guardarReemplazo(payload)
      .subscribe({

        next: () => {

          this.alert.success('Reemplazo guardado');

          this.cerrarModalReemplazo();

          this.buscar();
        },

        error: (err) => {

          console.error(err);

          this.alert.modalError(
            'Error',
            err.error?.message || 'No se pudo guardar'
          );
        }
      });
  }

  // 🔥 CERRAR MODAL
  cerrarModalReemplazo() {

    const modalEl = document.getElementById('modalReemplazo');

    const modal = (window as any)
      .bootstrap.Modal.getInstance(modalEl);

    modal?.hide();

    this.controlSeleccionado = null;

    this.reemplazoSeleccionado = null;

    this.motivoReemplazo = '';
  }


}