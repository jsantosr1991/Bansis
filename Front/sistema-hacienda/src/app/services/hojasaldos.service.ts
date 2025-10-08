import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {Enfunde, Hojasaldos} from '../interface/hojasaldos';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HojasaldosService {
 private baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  obtenerDatos(idhacienda:any, codigo:any):Observable<Hojasaldos[]>{

    const params = {idhacienda, codigo};

    return this.http.post<Hojasaldos[]>(this.baseUrl+'/hojasaldos', params);
  }
  obtenerValoresEnfunde(idhacienda: number, codigo: number): Observable<Enfunde[]> {
    const body = { idhacienda, codigo };
    return this.http.post<Enfunde[]>(`${this.baseUrl}/hojasaldosenfunde`, body);
  }
  obtenerEnfundeSaldos(idhacienda: number, codigo: number): Observable<{ saldos: Hojasaldos[], metas: Enfunde[] }> {
    return forkJoin({
      saldos: this.obtenerDatos(idhacienda, codigo),
      metas: this.obtenerValoresEnfunde(idhacienda, codigo)
    });
  }
}
