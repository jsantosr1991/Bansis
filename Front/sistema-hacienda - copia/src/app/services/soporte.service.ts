import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthserviceService } from './authservice.service';

@Injectable({
  providedIn: 'root'
})
export class SoporteService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthserviceService
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getSolicitudes(todas: boolean = false): Observable<any[]> {
    const url = todas ? `${this.baseUrl}/soporte-tecnico?todas=true` : `${this.baseUrl}/soporte-tecnico`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  getDetalle(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/soporte-tecnico/${id}`, { headers: this.getHeaders() });
  }

  crearSolicitud(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/soporte-tecnico`, data, { headers: this.getHeaders() });
  }

  cambiarEstado(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/soporte-tecnico/${id}/estado`, {}, { headers: this.getHeaders() });
  }

  getMensajes(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/soporte-tecnico/${id}/mensajes`, { headers: this.getHeaders() });
  }

  enviarMensaje(id: number, mensaje: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/soporte-tecnico/${id}/mensajes`, { mensaje }, { headers: this.getHeaders() });
  }

  getMateriales(term: string = ''): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/soporte-tecnico/materiales/lista?term=${term}`, { headers: this.getHeaders() });
  }

  despacharMaterial(solicitudId: number, materiales: any[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/soporte-tecnico/${solicitudId}/despachar`, { 
      materiales: materiales 
    }, { headers: this.getHeaders() });
  }
}
