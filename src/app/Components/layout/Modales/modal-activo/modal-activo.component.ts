import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Activo } from 'src/app/Interfaces/activo';
import { ActivoService } from 'src/app/Services/activo.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-activo',
  templateUrl: './modal-activo.component.html',
  styleUrls: ['./modal-activo.component.css']
})
export class ModalActivoComponent implements OnInit {

  formularioActivo:FormGroup;
  tituloAccion:string="Agregar";
  botonAccion:string="Guardar";
  mostrarLoading:boolean=false;

  constructor(
    private modalActual:MatDialogRef<ModalActivoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosActivo: Activo,
    private fb:FormBuilder,
    private _activoServicio:ActivoService,
    private _utilidadServicio:UtilidadService
  ) {
    this.formularioActivo= this.fb.group({
      nombre:['',Validators.required],
      marca:['',Validators.required],
      codigo:['',Validators.required],
      esActivo:['1',Validators.required]
    });

    if(this.datosActivo!=null){

      this.tituloAccion="Editar";
      this.botonAccion="Actualizar";
    }
   }

  ngOnInit(): void {
    if(this.datosActivo != null){
      this.formularioActivo.patchValue({
        nombre:this.datosActivo.nombre,
        marca:this.datosActivo.marca,
        codigo:this.datosActivo.codigo,
        esActivo:this.datosActivo.esActivo.toString()
      });
    }

  }

  guardarEditar_Activo(){

    const _activo:Activo ={
      idActivo:this.datosActivo==null?0:this.datosActivo.idActivo,
      nombre:this.formularioActivo.value.nombre,
      marca:this.formularioActivo.value.marca,
      codigo: this.formularioActivo.value.codigo,
      fechaCaducidad:"2024-01-01",
      esActivo:parseInt(this.formularioActivo.value.esActivo)
    }
    this.mostrarLoading=true;

    if(this.datosActivo == null){
      this._activoServicio.guardar(_activo).subscribe({

        next:(data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El equipo fue registrado","Exito");
            this.modalActual.close("true")
          }else
          this._utilidadServicio.mostrarAlerta("No se pudo registrar el equipo","Error");
        },
        complete : () =>{
          this.mostrarLoading=false;
        },
        error:(e)=>{}
      })

    }else {
      this._activoServicio.editar(_activo).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El equipo fue editado","Exito");
            this.modalActual.close("true")
          }else
          this._utilidadServicio.mostrarAlerta("No se pudo editar el equipo","Error");
        },
        complete : () =>{
          this.mostrarLoading=false;
        },
        error:(e)=>{}
      })
    }
  }

}
