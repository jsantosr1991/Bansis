import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hojasaldos } from '../interface/hojasaldos';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HojasaldosService {
 private baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  obtenerDatos(idhacienda:any, codigo:any):Observable<Hojasaldos[]>{

    const params = {idhacienda, codigo};
    console.log(params);
    return this.http.post<Hojasaldos[]>(this.baseUrl+'/hojasaldos', params);
  }

  
}
