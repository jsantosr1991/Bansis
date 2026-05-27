import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LaboresService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getSP(data: any) {
    return this.http.post(`${this.baseUrl}/labores/sp`, data);
  }

  getGuardadas(data: any) {
    return this.http.post(`${this.baseUrl}/labores/guardadas`, data);
  }

  guardar(data: any) {
    return this.http.post(`${this.baseUrl}/labores/guardar`, data);
  }

  cerrar(data: any) {
    return this.http.post(`${this.baseUrl}/labores/cerrar`, data);
  }
  getReporte(payload: any) {
    return this.http.post(`${this.baseUrl}/labores/reportesemanal`, payload);
  }
}
