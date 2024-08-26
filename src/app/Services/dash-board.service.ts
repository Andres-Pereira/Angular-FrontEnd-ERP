import { Injectable } from '@angular/core';
import{HttpClient}from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {
  private urlApi:string=environment.endpoint + "DashBoard/";
  constructor(private http:HttpClient) { }

  resumen(intervalo:number):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Resumen?interv=${intervalo}`)
  }

  resumenMes(mes:number,año:number):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}ResumenMes?mes=${mes}&año=${año}`)
  }

  resumenAño(año:number):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}ResumenAnual?año=${año}`)
  }

  resumenVendedores(año:number):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}ResumenVendedores?año=${año}`)
  }

  resumenProductos(año:number):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}ResumenProductos?año=${año}`)
  }

}
