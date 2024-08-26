import { Component, OnInit, AfterViewInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder,FormGroup} from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from 'src/app/Interfaces/venta';
import { VentaService } from 'src/app/Services/venta.service';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/Interfaces/cliente';
import { ClienteService } from 'src/app/Services/cliente.service';

export const MY_DATA_FORMATS={
  parse:{
    dateInput:'DD/MM/YYYY'
  },
  display:{
    dateInput:'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY'
  }
}

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {
  _vendedor: string = "";
  _cliente: string = "";
  formularioBusqueda:FormGroup;
  listaUsuarios: Usuario[]=[];
  listaClientes: Cliente[]=[];
  listaUsuariosFiltro: Usuario[]=[];
  vendedorRegistrado: string = '';
  mostrarLoading:boolean=false;

  opcionesBusqueda: any [] = [
    {value:"fecha", desripcion: "Fechas"},
    {value:"numero", desripcion: "Número de venta"},
    {value:"cuentas", desripcion: "Cuentas por cobrar"},
    {value:"clientes", desripcion: "Clientes frecuentes"}
  ]

  columnasTabla: string [] = ['fechaRegistro','numeroDocumento','cliente','vendedor','esPagado','tipoPago','total','accion']
  dataInicio: Venta [] = [];
  datosListaVenta = new MatTableDataSource(this.dataInicio);

  constructor(
    private fb:FormBuilder,
    private dialog:MatDialog,
    private _ventaServicio:VentaService,
    private _usuarioServicio:UsuarioService,
    private _clienteServicio:ClienteService,
    private _utilidadServicio:UtilidadService
  ) {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero:[''],
      fechaInicio:[''],
      fechaFin:[''],
      cuentas:[''],
      clientes:['']
    })

    this.formularioBusqueda.get("buscarPor")?.valueChanges.subscribe(value=>{
      this.formularioBusqueda.patchValue({
        numero: "",
        fechaInicio: "",
        fechaFin: "",
        cuentas:"",
        clientes:""
      })
      this._vendedor="";
      this._cliente="";
      this.formularioBusqueda.value.numero="";
    })
    this._usuarioServicio.lista().subscribe({
      next:(d)=>{
        if(d.status){
          const lista2 = d.value as Usuario[];
          this.listaUsuarios = lista2.filter(u=>u.esActivo == 1);
        }
      },
      error:(e)=>{}
    })
    this._clienteServicio.lista().subscribe({
      next:(d)=>{
        if(d.status){
          const lista2 = d.value as Cliente[];
          this.listaClientes = lista2.filter(u=>u.esActivo == 1);
        }
      },
      error:(e)=>{}
    })
   }

   

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  vendedorSeleccionado(nombreCompleto:string){
    this._vendedor = nombreCompleto;
  }

  clienteSeleccionado(nombreCompleto:string){
    this._cliente = nombreCompleto.toString();
  }

  buscarVentas(){
    let _fechaInicio: string = "";
    let _fechaFin: string = "";
    let fIN: string = "";
    let fFin: string = "";
    this.mostrarLoading=true;
    

    if(this.formularioBusqueda.value.buscarPor === "fecha"){
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');

      fIN = moment(this.formularioBusqueda.value.fechaInicio).format('YYYY-MM-DD');
      fFin = moment(this.formularioBusqueda.value.fechaFin).format('YYYY-MM-DD');

      if(fIN>fFin)
      {
        this._utilidadServicio.mostrarAlerta("La fecha final debe ser mayor a la inical","Oops!");
        this.mostrarLoading=false;
        return;
      }
        

      if(_fechaInicio === "Invalid date" || _fechaFin === "Invalid date" ){
        this._utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas","Oops!");
        this.mostrarLoading=false;
        return;
      }
    }

    if(this._vendedor == "" && this.formularioBusqueda.value.buscarPor === "cuentas" ){
      this._utilidadServicio.mostrarAlerta("Debe llenar el campo","Oops!");
      this.mostrarLoading=false;
      return;
    }

    if(this._cliente == "" && this.formularioBusqueda.value.buscarPor == "clientes" ){
      this._utilidadServicio.mostrarAlerta("Debe llenar el campo","Oops!");
      this.mostrarLoading=false;
      return;
    }

    if(this.formularioBusqueda.value.numero == "" && this.formularioBusqueda.value.buscarPor == "numero" ){
      this._utilidadServicio.mostrarAlerta("Debe llenar el campo","Oops!");
      this.mostrarLoading=false;
      return;
    }

    this._ventaServicio.historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin,
      this._vendedor,
      this._cliente
    ).subscribe({
      next:(data)=>{
        if(data.status)
        {
          this.datosListaVenta = data.value;
        }
        else
        this._utilidadServicio.mostrarAlerta("No se encontraron datos!","Oops!");
          
      },
      complete : () =>{
        this.mostrarLoading=false;
      },
      error:(e)=>{}
    })
  }

  verDetalleVenta(_venta:Venta){
    this.dialog.open(ModalDetalleVentaComponent, {
      data: _venta,
      disableClose: true,
      width: '700px'
    })
  }

  editarVenta(venta:Venta){
    this.mostrarLoading=true;
    this._ventaServicio.editar(venta).subscribe({
      next:(data)=>{
        if(data.status){
          this._utilidadServicio.mostrarAlerta("La venta cambio de estado de pago.","Exito");
          this.buscarVentas()
        }else
        this._utilidadServicio.mostrarAlerta("No se pudo editar el estado de pago.","Error");
      },
      complete : () =>{
        this.mostrarLoading=false;
      },
      error:(e)=>{}
    })
  }

  eliminarVenta(venta:Venta){
    Swal.fire({
      title: '¿Desea eliminar la venta?',
      text: 'Las ventas solo se eliminan si hubo una equivocación y deben reportarse al superior.',
      icon:"warning",
      confirmButtonColor: '#d33',
      confirmButtonText:"Eliminar",
      showCancelButton:true,
      cancelButtonColor:'#303F9F',
      cancelButtonText: 'Volver'
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._ventaServicio.eliminar(venta.idVenta).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("La venta fue eliminada","Exito!")
              this.buscarVentas();
            }else
            this._utilidadServicio.mostrarAlerta("No se pudo eliminar","Error!")
          },
          error:(e)=>{}
        })
      }

    })
  }
}

