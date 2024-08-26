import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Activo } from 'src/app/Interfaces/activo';
import { ActivoService } from 'src/app/Services/activo.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Cliente } from 'src/app/Interfaces/cliente';
import { ClienteService } from 'src/app/Services/cliente.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

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
  selector: 'app-modal-creacion-contrato',
  templateUrl: './modal-creacion-contrato.component.html',
  styleUrls: ['./modal-creacion-contrato.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class ModalCreacionContratoComponent implements OnInit {

  formularioContrato:FormGroup;
  botonAccion:string="Guardar";
  listaUsuarios: Usuario[]=[];
  listaClientes: Cliente[]=[];
  listaClientesFiltro: Cliente[]=[];
  clienteSeleccionado! : Cliente;
  clienteRegistrado: string = '';
  fechaCad: string = '';
  mostrarLoading:boolean=false;

  retornarClientesPorFiltro(busqueda:any):Cliente[]{
    if (busqueda== null)
      {
        return busqueda;
      }
    else{
      const valorBuscado = typeof busqueda == "string"? busqueda.toLocaleLowerCase():busqueda.nombreCompleto.toLocaleLowerCase();
      return this.listaClientes.filter(item=>item.nombreCompleto.toLocaleLowerCase().includes(valorBuscado));
    }
  }


  constructor(
    private modalActual:MatDialogRef<ModalCreacionContratoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosActivo: Activo,
    private fb:FormBuilder,
    private _activoServicio:ActivoService,
    private _utilidadServicio:UtilidadService,
    private _usuarioServicio:UsuarioService,
    private _clienteServicio:ClienteService
  ) {
    this.formularioContrato= this.fb.group({
      cliente:['',Validators.required],
      encargado:['',Validators.required],
      fechaCaducidad: ['',Validators.required],
      esContrato:['1',Validators.required]
    });

    if(this.datosActivo!=null){
      this.botonAccion="Actualizar";
    }

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
          const lista3 = d.value as Cliente[];
          this.listaClientes = lista3.filter(u=>u.esActivo == 1);
        }
      },
      error:(e)=>{}
    })

    this.formularioContrato.get('cliente')?.valueChanges.subscribe(value=>{
      this.listaClientesFiltro= this.retornarClientesPorFiltro(value);
    })

   }

  ngOnInit(): void {
  }

  contrato_Activo(){

    this.mostrarLoading=true;
    this.fechaCad = moment(this.formularioContrato.value.fechaCaducidad).format('YYYY-MM-DD');
    const _activo:Activo ={
      idActivo:this.datosActivo==null?0:this.datosActivo.idActivo,
      nombre:this.datosActivo.nombre,
      marca:this.datosActivo.marca,
      codigo: this.datosActivo.codigo,
      esActivo:this.datosActivo.esActivo,
      cliente:this.formularioContrato.value.cliente.toString(),
      encargado:this.formularioContrato.value.encargado.toString(),
      fechaCaducidad:this.fechaCad.toString(),
      esContrato: parseInt(this.formularioContrato.value.esContrato)
    }

      this._activoServicio.editar(_activo).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El contrato fue registrado","Exito");
            this.modalActual.close("true")
          }else
          this._utilidadServicio.mostrarAlerta("No se pudo realizar un contrato","Error");
        },
        complete : () =>{
          this.mostrarLoading=false;
        },
        error:(e)=>{}
      })
    
  }

}
