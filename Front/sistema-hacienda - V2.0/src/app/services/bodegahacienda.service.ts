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

}
