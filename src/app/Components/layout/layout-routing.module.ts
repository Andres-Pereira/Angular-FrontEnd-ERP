import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { ActivoComponent } from './Pages/activo/activo.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ClienteComponent } from './Pages/cliente/cliente.component';
import { ActivoContratoComponent } from './Pages/activo-contrato/activo-contrato.component';
import { HasRoleGuard } from 'src/app/auth/guards/has-role.guard';

const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children:[
  {path:'dashboard',canActivate:[HasRoleGuard],data:{allowedRoles: ['Administrador']},component:DashBoardComponent},
  {path:'usuarios',canActivate:[HasRoleGuard],data:{allowedRoles: ['Administrador']},component:UsuarioComponent},
  {path:'productos',canActivate:[HasRoleGuard],data:{allowedRoles: ['Administrador','Supervisor']},component:ProductoComponent},
  {path:'activos',canActivate:[HasRoleGuard],data:{allowedRoles: ['Administrador','Supervisor']},component:ActivoComponent},
  {path:'venta',canActivate:[HasRoleGuard],data:{allowedRoles: ['Administrador','Vendedor','Supervisor']},component:VentaComponent},
  {path:'historial_venta',canActivate:[HasRoleGuard],data:{allowedRoles: ['Administrador','Vendedor','Supervisor']},component:HistorialVentaComponent},
  {path:'clientes',canActivate:[HasRoleGuard],data:{allowedRoles: ['Administrador','Vendedor','Supervisor']},component:ClienteComponent},
  {path:'activos_contrato',canActivate:[HasRoleGuard],data:{allowedRoles: ['Administrador','Vendedor','Supervisor']},component:ActivoContratoComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
