import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from 'src/app/Interfaces/cliente';
import { ClienteService } from 'src/app/Services/cliente.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';


@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.css']
})
export class ModalClienteComponent implements OnInit {

  formularioCliente:FormGroup;
  tituloAccion:string="Agregar";
  botonAccion:string="Guardar";
  mostrarLoading:boolean=false;

  constructor(
    private modalActual:MatDialogRef<ModalClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCliente: Cliente,
    private fb:FormBuilder,
    private _clienteServicio:ClienteService,
    private _utilidadServicio:UtilidadService
  ) {
    this.formularioCliente= this.fb.group({
      nombreCompleto:['',Validators.required],
      correo:['',Validators.required],
      contacto:['',Validators.required],
      esActivo:['1',Validators.required]
    });

    if(this.datosCliente!=null){

      this.tituloAccion="Editar";
      this.botonAccion="Actualizar";
    }
   }

  ngOnInit(): void {
    if(this.datosCliente != null){
      this.formularioCliente.patchValue({
        nombreCompleto:this.datosCliente.nombreCompleto,
        correo:this.datosCliente.correo,
        contacto:this.datosCliente.contacto,
        esActivo:this.datosCliente.esActivo.toString()
      });
    }

  }

  guardarEditar_Cliente(){
    this.mostrarLoading=true;
    const _cliente:Cliente ={
      idCliente:this.datosCliente==null?0:this.datosCliente.idCliente,
      nombreCompleto:this.formularioCliente.value.nombreCompleto,
      correo:this.formularioCliente.value.correo,
      contacto: this.formularioCliente.value.contacto,
      esActivo:parseInt(this.formularioCliente.value.esActivo)
    }

    if(this.datosCliente == null){
      this._clienteServicio.guardar(_cliente).subscribe({

        next:(data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El cliente fue registrado","Exito");
            this.modalActual.close("true")
          }else
          this._utilidadServicio.mostrarAlerta("No se pudo registrar al cliente","Error");
        },
        complete : () =>{
          this.mostrarLoading=false;
        },
        error:(e)=>{}
      })

    }else {
      this._clienteServicio.editar(_cliente).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("Los datos del cliente fueron editados","Exito");
            this.modalActual.close("true")
          }else
          this._utilidadServicio.mostrarAlerta("No se pudo editar el cliente","Error");
        },
        complete : () =>{
          this.mostrarLoading=false;
        },
        error:(e)=>{}
      })
    }
  }

}
