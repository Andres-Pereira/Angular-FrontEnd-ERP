import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements  CanActivate {

  constructor(private _utilidadServicio:UtilidadService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const allowedRoles = route.data?.['allowedRoles'];
    const rolUsuario : string = this._utilidadServicio.getRol();
    if(allowedRoles.includes(rolUsuario))
      return true;
    else 
      this._utilidadServicio.mostrarAlerta("No tienes permiso para acceder a esta ruta","Oops!");
      return (this.router.createUrlTree(['pages/venta']));
    
  }
}
