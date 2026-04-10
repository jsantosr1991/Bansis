import {
  environment
} from "./chunk-K2LMSEX6.js";
import {
  HttpClient,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-KOB7DKR4.js";

// src/app/services/user.service.ts
var UserService = class _UserService {
  http;
  baseUrl = environment.apiUrl;
  user = null;
  constructor(http) {
    this.http = http;
  }
  setUserFromToken(token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    this.user = {
      username: payload.username,
      codempleado: payload.codempleado,
      rol_id: payload.rol_id,
      group_id: payload.group_id,
      empe_nom: payload.empe_nom,
      empresa_id: payload.empresa_id
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
  getRolId() {
    return this.user?.rol_id ?? 0;
  }
  getCodEmpleado() {
    return this.user?.codempleado ?? "";
  }
  getCodEmpresa() {
    return this.user?.empresa_id ?? 0;
  }
  getNomEmpresa() {
    return this.user?.empe_nom ?? "Invitado";
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
  getUsuarios() {
    return this.http.get(this.baseUrl + "/getlistadminsitrativos");
  }
  getAdministrativos() {
    return this.http.get(this.baseUrl + "/getlistadminsitrativos");
  }
  getRol() {
    return this.http.get(this.baseUrl + "/listarol");
  }
  getGrupo() {
    return this.http.get(this.baseUrl + "/listagrupo");
  }
  // 🔍 Buscar usuario por nombre o apellido
  buscarUsuario(search) {
    const url = `${this.baseUrl}/listadminsitrativos?search=${search}`;
    return this.http.get(`${this.baseUrl}/listadminsitrativos?search=${search}`);
  }
  buscarOtrosEmpleados(search) {
    return this.http.get(`${this.baseUrl}/listaempleados?search=${search}`);
  }
  guardarUsuario(usuario) {
    return this.http.post(`${this.baseUrl}/registrarusuario`, usuario);
  }
  // ✏️ Actualizar usuario
  actualizarUsuario(id, usuario) {
    return this.http.put(`${this.baseUrl}/actualizarusuario/${id}`, usuario);
  }
  actualizarStatus(id, status) {
    return this.http.put(`${this.baseUrl}/actualizarusuario/${id}`, { status });
  }
  //
  obtenerTodos() {
    return this.http.get(this.baseUrl + "/privilegios");
  }
  otorgarPrivilegio(data) {
    return this.http.post(this.baseUrl + "/privilegios", data);
  }
  desactivarPrivilegio(id) {
    return this.http.post(`${this.baseUrl}/privilegios/desactivar/${id}`, {});
  }
  obtenerActivos() {
    return this.http.get(`${this.baseUrl}/privilegios?activo=1`);
  }
  static \u0275fac = function UserService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UserService, factory: _UserService.\u0275fac, providedIn: "root" });
};

export {
  UserService
};
//# sourceMappingURL=chunk-UHCEN6B7.js.map
