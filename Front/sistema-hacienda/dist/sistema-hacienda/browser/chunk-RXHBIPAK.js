import {
  require_sweetalert2_all
} from "./chunk-FTOV3S6L.js";
import {
  UserService
} from "./chunk-UHCEN6B7.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-IMONGHQ7.js";
import "./chunk-JMZPKJEB.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  RequiredValidator,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-2RHLRMSC.js";
import "./chunk-K2LMSEX6.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  DatePipe,
  DecimalPipe,
  Directive,
  EventEmitter,
  Input,
  NgForOf,
  NgIf,
  NgModule,
  Output,
  Pipe,
  ViewEncapsulation$1,
  forkJoin,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-KOB7DKR4.js";
import {
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-WYLQU5MV.js";

// src/app/services/data-table.service.ts
var DataTableService = class _DataTableService {
  init(selector, options = {}) {
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
      }
      $(selector).DataTable(options);
    }, 100);
  }
  destroy(selector) {
    try {
      if ($.fn.DataTable.isDataTable(selector)) {
        const table = $(selector).DataTable();
        table.clear();
        table.destroy();
        console.log("\u{1F9F9} DataTable destruido correctamente:", selector);
      }
    } catch (e) {
      console.warn("\u26A0\uFE0F No se pudo destruir DataTable (posiblemente no inicializado a\xFAn):", selector);
    }
  }
  static \u0275fac = function DataTableService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DataTableService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DataTableService, factory: _DataTableService.\u0275fac, providedIn: "root" });
};

// src/app/shared/data-table/data-table.component.ts
var _c0 = ["*"];
var DataTableComponent = class _DataTableComponent {
  dtService;
  tableId = "datatable";
  options = {};
  refreshTrigger;
  // cambia su valor para refrescar tabla
  initialized = false;
  constructor(dtService) {
    this.dtService = dtService;
  }
  ngAfterViewInit() {
    setTimeout(() => this.initTable(), 0);
  }
  ngOnChanges(changes) {
    if (changes["refreshTrigger"] && !changes["refreshTrigger"].firstChange) {
      console.log("\u{1F501} Refrescando DataTable por trigger:", this.refreshTrigger);
      this.reinitTable();
    }
  }
  ngOnDestroy() {
    this.dtService.destroy(`#${this.tableId}`);
  }
  initTable() {
    if (!this.initialized) {
      setTimeout(() => {
        this.dtService.init(`#${this.tableId}`, this.options);
        this.initialized = true;
        console.log("\u2705 DataTable inicializado:", this.tableId);
      }, 200);
    }
  }
  reinitTable() {
    if (this.initialized) {
      this.dtService.destroy(`#${this.tableId}`);
      this.initialized = false;
      console.log("\u267B\uFE0F DataTable destruido para reinicializar");
    }
    setTimeout(() => this.initTable(), 400);
  }
  static \u0275fac = function DataTableComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DataTableComponent)(\u0275\u0275directiveInject(DataTableService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DataTableComponent, selectors: [["app-data-table"]], inputs: { tableId: "tableId", options: "options", refreshTrigger: "refreshTrigger" }, standalone: true, features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature], ngContentSelectors: _c0, decls: 1, vars: 0, template: function DataTableComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275projection(0);
    }
  } });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DataTableComponent, { className: "DataTableComponent", filePath: "src\\app\\shared\\data-table\\data-table.component.ts", lineNumber: 11 });
})();

// src/app/settings/datatables.config.ts
var DEFAULT_DATATABLE_OPTIONS = {
  paging: true,
  searching: true,
  responsive: true,
  language: {
    url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
  }
};

// src/app/modulos/usuarios/pages/listar/listar.component.ts
var import_sweetalert22 = __toESM(require_sweetalert2_all());

// src/app/modulos/usuarios/pages/create/create.component.ts
var import_sweetalert2 = __toESM(require_sweetalert2_all());
function CreateComponent_ul_5_li_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 19);
    \u0275\u0275listener("click", function CreateComponent_ul_5_li_1_Template_li_click_0_listener() {
      const user_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.seleccionarUsuario(user_r2));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", user_r2.NOMBRE_1, " ", user_r2.APELLIDO_1, " - ", user_r2.NUM_CEDULA, " ");
  }
}
function CreateComponent_ul_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 17);
    \u0275\u0275template(1, CreateComponent_ul_5_li_1_Template, 2, 3, "li", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.usuariosEncontrados);
  }
}
function CreateComponent_option_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const grupo_r4 = ctx.$implicit;
    \u0275\u0275property("value", grupo_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(grupo_r4.grupo);
  }
}
function CreateComponent_option_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rol_r5 = ctx.$implicit;
    \u0275\u0275property("value", rol_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(rol_r5.nombre);
  }
}
var CreateComponent = class _CreateComponent {
  userService;
  route;
  usuarioCreado = new EventEmitter();
  searchTerm = "";
  usuariosEncontrados = [];
  usuario = {};
  usernameGenerado = "";
  roles = [];
  grupos = [];
  constructor(userService, route) {
    this.userService = userService;
    this.route = route;
  }
  ngOnInit() {
    this.cargarRoles();
    this.cargarGrupos();
  }
  // 🔄 Cargar roles desde el backend
  cargarRoles() {
    this.userService.getRol().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error("Error al obtener roles:", err);
      }
    });
  }
  // 🔄 Cargar grupos desde el backend
  cargarGrupos() {
    this.userService.getGrupo().subscribe({
      next: (data) => {
        this.grupos = data;
      },
      error: (err) => {
        console.error("Error al obtener grupos:", err);
      }
    });
  }
  buscarUsuario() {
    if (!this.searchTerm.trim()) {
      import_sweetalert2.default.fire("Advertencia", "Ingrese un nombre o apellido", "info");
      return;
    }
    forkJoin({
      administrativos: this.userService.buscarUsuario(this.searchTerm),
      otros: this.userService.buscarOtrosEmpleados(this.searchTerm)
    }).subscribe({
      next: (resp) => {
        const listaA = resp.administrativos || [];
        const listaB = resp.otros || [];
        this.usuariosEncontrados = [...listaA, ...listaB];
        if (this.usuariosEncontrados.length === 0) {
          import_sweetalert2.default.fire("Advertencia", "No se encontraron empleados", "warning");
        }
      },
      error: () => {
        import_sweetalert2.default.fire("Error", "Error al buscar empleados", "error");
      }
    });
  }
  seleccionarUsuario(user) {
    this.usuario = this.limpiarCampos(user);
    this.usuariosEncontrados = [];
    this.generarNombreUsuario();
    this.generarPassword();
  }
  limpiarCampos(usuario) {
    const limpio = {};
    for (const key in usuario) {
      if (usuario.hasOwnProperty(key)) {
        const valor = usuario[key];
        limpio[key] = typeof valor === "string" ? valor.trim() : valor;
      }
    }
    return limpio;
  }
  // 👤 Generar nombre de usuario automáticamente
  generarNombreUsuario() {
    if (this.usuario.NOMBRE_1 && this.usuario.APELLIDO_1) {
      const inicial = this.usuario.NOMBRE_1.trim().charAt(0).toLowerCase();
      const apellido = this.usuario.APELLIDO_1.trim().toLowerCase().replace(/\s+/g, "");
      this.usernameGenerado = `${inicial}${apellido}`;
    }
  }
  // 🔐 Generar password a partir del número de cédula
  generarPassword() {
    if (this.usuario.NUM_CEDULA) {
      this.usuario.password = this.usuario.NUM_CEDULA.toString();
    }
  }
  // 📧 Validar formato de email
  validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  // 💾 Guardar usuario
  guardarUsuario() {
    this.usuario = this.limpiarCampos(this.usuario);
    if (!this.usuario.NOMBRE_1 || !this.usuario.APELLIDO_1) {
      import_sweetalert2.default.fire("Advertencia", "Debe llenar los campos de nombre y apellido", "warning");
      return;
    }
    if (!this.usuario.EMAIL || !this.validarEmail(this.usuario.EMAIL)) {
      import_sweetalert2.default.fire("Advertencia", "Debe ingresar un correo electr\xF3nico v\xE1lido", "warning");
      return;
    }
    if (!this.usuario.idRol) {
      import_sweetalert2.default.fire("Advertencia", "Debe seleccionar un Rol", "warning");
      return;
    }
    if (!this.usuario.idGrupo) {
      import_sweetalert2.default.fire("Advertencia", "Debe seleccionar un Grupo", "warning");
      return;
    }
    import_sweetalert2.default.fire({
      title: "Guardando usuario...",
      text: "Por favor espera",
      allowOutsideClick: false,
      didOpen: () => {
        import_sweetalert2.default.showLoading();
      }
    });
    this.generarPassword();
    const nuevoUsuario = {
      nombre: this.usuario.NOMBRE_1,
      apellido: this.usuario.APELLIDO_1,
      email: this.usuario.EMAIL,
      password: this.usuario.password,
      empresa: this.usuario.EMPRESA,
      username: this.usernameGenerado,
      // ⚙️ Campos ocultos pero importantes
      codEmpleado: this.usuario.COD_TRABAJ,
      idEmpresa: this.usuario.COD_EMPRESA,
      idRol: this.usuario.idRol,
      idGrupo: this.usuario.idGrupo
    };
    this.userService.guardarUsuario(nuevoUsuario).subscribe({
      next: () => {
        import_sweetalert2.default.close();
        import_sweetalert2.default.fire({
          icon: "success",
          title: "Usuario guardado correctamente",
          text: "\u2705 El usuario se ha registrado en el sistema.",
          timer: 2500,
          showConfirmButton: false
        });
        this.usuarioCreado.emit(this.usuario);
        this.resetFormulario();
      },
      error: (err) => {
        import_sweetalert2.default.close();
        import_sweetalert2.default.fire({
          icon: "error",
          title: "Error al guardar",
          text: "No se pudo guardar el usuario. Intente nuevamente.",
          confirmButtonText: "Cerrar"
        });
      }
    });
  }
  resetFormulario() {
    this.usuario = {};
    this.usernameGenerado = "";
    this.searchTerm = "";
    this.usuariosEncontrados = [];
  }
  static \u0275fac = function CreateComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CreateComponent)(\u0275\u0275directiveInject(UserService), \u0275\u0275directiveInject(ActivatedRoute));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CreateComponent, selectors: [["app-create"]], outputs: { usuarioCreado: "usuarioCreado" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 51, vars: 13, consts: [[1, "container-fluid"], [1, "card"], [1, "card-body"], [1, "row"], ["type", "text", "placeholder", "Buscar empleado", 1, "form-control", 3, "ngModelChange", "keyup.enter", "ngModel"], ["class", "list-group mt-2", 4, "ngIf"], [1, "col-sm-6"], ["type", "text", "readonly", "", 1, "form-control", 3, "ngModelChange", "input", "ngModel"], ["type", "text", 1, "form-control", 3, "ngModelChange", "input", "ngModel"], ["type", "text", "readonly", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["type", "email", "placeholder", "ejemplo@empresa.com", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "col-sm-6", "mt-3"], ["required", "", 1, "form-select", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [1, "col-12", "mt-4"], [1, "btn", "btn-info", 3, "click"], [1, "list-group", "mt-2"], ["class", "list-group-item list-group-item-action", 3, "click", 4, "ngFor", "ngForOf"], [1, "list-group-item", "list-group-item-action", 3, "click"], [3, "value"]], template: function CreateComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "input", 4);
      \u0275\u0275twoWayListener("ngModelChange", function CreateComponent_Template_input_ngModelChange_4_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchTerm, $event) || (ctx.searchTerm = $event);
        return $event;
      });
      \u0275\u0275listener("keyup.enter", function CreateComponent_Template_input_keyup_enter_4_listener() {
        return ctx.buscarUsuario();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275template(5, CreateComponent_ul_5_Template, 2, 1, "ul", 5);
      \u0275\u0275elementStart(6, "div", 6)(7, "label");
      \u0275\u0275text(8, "Nombre *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "input", 7);
      \u0275\u0275twoWayListener("ngModelChange", function CreateComponent_Template_input_ngModelChange_9_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuario.NOMBRE_1, $event) || (ctx.usuario.NOMBRE_1 = $event);
        return $event;
      });
      \u0275\u0275listener("input", function CreateComponent_Template_input_input_9_listener() {
        return ctx.generarNombreUsuario();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 6)(11, "label");
      \u0275\u0275text(12, "Apellido *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "input", 7);
      \u0275\u0275twoWayListener("ngModelChange", function CreateComponent_Template_input_ngModelChange_13_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuario.APELLIDO_1, $event) || (ctx.usuario.APELLIDO_1 = $event);
        return $event;
      });
      \u0275\u0275listener("input", function CreateComponent_Template_input_input_13_listener() {
        return ctx.generarNombreUsuario();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div", 6)(15, "label");
      \u0275\u0275text(16, "C\xE9dula");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "input", 8);
      \u0275\u0275twoWayListener("ngModelChange", function CreateComponent_Template_input_ngModelChange_17_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuario.NUM_CEDULA, $event) || (ctx.usuario.NUM_CEDULA = $event);
        return $event;
      });
      \u0275\u0275listener("input", function CreateComponent_Template_input_input_17_listener() {
        return ctx.generarPassword();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 6)(19, "label");
      \u0275\u0275text(20, "Empresa *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "input", 9);
      \u0275\u0275twoWayListener("ngModelChange", function CreateComponent_Template_input_ngModelChange_21_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuario.EMPRESA, $event) || (ctx.usuario.EMPRESA = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "div", 6)(23, "label");
      \u0275\u0275text(24, "Email *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "input", 10);
      \u0275\u0275twoWayListener("ngModelChange", function CreateComponent_Template_input_ngModelChange_25_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuario.EMAIL, $event) || (ctx.usuario.EMAIL = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div", 6)(27, "label");
      \u0275\u0275text(28, "Nombre de Usuario");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "input", 9);
      \u0275\u0275twoWayListener("ngModelChange", function CreateComponent_Template_input_ngModelChange_29_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usernameGenerado, $event) || (ctx.usernameGenerado = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(30, "div", 11)(31, "label");
      \u0275\u0275text(32, "Grupo *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "select", 12);
      \u0275\u0275twoWayListener("ngModelChange", function CreateComponent_Template_select_ngModelChange_33_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuario.idGrupo, $event) || (ctx.usuario.idGrupo = $event);
        return $event;
      });
      \u0275\u0275elementStart(34, "option", 13);
      \u0275\u0275text(35, "-- Seleccione un grupo --");
      \u0275\u0275elementEnd();
      \u0275\u0275template(36, CreateComponent_option_36_Template, 2, 2, "option", 14);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(37, "div", 11)(38, "label");
      \u0275\u0275text(39, "Rol *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "select", 12);
      \u0275\u0275twoWayListener("ngModelChange", function CreateComponent_Template_select_ngModelChange_40_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuario.idRol, $event) || (ctx.usuario.idRol = $event);
        return $event;
      });
      \u0275\u0275elementStart(41, "option", 13);
      \u0275\u0275text(42, "-- Seleccione un rol --");
      \u0275\u0275elementEnd();
      \u0275\u0275template(43, CreateComponent_option_43_Template, 2, 2, "option", 14);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "div", 11)(45, "label");
      \u0275\u0275text(46, "Password (generado autom\xE1ticamente)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "input", 9);
      \u0275\u0275twoWayListener("ngModelChange", function CreateComponent_Template_input_ngModelChange_47_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuario.password, $event) || (ctx.usuario.password = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(48, "div", 15)(49, "button", 16);
      \u0275\u0275listener("click", function CreateComponent_Template_button_click_49_listener() {
        return ctx.guardarUsuario();
      });
      \u0275\u0275text(50, "Guardar Usuario");
      \u0275\u0275elementEnd()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchTerm);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.usuariosEncontrados.length > 0);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuario.NOMBRE_1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuario.APELLIDO_1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuario.NUM_CEDULA);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuario.EMPRESA);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuario.EMAIL);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usernameGenerado);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuario.idGrupo);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.grupos);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuario.idRol);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.roles);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuario.password);
    }
  }, dependencies: [
    FormsModule,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    RequiredValidator,
    NgModel,
    NgForOf,
    NgIf
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CreateComponent, { className: "CreateComponent", filePath: "src\\app\\modulos\\usuarios\\pages\\create\\create.component.ts", lineNumber: 20 });
})();

// src/app/modulos/usuarios/pages/listar/listar.component.ts
function ListarComponent_div_1_tr_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 41);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td")(14, "div", 42)(15, "input", 43, 0);
    \u0275\u0275listener("change", function ListarComponent_div_1_tr_35_Template_input_change_15_listener() {
      const u_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const chk_r5 = \u0275\u0275reference(16);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cambiarEstado(u_r4, chk_r5.checked));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "td")(18, "button", 44);
    \u0275\u0275listener("click", function ListarComponent_div_1_tr_35_Template_button_click_18_listener() {
      const u_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editarUsuario(u_r4));
    });
    \u0275\u0275element(19, "i", 45);
    \u0275\u0275text(20, " Editar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const u_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r4.NOMBRE_CORTO);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r4.username);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r4.email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r4.empe_nom);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r4.tipousuario);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r4.grupo);
    \u0275\u0275advance(3);
    \u0275\u0275property("checked", u_r4.status == 1);
  }
}
function ListarComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 28)(2, "div")(3, "h4", 29);
    \u0275\u0275text(4, "Usuarios");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small", 30);
    \u0275\u0275text(6, "Gesti\xF3n de usuarios activos");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 31)(8, "button", 32);
    \u0275\u0275element(9, "i", 33);
    \u0275\u0275text(10, " Nuevo usuario ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 34);
    \u0275\u0275listener("click", function ListarComponent_div_1_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.refrescarUsuarios());
    });
    \u0275\u0275element(12, "i", 35);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 36)(14, "div", 37)(15, "table", 38)(16, "thead")(17, "tr")(18, "th");
    \u0275\u0275text(19, "Nombres");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th");
    \u0275\u0275text(21, "Usuario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th");
    \u0275\u0275text(23, "E-mail");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "th");
    \u0275\u0275text(25, "Empresa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "th");
    \u0275\u0275text(27, "Rol");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "th");
    \u0275\u0275text(29, "Grupo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "th");
    \u0275\u0275text(31, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "th");
    \u0275\u0275text(33, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "tbody");
    \u0275\u0275template(35, ListarComponent_div_1_tr_35_Template, 21, 7, "tr", 39);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275element(36, "app-data-table", 40);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(35);
    \u0275\u0275property("ngForOf", ctx_r1.usuarios);
    \u0275\u0275advance();
    \u0275\u0275property("tableId", "usuariosTable")("options", ctx_r1.dataTableOptions)("refreshTrigger", ctx_r1.refreshToken);
  }
}
function ListarComponent_option_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 46);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rol_r6 = ctx.$implicit;
    \u0275\u0275property("value", rol_r6.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", rol_r6.nombre, " ");
  }
}
function ListarComponent_option_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 46);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const grupo_r7 = ctx.$implicit;
    \u0275\u0275property("value", grupo_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", grupo_r7.grupo, " ");
  }
}
var ListarComponent = class _ListarComponent {
  userService;
  router;
  usuarios = [];
  usuarioEdit = {};
  // Usuario en edición
  grupos = [];
  roles = [];
  dataTableOptions = __spreadProps(__spreadValues({}, DEFAULT_DATATABLE_OPTIONS), {
    pageLength: 10,
    order: [[0, "asc"]]
  });
  refreshToken = 0;
  // este valor cambiará para forzar la recarga
  constructor(userService, router) {
    this.userService = userService;
    this.router = router;
  }
  // 🔄 Cargar roles desde el backend
  cargarRoles() {
    this.userService.getRol().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error("Error al obtener roles:", err);
      }
    });
  }
  refrescarUsuarios() {
    window.location.reload();
  }
  // 🔄 Cargar grupos desde el backend
  cargarGrupos() {
    this.userService.getGrupo().subscribe({
      next: (data) => {
        this.grupos = data;
      },
      error: (err) => {
        console.error("Error al obtener grupos:", err);
      }
    });
  }
  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
    this.cargarGrupos();
  }
  /*  cargarUsuarios(): void {
      this.userService.getUsuarios().subscribe((data) => {
        this.usuarios = data;
  
        // 🔄 Forzamos un refresco del DataTable en un nuevo ciclo de detección
        setTimeout(() => {
          this.refreshToken = Date.now(); // cambia el valor del trigger
        }, 0);
      });
    }*/
  cargarUsuarios() {
    this.userService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        setTimeout(() => {
          this.refreshToken = Date.now();
        });
      },
      error: (err) => {
        console.error("Error al cargar usuarios", err);
      }
    });
  }
  editarUsuario(u) {
    const rol = this.roles.find((r) => r.nombre === u.tipousuario);
    const grupo = this.grupos.find((g) => g.grupo === u.grupo);
    this.usuarioEdit = {
      id: u.id,
      nombres: u.NOMBRE_CORTO,
      username: u.username,
      empresa: u.empe_nom,
      email: u.email,
      idRol: rol ? rol.id : null,
      idGrupo: grupo ? grupo.id : null,
      password: ""
      // vacío por defecto
    };
    const modal = new window.bootstrap.Modal(document.getElementById("editarModal"));
    modal.show();
  }
  guardarCambios() {
    import_sweetalert22.default.fire({
      title: "Actualizando usuario...",
      text: "Por favor espera",
      allowOutsideClick: false,
      didOpen: () => {
        import_sweetalert22.default.showLoading();
      }
    });
    this.userService.actualizarUsuario(this.usuarioEdit.id, this.usuarioEdit).subscribe({
      next: (res) => {
        import_sweetalert22.default.close();
        import_sweetalert22.default.fire({
          icon: "success",
          title: "\u2705 Usuario actualizado correctamente",
          text: "\u2705 El usuario se ha actualizado en el sistema.",
          timer: 2500,
          showConfirmButton: false
        });
        this.cargarUsuarios();
        setTimeout(() => {
          this.refreshToken = Date.now();
        }, 500);
        const modalInstance = window.bootstrap.Modal.getInstance(document.getElementById("editarModal"));
        if (modalInstance)
          modalInstance.hide();
        this.usuarioEdit = {};
      },
      error: (err) => {
        console.error(err);
        import_sweetalert22.default.close();
        import_sweetalert22.default.fire({
          icon: "error",
          title: "Error al guardar",
          text: "No se pudo guardar el usuario. Intente nuevamente.",
          confirmButtonText: "Cerrar"
        });
      }
    });
  }
  cambiarEstado(u, checked) {
    const nuevoStatus = checked ? 1 : 0;
    this.userService.actualizarStatus(u.id, nuevoStatus).subscribe({
      next: () => {
        import_sweetalert22.default.fire({
          icon: "success",
          title: nuevoStatus ? "Usuario activado" : "Usuario desactivado",
          showConfirmButton: false,
          timer: 1500
        });
        u.status = nuevoStatus;
      },
      error: () => {
        import_sweetalert22.default.fire({
          icon: "error",
          title: "Error al cambiar estado"
        });
        u.status = u.status ? 0 : 1;
      }
    });
  }
  onUsuarioCreado() {
    this.cargarUsuarios();
    const modalEl = document.getElementById("modalCrearUsuario");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
  HTMLInputElement = HTMLInputElement;
  static \u0275fac = function ListarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ListarComponent)(\u0275\u0275directiveInject(UserService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ListarComponent, selectors: [["app-listar"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 59, vars: 10, consts: [["chk", ""], [1, "container-fluid", "mt-0"], ["class", "container-fluid", 4, "ngIf"], ["id", "editarModal", "tabindex", "-1", "aria-labelledby", "editarModalLabel", "aria-hidden", "true", 1, "modal", "fade"], [1, "modal-dialog"], [1, "modal-content"], [3, "ngSubmit"], [1, "modal-header"], [1, "modal-title"], ["type", "button", "data-bs-dismiss", "modal", 1, "btn-close"], [1, "modal-body"], [1, "mb-3"], ["name", "nombres", "readonly", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["name", "username", "readonly", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["name", "empresa", "readonly", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["name", "email", "type", "email", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["name", "password", "type", "password", "placeholder", "Dejar vac\xEDo para no cambiarla", 1, "form-control", 3, "ngModelChange", "ngModel"], ["name", "idRol", "required", "", 1, "form-select", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["name", "idGrupo", "required", "", 1, "form-select", 3, "ngModelChange", "ngModel"], [1, "modal-footer"], ["type", "button", "data-bs-dismiss", "modal", 1, "btn", "btn-secondary"], ["type", "submit", 1, "btn", "btn-primary"], ["id", "modalCrearUsuario", "tabindex", "-1", 1, "modal", "fade"], [1, "modal-dialog", "modal-xl", "modal-dialog-scrollable"], [3, "usuarioCreado"], [1, "container-fluid"], [1, "d-flex", "justify-content-between", "align-items-center", "mb-3"], [1, "mb-0"], [1, "text-muted"], [1, "d-flex", "gap-2"], ["data-bs-toggle", "modal", "data-bs-target", "#modalCrearUsuario", 1, "btn", "btn-success"], [1, "bi", "bi-person-plus"], [1, "btn", "btn-outline-secondary", 3, "click"], [1, "bi", "bi-arrow-clockwise"], [1, "card", "shadow-sm", "mt-1"], [1, "card-body"], ["id", "usuariosTable", 1, "table", "table-bordered", "table-hover", "w-100"], [4, "ngFor", "ngForOf"], [3, "tableId", "options", "refreshTrigger"], [1, "text-uppercase"], [1, "form-check", "form-switch"], ["type", "checkbox", 1, "form-check-input", 3, "change", "checked"], [1, "btn", "btn-warning", "btn-sm", 3, "click"], [1, "fas", "fa-edit"], [3, "value"]], template: function ListarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 1);
      \u0275\u0275template(1, ListarComponent_div_1_Template, 37, 4, "div", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "div", 3)(3, "div", 4)(4, "div", 5)(5, "form", 6);
      \u0275\u0275listener("ngSubmit", function ListarComponent_Template_form_ngSubmit_5_listener() {
        return ctx.guardarCambios();
      });
      \u0275\u0275elementStart(6, "div", 7)(7, "h5", 8);
      \u0275\u0275text(8, "Editar Usuario");
      \u0275\u0275elementEnd();
      \u0275\u0275element(9, "button", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 10)(11, "div", 11)(12, "label");
      \u0275\u0275text(13, "Nombres");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "input", 12);
      \u0275\u0275twoWayListener("ngModelChange", function ListarComponent_Template_input_ngModelChange_14_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuarioEdit.nombres, $event) || (ctx.usuarioEdit.nombres = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "div", 11)(16, "label");
      \u0275\u0275text(17, "Usuario");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "input", 13);
      \u0275\u0275twoWayListener("ngModelChange", function ListarComponent_Template_input_ngModelChange_18_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuarioEdit.username, $event) || (ctx.usuarioEdit.username = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "div", 11)(20, "label");
      \u0275\u0275text(21, "Empresa");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "input", 14);
      \u0275\u0275twoWayListener("ngModelChange", function ListarComponent_Template_input_ngModelChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuarioEdit.empresa, $event) || (ctx.usuarioEdit.empresa = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "div", 11)(24, "label");
      \u0275\u0275text(25, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "input", 15);
      \u0275\u0275twoWayListener("ngModelChange", function ListarComponent_Template_input_ngModelChange_26_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuarioEdit.email, $event) || (ctx.usuarioEdit.email = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "div", 11)(28, "label");
      \u0275\u0275text(29, "Contrase\xF1a (opcional)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "input", 16);
      \u0275\u0275twoWayListener("ngModelChange", function ListarComponent_Template_input_ngModelChange_30_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuarioEdit.password, $event) || (ctx.usuarioEdit.password = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "div", 11)(32, "label");
      \u0275\u0275text(33, "Rol");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "select", 17);
      \u0275\u0275twoWayListener("ngModelChange", function ListarComponent_Template_select_ngModelChange_34_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuarioEdit.idRol, $event) || (ctx.usuarioEdit.idRol = $event);
        return $event;
      });
      \u0275\u0275elementStart(35, "option", 18);
      \u0275\u0275text(36, "-- Seleccione un rol --");
      \u0275\u0275elementEnd();
      \u0275\u0275template(37, ListarComponent_option_37_Template, 2, 2, "option", 19);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(38, "div", 11)(39, "label");
      \u0275\u0275text(40, "Grupo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "select", 20);
      \u0275\u0275twoWayListener("ngModelChange", function ListarComponent_Template_select_ngModelChange_41_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.usuarioEdit.idGrupo, $event) || (ctx.usuarioEdit.idGrupo = $event);
        return $event;
      });
      \u0275\u0275elementStart(42, "option", 18);
      \u0275\u0275text(43, "-- Seleccione un grupo --");
      \u0275\u0275elementEnd();
      \u0275\u0275template(44, ListarComponent_option_44_Template, 2, 2, "option", 19);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(45, "div", 21)(46, "button", 22);
      \u0275\u0275text(47, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "button", 23);
      \u0275\u0275text(49, "Guardar Cambios");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(50, "div", 24)(51, "div", 25)(52, "div", 5)(53, "div", 7)(54, "h5", 8);
      \u0275\u0275text(55, "Crear usuario");
      \u0275\u0275elementEnd();
      \u0275\u0275element(56, "button", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "div", 10)(58, "app-create", 26);
      \u0275\u0275listener("usuarioCreado", function ListarComponent_Template_app_create_usuarioCreado_58_listener() {
        return ctx.onUsuarioCreado();
      });
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.usuarios.length > 0);
      \u0275\u0275advance(13);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuarioEdit.nombres);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuarioEdit.username);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuarioEdit.empresa);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuarioEdit.email);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuarioEdit.password);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuarioEdit.idRol);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.roles);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.usuarioEdit.idGrupo);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.grupos);
    }
  }, dependencies: [CommonModule, NgForOf, NgIf, DataTableComponent, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, CreateComponent] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ListarComponent, { className: "ListarComponent", filePath: "src\\app\\modulos\\usuarios\\pages\\listar\\listar.component.ts", lineNumber: 19 });
})();

// src/app/modulos/usuarios/pages/privilegiostemporales/privilegiostemporales.component.ts
var import_sweetalert23 = __toESM(require_sweetalert2_all());

// node_modules/ngx-pagination/fesm2020/ngx-pagination.mjs
function PaginationControlsComponent_ul_3_li_1_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 12);
    \u0275\u0275listener("keyup.enter", function PaginationControlsComponent_ul_3_li_1_a_1_Template_a_keyup_enter_0_listener() {
      \u0275\u0275restoreView(_r2);
      \u0275\u0275nextContext(3);
      const p_r3 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(p_r3.previous());
    })("click", function PaginationControlsComponent_ul_3_li_1_a_1_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      \u0275\u0275nextContext(3);
      const p_r3 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(p_r3.previous());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.previousLabel, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.screenReaderPageLabel);
  }
}
function PaginationControlsComponent_ul_3_li_1_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.previousLabel, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.screenReaderPageLabel);
  }
}
function PaginationControlsComponent_ul_3_li_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 9);
    \u0275\u0275template(1, PaginationControlsComponent_ul_3_li_1_a_1_Template, 4, 2, "a", 10)(2, PaginationControlsComponent_ul_3_li_1_span_2_Template, 4, 2, "span", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const p_r3 = \u0275\u0275reference(1);
    \u0275\u0275classProp("disabled", p_r3.isFirstPage());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", 1 < p_r3.getCurrent());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", p_r3.isFirstPage());
  }
}
function PaginationControlsComponent_ul_3_li_4_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 12);
    \u0275\u0275listener("keyup.enter", function PaginationControlsComponent_ul_3_li_4_a_1_Template_a_keyup_enter_0_listener() {
      \u0275\u0275restoreView(_r5);
      const page_r6 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275nextContext(2);
      const p_r3 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(p_r3.setCurrent(page_r6.value));
    })("click", function PaginationControlsComponent_ul_3_li_4_a_1_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const page_r6 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275nextContext(2);
      const p_r3 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(p_r3.setCurrent(page_r6.value));
    });
    \u0275\u0275elementStart(1, "span", 13);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const page_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r3.screenReaderPageLabel, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(page_r6.label === "..." ? page_r6.label : \u0275\u0275pipeBind2(5, 2, page_r6.label, ""));
  }
}
function PaginationControlsComponent_ul_3_li_4_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "span", 16)(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const page_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r3.screenReaderCurrentLabel, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(page_r6.label === "..." ? page_r6.label : \u0275\u0275pipeBind2(6, 2, page_r6.label, ""));
  }
}
function PaginationControlsComponent_ul_3_li_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275template(1, PaginationControlsComponent_ul_3_li_4_a_1_Template, 6, 5, "a", 10)(2, PaginationControlsComponent_ul_3_li_4_ng_container_2_Template, 7, 5, "ng-container", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r6 = ctx.$implicit;
    \u0275\u0275nextContext(2);
    const p_r3 = \u0275\u0275reference(1);
    \u0275\u0275classProp("current", p_r3.getCurrent() === page_r6.value)("ellipsis", page_r6.label === "...");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", p_r3.getCurrent() !== page_r6.value);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", p_r3.getCurrent() === page_r6.value);
  }
}
function PaginationControlsComponent_ul_3_li_5_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 12);
    \u0275\u0275listener("keyup.enter", function PaginationControlsComponent_ul_3_li_5_a_1_Template_a_keyup_enter_0_listener() {
      \u0275\u0275restoreView(_r7);
      \u0275\u0275nextContext(3);
      const p_r3 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(p_r3.next());
    })("click", function PaginationControlsComponent_ul_3_li_5_a_1_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      \u0275\u0275nextContext(3);
      const p_r3 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(p_r3.next());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.nextLabel, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.screenReaderPageLabel);
  }
}
function PaginationControlsComponent_ul_3_li_5_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.nextLabel, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.screenReaderPageLabel);
  }
}
function PaginationControlsComponent_ul_3_li_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 17);
    \u0275\u0275template(1, PaginationControlsComponent_ul_3_li_5_a_1_Template, 4, 2, "a", 10)(2, PaginationControlsComponent_ul_3_li_5_span_2_Template, 4, 2, "span", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const p_r3 = \u0275\u0275reference(1);
    \u0275\u0275classProp("disabled", p_r3.isLastPage());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !p_r3.isLastPage());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", p_r3.isLastPage());
  }
}
function PaginationControlsComponent_ul_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 4);
    \u0275\u0275template(1, PaginationControlsComponent_ul_3_li_1_Template, 3, 4, "li", 5);
    \u0275\u0275elementStart(2, "li", 6);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, PaginationControlsComponent_ul_3_li_4_Template, 3, 6, "li", 7)(5, PaginationControlsComponent_ul_3_li_5_Template, 3, 4, "li", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    const p_r3 = \u0275\u0275reference(1);
    \u0275\u0275classProp("responsive", ctx_r3.responsive);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.directionLinks);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", p_r3.getCurrent(), " / ", p_r3.getLastPage(), " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", p_r3.pages)("ngForTrackBy", ctx_r3.trackByIndex);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.directionLinks);
  }
}
var PaginationService = class {
  constructor() {
    this.change = new EventEmitter();
    this.instances = {};
    this.DEFAULT_ID = "DEFAULT_PAGINATION_ID";
  }
  defaultId() {
    return this.DEFAULT_ID;
  }
  /**
   * Register a PaginationInstance with this service. Returns a
   * boolean value signifying whether the instance is new or
   * updated (true = new or updated, false = unchanged).
   */
  register(instance) {
    if (instance.id == null) {
      instance.id = this.DEFAULT_ID;
    }
    if (!this.instances[instance.id]) {
      this.instances[instance.id] = instance;
      return true;
    } else {
      return this.updateInstance(instance);
    }
  }
  /**
   * Check each property of the instance and update any that have changed. Return
   * true if any changes were made, else return false.
   */
  updateInstance(instance) {
    let changed = false;
    for (let prop in this.instances[instance.id]) {
      if (instance[prop] !== this.instances[instance.id][prop]) {
        this.instances[instance.id][prop] = instance[prop];
        changed = true;
      }
    }
    return changed;
  }
  /**
   * Returns the current page number.
   */
  getCurrentPage(id) {
    if (this.instances[id]) {
      return this.instances[id].currentPage;
    }
    return 1;
  }
  /**
   * Sets the current page number.
   */
  setCurrentPage(id, page) {
    if (this.instances[id]) {
      let instance = this.instances[id];
      let maxPage = Math.ceil(instance.totalItems / instance.itemsPerPage);
      if (page <= maxPage && 1 <= page) {
        this.instances[id].currentPage = page;
        this.change.emit(id);
      }
    }
  }
  /**
   * Sets the value of instance.totalItems
   */
  setTotalItems(id, totalItems) {
    if (this.instances[id] && 0 <= totalItems) {
      this.instances[id].totalItems = totalItems;
      this.change.emit(id);
    }
  }
  /**
   * Sets the value of instance.itemsPerPage.
   */
  setItemsPerPage(id, itemsPerPage) {
    if (this.instances[id]) {
      this.instances[id].itemsPerPage = itemsPerPage;
      this.change.emit(id);
    }
  }
  /**
   * Returns a clone of the pagination instance object matching the id. If no
   * id specified, returns the instance corresponding to the default id.
   */
  getInstance(id = this.DEFAULT_ID) {
    if (this.instances[id]) {
      return this.clone(this.instances[id]);
    }
    return {};
  }
  /**
   * Perform a shallow clone of an object.
   */
  clone(obj) {
    var target = {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        target[i] = obj[i];
      }
    }
    return target;
  }
};
var LARGE_NUMBER = Number.MAX_SAFE_INTEGER;
var PaginatePipe = class {
  constructor(service) {
    this.service = service;
    this.state = {};
  }
  transform(collection, args) {
    if (!(collection instanceof Array)) {
      let _id = args.id || this.service.defaultId();
      if (this.state[_id]) {
        return this.state[_id].slice;
      } else {
        return collection;
      }
    }
    let serverSideMode = args.totalItems && args.totalItems !== collection.length;
    let instance = this.createInstance(collection, args);
    let id = instance.id;
    let start, end;
    let perPage = instance.itemsPerPage;
    let emitChange = this.service.register(instance);
    if (!serverSideMode && collection instanceof Array) {
      perPage = +perPage || LARGE_NUMBER;
      start = (instance.currentPage - 1) * perPage;
      end = start + perPage;
      let isIdentical = this.stateIsIdentical(id, collection, start, end);
      if (isIdentical) {
        return this.state[id].slice;
      } else {
        let slice = collection.slice(start, end);
        this.saveState(id, collection, slice, start, end);
        this.service.change.emit(id);
        return slice;
      }
    } else {
      if (emitChange) {
        this.service.change.emit(id);
      }
      this.saveState(id, collection, collection, start, end);
      return collection;
    }
  }
  /**
   * Create an PaginationInstance object, using defaults for any optional properties not supplied.
   */
  createInstance(collection, config) {
    this.checkConfig(config);
    return {
      id: config.id != null ? config.id : this.service.defaultId(),
      itemsPerPage: +config.itemsPerPage || 0,
      currentPage: +config.currentPage || 1,
      totalItems: +config.totalItems || collection.length
    };
  }
  /**
   * Ensure the argument passed to the filter contains the required properties.
   */
  checkConfig(config) {
    const required = ["itemsPerPage", "currentPage"];
    const missing = required.filter((prop) => !(prop in config));
    if (0 < missing.length) {
      throw new Error(`PaginatePipe: Argument is missing the following required properties: ${missing.join(", ")}`);
    }
  }
  /**
   * To avoid returning a brand new array each time the pipe is run, we store the state of the sliced
   * array for a given id. This means that the next time the pipe is run on this collection & id, we just
   * need to check that the collection, start and end points are all identical, and if so, return the
   * last sliced array.
   */
  saveState(id, collection, slice, start, end) {
    this.state[id] = {
      collection,
      size: collection.length,
      slice,
      start,
      end
    };
  }
  /**
   * For a given id, returns true if the collection, size, start and end values are identical.
   */
  stateIsIdentical(id, collection, start, end) {
    let state = this.state[id];
    if (!state) {
      return false;
    }
    let isMetaDataIdentical = state.size === collection.length && state.start === start && state.end === end;
    if (!isMetaDataIdentical) {
      return false;
    }
    return state.slice.every((element, index) => element === collection[start + index]);
  }
};
PaginatePipe.\u0275fac = function PaginatePipe_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || PaginatePipe)(\u0275\u0275directiveInject(PaginationService, 16));
};
PaginatePipe.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({
  name: "paginate",
  type: PaginatePipe,
  pure: false
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaginatePipe, [{
    type: Pipe,
    args: [{
      name: "paginate",
      pure: false
    }]
  }], function() {
    return [{
      type: PaginationService
    }];
  }, null);
})();
var DEFAULT_TEMPLATE = `
    <pagination-template  #p="paginationApi"
                         [id]="id"
                         [maxSize]="maxSize"
                         (pageChange)="pageChange.emit($event)"
                         (pageBoundsCorrection)="pageBoundsCorrection.emit($event)">
    <nav role="navigation" [attr.aria-label]="screenReaderPaginationLabel">
    <ul class="ngx-pagination" 
        [class.responsive]="responsive"
        *ngIf="!(autoHide && p.pages.length <= 1)">

        <li class="pagination-previous" [class.disabled]="p.isFirstPage()" *ngIf="directionLinks"> 
            <a tabindex="0" *ngIf="1 < p.getCurrent()" (keyup.enter)="p.previous()" (click)="p.previous()">
                {{ previousLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>
            </a>
            <span *ngIf="p.isFirstPage()" aria-disabled="true">
                {{ previousLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>
            </span>
        </li> 

        <li class="small-screen">
            {{ p.getCurrent() }} / {{ p.getLastPage() }}
        </li>

        <li [class.current]="p.getCurrent() === page.value" 
            [class.ellipsis]="page.label === '...'"
            *ngFor="let page of p.pages; trackBy: trackByIndex">
            <a tabindex="0" (keyup.enter)="p.setCurrent(page.value)" (click)="p.setCurrent(page.value)" *ngIf="p.getCurrent() !== page.value">
                <span class="show-for-sr">{{ screenReaderPageLabel }} </span>
                <span>{{ (page.label === '...') ? page.label : (page.label | number:'') }}</span>
            </a>
            <ng-container *ngIf="p.getCurrent() === page.value">
              <span aria-live="polite">
                <span class="show-for-sr">{{ screenReaderCurrentLabel }} </span>
                <span>{{ (page.label === '...') ? page.label : (page.label | number:'') }}</span> 
              </span>
            </ng-container>
        </li>

        <li class="pagination-next" [class.disabled]="p.isLastPage()" *ngIf="directionLinks">
            <a tabindex="0" *ngIf="!p.isLastPage()" (keyup.enter)="p.next()" (click)="p.next()">
                 {{ nextLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>
            </a>
            <span *ngIf="p.isLastPage()" aria-disabled="true">
                 {{ nextLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>
            </span>
        </li>

    </ul>
    </nav>
    </pagination-template>
    `;
var DEFAULT_STYLES = `
.ngx-pagination {
  margin-left: 0;
  margin-bottom: 1rem; }
  .ngx-pagination::before, .ngx-pagination::after {
    content: ' ';
    display: table; }
  .ngx-pagination::after {
    clear: both; }
  .ngx-pagination li {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    margin-right: 0.0625rem;
    border-radius: 0; }
  .ngx-pagination li {
    display: inline-block; }
  .ngx-pagination a,
  .ngx-pagination button {
    color: #0a0a0a; 
    display: block;
    padding: 0.1875rem 0.625rem;
    border-radius: 0; }
    .ngx-pagination a:hover,
    .ngx-pagination button:hover {
      background: #e6e6e6; }
  .ngx-pagination .current {
    padding: 0.1875rem 0.625rem;
    background: #2199e8;
    color: #fefefe;
    cursor: default; }
  .ngx-pagination .disabled {
    padding: 0.1875rem 0.625rem;
    color: #cacaca;
    cursor: default; } 
    .ngx-pagination .disabled:hover {
      background: transparent; }
  .ngx-pagination a, .ngx-pagination button {
    cursor: pointer; }

.ngx-pagination .pagination-previous a::before,
.ngx-pagination .pagination-previous.disabled::before { 
  content: '\xAB';
  display: inline-block;
  margin-right: 0.5rem; }

.ngx-pagination .pagination-next a::after,
.ngx-pagination .pagination-next.disabled::after {
  content: '\xBB';
  display: inline-block;
  margin-left: 0.5rem; }

.ngx-pagination .show-for-sr {
  position: absolute !important;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0); }
.ngx-pagination .small-screen {
  display: none; }
@media screen and (max-width: 601px) {
  .ngx-pagination.responsive .small-screen {
    display: inline-block; } 
  .ngx-pagination.responsive li:not(.small-screen):not(.pagination-previous):not(.pagination-next) {
    display: none; }
}
  `;
var PaginationControlsDirective = class {
  constructor(service, changeDetectorRef) {
    this.service = service;
    this.changeDetectorRef = changeDetectorRef;
    this.maxSize = 7;
    this.pageChange = new EventEmitter();
    this.pageBoundsCorrection = new EventEmitter();
    this.pages = [];
    this.changeSub = this.service.change.subscribe((id) => {
      if (this.id === id) {
        this.updatePageLinks();
        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
      }
    });
  }
  ngOnInit() {
    if (this.id === void 0) {
      this.id = this.service.defaultId();
    }
    this.updatePageLinks();
  }
  ngOnChanges(changes) {
    this.updatePageLinks();
  }
  ngOnDestroy() {
    this.changeSub.unsubscribe();
  }
  /**
   * Go to the previous page
   */
  previous() {
    this.checkValidId();
    this.setCurrent(this.getCurrent() - 1);
  }
  /**
   * Go to the next page
   */
  next() {
    this.checkValidId();
    this.setCurrent(this.getCurrent() + 1);
  }
  /**
   * Returns true if current page is first page
   */
  isFirstPage() {
    return this.getCurrent() === 1;
  }
  /**
   * Returns true if current page is last page
   */
  isLastPage() {
    return this.getLastPage() === this.getCurrent();
  }
  /**
   * Set the current page number.
   */
  setCurrent(page) {
    this.pageChange.emit(page);
  }
  /**
   * Get the current page number.
   */
  getCurrent() {
    return this.service.getCurrentPage(this.id);
  }
  /**
   * Returns the last page number
   */
  getLastPage() {
    let inst = this.service.getInstance(this.id);
    if (inst.totalItems < 1) {
      return 1;
    }
    return Math.ceil(inst.totalItems / inst.itemsPerPage);
  }
  getTotalItems() {
    return this.service.getInstance(this.id).totalItems;
  }
  checkValidId() {
    if (this.service.getInstance(this.id).id == null) {
      console.warn(`PaginationControlsDirective: the specified id "${this.id}" does not match any registered PaginationInstance`);
    }
  }
  /**
   * Updates the page links and checks that the current page is valid. Should run whenever the
   * PaginationService.change stream emits a value matching the current ID, or when any of the
   * input values changes.
   */
  updatePageLinks() {
    let inst = this.service.getInstance(this.id);
    const correctedCurrentPage = this.outOfBoundCorrection(inst);
    if (correctedCurrentPage !== inst.currentPage) {
      setTimeout(() => {
        this.pageBoundsCorrection.emit(correctedCurrentPage);
        this.pages = this.createPageArray(inst.currentPage, inst.itemsPerPage, inst.totalItems, this.maxSize);
      });
    } else {
      this.pages = this.createPageArray(inst.currentPage, inst.itemsPerPage, inst.totalItems, this.maxSize);
    }
  }
  /**
   * Checks that the instance.currentPage property is within bounds for the current page range.
   * If not, return a correct value for currentPage, or the current value if OK.
   */
  outOfBoundCorrection(instance) {
    const totalPages = Math.ceil(instance.totalItems / instance.itemsPerPage);
    if (totalPages < instance.currentPage && 0 < totalPages) {
      return totalPages;
    } else if (instance.currentPage < 1) {
      return 1;
    }
    return instance.currentPage;
  }
  /**
   * Returns an array of Page objects to use in the pagination controls.
   */
  createPageArray(currentPage, itemsPerPage, totalItems, paginationRange) {
    paginationRange = +paginationRange;
    let pages = [];
    const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);
    const halfWay = Math.ceil(paginationRange / 2);
    const isStart = currentPage <= halfWay;
    const isEnd = totalPages - halfWay < currentPage;
    const isMiddle = !isStart && !isEnd;
    let ellipsesNeeded = paginationRange < totalPages;
    let i = 1;
    while (i <= totalPages && i <= paginationRange) {
      let label;
      let pageNumber = this.calculatePageNumber(i, currentPage, paginationRange, totalPages);
      let openingEllipsesNeeded = i === 2 && (isMiddle || isEnd);
      let closingEllipsesNeeded = i === paginationRange - 1 && (isMiddle || isStart);
      if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
        label = "...";
      } else {
        label = pageNumber;
      }
      pages.push({
        label,
        value: pageNumber
      });
      i++;
    }
    return pages;
  }
  /**
   * Given the position in the sequence of pagination links [i],
   * figure out what page number corresponds to that position.
   */
  calculatePageNumber(i, currentPage, paginationRange, totalPages) {
    let halfWay = Math.ceil(paginationRange / 2);
    if (i === paginationRange) {
      return totalPages;
    } else if (i === 1) {
      return i;
    } else if (paginationRange < totalPages) {
      if (totalPages - halfWay < currentPage) {
        return totalPages - paginationRange + i;
      } else if (halfWay < currentPage) {
        return currentPage - halfWay + i;
      } else {
        return i;
      }
    } else {
      return i;
    }
  }
};
PaginationControlsDirective.\u0275fac = function PaginationControlsDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || PaginationControlsDirective)(\u0275\u0275directiveInject(PaginationService), \u0275\u0275directiveInject(ChangeDetectorRef));
};
PaginationControlsDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: PaginationControlsDirective,
  selectors: [["pagination-template"], ["", "pagination-template", ""]],
  inputs: {
    id: "id",
    maxSize: "maxSize"
  },
  outputs: {
    pageChange: "pageChange",
    pageBoundsCorrection: "pageBoundsCorrection"
  },
  exportAs: ["paginationApi"],
  features: [\u0275\u0275NgOnChangesFeature]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaginationControlsDirective, [{
    type: Directive,
    args: [{
      selector: "pagination-template,[pagination-template]",
      exportAs: "paginationApi"
    }]
  }], function() {
    return [{
      type: PaginationService
    }, {
      type: ChangeDetectorRef
    }];
  }, {
    id: [{
      type: Input
    }],
    maxSize: [{
      type: Input
    }],
    pageChange: [{
      type: Output
    }],
    pageBoundsCorrection: [{
      type: Output
    }]
  });
})();
function coerceToBoolean(input) {
  return !!input && input !== "false";
}
var PaginationControlsComponent = class {
  constructor() {
    this.maxSize = 7;
    this.previousLabel = "Previous";
    this.nextLabel = "Next";
    this.screenReaderPaginationLabel = "Pagination";
    this.screenReaderPageLabel = "page";
    this.screenReaderCurrentLabel = `You're on page`;
    this.pageChange = new EventEmitter();
    this.pageBoundsCorrection = new EventEmitter();
    this._directionLinks = true;
    this._autoHide = false;
    this._responsive = false;
  }
  get directionLinks() {
    return this._directionLinks;
  }
  set directionLinks(value) {
    this._directionLinks = coerceToBoolean(value);
  }
  get autoHide() {
    return this._autoHide;
  }
  set autoHide(value) {
    this._autoHide = coerceToBoolean(value);
  }
  get responsive() {
    return this._responsive;
  }
  set responsive(value) {
    this._responsive = coerceToBoolean(value);
  }
  trackByIndex(index) {
    return index;
  }
};
PaginationControlsComponent.\u0275fac = function PaginationControlsComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || PaginationControlsComponent)();
};
PaginationControlsComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: PaginationControlsComponent,
  selectors: [["pagination-controls"]],
  inputs: {
    id: "id",
    maxSize: "maxSize",
    directionLinks: "directionLinks",
    autoHide: "autoHide",
    responsive: "responsive",
    previousLabel: "previousLabel",
    nextLabel: "nextLabel",
    screenReaderPaginationLabel: "screenReaderPaginationLabel",
    screenReaderPageLabel: "screenReaderPageLabel",
    screenReaderCurrentLabel: "screenReaderCurrentLabel"
  },
  outputs: {
    pageChange: "pageChange",
    pageBoundsCorrection: "pageBoundsCorrection"
  },
  decls: 4,
  vars: 4,
  consts: [["p", "paginationApi"], [3, "pageChange", "pageBoundsCorrection", "id", "maxSize"], ["role", "navigation"], ["class", "ngx-pagination", 3, "responsive", 4, "ngIf"], [1, "ngx-pagination"], ["class", "pagination-previous", 3, "disabled", 4, "ngIf"], [1, "small-screen"], [3, "current", "ellipsis", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["class", "pagination-next", 3, "disabled", 4, "ngIf"], [1, "pagination-previous"], ["tabindex", "0", 3, "keyup.enter", "click", 4, "ngIf"], ["aria-disabled", "true", 4, "ngIf"], ["tabindex", "0", 3, "keyup.enter", "click"], [1, "show-for-sr"], ["aria-disabled", "true"], [4, "ngIf"], ["aria-live", "polite"], [1, "pagination-next"]],
  template: function PaginationControlsComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "pagination-template", 1, 0);
      \u0275\u0275listener("pageChange", function PaginationControlsComponent_Template_pagination_template_pageChange_0_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.pageChange.emit($event));
      })("pageBoundsCorrection", function PaginationControlsComponent_Template_pagination_template_pageBoundsCorrection_0_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.pageBoundsCorrection.emit($event));
      });
      \u0275\u0275elementStart(2, "nav", 2);
      \u0275\u0275template(3, PaginationControlsComponent_ul_3_Template, 6, 8, "ul", 3);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      const p_r3 = \u0275\u0275reference(1);
      \u0275\u0275property("id", ctx.id)("maxSize", ctx.maxSize);
      \u0275\u0275advance(2);
      \u0275\u0275attribute("aria-label", ctx.screenReaderPaginationLabel);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !(ctx.autoHide && p_r3.pages.length <= 1));
    }
  },
  dependencies: [PaginationControlsDirective, NgIf, NgForOf, DecimalPipe],
  styles: ['.ngx-pagination{margin-left:0;margin-bottom:1rem}.ngx-pagination:before,.ngx-pagination:after{content:" ";display:table}.ngx-pagination:after{clear:both}.ngx-pagination li{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;margin-right:.0625rem;border-radius:0}.ngx-pagination li{display:inline-block}.ngx-pagination a,.ngx-pagination button{color:#0a0a0a;display:block;padding:.1875rem .625rem;border-radius:0}.ngx-pagination a:hover,.ngx-pagination button:hover{background:#e6e6e6}.ngx-pagination .current{padding:.1875rem .625rem;background:#2199e8;color:#fefefe;cursor:default}.ngx-pagination .disabled{padding:.1875rem .625rem;color:#cacaca;cursor:default}.ngx-pagination .disabled:hover{background:transparent}.ngx-pagination a,.ngx-pagination button{cursor:pointer}.ngx-pagination .pagination-previous a:before,.ngx-pagination .pagination-previous.disabled:before{content:"\\ab";display:inline-block;margin-right:.5rem}.ngx-pagination .pagination-next a:after,.ngx-pagination .pagination-next.disabled:after{content:"\\bb";display:inline-block;margin-left:.5rem}.ngx-pagination .show-for-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}.ngx-pagination .small-screen{display:none}@media screen and (max-width: 601px){.ngx-pagination.responsive .small-screen{display:inline-block}.ngx-pagination.responsive li:not(.small-screen):not(.pagination-previous):not(.pagination-next){display:none}}\n'],
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaginationControlsComponent, [{
    type: Component,
    args: [{
      selector: "pagination-controls",
      template: DEFAULT_TEMPLATE,
      styles: [DEFAULT_STYLES],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None
    }]
  }], null, {
    id: [{
      type: Input
    }],
    maxSize: [{
      type: Input
    }],
    directionLinks: [{
      type: Input
    }],
    autoHide: [{
      type: Input
    }],
    responsive: [{
      type: Input
    }],
    previousLabel: [{
      type: Input
    }],
    nextLabel: [{
      type: Input
    }],
    screenReaderPaginationLabel: [{
      type: Input
    }],
    screenReaderPageLabel: [{
      type: Input
    }],
    screenReaderCurrentLabel: [{
      type: Input
    }],
    pageChange: [{
      type: Output
    }],
    pageBoundsCorrection: [{
      type: Output
    }]
  });
})();
var NgxPaginationModule = class {
};
NgxPaginationModule.\u0275fac = function NgxPaginationModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || NgxPaginationModule)();
};
NgxPaginationModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: NgxPaginationModule
});
NgxPaginationModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  providers: [PaginationService],
  imports: [[CommonModule]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxPaginationModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule],
      declarations: [PaginatePipe, PaginationControlsComponent, PaginationControlsDirective],
      providers: [PaginationService],
      exports: [PaginatePipe, PaginationControlsComponent, PaginationControlsDirective]
    }]
  }], null, null);
})();

// src/app/modulos/usuarios/pages/privilegiostemporales/privilegiostemporales.component.ts
var _c02 = (a0) => ({ itemsPerPage: 5, currentPage: a0 });
function PrivilegiostemporalesComponent_option_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r1 = ctx.$implicit;
    \u0275\u0275property("value", u_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(u_r1.NOMBRE_CORTO);
  }
}
function PrivilegiostemporalesComponent_option_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r2 = ctx.$implicit;
    \u0275\u0275property("value", u_r2.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(u_r2.NOMBRE_CORTO);
  }
}
function PrivilegiostemporalesComponent_option_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r3 = ctx.$implicit;
    \u0275\u0275property("value", r_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r3.nombre);
  }
}
function PrivilegiostemporalesComponent_tr_61_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function PrivilegiostemporalesComponent_tr_61_button_19_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const p_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r5 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r5.desactivar(p_r5.idSerial));
    });
    \u0275\u0275element(1, "i", 24);
    \u0275\u0275text(2, " Desactivar ");
    \u0275\u0275elementEnd();
  }
}
function PrivilegiostemporalesComponent_tr_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 21);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 21);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 21);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 21)(16, "span", 6);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td", 21);
    \u0275\u0275template(19, PrivilegiostemporalesComponent_tr_61_button_19_Template, 3, 0, "button", 22);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r5 = ctx.$implicit;
    \u0275\u0275classProp("table-success", p_r5.activo == 1)("table-secondary", p_r5.activo == 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r5.idSerial);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r5.usuario);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r5.rol_delegado);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r5.otorgado_por);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(11, 16, p_r5.fecha_inicio, "dd-MM-yyyy"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(14, 19, p_r5.fecha_fin, "dd-MM-yyyy"));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("text-success", p_r5.activo == 1)("text-danger", p_r5.activo == 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", p_r5.activo ? "S\xED" : "No", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", p_r5.activo);
  }
}
var PrivilegiostemporalesComponent = class _PrivilegiostemporalesComponent {
  userService;
  page = 1;
  minDate = "";
  usuarioActual = {};
  // para guardar el nombre del usuario logueado
  privilegios = [];
  usuarios = [];
  // Lista de usuarios
  roles = [];
  nuevoPrivilegio = {
    usuario_id: null,
    otorgado_por: null,
    rol_delegado_id: null,
    fecha_inicio: "",
    fecha_fin: "",
    usuario: ""
  };
  constructor(userService) {
    this.userService = userService;
  }
  ngOnInit() {
    const hoy = /* @__PURE__ */ new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    this.minDate = `${yyyy}-${mm}-${dd}`;
    this.cargarPrivilegios();
    this.cargarUsuarios();
    this.cargarRoles();
  }
  cargarUsuarios() {
    this.userService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error(err)
    });
  }
  cargarRoles() {
    this.userService.getRol().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error(err)
    });
  }
  cargarPrivilegios() {
    this.userService.obtenerTodos().subscribe({
      next: (data) => this.privilegios = data,
      error: (err) => console.error(err)
    });
  }
  otorgar() {
    this.nuevoPrivilegio.usuario = this.userService.getUsername();
    this.userService.otorgarPrivilegio(this.nuevoPrivilegio).subscribe({
      next: (res) => {
        import_sweetalert23.default.fire("\u2705 \xC9xito", res.message, "success");
        this.cargarPrivilegios();
      },
      error: (err) => import_sweetalert23.default.fire("\u274C Error", "No se pudo otorgar el privilegio", "error")
    });
  }
  desactivar(id) {
    import_sweetalert23.default.fire({
      title: "\xBFDesactivar privilegio?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "S\xED, desactivar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.desactivarPrivilegio(id).subscribe({
          next: (res) => {
            import_sweetalert23.default.fire("\u2705 Desactivado", res.message, "success");
            this.cargarPrivilegios();
          },
          error: (err) => import_sweetalert23.default.fire("\u274C Error", "No se pudo desactivar", "error")
        });
      }
    });
  }
  static \u0275fac = function PrivilegiostemporalesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PrivilegiostemporalesComponent)(\u0275\u0275directiveInject(UserService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PrivilegiostemporalesComponent, selectors: [["app-privilegiostemporales"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 63, vars: 16, consts: [[1, "container-fluid", "mt-4"], [1, "container"], [1, "card", "mb-4", "p-3"], [3, "ngSubmit"], [1, "row", "g-2"], [1, "col-md-3"], [1, "fw-bold"], ["name", "rol_delegado_id", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["value", "", "disabled", "", "selected", ""], [3, "value", 4, "ngFor", "ngForOf"], ["name", "usuario_id", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "col-md-2"], ["type", "date", "name", "fecha_inicio", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel", "min"], ["type", "date", "name", "fecha_fin", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel", "min"], [1, "mt-3", "text-end"], [1, "btn", "btn-primary"], [1, "table-responsive"], [1, "table", "table-striped", "table-bordered", "table-hover", "table-sm", "align-middle"], [1, "table-primary", "text-center"], [3, "table-success", "table-secondary", 4, "ngFor", "ngForOf"], [3, "value"], [1, "text-center"], ["class", "btn btn-sm btn-danger", 3, "click", 4, "ngIf"], [1, "btn", "btn-sm", "btn-danger", 3, "click"], [1, "bi", "bi-x-circle"]], template: function PrivilegiostemporalesComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h3");
      \u0275\u0275text(3, "Gesti\xF3n de Privilegios Temporales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 2)(5, "form", 3);
      \u0275\u0275listener("ngSubmit", function PrivilegiostemporalesComponent_Template_form_ngSubmit_5_listener() {
        return ctx.otorgar();
      });
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "label", 6);
      \u0275\u0275text(9, "De:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "select", 7);
      \u0275\u0275twoWayListener("ngModelChange", function PrivilegiostemporalesComponent_Template_select_ngModelChange_10_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.nuevoPrivilegio.otorgado_por, $event) || (ctx.nuevoPrivilegio.otorgado_por = $event);
        return $event;
      });
      \u0275\u0275elementStart(11, "option", 8);
      \u0275\u0275text(12, "Selecciona Usuario");
      \u0275\u0275elementEnd();
      \u0275\u0275template(13, PrivilegiostemporalesComponent_option_13_Template, 2, 2, "option", 9);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div", 5)(15, "label", 6);
      \u0275\u0275text(16, "A :");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "select", 10);
      \u0275\u0275twoWayListener("ngModelChange", function PrivilegiostemporalesComponent_Template_select_ngModelChange_17_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.nuevoPrivilegio.usuario_id, $event) || (ctx.nuevoPrivilegio.usuario_id = $event);
        return $event;
      });
      \u0275\u0275elementStart(18, "option", 8);
      \u0275\u0275text(19, "Selecciona un usuario");
      \u0275\u0275elementEnd();
      \u0275\u0275template(20, PrivilegiostemporalesComponent_option_20_Template, 2, 2, "option", 9);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "div", 11)(22, "label", 6);
      \u0275\u0275text(23, "Seleccionar Rol:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "select", 7);
      \u0275\u0275twoWayListener("ngModelChange", function PrivilegiostemporalesComponent_Template_select_ngModelChange_24_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.nuevoPrivilegio.rol_delegado_id, $event) || (ctx.nuevoPrivilegio.rol_delegado_id = $event);
        return $event;
      });
      \u0275\u0275elementStart(25, "option", 8);
      \u0275\u0275text(26, "Selecciona un rol");
      \u0275\u0275elementEnd();
      \u0275\u0275template(27, PrivilegiostemporalesComponent_option_27_Template, 2, 2, "option", 9);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "div", 11)(29, "label", 6);
      \u0275\u0275text(30, "Fecha Inicio:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "input", 12);
      \u0275\u0275twoWayListener("ngModelChange", function PrivilegiostemporalesComponent_Template_input_ngModelChange_31_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.nuevoPrivilegio.fecha_inicio, $event) || (ctx.nuevoPrivilegio.fecha_inicio = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "div", 11)(33, "label", 6);
      \u0275\u0275text(34, "Fecha Fin:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "input", 13);
      \u0275\u0275twoWayListener("ngModelChange", function PrivilegiostemporalesComponent_Template_input_ngModelChange_35_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.nuevoPrivilegio.fecha_fin, $event) || (ctx.nuevoPrivilegio.fecha_fin = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(36, "div", 14)(37, "button", 15);
      \u0275\u0275text(38, "Otorgar privilegio");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(39, "div", 1)(40, "div", 16)(41, "table", 17)(42, "thead", 18)(43, "tr")(44, "th");
      \u0275\u0275text(45, "ID");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "th");
      \u0275\u0275text(47, "Usuario");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "th");
      \u0275\u0275text(49, "Rol delegado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "th");
      \u0275\u0275text(51, "Otorgado por");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "th");
      \u0275\u0275text(53, "Inicio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "th");
      \u0275\u0275text(55, "Fin");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "th");
      \u0275\u0275text(57, "Activo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "th");
      \u0275\u0275text(59, "Acci\xF3n");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(60, "tbody");
      \u0275\u0275template(61, PrivilegiostemporalesComponent_tr_61_Template, 20, 22, "tr", 19);
      \u0275\u0275pipe(62, "paginate");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.nuevoPrivilegio.otorgado_por);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.usuarios);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.nuevoPrivilegio.usuario_id);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.usuarios);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.nuevoPrivilegio.rol_delegado_id);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.roles);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.nuevoPrivilegio.fecha_inicio);
      \u0275\u0275property("min", ctx.minDate);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.nuevoPrivilegio.fecha_fin);
      \u0275\u0275property("min", ctx.minDate);
      \u0275\u0275advance(26);
      \u0275\u0275property("ngForOf", \u0275\u0275pipeBind2(62, 11, ctx.privilegios, \u0275\u0275pureFunction1(14, _c02, ctx.page)));
    }
  }, dependencies: [
    FormsModule,
    \u0275NgNoValidate,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    NgModel,
    NgForm,
    DatePipe,
    NgForOf,
    NgIf,
    NgxPaginationModule,
    PaginatePipe
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PrivilegiostemporalesComponent, { className: "PrivilegiostemporalesComponent", filePath: "src\\app\\modulos\\usuarios\\pages\\privilegiostemporales\\privilegiostemporales.component.ts", lineNumber: 21 });
})();

// src/app/modulos/usuarios/usuarios.routes.ts
var USUARIOS_ROUTES = [
  {
    path: "",
    component: ListarComponent,
    data: {
      breadcrumb: "Lista de Usuarios"
    }
  },
  {
    path: "createusuario",
    component: CreateComponent,
    data: { breadcrumb: "Crear Usuarios" }
  },
  {
    path: "privilegios-temporales",
    component: PrivilegiostemporalesComponent,
    data: { breadcrumb: "Privilegios Temporales" }
  }
];
export {
  USUARIOS_ROUTES
};
//# sourceMappingURL=chunk-RXHBIPAK.js.map
