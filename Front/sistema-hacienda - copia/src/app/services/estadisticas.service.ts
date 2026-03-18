import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  private baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  //OBTENER SEMANA EN CURSO
  getSemanaActual(data:any){

    return this.http.post(`${this.baseUrl}/getsemcalendar`,data);
  }
  //para recobro
  calendar(anio:any):Observable<any[]>{

    return this.http.post<any[]>(`${this.baseUrl}/calendar`,{anio:anio});
  }
  //enfunde
  calendarenfunde(anio:any):Observable<any[]>{
    return this.http.post<any[]>(`${this.baseUrl}/calendarenfunde`,{anio:anio});
  }

  //SALDOS FINALES
  getsaldosP(data:any){
    return this.http.post(`${this.baseUrl}/saldosp`,data);
  }


  // Este método maneja la consulta solo según el ID
  consultarConId(id: any, codigo:any): Observable<any> {

    let url = '';
    let url2 = '';

    // Dependiendo del id, se construye la URL de la consulta
    if (id === '1') {
      url = `${this.baseUrl}/saldosp`;  // URL para la consulta con id 1
      url2 = `${this.baseUrl}/cosechap`;  // URL para la segunda consulta si id es 1


    } else if (id === '3') {
      url = `${this.baseUrl}/saldossof`;  // URL para la consulta con id 3
      url2 = `${this.baseUrl}/cosechas`;  // URL para la segunda consulta si id es 3
    } else {

      return new Observable(observer => observer.error('ID no válido'));
    }

    // Realizamos las consultas concurrentes usando forkJoin
    return forkJoin([
      this.http.post(url, { cinta: codigo }),  // Primera consulta
      this.http.post(url2, { cinta: codigo })   // Segunda consulta
    ]);
  }

  // Este método maneja la consulta solo según el ID
  consultarLote(id: any, codigo:any, lote:any): Observable<any> {

    let url = '';
    let url2 = '';
    let url3 = '';
    let url4 = '';
    // Dependiendo del id, se construye la URL de la consulta
    if (id === '1') {
      url = `${this.baseUrl}/lotehistp`;  // URL para la consulta con id 1
      url2 = `${this.baseUrl}/histcinta`;  // URL para la consulta con id 2
      url3 = `${this.baseUrl}/lotehistp2`;  // URL para la consulta con id 2
      url4 = `${this.baseUrl}/histcinta2`;  // URL para la consulta con id 2


    } else if (id === '3') {
      url = `${this.baseUrl}/lotehists`;  // URL para la consulta con id 3
      url2 = `${this.baseUrl}/histcinta`;  // URL para la consulta con id 3
      url3 = `${this.baseUrl}/lotehists2`;  // URL para la consulta con id 3
      url4 = `${this.baseUrl}/histcinta2`;  // URL para la consulta con id 2

    } else {

      return new Observable(observer => observer.error('ID no válido'));
    }

    // Realizamos las consultas concurrentes usando forkJoin
    return forkJoin([
      this.http.post(url, { lote:lote, cinta: codigo }),  // Primera consulta
      this.http.post(url2, { cinta: codigo, hacienda:id }),   // Segunda consulta
      this.http.post(url3, { lote:lote, cinta: codigo }),  // tercera consulta
      this.http.post(url4, { cinta: codigo, hacienda:id }),   // Segunda consulta
    ]);

  }
  //obtener loteros con su lote
  loteros(id: any, codigo:any, lote:any): Observable<any>{

    let url =  `${this.baseUrl}/enfloterocintas`;

    return this.http.post(url,{cinta:codigo,hacienda:id,lote:lote})

  }
  //obtener loteros con total de enfunde
  loterosenfunde(id: any, codigo:any): Observable<any>{

    let url =  `${this.baseUrl}/enfloterosemana`;
    let url2 =  `${this.baseUrl}/getloteroterrestre`;

    return forkJoin([
      this.http.post(url,{cinta:codigo,hacienda:id}),
      this.http.post(url2,{hacienda:id})
    ])

  }

}
