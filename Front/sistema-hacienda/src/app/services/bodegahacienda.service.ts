import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BodegahaciendaService {
  private baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  obtenerSolicitudes():Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/vsolicitudpedidos');
  }
  //por modificar aun
  despachar(payload:any){
    return this.http.post(`${this.baseUrl}/despachar`,payload);
  }

  despachado(payload:any):Observable<any[]>{
    console.log(payload);

    return this.http.post<any[]>(`${this.baseUrl}/getdespacho`,payload);
  }
  getUltimaFechaDespacho(){
    return this.http.get<{ fecha: string}>(this.baseUrl + '/ultimafechadespacho');
  }
  getUltimaFechaDespachoPorHacienda(){
    return this.http.get<{ idhacienda:number, fecha:string }[]>(
      this.baseUrl + '/ultimafechadespachoporhacienda'
    );
  }

}
