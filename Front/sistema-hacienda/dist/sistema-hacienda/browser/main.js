import {
  MENU_CONFIG
} from "./chunk-SA3JJLRU.js";
import {
  HojasaldosService
} from "./chunk-H6H3KZHT.js";
import {
  AuthserviceService
} from "./chunk-3TA73A5V.js";
import {
  UserService
} from "./chunk-UHCEN6B7.js";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
  Title,
  bootstrapApplication,
  provideRouter,
  withHashLocation
} from "./chunk-IMONGHQ7.js";
import {
  jwtDecode
} from "./chunk-LTPV2N3O.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-2RHLRMSC.js";
import {
  environment
} from "./chunk-K2LMSEX6.js";
import {
  BehaviorSubject,
  CommonModule,
  DatePipe,
  HTTP_INTERCEPTORS,
  HttpClient,
  NgForOf,
  NgIf,
  catchError,
  filter,
  importProvidersFrom,
  provideHttpClient,
  tap,
  throwError,
  withInterceptorsFromDi,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-KOB7DKR4.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WYLQU5MV.js";

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  title = "sistema-hacienda";
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src\\app\\app.component.ts", lineNumber: 11 });
})();

// src/app/auth/login/login.component.ts
function LoginComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 23)(2, "span", 24);
    \u0275\u0275text(3, "Cargando...");
    \u0275\u0275elementEnd()()();
  }
}
function LoginComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage, " ");
  }
}
var LoginComponent = class _LoginComponent {
  auth;
  router;
  loginMessage = "";
  messageClass = "";
  // clase CSS de Bootstrap según el tipo de mensaje
  isLoading = false;
  username = "";
  password = "";
  errorMessage = "";
  invalidLogin = false;
  constructor(auth, router) {
    this.auth = auth;
    this.router = router;
  }
  onSubmit() {
    if (this.isLoading)
      return;
    this.isLoading = true;
    if (!this.username || !this.password)
      return;
    this.isLoading = true;
    this.invalidLogin = false;
    this.errorMessage = "";
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loginMessage = "Inicio de sesi\xF3n exitoso. Redirigiendo...";
        this.messageClass = "alert-success";
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        this.invalidLogin = true;
        this.isLoading = false;
        this.errorMessage = "Credenciales incorrectas";
        document.body.classList.remove("loading");
        console.error(err);
      },
      complete: () => {
        this.isLoading = false;
        document.body.classList.remove("loading");
      }
    });
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)(\u0275\u0275directiveInject(AuthserviceService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 32, vars: 11, consts: [["class", "overlay-spinner", 4, "ngIf"], [1, "login-container"], [3, "ngSubmit"], [1, "login-box"], [1, "login-form"], ["href", "index.html", 1, "login-logo"], ["src", "assets/images/SistemaHac/Logo/bananas.svg", "alt", "Vico Admin"], [1, "login-welcome"], [1, "mb-3"], [1, "form-label", "fw-bold"], ["type", "text", "id", "username", "name", "username", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "d-flex", "justify-content-between"], [1, "form-label", "fw-bolder"], ["routerLink", "/forgotpassword", 1, "btn-link", "ml-auto"], ["type", "password", "id", "password", "name", "password", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["class", "alert alert-danger text-center py-2", 4, "ngIf"], [1, "login-form-actions"], ["type", "submit", 1, "btn", 3, "disabled"], [1, "icon"], [1, "bi", "bi-arrow-right-circle"], [1, "login-form-footer"], [1, "additional-link"], [1, "overlay-spinner"], ["role", "status", 1, "spinner-border", "text-primary", 2, "width", "4rem", "height", "4rem"], [1, "visually-hidden"], [1, "alert", "alert-danger", "text-center", "py-2"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, LoginComponent_div_0_Template, 4, 0, "div", 0);
      \u0275\u0275elementStart(1, "div", 1)(2, "form", 2);
      \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_2_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(3, "div", 3)(4, "div", 4)(5, "a", 5);
      \u0275\u0275element(6, "img", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 7)(8, "b");
      \u0275\u0275text(9, " Bienvenido, ");
      \u0275\u0275element(10, "br");
      \u0275\u0275text(11, "Por favor ingrese credenciales.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "div", 8)(13, "label", 9);
      \u0275\u0275text(14, "Username");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "input", 10);
      \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Template_input_ngModelChange_15_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.username, $event) || (ctx.username = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 8)(17, "div", 11)(18, "label", 12);
      \u0275\u0275text(19, "Password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "a", 13);
      \u0275\u0275text(21, "Forgot password?");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "input", 14);
      \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Template_input_ngModelChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.password, $event) || (ctx.password = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(23, LoginComponent_div_23_Template, 2, 1, "div", 15);
      \u0275\u0275elementStart(24, "div", 16)(25, "button", 17)(26, "span", 18);
      \u0275\u0275element(27, "i", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275text(28, " Login ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "div", 20)(30, "div", 21);
      \u0275\u0275text(31, " Si no puedes ingresar contacte a Sistemas ");
      \u0275\u0275elementEnd()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.isLoading);
      \u0275\u0275advance();
      \u0275\u0275classProp("opacity-50", ctx.isLoading);
      \u0275\u0275advance(14);
      \u0275\u0275classProp("input-error", ctx.invalidLogin);
      \u0275\u0275twoWayProperty("ngModel", ctx.username);
      \u0275\u0275advance(7);
      \u0275\u0275classProp("input-error", ctx.invalidLogin);
      \u0275\u0275twoWayProperty("ngModel", ctx.password);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.invalidLogin);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.isLoading);
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, CommonModule, NgIf, RouterLink], styles: ["\n\n.input-error[_ngcontent-%COMP%] {\n  border: 1px solid #dc3545;\n  background-color: #f8d7da;\n}\n.error-message[_ngcontent-%COMP%] {\n  color: #dc3545;\n  font-weight: 500;\n  margin-top: 10px;\n  background-color: #f8d7da;\n  border: 1px solid #dc3545;\n  padding: 8px;\n  border-radius: 4px;\n}\n.overlay-spinner[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background-color: rgba(255, 255, 255, 0.6);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 1050;\n}\ninput[_ngcontent-%COMP%]:-webkit-autofill {\n  -webkit-box-shadow: 0 0 0px 1000px white inset !important;\n  box-shadow: 0 0 0px 1000px white inset !important;\n  -webkit-text-fill-color: #000 !important;\n  transition: background-color 5000s ease-in-out 0s;\n}\n/*# sourceMappingURL=login.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src\\app\\auth\\login\\login.component.ts", lineNumber: 14 });
})();

// src/app/auth/auth.guard.ts
var AuthGuard = class _AuthGuard {
  authService;
  router;
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
  }
  /* canActivate(): Observable<boolean> {
     return this.authService.isLoggedIn().pipe(
       map(loggedIn => {
         if (!loggedIn) {
           this.router.navigate(['/login']);
           return false;
         }
         return true;
       })
     );
   }*/
  canActivate() {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(["/login"]);
      return false;
    }
    return true;
  }
  static \u0275fac = function AuthGuard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthGuard)(\u0275\u0275inject(AuthserviceService), \u0275\u0275inject(Router));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthGuard, factory: _AuthGuard.\u0275fac, providedIn: "root" });
};

// src/app/services/menu.service.ts
var MenuService = class _MenuService {
  router;
  service;
  // Subject emitting the breadcrumb hierarchy
  _breadcrumbs$ = new BehaviorSubject([]);
  // Observable exposing the breadcrumb hierarchy
  breadcrumbs$ = this._breadcrumbs$.asObservable();
  constructor(router, service) {
    this.router = router;
    this.service = service;
    this.router.events.pipe(
      // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const root = this.router.routerState.snapshot.root;
      const breadcrumbs = [];
      this.addBreadcrumb(root, [], breadcrumbs);
      this._breadcrumbs$.next(breadcrumbs);
    });
  }
  addBreadcrumb(route, parentUrl, breadcrumbs) {
    if (route) {
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
      if (route.data["breadcrumb"]) {
        const breadcrumb = {
          label: this.getLabel(route.data),
          url: "/" + routeUrl.join("/")
        };
        breadcrumbs.push(breadcrumb);
      }
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }
  getLabel(data) {
    return typeof data["breadcrumb"] === "function" ? data["breadcrumb"](data) : data["breadcrumb"];
  }
  // ✅ Versión final con tipos string[]
  /*  getMenuByUser(): MenuItem[] {
      return MENU_CONFIG
        .filter(item =>
          this.service.tieneAlgunRol(item.roles || []) &&
          this.service.tieneAlgunGrupo(item.grupos || [])
        )
        .map(item => ({
          ...item,
          submenus: item.submenus?.filter(sub =>
            this.service.tieneAlgunRol(sub.roles || []) &&
            this.service.tieneAlgunGrupo(sub.grupos || [])
          ) || []
        }));
    }*/
  getMenuByUser() {
    return MENU_CONFIG;
  }
  static \u0275fac = function MenuService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MenuService)(\u0275\u0275inject(Router), \u0275\u0275inject(AuthserviceService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MenuService, factory: _MenuService.\u0275fac, providedIn: "root" });
};

// src/app/index/header/header.component.ts
function HeaderComponent_ol_6_li_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "a", 23);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const breadcrumb_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", breadcrumb_r1.url);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(breadcrumb_r1.label);
  }
}
function HeaderComponent_ol_6_li_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const breadcrumb_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", breadcrumb_r1.label, " ");
  }
}
function HeaderComponent_ol_6_li_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 2);
    \u0275\u0275template(1, HeaderComponent_ol_6_li_1_ng_container_1_Template, 3, 2, "ng-container", 22)(2, HeaderComponent_ol_6_li_1_ng_container_2_Template, 2, 1, "ng-container", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const last_r2 = ctx.last;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !last_r2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", last_r2);
  }
}
function HeaderComponent_ol_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ol", 1);
    \u0275\u0275template(1, HeaderComponent_ol_6_li_1_Template, 3, 2, "li", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.breadcrumbs);
  }
}
var HeaderComponent = class _HeaderComponent {
  userService;
  menuService;
  authService;
  router;
  route;
  breadcrumbService;
  username = "";
  menuItems = [];
  userRole = 0;
  userGroup = 0;
  breadcrumbs$;
  breadcrumbs = [];
  //nuevo breadcrumbs
  isSidebarVisible = false;
  constructor(userService, menuService, authService, router, route, breadcrumbService) {
    this.userService = userService;
    this.menuService = menuService;
    this.authService = authService;
    this.router = router;
    this.route = route;
    this.breadcrumbService = breadcrumbService;
  }
  ngOnInit() {
    console.log("HeaderComponent cargado");
    this.username = this.userService.getUsername() ?? "";
    this.userRole = Number(this.userService.getRolId()) || 0;
    this.userGroup = Number(this.userService.getGroupId()) || 0;
    this.menuItems = this.menuService.getMenuByUser();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      console.log("navegacion completada");
      this.breadcrumbs = [];
      let currentRoute = this.route.root;
      while (currentRoute.children.length > 0) {
        currentRoute = currentRoute.children[0];
        const breadcrumbData = currentRoute.snapshot.data["breadcrumb"];
        if (breadcrumbData) {
          const url = this.getUrl(currentRoute);
          this.breadcrumbs.push({ label: breadcrumbData, url });
        }
      }
    });
  }
  getUrl(route) {
    let url = "";
    let parentRoute = route.parent;
    while (parentRoute) {
      if (parentRoute.snapshot.url.length > 0) {
        url = "/" + parentRoute.snapshot.url.map((segment) => segment.path).join("/") + url;
      }
      parentRoute = parentRoute.parent;
    }
    return url;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
  static \u0275fac = function HeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeaderComponent)(\u0275\u0275directiveInject(UserService), \u0275\u0275directiveInject(MenuService), \u0275\u0275directiveInject(AuthserviceService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(MenuService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HeaderComponent, selectors: [["app-header"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 28, vars: 2, consts: [[1, "page-header"], [1, "breadcrumb"], [1, "breadcrumb-item", "breadcrumb-active"], [1, "bi", "bi-house"], ["routerLink", "/dashboard"], ["class", "breadcrumb ", 4, "ngIf"], [1, "header-actions-container"], [1, "search-container"], [1, "header-actions"], [1, "fw-bolder", "text-center", "text-primary-emphasis"], [1, "dropdown"], ["href", "#", "id", "userSettings", "data-toggle", "dropdown", "aria-haspopup", "true", 1, "user-settings"], [1, "user-name", "d-none", "d-md-block"], [1, "avatar"], ["src", "assets/images/SistemaHac/Logo/user.svg", "alt", "Admin "], [1, "status", "online"], ["aria-labelledby", "userSettings", 1, "dropdown-menu", "dropdown-menu-end"], [1, "header-profile-actions"], ["href", "profile.html"], ["href", "account-settings.html"], [3, "click"], ["class", "breadcrumb-item breadcrumb-active", 4, "ngFor", "ngForOf"], [4, "ngIf"], [3, "routerLink"]], template: function HeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "li", 2);
      \u0275\u0275element(3, "i", 3);
      \u0275\u0275elementStart(4, "a", 4);
      \u0275\u0275text(5, "Home > ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(6, HeaderComponent_ol_6_Template, 2, 1, "ol", 5);
      \u0275\u0275elementStart(7, "div", 6);
      \u0275\u0275element(8, "div", 7);
      \u0275\u0275elementStart(9, "div", 6)(10, "ul", 8)(11, "p", 9);
      \u0275\u0275text(12, " Bienvenido: ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "li", 10)(14, "a", 11)(15, "span", 12);
      \u0275\u0275text(16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "span", 13);
      \u0275\u0275element(18, "img", 14)(19, "span", 15);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 16)(21, "div", 17)(22, "a", 18);
      \u0275\u0275text(23, "Profile");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "a", 19);
      \u0275\u0275text(25, "Settings");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "a", 20);
      \u0275\u0275listener("click", function HeaderComponent_Template_a_click_26_listener() {
        return ctx.logout();
      });
      \u0275\u0275text(27, "Logout");
      \u0275\u0275elementEnd()()()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("ngIf", ctx.breadcrumbs.length > 0);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.username);
    }
  }, dependencies: [
    RouterLink,
    NgIf,
    NgForOf
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HeaderComponent, { className: "HeaderComponent", filePath: "src\\app\\index\\header\\header.component.ts", lineNumber: 24 });
})();

// src/app/index/sidebar/sidebar.component.ts
function SidebarComponent_li_7_div_5_li_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a", 13);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const submenu_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", submenu_r4.route);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(submenu_r4.title);
  }
}
function SidebarComponent_li_7_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "ul");
    \u0275\u0275template(2, SidebarComponent_li_7_div_5_li_2_Template, 3, 2, "li", 12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", item_r2.submenus);
  }
}
function SidebarComponent_li_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 7)(1, "a", 8);
    \u0275\u0275listener("click", function SidebarComponent_li_7_Template_a_click_1_listener() {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toggleDropdown(item_r2));
    });
    \u0275\u0275element(2, "i");
    \u0275\u0275elementStart(3, "span", 9);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(5, SidebarComponent_li_7_div_5_Template, 3, 1, "div", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    \u0275\u0275classProp("active", item_r2.active);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(item_r2.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r2.title);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", item_r2.submenus && item_r2.submenus.length);
  }
}
var SidebarComponent = class _SidebarComponent {
  authService;
  menuItems = [];
  sidebarVisible = false;
  filteredMenu = [];
  constructor(authService) {
    this.authService = authService;
  }
  ngOnInit() {
    this.authService.getUserInfoFromBackend().subscribe({
      next: (data) => {
        if (data) {
          this.authService.setUserInfo(data);
          this.filtrarMenu();
        }
      },
      error: (err) => {
        console.error("Error al obtener info del usuario:", err);
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
  toggleDropdown(item) {
    this.filteredMenu.forEach((i) => {
      if (i !== item)
        i.active = false;
    });
    item.active = !item.active;
  }
  static \u0275fac = function SidebarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarComponent)(\u0275\u0275directiveInject(AuthserviceService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SidebarComponent, selectors: [["app-sidebar"]], inputs: { menuItems: "menuItems", sidebarVisible: "sidebarVisible" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 8, vars: 3, consts: [[1, "sidebar-wrapper"], [1, "sidebar-brand"], ["routerLink", "/dashboard", 1, "logo"], ["src", "assets/images/SistemaHac/Logo/letter-v.svg", "alt", "Melon Admin Dashboard"], [1, "sidebar-menu"], [1, "sidebarMenuScroll"], ["class", "sidebar-dropdown", 3, "active", 4, "ngFor", "ngForOf"], [1, "sidebar-dropdown"], ["href", "javascript:void(0)", 3, "click"], [1, "menu-text"], ["class", "sidebar-submenu", 4, "ngIf"], [1, "sidebar-submenu"], [4, "ngFor", "ngForOf"], ["routerLinkActive", "current-page", 3, "routerLink"]], template: function SidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "nav", 0)(1, "div", 1)(2, "a", 2);
      \u0275\u0275element(3, "img", 3);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "ul");
      \u0275\u0275template(7, SidebarComponent_li_7_Template, 6, 6, "li", 6);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("visible", ctx.sidebarVisible);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngForOf", ctx.filteredMenu);
    }
  }, dependencies: [
    RouterLink,
    NgForOf,
    NgIf
  ], styles: ["\n\n/*# sourceMappingURL=sidebar.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SidebarComponent, { className: "SidebarComponent", filePath: "src\\app\\index\\sidebar\\sidebar.component.ts", lineNumber: 24 });
})();

// src/app/index/index/index.component.ts
var IndexComponent = class _IndexComponent {
  userService;
  menuService;
  username = "";
  menuItems = [];
  userRole = 0;
  userGroup = 0;
  isSidebarVisible = false;
  constructor(userService, menuService) {
    this.userService = userService;
    this.menuService = menuService;
  }
  ngOnInit() {
    this.username = this.userService.getUsername() ?? "";
    this.userRole = Number(this.userService.getRolId()) || 0;
    this.userGroup = Number(this.userService.getGroupId()) || 0;
    this.menuItems = this.menuService.getMenuByUser();
  }
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  static \u0275fac = function IndexComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IndexComponent)(\u0275\u0275directiveInject(UserService), \u0275\u0275directiveInject(MenuService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _IndexComponent, selectors: [["app-index"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 4, consts: [[1, "page-wrapper"], [3, "menuItems", "sidebarVisible"], [1, "main-container"]], template: function IndexComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "app-sidebar", 1);
      \u0275\u0275elementStart(2, "div", 2);
      \u0275\u0275element(3, "app-header")(4, "router-outlet");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("menuItems", ctx.menuItems)("sidebarVisible", ctx.isSidebarVisible);
      \u0275\u0275advance();
      \u0275\u0275classProp("sidebar-visble", ctx.isSidebarVisible);
    }
  }, dependencies: [HeaderComponent, SidebarComponent, RouterOutlet] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(IndexComponent, { className: "IndexComponent", filePath: "src\\app\\index\\index\\index.component.ts", lineNumber: 16 });
})();

// src/app/auth/role.guard.ts
var RoleGuard = class _RoleGuard {
  permisosService;
  router;
  constructor(permisosService, router) {
    this.permisosService = permisosService;
    this.router = router;
  }
  canActivate(route) {
    const gruposPermitidos = route.data["grupos"];
    if (!gruposPermitidos) {
      return true;
    }
    if (this.permisosService.tieneAlgunGrupo(gruposPermitidos)) {
      return true;
    }
    return this.router.createUrlTree(["/acceso-denegado"]);
  }
  static \u0275fac = function RoleGuard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RoleGuard)(\u0275\u0275inject(AuthserviceService), \u0275\u0275inject(Router));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RoleGuard, factory: _RoleGuard.\u0275fac, providedIn: "root" });
};

// src/app/shared/imprimir/imprimir.component.ts
function ImprimirComponent_div_3_tr_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.lote);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.codigo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.cantidad);
  }
}
function ImprimirComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 5);
    \u0275\u0275element(2, "img", 6);
    \u0275\u0275elementStart(3, "div")(4, "h2");
    \u0275\u0275text(5, "REPORTE SEMANAL");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7, "Matas Caidas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 7)(9, "p")(10, "strong");
    \u0275\u0275text(11, "Semana:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p")(14, "strong");
    \u0275\u0275text(15, "A\xF1o:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p")(18, "strong");
    \u0275\u0275text(19, "Empleado:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "p")(22, "strong");
    \u0275\u0275text(23, "Hacienda:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "p")(26, "strong");
    \u0275\u0275text(27, "Fecha:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(30, "hr");
    \u0275\u0275elementStart(31, "table", 8)(32, "thead")(33, "tr")(34, "th");
    \u0275\u0275text(35, "Lote");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "th");
    \u0275\u0275text(37, "C\xF3digo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "th");
    \u0275\u0275text(39, "Cantidad");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(40, "tbody");
    \u0275\u0275template(41, ImprimirComponent_div_3_tr_41_Template, 7, 3, "tr", 9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 10)(43, "p");
    \u0275\u0275text(44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "p");
    \u0275\u0275text(46);
    \u0275\u0275pipe(47, "date");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate1(" ", ctx_r1.datos.cabecera.semana, "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.datos.cabecera.anio, "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.datos.cabecera.user, "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.datos.cabecera.nombrehacienda, "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(29, 8, ctx_r1.datos.cabecera.created_at, "longDate"), "");
    \u0275\u0275advance(13);
    \u0275\u0275property("ngForOf", ctx_r1.datos.detalle);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Usuario:", ctx_r1.datos.cabecera.user, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Generado el ", \u0275\u0275pipeBind2(47, 11, ctx_r1.today, "short"), "");
  }
}
var ImprimirComponent = class _ImprimirComponent {
  route;
  imprimirService;
  title;
  today = /* @__PURE__ */ new Date();
  id;
  datos = {
    cabecera: {},
    detalle: []
  };
  constructor(route, imprimirService, title) {
    this.route = route;
    this.imprimirService = imprimirService;
    this.title = title;
  }
  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    const original = this.title.getTitle();
    this.title.setTitle("Reporte de Matas Caidas");
    this.imprimirService.imprimirPorId(this.id).subscribe({
      next: (resp) => {
        this.datos = resp;
        setTimeout(() => {
          window.print();
          this.title.setTitle(original);
        }, 300);
      },
      error: () => {
        alert("No se pudo cargar la informaci\xF3n");
      }
    });
  }
  static \u0275fac = function ImprimirComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ImprimirComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(HojasaldosService), \u0275\u0275directiveInject(Title));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ImprimirComponent, selectors: [["app-imprimir"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 4, vars: 1, consts: [[1, "container-fluid", "mt-0"], [1, "container-fluid"], [1, "print-columns"], ["class", "print-item", 4, "ngIf"], [1, "print-item"], [1, "print-header"], ["src", "assets/images/star-selected.svg", "alt", "Logo", 1, "logo"], [1, "print-info"], [1, "print-table"], [4, "ngFor", "ngForOf"], [1, "print-footer"]], template: function ImprimirComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
      \u0275\u0275template(3, ImprimirComponent_div_3_Template, 48, 14, "div", 3);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.datos.detalle.length > 0);
    }
  }, dependencies: [
    NgForOf,
    DatePipe,
    NgIf
  ], styles: ["\n\n.print-container[_ngcontent-%COMP%] {\n  font-family: Arial, sans-serif;\n  color: #000;\n}\n.print-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n}\n.logo[_ngcontent-%COMP%] {\n  width: 70px;\n}\n.print-info[_ngcontent-%COMP%] {\n  margin: 15px 0;\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n}\n.print-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  margin-top: 15px;\n}\n.print-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.print-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  border: 1px solid #000;\n  padding: 6px;\n  text-align: left;\n}\n.print-footer[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  font-size: 12px;\n  text-align: right;\n}\n@media print {\n  @page {\n    size: A4 landscape;\n    margin: 10mm;\n  }\n  body[_ngcontent-%COMP%] {\n    padding: 0;\n    margin: 0;\n  }\n  body[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n    visibility: hidden;\n  }\n  .print-columns[_ngcontent-%COMP%] {\n    column-count: 2;\n    column-gap: 10mm;\n  }\n  .print-item[_ngcontent-%COMP%] {\n    break-inside: avoid;\n  }\n  .print-container[_ngcontent-%COMP%], \n   .print-container[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n    visibility: visible;\n  }\n  .print-container[_ngcontent-%COMP%] {\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 100%;\n  }\n  button[_ngcontent-%COMP%] {\n    display: none !important;\n  }\n}\n/*# sourceMappingURL=imprimir.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ImprimirComponent, { className: "ImprimirComponent", filePath: "src\\app\\shared\\imprimir\\imprimir.component.ts", lineNumber: 19 });
})();

// src/app/auth/forgotpassword/forgotpassword.component.ts
var ForgotpasswordComponent = class _ForgotpasswordComponent {
  static \u0275fac = function ForgotpasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ForgotpasswordComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ForgotpasswordComponent, selectors: [["app-forgotpassword"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 19, vars: 0, consts: [[1, "login-container"], [1, "login-box"], [1, "login-form"], ["routerLink", "/login", 1, "login-logo"], ["src", "assets/images/SistemaHac/Logo/bananas.svg", "alt", "Vico Admin"], [1, "login-welcome"], [1, "mb-3"], [1, "form-label"], ["type", "email", "placeholder", "Enter your email", 1, "form-control"], [1, "login-form-actions"], ["type", "submit", 1, "btn"], [1, "icon"], [1, "bi", "bi-arrow-right-circle"]], template: function ForgotpasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "form")(2, "div", 1)(3, "div", 2)(4, "a", 3);
      \u0275\u0275element(5, "img", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 5);
      \u0275\u0275text(7, " In order to access your Vivo account,");
      \u0275\u0275element(8, "br");
      \u0275\u0275text(9, "please enter the email id you provided during the registration process. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 6)(11, "label", 7);
      \u0275\u0275text(12, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275element(13, "input", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 9)(15, "button", 10)(16, "span", 11);
      \u0275\u0275element(17, "i", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275text(18, " Submit");
      \u0275\u0275elementEnd()()()()()();
    }
  }, dependencies: [RouterLink] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ForgotpasswordComponent, { className: "ForgotpasswordComponent", filePath: "src\\app\\auth\\forgotpassword\\forgotpassword.component.ts", lineNumber: 13 });
})();

// src/app/app.routes.ts
var routes = [
  { path: "login", component: LoginComponent },
  { path: "forgotpassword", component: ForgotpasswordComponent },
  {
    path: "",
    component: IndexComponent,
    canActivate: [AuthGuard],
    children: [
      // ?? RUTA POR DEFECTO
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        loadComponent: () => import("./chunk-LAEBQ4TW.js").then((m) => m.DashboardComponent),
        data: { title: "Dashboard" }
      },
      {
        path: "usuarios",
        loadChildren: () => import("./chunk-RXHBIPAK.js").then((m) => m.USUARIOS_ROUTES),
        canActivate: [RoleGuard],
        data: { grupos: ["administradores", "sistemas"], title: "Usuarios" }
      },
      {
        path: "balanza",
        loadChildren: () => import("./chunk-PKRYOLWU.js").then((m) => m.HOJASALDOS_ROUTES),
        canActivate: [RoleGuard],
        data: {
          title: "Balanza",
          breadcrumb: "Balanza"
        }
      },
      {
        path: "estadisticas",
        loadChildren: () => import("./chunk-JME4OWDR.js").then((m) => m.ESTADISCITCAS_ROUTES),
        canActivate: [RoleGuard],
        data: {
          title: "Estadisticas",
          breadcrumb: "Estadisticas"
        }
      },
      {
        path: "asistencia",
        loadChildren: () => import("./chunk-WQQYMOZB.js").then((m) => m.ASISTENCIA_ROUTES),
        canActivate: [RoleGuard],
        data: {
          title: "Asistencia General",
          breadcrumb: "Asistencia General"
        }
      },
      {
        path: "bodegas",
        loadChildren: () => import("./chunk-AZH54J6A.js").then((m) => m.BODEGAS_ROUTES),
        canActivate: [RoleGuard],
        data: {
          title: "Bodegas"
        }
      }
    ]
  },
  { path: "imprimir/:id", component: ImprimirComponent },
  {
    path: "**",
    loadComponent: () => import("./chunk-OSO4AE3F.js").then((m) => m.NotFoundComponent),
    data: { title: "P\xE1gina no encontrada" }
  }
];

// src/app/auth/user.service.ts
var UserService2 = class _UserService {
  user = null;
  setUserFromToken(token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    this.user = {
      username: payload.username,
      codempleado: payload.codempleado,
      rol_id: payload.rol_id,
      group_id: payload.group_id
    };
  }
  setUser(user) {
    this.user = user;
  }
  getUser() {
    return this.user;
  }
  getUsername() {
    return this.user?.username ?? "Invitado";
  }
  getCodEmpleado() {
    return this.user?.codempleado ?? 0;
  }
  getRolId() {
    return this.user?.rol_id ?? 0;
  }
  getGroupId() {
    return this.user?.group_id ?? 0;
  }
  clearUser() {
    this.user = null;
  }
  isAuthenticated() {
    return !!this.user;
  }
  static \u0275fac = function UserService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UserService, factory: _UserService.\u0275fac, providedIn: "root" });
};

// src/app/auth/authservice.service.ts
var AuthserviceService2 = class _AuthserviceService {
  http;
  userService;
  baseUrl = environment.apiUrl;
  tokenKey = "access_token";
  loggedIn = new BehaviorSubject(this.hasToken());
  constructor(http, userService) {
    this.http = http;
    this.userService = userService;
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.userService.setUser({
          username: decoded.username,
          rol_id: decoded.rol_id,
          group_id: decoded.group_id,
          codempleado: decoded.codempleado
        });
      } catch (e) {
        console.error("Error al decodificar token en constructor", e);
        this.userService.clearUser();
      }
    }
  }
  login(username, password) {
    return this.http.post(`${this.baseUrl}/auth/login`, { username, password }).pipe(tap((response) => {
      localStorage.setItem(this.tokenKey, response.access_token);
      this.loggedIn.next(true);
      const decoded = jwtDecode(response.access_token);
      this.userService.setUser({
        username: decoded.username,
        rol_id: decoded.rol_id,
        group_id: decoded.group_id,
        codempleado: decoded.codempleado
      });
    }));
  }
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
    this.userService.clearUser();
  }
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
  hasToken() {
    return !!localStorage.getItem(this.tokenKey);
  }
  clearSession() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }
  static \u0275fac = function AuthserviceService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthserviceService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(UserService2));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthserviceService, factory: _AuthserviceService.\u0275fac, providedIn: "root" });
};

// src/app/auth/jwt.interceptor.ts
var JwtInterceptor = class _JwtInterceptor {
  auth;
  router;
  handling401 = false;
  constructor(auth, router) {
    this.auth = auth;
    this.router = router;
  }
  intercept(req, next) {
    const token = this.auth.getToken();
    const authReq = token ? req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }) : req;
    return next.handle(authReq).pipe(catchError((error) => {
      if (error.status === 401 && !this.handling401) {
        this.handling401 = true;
        this.auth.clearSession();
        this.router.navigateByUrl("/login");
      }
      return throwError(() => error);
    }));
  }
  static \u0275fac = function JwtInterceptor_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _JwtInterceptor)(\u0275\u0275inject(AuthserviceService2), \u0275\u0275inject(Router));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _JwtInterceptor, factory: _JwtInterceptor.\u0275fac });
};

// src/main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(FormsModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ]
});
//# sourceMappingURL=main.js.map
