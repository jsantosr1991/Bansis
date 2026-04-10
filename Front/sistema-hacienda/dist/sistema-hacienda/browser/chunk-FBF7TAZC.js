import {
  environment
} from "./chunk-K2LMSEX6.js";
import {
  HttpClient,
  Observable,
  forkJoin,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-KOB7DKR4.js";

// src/app/services/estadisticas.service.ts
var EstadisticasService = class _EstadisticasService {
  http;
  baseUrl = environment.apiUrl;
  constructor(http) {
    this.http = http;
  }
  //OBTENER SEMANA EN CURSO
  getSemanaActual(data) {
    return this.http.post(`${this.baseUrl}/getsemcalendar`, data);
  }
  //para recobro
  calendar(anio) {
    return this.http.post(`${this.baseUrl}/calendar`, { anio });
  }
  //enfunde
  calendarenfunde(anio) {
    return this.http.post(`${this.baseUrl}/calendarenfunde`, { anio });
  }
  //SALDOS FINALES
  getsaldosP(data) {
    return this.http.post(`${this.baseUrl}/saldosp`, data);
  }
  // Este método maneja la consulta solo según el ID
  consultarConId(id, codigo) {
    let url = "";
    let url2 = "";
    if (id === "1") {
      url = `${this.baseUrl}/saldosp`;
      url2 = `${this.baseUrl}/cosechap`;
    } else if (id === "3") {
      url = `${this.baseUrl}/saldossof`;
      url2 = `${this.baseUrl}/cosechas`;
    } else {
      return new Observable((observer) => observer.error("ID no v\xE1lido"));
    }
    return forkJoin([
      this.http.post(url, { cinta: codigo }),
      // Primera consulta
      this.http.post(url2, { cinta: codigo })
      // Segunda consulta
    ]);
  }
  // Este método maneja la consulta solo según el ID
  consultarLote(id, codigo, lote) {
    let url = "";
    let url2 = "";
    let url3 = "";
    let url4 = "";
    if (id === "1") {
      url = `${this.baseUrl}/lotehistp`;
      url2 = `${this.baseUrl}/histcinta`;
      url3 = `${this.baseUrl}/lotehistp2`;
      url4 = `${this.baseUrl}/histcinta2`;
    } else if (id === "3") {
      url = `${this.baseUrl}/lotehists`;
      url2 = `${this.baseUrl}/histcinta`;
      url3 = `${this.baseUrl}/lotehists2`;
      url4 = `${this.baseUrl}/histcinta2`;
    } else {
      return new Observable((observer) => observer.error("ID no v\xE1lido"));
    }
    return forkJoin([
      this.http.post(url, { lote, cinta: codigo }),
      // Primera consulta
      this.http.post(url2, { cinta: codigo, hacienda: id }),
      // Segunda consulta
      this.http.post(url3, { lote, cinta: codigo }),
      // tercera consulta
      this.http.post(url4, { cinta: codigo, hacienda: id })
      // Segunda consulta
    ]);
  }
  //obtener loteros con su lote
  loteros(id, codigo, lote) {
    let url = `${this.baseUrl}/enfloterocintas`;
    return this.http.post(url, { cinta: codigo, hacienda: id, lote });
  }
  //obtener loteros con total de enfunde
  loterosenfunde(id, codigo) {
    let url = `${this.baseUrl}/enfloterosemana`;
    let url2 = `${this.baseUrl}/getloteroterrestre`;
    return forkJoin([
      this.http.post(url, { cinta: codigo, hacienda: id }),
      this.http.post(url2, { hacienda: id })
    ]);
  }
  static \u0275fac = function EstadisticasService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EstadisticasService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EstadisticasService, factory: _EstadisticasService.\u0275fac, providedIn: "root" });
};

export {
  EstadisticasService
};
//# sourceMappingURL=chunk-FBF7TAZC.js.map
