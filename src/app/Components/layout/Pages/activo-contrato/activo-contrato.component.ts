import { Component, OnInit, AfterViewInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Activo } from 'src/app/Interfaces/activo';
import { ActivoService } from 'src/app/Services/activo.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ModalFechaComponent } from '../../Modales/modal-fecha/modal-fecha.component';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Cliente } from 'src/app/Interfaces/cliente';
import { FormBuilder,FormGroup} from '@angular/forms';
import { ClienteService } from 'src/app/Services/cliente.service';

@Component({
  selector: 'app-activo-contrato',
  templateUrl: './activo-contrato.component.html',
  styleUrls: ['./activo-contrato.component.css']
})
export class ActivoContratoComponent implements OnInit, AfterViewInit {

  _encargado: string = "";
  _cliente: string = "";
  mostrarLoading:boolean=false;
  formularioBusqueda:FormGroup;
  listaUsuarios: Usuario[]=[];
  listaClientes: Cliente[]=[];

  opcionesBusqueda: any [] = [
    {value:"todo", desripcion: "Todo"},
    {value:"caducados", desripcion: "Contratos Expirados"},
    {value:"vigentes", desripcion: "Contratos Vigentes"},
    {value:"encargados", desripcion: "Encargados"},
    {value:"clientes", desripcion: "Clientes"}
  ]

  columnasTabla: string [] = ['nombre','marca','codigo','cliente','encargado','fechaCaducidad','acciones']
  dataInicio: Activo [] = [];
  datosActivos = new MatTableDataSource(this.dataInicio);

  constructor(
    private fb:FormBuilder,
    private dialog:MatDialog,
    private _activoServicio:ActivoService,
    private _usuarioServicio:UsuarioService,
    private _clienteServicio:ClienteService,
    private _utilidadServicio:UtilidadService
  ) {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['todo'],
      encargados:[''],
      clientes:['']
    })

    this.formularioBusqueda.get("buscarPor")?.valueChanges.subscribe(value=>{
      this.formularioBusqueda.patchValue({
        encargados:"",
        clientes:""
      })
      this._encargado = "";
      this._cliente = "";
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
    this.filtrarActivos();
  }

  ngAfterViewInit(): void {
  }

  encargadoSeleccionado(nombreCompleto:string){
    this._encargado = nombreCompleto.toString();
  }

  clienteSeleccionado(nombreCompleto:string){
    this._cliente = nombreCompleto.toString();
  }

  filtrarActivos(){

    this.mostrarLoading=true;
    this._activoServicio.filtros(
      this.formularioBusqueda.value.buscarPor,
      this._encargado,
      this._cliente
    ).subscribe({
      next:(data)=>{
        if(data.status)
          this.datosActivos = data.value;
        else
        this._utilidadServicio.mostrarAlerta("No se encontraron datos!","Oops!");
      },
      complete : () =>{
        this.mostrarLoading=false;
      },
      error:(e)=>{}
    })
  }

  busquedaActivos(){

    if(this._encargado == "" && this.formularioBusqueda.value.buscarPor == "encargados" ){
      this._utilidadServicio.mostrarAlerta("Debe llenar el campo","Oops!");
      return;
    }

    if(this._cliente == "" && this.formularioBusqueda.value.buscarPor == "clientes" ){
      this._utilidadServicio.mostrarAlerta("Debe llenar el campo","Oops!");
      return;
    }

    this.mostrarLoading=true;
    this._activoServicio.filtros(
      this.formularioBusqueda.value.buscarPor,
      this._encargado,
      this._cliente
    ).subscribe({
      next:(data)=>{
        if(data.status)
        {
          this.datosActivos = data.value;
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

  fechaActivo(activo:Activo){
    this.dialog.open(ModalFechaComponent, {
      disableClose:true,
      data:activo
    }).afterClosed().subscribe(resultado=>{
      if(resultado=='true') this.filtrarActivos();
    });
  }

  editarEstado(activo:Activo){
    this._activoServicio.editarEstado(activo).subscribe({
      next:(data)=>{
        if(data.status){
          this._utilidadServicio.mostrarAlerta("El contrato ha concluido.","Exito");
          this.filtrarActivos()
        }else
        this._utilidadServicio.mostrarAlerta("No se pudo cambiar el estado del contrato","Error");
      },
      error:(e)=>{}
    })
  }

  
}
