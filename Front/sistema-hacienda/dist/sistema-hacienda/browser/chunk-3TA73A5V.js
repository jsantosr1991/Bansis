import {
  UserService
} from "./chunk-UHCEN6B7.js";
import {
  jwtDecode
} from "./chunk-LTPV2N3O.js";
import {
  environment
} from "./chunk-K2LMSEX6.js";
import {
  BehaviorSubject,
  HttpClient,
  HttpHeaders,
  of,
  tap,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-KOB7DKR4.js";

// src/app/services/authservice.service.ts
var AuthserviceService = class _AuthserviceService {
  http;
  userService;
  gruposUsuario = [];
  rolesUsuario = [];
  gruposMap = {
    administradores: [1],
    sistemas: [2],
    mayordomo: [3],
    jefes: [4],
    fitosanitario: [5],
    gerencia: [6],
    certificaciones: [7],
    empacadora: [8],
    rrhh: [9],
    bodega: [10],
    todos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    campo: [3, 5, 8],
    oficina: [1, 2, 6]
  };
  rolesMap = {
    superadmin: [1],
    usergerencia: [2],
    userjefefito: [3],
    usermmfito: [4],
    usercampo: [5],
    userjefempacadora: [6],
    userempacadora: [7],
    user: [8],
    todos: [1, 2, 3, 4, 5, 6, 7, 8]
  };
  baseUrl = environment.apiUrl;
  permisos$ = new BehaviorSubject(false);
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
          codempleado: decoded.codempleado,
          empe_nom: decoded.empe_nom,
          empresa_id: decoded.empresa_id
        });
        this.setGruposUsuario([decoded.group_id]);
      } catch (e) {
        console.error("Error al decodificar token en constructor", e);
        this.userService.clearUser();
      }
    }
  }
  // ========= SETTERS =========
  setGruposUsuario(grupos) {
    this.gruposUsuario = [...new Set(grupos)];
  }
  setUserInfo(data) {
    const usuario = this.userService.getUser();
    if (!usuario)
      return;
    usuario.rol_id = data.rol_id;
    usuario.group_id = data.group_id;
    this.userService.setUser(usuario);
    const grupos = [data.group_id];
    if (data.grupo_extra_id) {
      grupos.push(data.grupo_extra_id);
    }
    this.setGruposUsuario(grupos);
  }
  //verifica si el usuario pertnece a un grupo por nombre
  tieneGrupo(nombreGrupo) {
    const idsGrupos = this.gruposMap[nombreGrupo];
    if (!idsGrupos)
      return false;
    return this.gruposUsuario.some((id) => idsGrupos.includes(id));
  }
  /* tieneRol(nombreRol: string): boolean {
      const idsRoles = this.rolesMap[nombreRol];
     // console.log(idsRoles)
      if (!idsRoles) return false;
  
      const usuario = this.userService.getUser();
      if (!usuario) return false; // 🧩 Evita null
  
      return idsRoles.includes(usuario.rol_id);
    }*/
  tieneRol(nombreRol) {
    const idsRoles = this.rolesMap[nombreRol];
    if (!idsRoles)
      return false;
    const usuario = this.userService.getUser();
    if (!usuario)
      return false;
    return idsRoles.includes(usuario.rol_id);
  }
  tieneAlgunRol(nombresRoles) {
    return nombresRoles.some((nombre) => this.tieneRol(nombre));
  }
  tieneAlgunGrupo(nombresGrupos) {
    return nombresGrupos.some((nombre) => this.tieneGrupo(nombre));
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
        codempleado: decoded.codempleado,
        empe_nom: decoded.empe_nom,
        empresa_id: decoded.empresa_id
      });
      const grupos = [decoded.group_id];
      if (decoded.grupo_extra_id) {
        grupos.push(decoded.grupo_extra_id);
      }
      this.setGruposUsuario(grupos);
    }));
  }
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
    this.userService.clearUser();
    this.gruposUsuario = [];
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
  getUserInfo() {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.username;
      } catch (e) {
        console.error("Token inv\xE1lido:", e);
        return null;
      }
    }
    return null;
  }
  getUserInfoFromBackend() {
    const token = this.getToken();
    if (!token)
      return of(null);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}/auth/me`, { headers });
  }
  // ========= DEBUG =========
  getRoles() {
    return this.rolesUsuario;
  }
  getGrupos() {
    return this.gruposUsuario;
  }
  emitirCambioPermisos() {
    this.permisos$.next(true);
  }
  getCambiosPermisos() {
    return this.permisos$.asObservable();
  }
  static \u0275fac = function AuthserviceService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthserviceService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(UserService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthserviceService, factory: _AuthserviceService.\u0275fac, providedIn: "root" });
};

export {
  AuthserviceService
};
//# sourceMappingURL=chunk-3TA73A5V.js.map
