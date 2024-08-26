import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanLoad {
  constructor(private _utilidadServicio:UtilidadService, private router: Router){}
  
  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this._utilidadServicio.estaLogeado()==false)
      {
        this._utilidadServicio.mostrarAlerta("Primero inicia sesion!","Oops!");
        return (this.router.createUrlTree(['login']));
      }
    else
    return this._utilidadServicio.estaLogeado();
  }
}
