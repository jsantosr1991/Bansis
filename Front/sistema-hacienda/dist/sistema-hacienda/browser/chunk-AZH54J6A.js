import {
  AuthserviceService
} from "./chunk-3TA73A5V.js";
import {
  require_sweetalert2_all
} from "./chunk-FTOV3S6L.js";
import {
  UserService
} from "./chunk-UHCEN6B7.js";
import {
  RouterOutlet
} from "./chunk-IMONGHQ7.js";
import "./chunk-LTPV2N3O.js";
import {
  LoaderComponent
} from "./chunk-JMZPKJEB.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-2RHLRMSC.js";
import {
  environment
} from "./chunk-K2LMSEX6.js";
import {
  ChangeDetectorRef,
  DatePipe,
  HttpClient,
  NgForOf,
  NgIf,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-KOB7DKR4.js";
import {
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-WYLQU5MV.js";

// src/app/modulos/bodegas/bodegahacienda/bodegahacienda.component.ts
var import_sweetalert2 = __toESM(require_sweetalert2_all());

// src/app/services/bodegahacienda.service.ts
var BodegahaciendaService = class _BodegahaciendaService {
  http;
  baseUrl = environment.apiUrl;
  constructor(http) {
    this.http = http;
  }
  obtenerSolicitudes() {
    return this.http.get(this.baseUrl + "/vsolicitudpedidos");
  }
  //por modificar aun
  despachar(payload) {
    return this.http.post(`${this.baseUrl}/despachar`, payload);
  }
  despachado(payload) {
    console.log(payload);
    return this.http.post(`${this.baseUrl}/getdespacho`, payload);
  }
  getUltimaFechaDespacho() {
    return this.http.get(this.baseUrl + "/ultimafechadespacho");
  }
  getUltimaFechaDespachoPorHacienda() {
    return this.http.get(this.baseUrl + "/ultimafechadespachoporhacienda");
  }
  static \u0275fac = function BodegahaciendaService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BodegahaciendaService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _BodegahaciendaService, factory: _BodegahaciendaService.\u0275fac, providedIn: "root" });
};

// src/app/modulos/bodegas/bodegahacienda/bodegahacienda.component.ts
function BodegahaciendaComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "div", 20);
    \u0275\u0275elementEnd();
  }
}
function BodegahaciendaComponent_ng_template_6_option_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const h_r4 = ctx.$implicit;
    \u0275\u0275property("value", h_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(h_r4.name);
  }
}
function BodegahaciendaComponent_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "div", 21)(2, "label", 22);
    \u0275\u0275text(3, "Escoja Hacienda");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 23);
    \u0275\u0275twoWayListener("ngModelChange", function BodegahaciendaComponent_ng_template_6_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.solicitud.idhacienda, $event) || (ctx_r2.solicitud.idhacienda = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function BodegahaciendaComponent_ng_template_6_Template_select_change_4_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cargarSolicitudes());
    });
    \u0275\u0275template(5, BodegahaciendaComponent_ng_template_6_option_5_Template, 2, 2, "option", 24);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.solicitud.idhacienda);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.hacienda);
  }
}
function BodegahaciendaComponent_div_10_tr_19_td_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td")(1, "span", 39)(2, "b");
    \u0275\u0275text(3, " Pendiente ");
    \u0275\u0275elementEnd()()();
  }
}
function BodegahaciendaComponent_div_10_tr_19_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 34)(1, "span", 40)(2, "b");
    \u0275\u0275text(3, " Incompleto ");
    \u0275\u0275elementEnd()()();
  }
}
function BodegahaciendaComponent_div_10_tr_19_span_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 41);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", s_r6.itemsPendientes, " \xEDtems ");
  }
}
function BodegahaciendaComponent_div_10_tr_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 31);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td")(7, "div", 32);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td")(10, "span", 33);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(12, BodegahaciendaComponent_div_10_tr_19_td_12_Template, 4, 0, "td", 6)(13, BodegahaciendaComponent_div_10_tr_19_ng_template_13_Template, 4, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementStart(15, "td", 34);
    \u0275\u0275template(16, BodegahaciendaComponent_div_10_tr_19_span_16_Template, 2, 1, "span", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 36)(18, "button", 37);
    \u0275\u0275listener("click", function BodegahaciendaComponent_div_10_tr_19_Template_button_click_18_listener() {
      const s_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.verDetalle(s_r6));
    });
    \u0275\u0275element(19, "i", 38);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const s_r6 = ctx.$implicit;
    const pendiente_r7 = \u0275\u0275reference(14);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", s_r6.Documento, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(5, 7, s_r6.FechaEmision, "dd/MM/yyyy"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(s_r6.usuario);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", s_r6.detalle.length, " productos ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", s_r6.itemsPendientes === s_r6.detalle.length)("ngIfElse", pendiente_r7);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", s_r6.itemsPendientes > 0);
  }
}
function BodegahaciendaComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "table", 27)(2, "thead", 28)(3, "tr")(4, "th");
    \u0275\u0275text(5, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Usuario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "\xCDtems");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Por despachar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 29);
    \u0275\u0275text(17, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275template(19, BodegahaciendaComponent_div_10_tr_19_Template, 20, 10, "tr", 30);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(19);
    \u0275\u0275property("ngForOf", ctx_r2.solicitudes);
  }
}
function BodegahaciendaComponent_div_18_tr_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 47);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 29)(10, "input", 48);
    \u0275\u0275twoWayListener("ngModelChange", function BodegahaciendaComponent_div_18_tr_29_Template_input_ngModelChange_10_listener($event) {
      const d_r9 = \u0275\u0275restoreView(_r8).$implicit;
      \u0275\u0275twoWayBindingSet(d_r9.completo, $event) || (d_r9.completo = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function BodegahaciendaComponent_div_18_tr_29_Template_input_change_10_listener() {
      const d_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onCheckItem(d_r9));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 47)(12, "input", 49);
    \u0275\u0275twoWayListener("ngModelChange", function BodegahaciendaComponent_div_18_tr_29_Template_input_ngModelChange_12_listener($event) {
      const d_r9 = \u0275\u0275restoreView(_r8).$implicit;
      \u0275\u0275twoWayBindingSet(d_r9.cantidadDespachar, $event) || (d_r9.cantidadDespachar = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const d_r9 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r9.Solicitante);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r9.codProd);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r9.producto);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", d_r9.pendiente, " ");
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", d_r9.completo);
    \u0275\u0275property("disabled", d_r9.pendiente === 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("max", d_r9.pendiente);
    \u0275\u0275twoWayProperty("ngModel", d_r9.cantidadDespachar);
    \u0275\u0275property("disabled", d_r9.completo || d_r9.pendiente === 0);
  }
}
function BodegahaciendaComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "div", 43)(2, "div", 44)(3, "strong");
    \u0275\u0275text(4, "Solicita:");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "br");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 44)(8, "strong");
    \u0275\u0275text(9, "Bodega:");
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "br");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 26)(13, "table", 45)(14, "thead", 46)(15, "tr")(16, "th");
    \u0275\u0275text(17, "Despachar a:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "Cod. Prod");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th");
    \u0275\u0275text(21, "Producto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th", 47);
    \u0275\u0275text(23, "Cantidad Pendiente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "th", 29);
    \u0275\u0275text(25, "Completo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "th", 47);
    \u0275\u0275text(27, "Cantidad a despachar");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "tbody");
    \u0275\u0275template(29, BodegahaciendaComponent_div_18_tr_29_Template, 13, 9, "tr", 30);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r2.solicitudSeleccionada == null ? null : ctx_r2.solicitudSeleccionada.usuario, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r2.solicitudSeleccionada == null ? null : ctx_r2.solicitudSeleccionada.hacienda, " ");
    \u0275\u0275advance(18);
    \u0275\u0275property("ngForOf", ctx_r2.solicitudSeleccionada == null ? null : ctx_r2.solicitudSeleccionada.detalle);
  }
}
var BodegahaciendaComponent = class _BodegahaciendaComponent {
  solicitudService;
  cdr;
  permisoService;
  userService;
  loading = false;
  solicitudes = [];
  solicitudSeleccionada = null;
  idhaciendaSeleccionada = null;
  // Guarda el valor seleccionado del select
  namehacienda = null;
  dataTable = null;
  dataOriginal = [];
  empresas = [];
  solicitud = {
    fecha: "",
    idhacienda: ""
  };
  hacienda = [
    { id: 1, name: "AGRICOLA E INDUSTRIAL PRIMOBANANO S.A." },
    { id: 3, name: "SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A." }
  ];
  constructor(solicitudService, cdr, permisoService, userService) {
    this.solicitudService = solicitudService;
    this.cdr = cdr;
    this.permisoService = permisoService;
    this.userService = userService;
  }
  /* =========================
   * CICLO DE VIDA
   * ========================= */
  ngOnInit() {
    const modalEl = document.getElementById("modalDetalle");
    modalEl?.addEventListener("hidden.bs.modal", () => {
      document.body.classList.remove("modal-open");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
      this.solicitudSeleccionada = null;
    });
    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();
    this.namehacienda = this.userService.getNomEmpresa();
    const esGerencia = this.permisoService.tieneGrupo("gerencia");
    const esAdmin = this.permisoService.tieneGrupo("administradores");
    if (esGerencia || esAdmin) {
      this.cargarhacienda();
    }
    this.cargarSolicitudes();
  }
  cargarhacienda() {
    this.empresas = this.hacienda;
  }
  ngOnDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy(true);
      this.dataTable = null;
    }
  }
  /* =========================
   * DATA
   * ========================= */
  cargarSolicitudes() {
    this.loading = true;
    const esMayordomo = this.permisoService.tieneGrupo("bodega");
    let idhacienda = null;
    if (esMayordomo) {
      idhacienda = Number(this.idhaciendaSeleccionada);
      if (idhacienda == 8) {
        idhacienda = 3;
      }
    } else {
      idhacienda = this.solicitud.idhacienda ? Number(this.solicitud.idhacienda) : null;
      if (idhacienda == 1) {
        this.namehacienda = "AGRICOLA E INDUSTRIAL PRIMOBANANO S.A.";
      } else {
        this.namehacienda = "SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A.";
      }
    }
    this.solicitudService.obtenerSolicitudes().subscribe({
      next: (data) => {
        this.dataOriginal = data;
        let dataProcesar = this.dataOriginal.filter((x) => x.idhacienda === idhacienda);
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
      error: (err) => console.error(err)
    });
  }
  inicializarDataTable() {
    this.dataTable = $("#tablaSolicitudes").DataTable({
      dom: '<"top d-flex justify-content-between align-items-center"lf>rt<"bottom"ip>',
      autoWidth: false,
      responsive: false,
      ordering: true,
      destroy: true,
      columnDefs: [
        { targets: [5], orderable: false }
      ],
      language: {
        emptyTable: "No hay datos para la fecha seleccionada",
        zeroRecords: "No se encontraron resultados",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ registros",
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        infoEmpty: "Mostrando 0 registros",
        paginate: {
          next: "Siguiente",
          previous: "Anterior"
        }
      }
    });
  }
  /* =========================
   * AGRUPACIÓN
   * ========================= */
  agruparSolicitudes(data) {
    const mapa = /* @__PURE__ */ new Map();
    data.forEach((item) => {
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
          itemsPendientes: 0
          // ?? OBLIGATORIO
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
        itemsPendientes: 0,
        // ?? CONTADOR DE ÍTEMS
        pendiente,
        // UI
        completo: true,
        cantidadDespachar: pendiente
      });
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
  verDetalle(s) {
    this.solicitudSeleccionada = __spreadProps(__spreadValues({}, s), {
      detalle: s.detalle.filter((d) => d.pendiente >= 0).map((d) => __spreadProps(__spreadValues({}, d), {
        completo: true,
        cantidadDespachar: d.pendiente
      }))
    });
    this.cdr.detectChanges();
    const modalEl = document.getElementById("modalDetalle");
    const modal = new bootstrap.Modal(modalEl, {
      backdrop: "static",
      keyboard: false
    });
    modal.show();
  }
  onCheckItem(d) {
    if (d.completo) {
      d.cantidadDespachar = d.pendiente;
    } else {
      d.cantidadDespachar = 0;
    }
  }
  /* =========================
   * DESPACHO
   * ========================= */
  confirmarDespacho() {
    const invalido = this.solicitudSeleccionada.detalle.some((d) => d.cantidadDespachar < 0 || d.cantidadDespachar > d.pendiente);
    if (invalido) {
      import_sweetalert2.default.fire({
        icon: "warning",
        title: "Cantidad inv\xE1lida",
        text: "Verifique las cantidades a despachar"
      });
      return;
    }
    const payload = {
      Documento: this.solicitudSeleccionada.Documento,
      detalle: this.solicitudSeleccionada.detalle.map((d) => ({
        linea: d.linea,
        CantidadDespachada: Number(d.cantidadDespachar || 0)
      }))
    };
    this.solicitudService.despachar(payload).subscribe({
      next: () => {
        this.cerrarModal();
        setTimeout(() => {
          this.cargarSolicitudes();
          import_sweetalert2.default.fire({
            icon: "success",
            title: "Despacho registrado",
            timer: 1200,
            showConfirmButton: false
          });
        }, 300);
      },
      error: (err) => {
        const msg = err?.error?.message || "No due posible registrar el despacho";
        import_sweetalert2.default.fire({
          icon: "error",
          title: "Error en el despacho",
          text: msg
        });
      }
    });
  }
  cerrarModal() {
    const modalEl = document.getElementById("modalDetalle");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
    document.body.classList.remove("modal-open");
    document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
    this.solicitudSeleccionada = null;
  }
  static \u0275fac = function BodegahaciendaComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BodegahaciendaComponent)(\u0275\u0275directiveInject(BodegahaciendaService), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(AuthserviceService), \u0275\u0275directiveInject(UserService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BodegahaciendaComponent, selectors: [["app-bodegahacienda"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 24, vars: 7, consts: [["gerencia", ""], ["pendiente", ""], [3, "loading"], [1, "d-flex", "justify-content-between", "align-items-center", "mb-3"], [1, "fw-bold"], [1, "bi", "bi-box-seam", "me-2"], [4, "ngIf", "ngIfElse"], [1, "card", "shadow-sm", "mt-1"], [1, "card-body"], ["class", "table-responsive", 4, "ngIf"], ["id", "modalDetalle", "tabindex", "-1", "aria-hidden", "true", 1, "modal", "fade"], [1, "modal-dialog", "modal-lg", "modal-dialog-centered"], [1, "modal-content"], [1, "modal-header"], [1, "modal-title"], ["type", "button", "data-bs-dismiss", "modal", 1, "btn-close"], ["class", "modal-body", 4, "ngIf"], [1, "modal-footer"], ["data-bs-dismiss", "modal", 1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-success", 3, "click"], [1, "row", "align-items-end"], [1, "col-md-4"], ["for", "hacienda-administrador"], ["id", "hacienda-administrador", 1, "form-select", 3, "ngModelChange", "change", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], [1, "table-responsive"], ["id", "tablaSolicitudes", 1, "table", "table-striped", "table-hover", "align-middle", "w-100", 2, "table-layout", "auto"], [1, "table-dark"], [1, "text-center"], [4, "ngFor", "ngForOf"], [1, "col-documento"], [1, "usuario-nombre"], [1, "badge", "bg-success"], [1, "justify-content-center"], ["class", "fw-bolder text-center", 4, "ngIf"], [1, "text-center", "acciones"], [1, "btn", "btn-primary", 3, "click"], [1, "bi", "bi-eye"], [1, "badge", "bg-danger"], [1, "badge", "bg-warning"], [1, "fw-bolder", "text-center"], [1, "modal-body"], [1, "row", "mb-3"], [1, "col-md-6"], [1, "table", "table-bordered", "table-sm", "align-middle"], [1, "table-light"], [1, "text-end"], ["type", "checkbox", 1, "form-check-input", 3, "ngModelChange", "change", "ngModel", "disabled"], ["type", "number", "min", "0", "step", "0.01", 1, "form-control", "form-control-sm", "text-end", 3, "ngModelChange", "max", "ngModel", "disabled"]], template: function BodegahaciendaComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275element(0, "app-loader", 2);
      \u0275\u0275elementStart(1, "div", 3)(2, "h4", 4);
      \u0275\u0275element(3, "i", 5);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(5, BodegahaciendaComponent_div_5_Template, 2, 0, "div", 6)(6, BodegahaciendaComponent_ng_template_6_Template, 6, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementStart(8, "div", 7)(9, "div", 8);
      \u0275\u0275template(10, BodegahaciendaComponent_div_10_Template, 20, 1, "div", 9);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 10)(12, "div", 11)(13, "div", 12)(14, "div", 13)(15, "h5", 14);
      \u0275\u0275text(16);
      \u0275\u0275elementEnd();
      \u0275\u0275element(17, "button", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275template(18, BodegahaciendaComponent_div_18_Template, 30, 3, "div", 16);
      \u0275\u0275elementStart(19, "div", 17)(20, "button", 18);
      \u0275\u0275listener("click", function BodegahaciendaComponent_Template_button_click_20_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cerrarModal());
      });
      \u0275\u0275text(21, " Cerrar ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "button", 19);
      \u0275\u0275listener("click", function BodegahaciendaComponent_Template_button_click_22_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.confirmarDespacho());
      });
      \u0275\u0275text(23, " Confirmar despacho ");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      const gerencia_r10 = \u0275\u0275reference(7);
      \u0275\u0275property("loading", ctx.loading);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" Solicitudes Pendientes | ", ctx.namehacienda, " ");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.permisoService.tieneGrupo("bodega"))("ngIfElse", gerencia_r10);
      \u0275\u0275advance(5);
      \u0275\u0275property("ngIf", ctx.solicitudes.length > 0);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1(" Detalle de Solicitud: N\xBA ", ctx.solicitudSeleccionada == null ? null : ctx.solicitudSeleccionada.Documento, " ");
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.solicitudSeleccionada);
    }
  }, dependencies: [
    NgForOf,
    DatePipe,
    NgIf,
    FormsModule,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    NumberValueAccessor,
    CheckboxControlValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    MinValidator,
    MaxValidator,
    NgModel,
    LoaderComponent
  ], styles: ["\n\ntable.dataTable[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background-color: #212529 !important;\n  color: #fff;\n  font-weight: 600;\n  font-size: 13px;\n  padding: 6px 8px !important;\n  white-space: nowrap;\n  vertical-align: middle;\n}\ntable.dataTable[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th.sorting[_ngcontent-%COMP%]:before, \ntable.dataTable[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th.sorting[_ngcontent-%COMP%]:after, \ntable.dataTable[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th.sorting_asc[_ngcontent-%COMP%]:before, \ntable.dataTable[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th.sorting_desc[_ngcontent-%COMP%]:before {\n  opacity: 0.4;\n}\ntable.dataTable[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 8px 8px;\n  vertical-align: middle;\n  font-size: 13px;\n}\n.col-documento[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 13px;\n  color: #212529;\n  white-space: nowrap;\n}\n.usuario-nombre[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 13px;\n}\n.usuario-area[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: #6c757d;\n}\n.badge-items[_ngcontent-%COMP%] {\n  background-color: #0dcaf0;\n  font-size: 11px;\n  font-weight: 500;\n  padding: 4px 8px;\n}\n.acciones[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  padding: 0;\n}\n.acciones[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 14px;\n}\n/*# sourceMappingURL=bodegahacienda.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BodegahaciendaComponent, { className: "BodegahaciendaComponent", filePath: "src\\app\\modulos\\bodegas\\bodegahacienda\\bodegahacienda.component.ts", lineNumber: 27 });
})();

// src/app/modulos/bodegas/homebodega/homebodega.component.ts
var HomebodegaComponent = class _HomebodegaComponent {
  static \u0275fac = function HomebodegaComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomebodegaComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomebodegaComponent, selectors: [["app-homebodega"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 3, vars: 0, consts: [[1, "container-fluid", "mt-0"], [1, "container-fluid"]], template: function HomebodegaComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275element(2, "router-outlet");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [RouterOutlet] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomebodegaComponent, { className: "HomebodegaComponent", filePath: "src\\app\\modulos\\bodegas\\homebodega\\homebodega.component.ts", lineNumber: 13 });
})();

// src/app/modulos/bodegas/itemsdespachados/itemsdespachados.component.ts
function ItemsdespachadosComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 10)(2, "label", 11);
    \u0275\u0275text(3, "Hacienda");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 12)(5, "option");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 10)(8, "label", 11);
    \u0275\u0275text(9, "\xDAltima fecha despacho");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "input", 13);
    \u0275\u0275twoWayListener("ngModelChange", function ItemsdespachadosComponent_div_5_Template_input_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.fechaSeleccionada, $event) || (ctx_r1.fechaSeleccionada = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ItemsdespachadosComponent_div_5_Template_input_change_10_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFechaChange());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r1.namehacienda, " ");
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.fechaSeleccionada);
    \u0275\u0275property("max", ctx_r1.hoy);
  }
}
function ItemsdespachadosComponent_ng_template_6_option_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const h_r4 = ctx.$implicit;
    \u0275\u0275property("value", h_r4.idhacienda);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", h_r4.name, " ");
  }
}
function ItemsdespachadosComponent_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 10)(2, "label", 11);
    \u0275\u0275text(3, "Hacienda");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 15);
    \u0275\u0275twoWayListener("ngModelChange", function ItemsdespachadosComponent_ng_template_6_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.idhaciendaSeleccionada, $event) || (ctx_r1.idhaciendaSeleccionada = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ItemsdespachadosComponent_ng_template_6_Template_select_change_4_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onHaciendaChange());
    });
    \u0275\u0275elementStart(5, "option", 16);
    \u0275\u0275text(6, "Seleccione hacienda");
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, ItemsdespachadosComponent_ng_template_6_option_7_Template, 2, 2, "option", 17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 10)(9, "label", 11);
    \u0275\u0275text(10, "\xDAltima fecha despacho");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 13);
    \u0275\u0275twoWayListener("ngModelChange", function ItemsdespachadosComponent_ng_template_6_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.fechaSeleccionada, $event) || (ctx_r1.fechaSeleccionada = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ItemsdespachadosComponent_ng_template_6_Template_input_change_11_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFechaChange());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.idhaciendaSeleccionada);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.haciendas);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.fechaSeleccionada);
    \u0275\u0275property("max", ctx_r1.hoy);
  }
}
var ItemsdespachadosComponent = class _ItemsdespachadosComponent {
  permisoService;
  serviceBodega;
  userService;
  loading = false;
  fechaSeleccionada = "";
  idhaciendaSeleccionada;
  namehacienda = null;
  haciendas = [];
  haciendaCatalogo = [
    { id: 1, name: "AGRICOLA E INDUSTRIAL PRIMOBANANO S.A." },
    { id: 3, name: "SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A." }
  ];
  dataTable = null;
  hoy = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  // ?? límite máximo
  constructor(permisoService, serviceBodega, userService) {
    this.permisoService = permisoService;
    this.serviceBodega = serviceBodega;
    this.userService = userService;
  }
  ngOnInit() {
    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();
    this.namehacienda = this.userService.getNomEmpresa();
    this.cargarHaciendas();
  }
  cargarHaciendas() {
    this.loading = true;
    this.serviceBodega.getUltimaFechaDespachoPorHacienda().subscribe({
      next: (res) => {
        this.haciendas = res.map((h) => {
          const haciendaInfo = this.haciendaCatalogo.find((x) => x.id === h.idhacienda);
          return __spreadProps(__spreadValues({}, h), {
            name: haciendaInfo?.name ?? "Hacienda desconocida"
          });
        });
        const esMayordomo = this.permisoService.tieneGrupo("bodega");
        if (esMayordomo) {
          if (this.idhaciendaSeleccionada == 8) {
            this.idhaciendaSeleccionada = 3;
          }
          const haciendaUsuario = this.haciendas.find((h) => h.idhacienda === this.idhaciendaSeleccionada);
          if (haciendaUsuario) {
            this.idhaciendaSeleccionada = haciendaUsuario.idhacienda;
            this.fechaSeleccionada = haciendaUsuario.fecha;
            this.cargarDespachados();
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  cargarDespachados() {
    if (!this.fechaSeleccionada || !this.idhaciendaSeleccionada)
      return;
    this.loading = true;
    const payload = {
      fechai: this.fechaSeleccionada,
      idhacienda: this.idhaciendaSeleccionada
    };
    this.serviceBodega.despachado(payload).subscribe({
      next: (data) => {
        if (this.dataTable) {
          this.dataTable.clear().destroy();
          this.dataTable = null;
        }
        this.dataTable = $("#tablaDespachos").DataTable({
          data: data ?? [],
          columns: [
            { data: "Documento" },
            {
              data: "FechaEmision",
              render: (data2) => data2 ? new Date(data2).toLocaleDateString("es-ES") : ""
            },
            { data: "producto" },
            { data: "usuario" },
            { data: "Solicitante" },
            { data: "TotalDespachado" },
            {
              data: "fecha_despacho",
              render: (data2) => data2 ? new Date(data2).toLocaleDateString("es-ES") : ""
            }
          ],
          destroy: true,
          ordering: true,
          language: {
            emptyTable: "No hay datos para la fecha seleccionada"
          }
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  onHaciendaChange() {
    const hacienda = this.haciendas.find((h) => h.idhacienda == this.idhaciendaSeleccionada);
    if (!hacienda?.fecha)
      return;
    this.fechaSeleccionada = hacienda.fecha;
    this.cargarDespachados();
  }
  onFechaChange() {
    this.cargarDespachados();
  }
  static \u0275fac = function ItemsdespachadosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ItemsdespachadosComponent)(\u0275\u0275directiveInject(AuthserviceService), \u0275\u0275directiveInject(BodegahaciendaService), \u0275\u0275directiveInject(UserService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ItemsdespachadosComponent, selectors: [["app-itemsdespachados"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 27, vars: 3, consts: [["gerencia", ""], [3, "loading"], [1, "d-flex", "justify-content-between", "align-items-center", "mb-3"], [1, "fw-bold"], [1, "bi", "bi-box-seam", "me-2"], ["class", "row mb-3", 4, "ngIf", "ngIfElse"], [1, "col-auto", "mt-2"], ["id", "tablaDespachos", 1, "table", "table-striped"], [1, "table-dark"], [1, "row", "mb-3"], [1, "col-md-4"], [1, "form-label"], [1, "form-select"], ["type", "date", 1, "form-control", 3, "ngModelChange", "change", "ngModel", "max"], [1, "row", "g-3"], [1, "form-select", 3, "ngModelChange", "change", "ngModel"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"]], template: function ItemsdespachadosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-loader", 1);
      \u0275\u0275elementStart(1, "div", 2)(2, "h4", 3);
      \u0275\u0275element(3, "i", 4);
      \u0275\u0275text(4, " Material Despachado ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(5, ItemsdespachadosComponent_div_5_Template, 11, 3, "div", 5)(6, ItemsdespachadosComponent_ng_template_6_Template, 12, 4, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementStart(8, "div", 6)(9, "table", 7)(10, "thead", 8)(11, "tr")(12, "th");
      \u0275\u0275text(13, "Doc.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "th");
      \u0275\u0275text(15, "Fecha Emision");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "th");
      \u0275\u0275text(17, "Producto");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "th");
      \u0275\u0275text(19, "Solicitante:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "th");
      \u0275\u0275text(21, "Despachado a:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "th");
      \u0275\u0275text(23, "Cantidad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "th");
      \u0275\u0275text(25, "Fecha");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(26, "tbody");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      const gerencia_r5 = \u0275\u0275reference(7);
      \u0275\u0275property("loading", ctx.loading);
      \u0275\u0275advance(5);
      \u0275\u0275property("ngIf", ctx.permisoService.tieneGrupo("bodega"))("ngIfElse", gerencia_r5);
    }
  }, dependencies: [
    FormsModule,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    NgModel,
    LoaderComponent,
    NgForOf,
    NgIf
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ItemsdespachadosComponent, { className: "ItemsdespachadosComponent", filePath: "src\\app\\modulos\\bodegas\\itemsdespachados\\itemsdespachados.component.ts", lineNumber: 23 });
})();

// src/app/modulos/bodegas/bodegas.routes.ts
var BODEGAS_ROUTES = [
  {
    path: "",
    component: HomebodegaComponent,
    data: { breadcrumb: "Homebodega" },
    children: [
      {
        path: "bodegahacienda",
        component: BodegahaciendaComponent,
        data: { breadcrumb: "Bodega Hacienda" }
      },
      {
        path: "itemdespachado",
        component: ItemsdespachadosComponent,
        data: { breadcrumb: "Material Despachado" }
      }
    ]
  }
];
export {
  BODEGAS_ROUTES
};
//# sourceMappingURL=chunk-AZH54J6A.js.map
