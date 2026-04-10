import {
  MENU_CONFIG
} from "./chunk-SA3JJLRU.js";
import {
  AuthserviceService
} from "./chunk-3TA73A5V.js";
import {
  UserService
} from "./chunk-UHCEN6B7.js";
import {
  Router
} from "./chunk-IMONGHQ7.js";
import "./chunk-LTPV2N3O.js";
import "./chunk-K2LMSEX6.js";
import {
  NgClass,
  NgForOf,
  NgIf,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-KOB7DKR4.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WYLQU5MV.js";

// src/app/index/dashboard/dashboard.component.ts
function DashboardComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "p");
    \u0275\u0275text(2, "Cargando m\xF3dulos...");
    \u0275\u0275elementEnd()();
  }
}
function DashboardComponent_div_5_div_1_div_5_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275listener("click", function DashboardComponent_div_5_div_1_div_5_button_1_Template_button_click_0_listener() {
      const sub_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(sub_r5.route && ctx_r2.irARuta(sub_r5.route));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", sub_r5.title, " ");
  }
}
function DashboardComponent_div_5_div_1_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275template(1, DashboardComponent_div_5_div_1_div_5_button_1_Template, 2, 1, "button", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", item_r2.submenus);
  }
}
function DashboardComponent_div_5_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 9);
    \u0275\u0275listener("click", function DashboardComponent_div_5_div_1_Template_div_click_1_listener() {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.irARuta(item_r2.route ? item_r2.route : item_r2.submenus == null ? null : item_r2.submenus[0] == null ? null : item_r2.submenus[0].route));
    });
    \u0275\u0275element(2, "i");
    \u0275\u0275elementStart(3, "h5");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, DashboardComponent_div_5_div_1_div_5_Template, 2, 1, "div", 10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const i_r6 = ctx.index;
    \u0275\u0275property("ngClass", "size-" + i_r6 % 6);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(item_r2.icon + " fs-1 mb-2 text-primary");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r2.title);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", item_r2.submenus == null ? null : item_r2.submenus.length);
  }
}
function DashboardComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275template(1, DashboardComponent_div_5_div_1_Template, 6, 5, "div", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.filteredMenu);
  }
}
function DashboardComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "p");
    \u0275\u0275text(2, "No tienes m\xF3dulos habilitados con tu rol actual.");
    \u0275\u0275elementEnd()();
  }
}
var DashboardComponent = class _DashboardComponent {
  router;
  authService;
  userService;
  menuItems = MENU_CONFIG;
  filteredMenu = [];
  cargando = true;
  // bandera para mostrar "cargando"
  constructor(router, authService, userService) {
    this.router = router;
    this.authService = authService;
    this.userService = userService;
  }
  /* ngOnInit(): void {
    //this.filtrarMenu();
     const usuario = this.userService.getUser();
    //console.log(usuario)
   //  console.log('🔹 Filtrando menú con usuario:', this.userService.getUser());
    // console.log('🔹 Grupos actuales:', this.authService['gruposUsuario']);
     // Traer la info del usuario desde backend
     this.authService.getUserInfoFromBackend().subscribe({
        next: (data) => {
          if (data) {
            this.userService.setUser({
              username: data.username,
              rol_id: data.rol_id,
              group_id: data.group_id,
              codempleado: data.codempleado,
              empe_nom: data.empe_nom,
              empresa_id: data.empresa_id
            });
            console.log('Rol temporal activo:', data.rol_temporal);
            console.log('Rol temporal :', data);
          }
        },
        error: (err) => console.error('Error al obtener info del usuario:', err)
      });
   }*/
  ngOnInit() {
    this.authService.getUserInfoFromBackend().subscribe({
      next: (data) => {
        if (data) {
          this.authService.setUserInfo(data);
          this.filtrarMenu();
          this.cargando = false;
        }
      },
      error: (err) => {
        console.error("Error al obtener info del usuario:", err);
        this.cargando = false;
      }
    });
  }
  filtrarMenu() {
    this.filteredMenu = this.menuItems.filter((item) => this.hasAccess(item)).map((item) => __spreadProps(__spreadValues({}, item), {
      submenus: item.submenus?.filter((sub) => this.hasAccess(sub)) || []
    })).filter((item) => item.submenus?.length || item.route);
  }
  hasAccess(item) {
    const roleAllowed = !item.roles || this.authService.tieneAlgunRol(item.roles);
    const groupAllowed = !item.grupos || this.authService.tieneAlgunGrupo(item.grupos);
    return roleAllowed && groupAllowed;
  }
  irARuta(ruta) {
    if (ruta) {
      this.router.navigate([ruta]);
    }
  }
  static \u0275fac = function DashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AuthserviceService), \u0275\u0275directiveInject(UserService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 7, vars: 3, consts: [[1, "container-fluid", "mt-4"], [1, "container"], [1, "mb-4"], ["class", "text-center mt-5", 4, "ngIf"], ["class", "dashboard-grid", 4, "ngIf"], [1, "text-center", "mt-5"], [1, "dashboard-grid"], ["class", "dashboard-item", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "dashboard-item", 3, "ngClass"], [1, "card", "shadow-sm", "text-center", "p-3", "dashboard-card", 3, "click"], ["class", "mt-3", 4, "ngIf"], [1, "mt-3"], ["class", "btn btn-outline-primary btn-sm me-1 mb-1", 3, "click", 4, "ngFor", "ngForOf"], [1, "btn", "btn-outline-primary", "btn-sm", "me-1", "mb-1", 3, "click"]], template: function DashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h2", 2);
      \u0275\u0275text(3, "M\xF3dulos habilitados");
      \u0275\u0275elementEnd();
      \u0275\u0275template(4, DashboardComponent_div_4_Template, 3, 0, "div", 3)(5, DashboardComponent_div_5_Template, 2, 1, "div", 4)(6, DashboardComponent_div_6_Template, 3, 0, "div", 3);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275property("ngIf", ctx.cargando);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.cargando && ctx.filteredMenu.length);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.cargando && ctx.filteredMenu.length === 0);
    }
  }, dependencies: [
    NgForOf,
    NgIf,
    NgClass
  ], styles: ["\n\n.dashboard-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n  grid-auto-rows: minmax(140px, auto);\n  gap: 1.5rem;\n}\n.dashboard-card[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 260px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n.dashboard-card[_ngcontent-%COMP%]   .mt-3[_ngcontent-%COMP%] {\n  margin-top: auto;\n}\n.dashboard-card[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  min-width: 140px;\n}\n@media (max-width: 992px) {\n  .dashboard-item[_ngcontent-%COMP%] {\n    grid-column: span 6 !important;\n  }\n}\n@media (max-width: 576px) {\n  .dashboard-item[_ngcontent-%COMP%] {\n    grid-column: span 12 !important;\n  }\n  @media (max-width: 767px) {\n    .sidebar[_ngcontent-%COMP%] {\n      transform: translateX(-100%);\n      position: fixed;\n    }\n    .sidebar.show[_ngcontent-%COMP%] {\n      transform: translateX(0);\n    }\n    .main-container[_ngcontent-%COMP%] {\n      margin-left: 0;\n      width: 100%;\n    }\n  }\n}\n/*# sourceMappingURL=dashboard.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src\\app\\index\\dashboard\\dashboard.component.ts", lineNumber: 23 });
})();
export {
  DashboardComponent
};
//# sourceMappingURL=chunk-LAEBQ4TW.js.map
