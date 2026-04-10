import {
  environment
} from "./chunk-K2LMSEX6.js";
import {
  HttpClient,
  forkJoin,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-KOB7DKR4.js";

// src/app/services/hojasaldos.service.ts
var HojasaldosService = class _HojasaldosService {
  http;
  baseUrl = environment.apiUrl;
  constructor(http) {
    this.http = http;
  }
  obtenerDatos(idhacienda, codigo) {
    const params = { idhacienda, codigo };
    return this.http.post(this.baseUrl + "/hojasaldos", params);
  }
  obtenerValoresEnfunde(idhacienda, codigo) {
    const body = { idhacienda, codigo };
    return this.http.post(`${this.baseUrl}/hojasaldosenfunde`, body);
  }
  obtenerDatosCaidas(idhacienda, codigo) {
    const params = { idhacienda, codigo };
    return this.http.post(this.baseUrl + "/hojasaldoscaidas", params);
  }
  obtenerEnfundeSaldos(idhacienda, codigo) {
    return forkJoin({
      saldos: this.obtenerDatos(idhacienda, codigo),
      metas: this.obtenerValoresEnfunde(idhacienda, codigo),
      caidas: this.obtenerDatosCaidas(idhacienda, codigo)
    });
  }
  obtenerLotesMayordomo(idhacienda) {
    const params = { idhacienda };
    return this.http.post(this.baseUrl + "/getlotesmayordomos", params);
  }
  obtenerSemanaMatasCaidas() {
    return this.http.get(this.baseUrl + "/getsemanamatascaidas");
  }
  obtenerCintasMataCaidas(semana) {
    return this.http.post(this.baseUrl + "/getcalendarmatascaidas", { semana });
  }
  guardar(payload) {
    return this.http.post(`${this.baseUrl}/guardarmatascaidas`, payload);
  }
  imprimirPorId(id) {
    return this.http.get(`${this.baseUrl}/imprimirmatascaidas/${id}`);
  }
  verPorId(id) {
    return this.http.get(`${this.baseUrl}/imprimirmatascaidas/${id}`);
  }
  listarHistorico() {
    return this.http.get(`${this.baseUrl}/historicomatascaidas`);
  }
  static \u0275fac = function HojasaldosService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HojasaldosService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HojasaldosService, factory: _HojasaldosService.\u0275fac, providedIn: "root" });
};

export {
  HojasaldosService
};
//# sourceMappingURL=chunk-H6H3KZHT.js.map
