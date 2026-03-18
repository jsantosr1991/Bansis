import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Asistencia, DiasCorteI} from '../interface/asistencia';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  obtenerEmpresas(){
    return this.http.get(this.baseUrl + '/vempresashacienda');
  }

  obtenerAsistenciaMM(idhacienda:any, fecha:any):Observable<Asistencia[]> {

    const params = {idhacienda, fecha};
    return this.http.post<Asistencia[]>(this.baseUrl+'/asistenciaMM', params);

  }

  obtenerAsistenciaGeneral(idhacienda:any, fecha:any):Observable<Asistencia[]>{
    const params = {idhacienda, fecha};
    return this.http.post<Asistencia[]>(this.baseUrl+'/asistenciaGeneral', params);

  }
  obtenerFaltasPermisos(idhacienda:any, fecha:any):Observable<Asistencia[]> {

    const params = {idhacienda, fecha};
    return this.http.post<Asistencia[]>(this.baseUrl+'/viewfaltaspermisos', params);

  }

  obtenerDiasCorte(idhacienda:any, fecha:any):Observable<DiasCorteI[]> {

    const params = {idhacienda, fecha};
    return this.http.post<DiasCorteI[]>(this.baseUrl+'/diascorte', params);

  }


}
