import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { ActivoComponent } from './Pages/activo/activo.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { SharedModule } from 'src/app/Reutilizable/shared/shared.module';
import { ModalUsuarioComponent } from './Modales/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './Modales/modal-producto/modal-producto.component';
import { ModalActivoComponent } from './Modales/modal-activo/modal-activo.component';
import { ModalDetalleVentaComponent } from './Modales/modal-detalle-venta/modal-detalle-venta.component';
import { ClienteComponent } from './Pages/cliente/cliente.component';
import { ModalClienteComponent } from './Modales/modal-cliente/modal-cliente.component';
import { ModalCreacionContratoComponent } from './Modales/modal-creacion-contrato/modal-creacion-contrato.component';
import { ActivoContratoComponent } from './Pages/activo-contrato/activo-contrato.component';
import { ModalFechaComponent } from './Modales/modal-fecha/modal-fecha.component';


@NgModule({
  declarations: [
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    ActivoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalActivoComponent,
    ModalDetalleVentaComponent,
    ClienteComponent,
    ModalClienteComponent,
    ModalCreacionContratoComponent,
    ActivoContratoComponent,
    ModalFechaComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule
  ]
})
export class LayoutModule { }
