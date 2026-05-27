import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BodegahaciendaService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  obtenerSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/vsolicitudpedidos');
  }

  getDetalle(doc: string, user: string) {
    return this.http.get<any[]>(this.baseUrl + '/vdetalle', {
      params: { Document: doc, usuario: user }
    });
  }

  despachar(payload: any) {
    return this.http.post(`${this.baseUrl}/despachar`, payload);
  }
  //por modificar aun
  detalleDespacho(payload: any): Observable<any[]> {

    return this.http.post<any[]>(this.baseUrl + '/getdespacho', payload);
  }

  despachado(payload: any): Observable<any[]> {


    return this.http.post<any[]>(`${this.baseUrl}/getdespachocomprobar`, payload);
  }
  getUltimaFechaDespacho() {
    return this.http.get<{ fecha: string }>(this.baseUrl + '/ultimafechadespacho');
  }
  getUltimaFechaDespachoPorHacienda() {
    return this.http.get<{ idhacienda: number, fecha: string }[]>(
      this.baseUrl + '/ultimafechadespachoporhacienda'
    );
  }

  getEstado(params: any) {
    return this.http.get<any[]>(`${this.baseUrl}/rollos/estado`, { params });
  }


  getSemana(fecha: string) {
    return this.http.get(`${this.baseUrl}/rollos/semana?fecha=${fecha}`);
  }

  getEstadoSemana(params: any) {
    return this.http.get(`${this.baseUrl}/rollos/estado-semana`, { params });
  }

  crearSemana(data: any) {
    return this.http.post(`${this.baseUrl}/rollos/crear-semana`, data);
  }

  cerrarSemana(data: any) {

    return this.http.post(`${this.baseUrl}/rollos/cerrar-semana`, data);
  }
  getTotalFundas(params: any) {
    return this.http.get(`${this.baseUrl}/rollos/total-fundas`, { params });
  }
  registrarMovimiento(data: any) {
    return this.http.post(`${this.baseUrl}/rollos/registrar-movimiento`, data);
  }

  despachoPorPersona(data: any) {
    return this.http.post(`${this.baseUrl}/rollos/despacho-persona`, data);
  }
  getMovimientos(idcontrol: number) {
    return this.http.get(`${this.baseUrl}/rollos/movimientos/${idcontrol}`);
  }
  generarControlPersonas(data: any) {
    return this.http.post(`${this.baseUrl}/rollos/personas/generar`, data);
  }

  getControlPersonas(data: any) {
    return this.http.post<any[]>(`${this.baseUrl}/rollos/personas/listar`, data);
  }
  guardarEntrega(data: any) {
    return this.http.post(`${this.baseUrl}/rollos/personas/guardar`, data);
  }
  getPersonas(idhacienda: number) {
    return this.http.get(`${this.baseUrl}/rollos/personas/${idhacienda}`);
  }

  asignarPersona(data: any) {
    return this.http.post(`${this.baseUrl}/rollos/asignar-persona`, data);
  }

  getHistorialPersona(data: any) {
    return this.http.post(`${this.baseUrl}/rollos/historial-persona`, data);
  }

  guardarReemplazo(payload: any) { return this.http.post(`${this.baseUrl}/rollos/guardar-reemplazo`, payload); }

}
