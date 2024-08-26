import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Activo } from 'src/app/Interfaces/activo';
import { ActivoService } from 'src/app/Services/activo.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
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
  selector: 'app-modal-fecha',
  templateUrl: './modal-fecha.component.html',
  styleUrls: ['./modal-fecha.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class ModalFechaComponent implements OnInit {

  fechaCad: string = '';
  formularioFecha:FormGroup;
  mostrarLoading:boolean=false;

  constructor(
    private modalActual:MatDialogRef<ModalFechaComponent>,
    @Inject(MAT_DIALOG_DATA) public datosActivo: Activo,
    private fb:FormBuilder,
    private _activoServicio:ActivoService,
    private _utilidadServicio:UtilidadService
  ) {
    this.formularioFecha= this.fb.group({
      fechaCaducidad:['',Validators.required]
    });
   }

  ngOnInit(): void {
    if(this.datosActivo != null){
      this.formularioFecha.patchValue({
        fechaCaducidad:this.datosActivo.fechaCaducidad
      });
    }

  }

  fecha_Activo(){

    this.mostrarLoading=true;
    this.fechaCad = moment(this.formularioFecha.value.fechaCaducidad).format('YYYY-MM-DD');
    const _activo:Activo ={
      idActivo:this.datosActivo==null?0:this.datosActivo.idActivo,
      nombre:this.datosActivo.nombre,
      marca:this.datosActivo.marca,
      codigo: this.datosActivo.codigo,
      esActivo:this.datosActivo.esActivo,
      cliente:this.datosActivo.cliente,
      encargado:this.datosActivo.encargado,
      fechaCaducidad:this.fechaCad.toString(),
      esContrato: this.datosActivo.esContrato
    }

    this._activoServicio.editar(_activo).subscribe({
      next:(data)=>{
        if(data.status){
          this._utilidadServicio.mostrarAlerta("El contrato fue actualizado","Exito");
          this.modalActual.close("true")
        }else
        this._utilidadServicio.mostrarAlerta("No se pudo actualizar la fecha del contrato","Error");
      },
      complete : () =>{
        this.mostrarLoading=false;
      },
      error:(e)=>{}
    })

  
  }
}
