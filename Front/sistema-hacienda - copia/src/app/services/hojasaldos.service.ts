import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {Caidas, Enfunde, Hojasaldos} from '../interface/hojasaldos';
import { environment } from '../../environments/environment';
import {LotesMayordomosI} from '../interface/LotesMayordomosI';

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

  obtenerDatosCaidas(idhacienda:any, codigo:any):Observable<Caidas[]>{

    const params = {idhacienda, codigo};

    return this.http.post<Caidas[]>(this.baseUrl+'/hojasaldoscaidas', params);
  }

  obtenerEnfundeSaldos(idhacienda: number, codigo: number): Observable<{ saldos: Hojasaldos[], metas: Enfunde[], caidas:Caidas[] }> {
    return forkJoin({
      saldos: this.obtenerDatos(idhacienda, codigo),
      metas: this.obtenerValoresEnfunde(idhacienda, codigo),
      caidas: this.obtenerDatosCaidas(idhacienda,codigo)
    });
  }
  obtenerLotesMayordomo(idhacienda:any):Observable<LotesMayordomosI[]>{

    const params = {idhacienda};

    return this.http.post<LotesMayordomosI[]>(this.baseUrl+'/getlotesmayordomos', params);
  }

  obtenerSemanaMatasCaidas():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl+'/getsemanamatascaidas');
  }

  obtenerCintasMataCaidas(semana:any):Observable<any[]>{

    return this.http.post<any[]>(this.baseUrl+'/getcalendarmatascaidas',{semana:semana});
  }

  guardar(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/guardarmatascaidas`, payload);
  }

  imprimirPorId(id:number){
    return this.http.get(`${this.baseUrl}/imprimirmatascaidas/${id}`);
  }
  verPorId(id:number):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/imprimirmatascaidas/${id}`);
  }


  listarHistorico(){
    return this.http.get<any[]>(`${this.baseUrl}/historicomatascaidas`);
  }

}
