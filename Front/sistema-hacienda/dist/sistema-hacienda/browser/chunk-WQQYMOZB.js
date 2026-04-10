import {
  AuthserviceService
} from "./chunk-3TA73A5V.js";
import {
  UserService
} from "./chunk-UHCEN6B7.js";
import "./chunk-LTPV2N3O.js";
import {
  LoaderComponent
} from "./chunk-JMZPKJEB.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-2RHLRMSC.js";
import {
  environment
} from "./chunk-K2LMSEX6.js";
import {
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
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-KOB7DKR4.js";
import "./chunk-WYLQU5MV.js";

// src/app/modulos/asistencia/general/general.component.ts
var GeneralComponent = class _GeneralComponent {
  static \u0275fac = function GeneralComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GeneralComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GeneralComponent, selectors: [["app-general"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 2, vars: 0, template: function GeneralComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p");
      \u0275\u0275text(1, "general works!");
      \u0275\u0275elementEnd();
    }
  } });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GeneralComponent, { className: "GeneralComponent", filePath: "src\\app\\modulos\\asistencia\\general\\general.component.ts", lineNumber: 10 });
})();

// src/app/services/asistencia.service.ts
var AsistenciaService = class _AsistenciaService {
  http;
  baseUrl = environment.apiUrl;
  constructor(http) {
    this.http = http;
  }
  obtenerEmpresas() {
    return this.http.get(this.baseUrl + "/vempresashacienda");
  }
  obtenerAsistenciaMM(idhacienda, fecha) {
    const params = { idhacienda, fecha };
    return this.http.post(this.baseUrl + "/asistenciaMM", params);
  }
  obtenerAsistenciaGeneral(idhacienda, fecha) {
    const params = { idhacienda, fecha };
    return this.http.post(this.baseUrl + "/asistenciaGeneral", params);
  }
  obtenerFaltasPermisos(idhacienda, fecha) {
    const params = { idhacienda, fecha };
    return this.http.post(this.baseUrl + "/viewfaltaspermisos", params);
  }
  obtenerDiasCorte(idhacienda, fecha) {
    const params = { idhacienda, fecha };
    return this.http.post(this.baseUrl + "/diascorte", params);
  }
  static \u0275fac = function AsistenciaService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AsistenciaService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AsistenciaService, factory: _AsistenciaService.\u0275fac, providedIn: "root" });
};

// src/app/modulos/asistencia/mandosmedios/mandosmedios.component.ts
var _c0 = ["tablaAsistencia"];
var _c1 = ["tablaFaltas"];
var _c2 = ["tablaPermisos"];
var _c3 = ["tablaVacaciones"];
var _c4 = ["tablaSinMarcacion"];
var _c5 = ["tablaFaltasCantidad"];
var _c6 = ["tablaPermisoCantidad"];
function MandosmediosComponent_div_9_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 55)(1, "button", 56);
    \u0275\u0275listener("click", function MandosmediosComponent_div_9_div_10_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.abrirModalTabla1());
    });
    \u0275\u0275element(2, "i", 57);
    \u0275\u0275text(3, " Faltas ");
    \u0275\u0275elementStart(4, "span", 58);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 59);
    \u0275\u0275listener("click", function MandosmediosComponent_div_9_div_10_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.abrirModalTabla2());
    });
    \u0275\u0275element(7, "i", 60);
    \u0275\u0275text(8, " Permisos ");
    \u0275\u0275elementStart(9, "span", 58);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.botonesHabilitados);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.totales.faltas, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.totales2.permisos, " ");
  }
}
function MandosmediosComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 48)(2, "div", 49)(3, "label", 50);
    \u0275\u0275text(4, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 51);
    \u0275\u0275twoWayListener("ngModelChange", function MandosmediosComponent_div_9_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.asistencia.fecha, $event) || (ctx_r1.asistencia.fecha = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function MandosmediosComponent_div_9_Template_input_change_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargarAsistencia());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 49)(7, "label", 52);
    \u0275\u0275text(8, "Hacienda");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "input", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, MandosmediosComponent_div_9_div_10_Template, 11, 3, "div", 54);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.asistencia.fecha);
    \u0275\u0275property("max", ctx_r1.maxFecha);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r1.namehacienda);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.botonesHabilitados);
  }
}
function MandosmediosComponent_ng_template_10_div_0_option_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 67);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const h_r5 = ctx.$implicit;
    \u0275\u0275property("value", h_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(h_r5.nombre);
  }
}
function MandosmediosComponent_ng_template_10_div_0_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 55)(1, "button", 56);
    \u0275\u0275listener("click", function MandosmediosComponent_ng_template_10_div_0_div_10_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.abrirModalTabla1());
    });
    \u0275\u0275element(2, "i", 57);
    \u0275\u0275text(3, " Faltas ");
    \u0275\u0275elementStart(4, "span", 58);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 59);
    \u0275\u0275listener("click", function MandosmediosComponent_ng_template_10_div_0_div_10_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.abrirModalTabla2());
    });
    \u0275\u0275element(7, "i", 60);
    \u0275\u0275text(8, " Permisos ");
    \u0275\u0275elementStart(9, "span", 58);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.botonesHabilitados);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.totales.faltas, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.totales2.permisos, " ");
  }
}
function MandosmediosComponent_ng_template_10_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48)(1, "div", 49)(2, "label", 62);
    \u0275\u0275text(3, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 63);
    \u0275\u0275twoWayListener("ngModelChange", function MandosmediosComponent_ng_template_10_div_0_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.asistencia.fecha, $event) || (ctx_r1.asistencia.fecha = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function MandosmediosComponent_ng_template_10_div_0_Template_input_change_4_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cargarAsistencia());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 49)(6, "label", 64);
    \u0275\u0275text(7, "Escoja Hacienda");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "select", 65);
    \u0275\u0275twoWayListener("ngModelChange", function MandosmediosComponent_ng_template_10_div_0_Template_select_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.asistencia.idhacienda, $event) || (ctx_r1.asistencia.idhacienda = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function MandosmediosComponent_ng_template_10_div_0_Template_select_change_8_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cargarAsistencia());
    });
    \u0275\u0275template(9, MandosmediosComponent_ng_template_10_div_0_option_9_Template, 2, 2, "option", 66);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, MandosmediosComponent_ng_template_10_div_0_div_10_Template, 11, 3, "div", 54);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.asistencia.fecha);
    \u0275\u0275property("max", ctx_r1.maxFecha);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.asistencia.idhacienda);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.empresas);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.botonesHabilitados);
  }
}
function MandosmediosComponent_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, MandosmediosComponent_ng_template_10_div_0_Template, 11, 5, "div", 61);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    const administrador_r7 = \u0275\u0275reference(13);
    \u0275\u0275property("ngIf", ctx_r1.permisoService.tieneGrupo("gerencia") || ctx_r1.permisoService.tieneGrupo("administradores"))("ngIfElse", administrador_r7);
  }
}
function MandosmediosComponent_ng_template_12_option_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 67);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const h_r9 = ctx.$implicit;
    \u0275\u0275property("value", h_r9.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(h_r9.name);
  }
}
function MandosmediosComponent_ng_template_12_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 55)(1, "button", 56);
    \u0275\u0275listener("click", function MandosmediosComponent_ng_template_12_div_10_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.abrirModalTabla1());
    });
    \u0275\u0275element(2, "i", 57);
    \u0275\u0275text(3, " Faltas ");
    \u0275\u0275elementStart(4, "span", 58);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 59);
    \u0275\u0275listener("click", function MandosmediosComponent_ng_template_12_div_10_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.abrirModalTabla2());
    });
    \u0275\u0275element(7, "i", 60);
    \u0275\u0275text(8, " Permisos ");
    \u0275\u0275elementStart(9, "span", 58);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.botonesHabilitados);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.totales.faltas, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.totales2.permisos, " ");
  }
}
function MandosmediosComponent_ng_template_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48)(1, "div", 49)(2, "label", 62);
    \u0275\u0275text(3, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 63);
    \u0275\u0275twoWayListener("ngModelChange", function MandosmediosComponent_ng_template_12_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.asistencia.fecha, $event) || (ctx_r1.asistencia.fecha = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function MandosmediosComponent_ng_template_12_Template_input_change_4_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargarAsistencia());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 49)(6, "label", 64);
    \u0275\u0275text(7, "Escoja Hacienda");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "select", 65);
    \u0275\u0275twoWayListener("ngModelChange", function MandosmediosComponent_ng_template_12_Template_select_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.asistencia.idhacienda, $event) || (ctx_r1.asistencia.idhacienda = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function MandosmediosComponent_ng_template_12_Template_select_change_8_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargarAsistencia());
    });
    \u0275\u0275template(9, MandosmediosComponent_ng_template_12_option_9_Template, 2, 2, "option", 66);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, MandosmediosComponent_ng_template_12_div_10_Template, 11, 3, "div", 54);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.asistencia.fecha);
    \u0275\u0275property("max", ctx_r1.maxFecha);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.asistencia.idhacienda);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.hacienda);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.botonesHabilitados);
  }
}
function MandosmediosComponent_div_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275element(1, "span", 68);
    \u0275\u0275elementStart(2, "small")(3, "b");
    \u0275\u0275text(4, "D\xEDa de Proceso");
    \u0275\u0275elementEnd()()();
  }
}
function MandosmediosComponent_ng_template_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275element(1, "span", 69);
    \u0275\u0275elementStart(2, "small")(3, "b");
    \u0275\u0275text(4, "No hay Proceso");
    \u0275\u0275elementEnd()()();
  }
}
var MandosmediosComponent = class _MandosmediosComponent {
  service;
  permisoService;
  userService;
  loading = false;
  agrupados = [];
  agrupados2 = [];
  totales = { faltas: 0, permisos: 0 };
  totales2 = { faltas: 0, permisos: 0 };
  asistencia = {
    fecha: "",
    idhacienda: ""
  };
  idhaciendaSeleccionada = null;
  // Guarda el valor seleccionado del select
  namehacienda = null;
  botonesHabilitados = false;
  columnsFaltasCantidad = [
    { data: "trabajador", title: "Empleado", className: "text-center fw-semibold" },
    { data: "faltas", title: "Cantidad", className: "text-center fw-semibold" },
    {
      data: "listaFaltas",
      title: "Observacion",
      className: "text-center fw-semibold",
      render: function(data, type, row) {
        if (!data || data.length === 0)
          return "-";
        return data.map((item) => `<div><b>${item.fecha}</b>: ${item.observacion}</div>`).join("");
      }
    }
  ];
  columnsPermisosCantidad = [
    { data: "trabajador", title: "Empleado", className: "text-center fw-semibold" },
    { data: "justificados", title: "Cantidad", className: "text-center fw-semibold" },
    {
      data: "listaJustificaciones",
      title: "Observacion",
      className: "text-center fw-semibold",
      render: function(data, type, row) {
        if (!data || data.length === 0)
          return "-";
        return data.map((item) => `<div><b>${item.fecha}</b>: ${item.observacion}</div>`).join("");
      }
    }
  ];
  mes = "";
  // propiedad para el template
  estadoCorte = null;
  // guardaremos solo el campo que necesitamos
  hacienda = [
    { id: "1", name: "AGRICOLA E INDUSTRIAL PRIMOBANANO S.A." },
    { id: "8", name: "SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A." }
  ];
  empresas = [];
  maxFecha = "";
  // Datos filtrados
  asistencias = [];
  faltas = [];
  permisos = [];
  vacaciones = [];
  sinMarcacion = [];
  // Referencias DataTables
  tablaAsistencia;
  tablaFaltas;
  tablaPermisos;
  tablaVacaciones;
  tablaSinMarcacion;
  tablaFaltaCantidad;
  tablaPermisoCantidad;
  constructor(service, permisoService, userService) {
    this.service = service;
    this.permisoService = permisoService;
    this.userService = userService;
  }
  ngOnInit() {
    const hoy = /* @__PURE__ */ new Date();
    const hoyISO = hoy.toISOString().split("T")[0];
    this.asistencia.fecha = hoyISO;
    this.maxFecha = hoyISO;
    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();
    this.namehacienda = this.userService.getNomEmpresa();
    const esGerencia = this.permisoService.tieneGrupo("gerencia");
    const esAdmin = this.permisoService.tieneGrupo("administradores");
    if (esGerencia || esAdmin) {
      this.cargarEmpresas();
    }
    this.cargarAsistencia();
  }
  cargarEmpresas() {
    this.service.obtenerEmpresas().subscribe({
      next: (res) => {
        this.empresas = res;
      },
      error: (err) => console.error("Error cargando empresas", err)
    });
  }
  createdRow = (row, data) => {
    if (data.asis === "N") {
      $("td", row).css({ "background-color": "#ff0000", "color": "#ffffff" });
    } else if (data.asis === "V") {
      $("td", row).css({ "background-color": "#bf00ff", "color": "#ffffff" });
    } else if (data.asis === "J") {
      $("td", row).css({ "background-color": "green", "color": "#ffffff" });
    }
    const esLotero = parseInt(data.es_lotero);
    const soloCorte = parseInt(data.SOLO_CORTE);
    if (esLotero === 1) {
      $(row).find("td:eq(0)").css({ "background": "blue", "color": "white" });
    } else if (soloCorte === 1) {
      $(row).find("td:eq(0)").css({ "background": "yellow", "color": "black" });
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
    const esMayordomo = this.permisoService.tieneGrupo("mayordomo");
    const esGerencia = this.permisoService.tieneGrupo("gerencia");
    const esAdmin = this.permisoService.tieneGrupo("administradores");
    let idhacienda;
    if (esMayordomo) {
      idhacienda = this.idhaciendaSeleccionada;
    } else {
      idhacienda = this.asistencia.idhacienda;
    }
    if (!idhacienda || !fecha) {
      this.loading = false;
      return;
    }
    const fechaDate = new Date(fecha);
    this.mes = fechaDate.toLocaleString("es-ES", { month: "long" });
    const esGerenciaOAdmin = esGerencia || esAdmin;
    const consulta = esGerenciaOAdmin ? this.service.obtenerAsistenciaGeneral(idhacienda, fecha) : this.service.obtenerAsistenciaMM(idhacienda, fecha);
    consulta.subscribe({
      next: (res) => {
        this.asistencias = res.filter((x) => x.asis === "A");
        this.faltas = res.filter((x) => x.asis === "F");
        this.permisos = res.filter((x) => x.asis === "J");
        this.vacaciones = res.filter((x) => x.asis === "V");
        this.sinMarcacion = res.filter((x) => x.asis === "N");
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
    this.service.obtenerFaltasPermisos(idhacienda, fecha).subscribe((re) => {
      const faltas = re.filter((e) => e.asis === "F");
      const permisos = re.filter((e) => e.asis === "J");
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
    this.service.obtenerDiasCorte(idhacienda, fecha).subscribe((re) => {
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
    { title: "Fecha", data: "FECHA", render: function(data) {
      if (data) {
        const [year, month, day] = data.split("-");
        return `${day}/${month}/${year}`;
      }
      return "";
    } },
    {
      title: "Entrada",
      data: "HoraE",
      render: (d) => d ? `<span class="badge bg-success">${d}</span>` : ""
    },
    {
      title: "Salida",
      data: "HoraS",
      render: (d, type, row) => {
        if (row.HoraE === row.HoraS)
          return "";
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
  initDataTable(ref, data, columns) {
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
          targets: "_all",
          createdCell: (cell, cellData, rowData, rowIndex, colIndex) => {
            if (colIndex !== 0) {
              $(cell).css("text-align", "center");
            }
          }
        }
      ]
    });
  }
  getAgrupadosPorTrabajador(data) {
    const agrupado = data.reduce((acc, item) => {
      const key = item.NOMBRE_CORTO.trim();
      if (!acc[key]) {
        acc[key] = {
          trabajador: item.NOMBRE_CORTO.trim(),
          empresa: item.EMPRESA?.trim() || "",
          cantidad: 0,
          faltas: 0,
          justificados: 0,
          listaFaltas: [],
          listaJustificaciones: []
        };
      }
      acc[key].cantidad++;
      if (item.asis === "F") {
        acc[key].faltas++;
        acc[key].listaFaltas.push({
          fecha: item.FechaI,
          observacion: item.OBSERVACION.trim().toUpperCase()
        });
      } else if (item.asis === "J") {
        acc[key].justificados++;
        acc[key].listaJustificaciones.push({
          fecha: item.FechaI,
          observacion: item.OBSERVACION.trim().toUpperCase()
        });
      }
      return acc;
    }, {});
    return Object.values(agrupado);
  }
  getTotales(agrupados) {
    const total = {
      faltas: 0,
      permisos: 0
    };
    agrupados.forEach((t) => {
      total.faltas += t.faltas;
      total.permisos += t.justificados;
    });
    return total;
  }
  abrirModalTabla1() {
    const modal1 = new bootstrap.Modal(document.getElementById("modalTabla1"));
    modal1.show();
  }
  abrirModalTabla2() {
    const modal2 = new bootstrap.Modal(document.getElementById("modalTabla2"));
    modal2.show();
  }
  static \u0275fac = function MandosmediosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MandosmediosComponent)(\u0275\u0275directiveInject(AsistenciaService), \u0275\u0275directiveInject(AuthserviceService), \u0275\u0275directiveInject(UserService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MandosmediosComponent, selectors: [["app-mandosmedios"]], viewQuery: function MandosmediosComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
      \u0275\u0275viewQuery(_c1, 5);
      \u0275\u0275viewQuery(_c2, 5);
      \u0275\u0275viewQuery(_c3, 5);
      \u0275\u0275viewQuery(_c4, 5);
      \u0275\u0275viewQuery(_c5, 5);
      \u0275\u0275viewQuery(_c6, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.tablaAsistencia = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.tablaFaltas = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.tablaPermisos = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.tablaVacaciones = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.tablaSinMarcacion = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.tablaFaltaCantidad = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.tablaPermisoCantidad = _t.first);
    }
  }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 158, vars: 14, consts: [["gerencia", ""], ["administrador", ""], ["nocorte", ""], ["tablaAsistencia", ""], ["tablaSinMarcacion", ""], ["tablaFaltas", ""], ["tablaPermisos", ""], ["tablaVacaciones", ""], ["tablaFaltasCantidad", ""], ["tablaPermisoCantidad", ""], [3, "loading"], [1, "container-fluid", "mt-4"], [1, "container-fluid"], [1, "row", "mb-3"], [1, "col-md-12"], [1, "card", "shadow-sm", "border-info"], [1, "card-body"], [1, "card-title"], [4, "ngIf", "ngIfElse"], ["id", "leyenda-colores", 1, "legend-container"], [1, "d-flex", "flex-wrap", "gap-4"], [1, "d-flex", "align-items-center", "gap-2"], [1, "legend-box", 2, "background", "blue"], [1, "legend-box", 2, "background", "yellow", "border", "1px solid #ccc"], [1, "legend-box", 2, "background", "#ff0000"], [1, "legend-box", 2, "background", "#bf00ff"], [1, "legend-box", 2, "background", "green"], ["class", "d-flex align-items-center gap-2", 4, "ngIf", "ngIfElse"], [1, "table-container", "mb-4"], [1, "table-title", "mb-2"], [1, "table", "table-bordered", "table-striped", "table-hover", "w-100"], [1, "table-titlesinmarcar", "mb-2"], [1, "table", "table-bordered", "table-striped", "table-hover", "w-100", "table-warning"], [1, "table-titlefalta", "mb-2"], [1, "table-titlepermiso", "mb-2"], [1, "table-titlevacaciones", "mb-2"], ["id", "modalTabla1", "tabindex", "-1", 1, "modal", "fade"], [1, "modal-dialog", "modal-lg"], [1, "modal-content"], [1, "modal-header"], [1, "modal-title", "text-uppercase", "text-danger"], ["type", "button", "data-bs-dismiss", "modal", 1, "btn-close"], [1, "modal-body"], [1, "table-responsive"], ["id", "tablaFaltasCantidad", 1, "table", "table-bordered", "display", 2, "width", "100%"], ["id", "modalTabla2", "tabindex", "-1", 1, "modal", "fade"], [1, "modal-title", "text-uppercase", "text-warning"], ["id", "tablaPermisoCantidad", 1, "table", "table-bordered", "display", 2, "width", "100%"], [1, "row", "align-items-end"], [1, "col-md-4"], ["for", "fecha", 1, "form-label"], ["id", "fecha", "type", "date", 1, "form-control", 3, "ngModelChange", "change", "ngModel", "max"], ["for", "hacienda", 1, "form-label"], ["id", "hacienda", "readonly", "", 1, "form-control", 3, "value"], ["class", "col-md-4 d-flex gap-2 mt-3 mt-md-0", 4, "ngIf"], [1, "col-md-4", "d-flex", "gap-2", "mt-3", "mt-md-0"], [1, "btn", "btn-danger", "position-relative", "w-100", 3, "click", "disabled"], [1, "bi", "bi-x-circle"], [1, "position-absolute", "top-0", "start-100", "translate-middle", "badge", "rounded-pill", "bg-dark"], [1, "btn", "btn-warning", "position-relative", "w-100", 3, "click"], [1, "bi", "bi-exclamation-triangle"], ["class", "row align-items-end", 4, "ngIf", "ngIfElse"], ["for", "fecha-administrador"], ["id", "fecha-administrador", "type", "date", 1, "form-control", 3, "ngModelChange", "change", "ngModel", "max"], ["for", "hacienda-administrador"], ["id", "hacienda-administrador", 1, "form-select", 3, "ngModelChange", "change", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], [1, "legend-box", 2, "background", "limegreen"], [1, "legend-box", 2, "background", "darkred"]], template: function MandosmediosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-loader", 10);
      \u0275\u0275elementStart(1, "div", 11)(2, "div", 12)(3, "div", 13)(4, "div", 14)(5, "div", 15)(6, "div", 16)(7, "h5", 17);
      \u0275\u0275text(8, "Configuraci\xF3n de Asistencia");
      \u0275\u0275elementEnd();
      \u0275\u0275template(9, MandosmediosComponent_div_9_Template, 11, 4, "div", 18);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(10, MandosmediosComponent_ng_template_10_Template, 1, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(12, MandosmediosComponent_ng_template_12_Template, 11, 5, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementStart(14, "div", 19)(15, "div", 20)(16, "div", 21);
      \u0275\u0275element(17, "span", 22);
      \u0275\u0275elementStart(18, "small");
      \u0275\u0275text(19, "Lotero");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 21);
      \u0275\u0275element(21, "span", 23);
      \u0275\u0275elementStart(22, "small");
      \u0275\u0275text(23, "Solo Corte");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "div", 21);
      \u0275\u0275element(25, "span", 24);
      \u0275\u0275elementStart(26, "small");
      \u0275\u0275text(27, "Sin marcaci\xF3n");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "div", 21);
      \u0275\u0275element(29, "span", 25);
      \u0275\u0275elementStart(30, "small");
      \u0275\u0275text(31, "Vacaciones");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "div", 21);
      \u0275\u0275element(33, "span", 26);
      \u0275\u0275elementStart(34, "small");
      \u0275\u0275text(35, "Permiso / Justificado");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(36, MandosmediosComponent_div_36_Template, 5, 0, "div", 27)(37, MandosmediosComponent_ng_template_37_Template, 5, 0, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(39, "hr");
      \u0275\u0275elementStart(40, "div", 28)(41, "h4", 29);
      \u0275\u0275text(42);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "table", 30, 3)(45, "thead")(46, "tr")(47, "th");
      \u0275\u0275text(48, "Empleado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "th");
      \u0275\u0275text(50, "Cod");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "th");
      \u0275\u0275text(52, "Cargo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "th");
      \u0275\u0275text(54, "Fecha");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "th");
      \u0275\u0275text(56, "Entrada");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "th");
      \u0275\u0275text(58, "Salida");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(59, "tbody");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(60, "hr");
      \u0275\u0275elementStart(61, "div", 28)(62, "h4", 31);
      \u0275\u0275text(63);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "table", 32, 4)(66, "thead")(67, "tr")(68, "th");
      \u0275\u0275text(69, "Empleado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(70, "th");
      \u0275\u0275text(71, "Cod");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(72, "th");
      \u0275\u0275text(73, "Cargo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(74, "th");
      \u0275\u0275text(75, "Fecha");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(76, "tbody");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(77, "hr");
      \u0275\u0275elementStart(78, "div", 28)(79, "h4", 33);
      \u0275\u0275text(80);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(81, "table", 32, 5)(83, "thead")(84, "tr")(85, "th");
      \u0275\u0275text(86, "Empleado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(87, "th");
      \u0275\u0275text(88, "Cod");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(89, "th");
      \u0275\u0275text(90, "Cargo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(91, "th");
      \u0275\u0275text(92, "Fecha");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(93, "th");
      \u0275\u0275text(94, "Motivo");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(95, "tbody");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(96, "hr");
      \u0275\u0275elementStart(97, "div", 28)(98, "h4", 34);
      \u0275\u0275text(99);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(100, "table", 32, 6)(102, "thead")(103, "tr")(104, "th");
      \u0275\u0275text(105, "Empleado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(106, "th");
      \u0275\u0275text(107, "Cod");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(108, "th");
      \u0275\u0275text(109, "Cargo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(110, "th");
      \u0275\u0275text(111, "Inicio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(112, "th");
      \u0275\u0275text(113, "Fin");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(114, "th");
      \u0275\u0275text(115, "Detalle");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(116, "tbody");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(117, "hr");
      \u0275\u0275elementStart(118, "div", 28)(119, "h4", 35);
      \u0275\u0275text(120);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(121, "table", 32, 7)(123, "thead")(124, "tr")(125, "th");
      \u0275\u0275text(126, "Empleado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(127, "th");
      \u0275\u0275text(128, "Cod");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(129, "th");
      \u0275\u0275text(130, "Cargo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(131, "th");
      \u0275\u0275text(132, "Desde");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(133, "th");
      \u0275\u0275text(134, "Hasta");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(135, "tbody");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(136, "div", 36)(137, "div", 37)(138, "div", 38)(139, "div", 39)(140, "h5", 40);
      \u0275\u0275text(141);
      \u0275\u0275elementEnd();
      \u0275\u0275element(142, "button", 41);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(143, "div", 42)(144, "div", 43);
      \u0275\u0275element(145, "table", 44, 8);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(147, "div", 45)(148, "div", 37)(149, "div", 38)(150, "div", 39)(151, "h5", 46);
      \u0275\u0275text(152);
      \u0275\u0275elementEnd();
      \u0275\u0275element(153, "button", 41);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(154, "div", 42)(155, "div", 43);
      \u0275\u0275element(156, "table", 47, 9);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      const gerencia_r11 = \u0275\u0275reference(11);
      const nocorte_r12 = \u0275\u0275reference(38);
      \u0275\u0275property("loading", ctx.loading);
      \u0275\u0275advance(9);
      \u0275\u0275property("ngIf", ctx.permisoService.tieneGrupo("mayordomo"))("ngIfElse", gerencia_r11);
      \u0275\u0275advance(27);
      \u0275\u0275property("ngIf", ctx.estadoCorte === "A")("ngIfElse", nocorte_r12);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1("Asistencia (", ctx.asistencias.length, ")");
      \u0275\u0275advance(21);
      \u0275\u0275textInterpolate1("Sin marcaci\xF3n (", ctx.sinMarcacion.length, ")");
      \u0275\u0275advance(17);
      \u0275\u0275textInterpolate1("Faltas (", ctx.faltas.length, ")");
      \u0275\u0275advance(19);
      \u0275\u0275textInterpolate1("Permisos / Justificados (", ctx.permisos.length, ")");
      \u0275\u0275advance(21);
      \u0275\u0275textInterpolate1("Vacaciones (", ctx.vacaciones.length, ")");
      \u0275\u0275advance(21);
      \u0275\u0275textInterpolate2("Cantidad de faltas en el mes de ", ctx.mes, ": ", ctx.totales.faltas, "");
      \u0275\u0275advance(11);
      \u0275\u0275textInterpolate2("Cantidad de permisos en el mes de ", ctx.mes, ": ", ctx.totales2.permisos, "");
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
  ], styles: ["\n\n.legend-container[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 1050;\n  background: white;\n  padding: 10px 20px;\n  border-bottom: 1px solid #ddd;\n  display: flex;\n  gap: 15px;\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.legend-container[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.legend-box[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  border-radius: 4px;\n  display: inline-block;\n  border: 1px solid #ccc;\n}\n.table-title[_ngcontent-%COMP%] {\n  background-color: #0d6efd;\n  color: white;\n  padding: 10px 15px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  display: inline-block;\n  font-weight: 600;\n  font-size: 1.1rem;\n  margin-bottom: 10px;\n}\n.table-titlesinmarcar[_ngcontent-%COMP%] {\n  background-color: #fa1f06;\n  color: white;\n  padding: 10px 15px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  display: inline-block;\n  font-weight: 600;\n  font-size: 1.1rem;\n  margin-bottom: 10px;\n}\n.table-titlefalta[_ngcontent-%COMP%] {\n  background-color: #fa7406;\n  color: white;\n  padding: 10px 15px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  display: inline-block;\n  font-weight: 600;\n  font-size: 1.1rem;\n  margin-bottom: 10px;\n}\n.table-titlevacaciones[_ngcontent-%COMP%] {\n  background-color: #bf00ff;\n  color: white;\n  padding: 10px 15px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  display: inline-block;\n  font-weight: 600;\n  font-size: 1.1rem;\n  margin-bottom: 10px;\n}\n.table-titlepermiso[_ngcontent-%COMP%] {\n  background-color: green;\n  color: white;\n  padding: 10px 15px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  display: inline-block;\n  font-weight: 600;\n  font-size: 1.1rem;\n  margin-bottom: 10px;\n}\n.table-title[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background-color: #26262b;\n  color: white;\n  font-weight: bold;\n  text-align: center;\n}\n.table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background-color: #f9f9f9;\n}\n.table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  border: 1px solid #ddd;\n}\n/*# sourceMappingURL=mandosmedios.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MandosmediosComponent, { className: "MandosmediosComponent", filePath: "src\\app\\modulos\\asistencia\\mandosmedios\\mandosmedios.component.ts", lineNumber: 23 });
})();

// src/app/modulos/asistencia/asistencia.routes.ts
var ASISTENCIA_ROUTES = [
  {
    path: "",
    component: GeneralComponent,
    data: { breadcrumb: "Asistencia General" }
  },
  {
    path: "asistenciamandosmedios",
    component: MandosmediosComponent,
    data: { breadcrumb: "Asistencia Haciendas" }
  }
];
export {
  ASISTENCIA_ROUTES
};
//# sourceMappingURL=chunk-WQQYMOZB.js.map
