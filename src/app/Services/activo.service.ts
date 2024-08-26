import { Injectable } from '@angular/core';
import{HttpClient}from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Activo } from '../Interfaces/activo';

@Injectable({
  providedIn: 'root'
})
export class ActivoService {

  private urlApi:string=environment.endpoint + "Activo/";
  constructor(private http:HttpClient) { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  ListaContrato():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}ListaContrato`)
  }

  ListaSintrato():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}ListaSintrato`)
  }

  guardar(request: Activo):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`,request)
  }

  editar(request: Activo):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`,request)
  }

  editarEstado(request: Activo):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}EditarEstado`,request)
  }

  filtros(buscarPor:string,encargado:string, cliente:string):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Filtros?buscarPor=${buscarPor}&encargado=${encargado}&cliente=${cliente}`)
  }

  eliminar(id: number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
}
