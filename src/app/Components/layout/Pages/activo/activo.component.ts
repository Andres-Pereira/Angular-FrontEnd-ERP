import { Component, OnInit, AfterViewInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalActivoComponent } from '../../Modales/modal-activo/modal-activo.component';
import { Activo } from 'src/app/Interfaces/activo';
import { ActivoService } from 'src/app/Services/activo.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { ModalCreacionContratoComponent } from '../../Modales/modal-creacion-contrato/modal-creacion-contrato.component';
import { MatSort, MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-activo',
  templateUrl: './activo.component.html',
  styleUrls: ['./activo.component.css']
})
export class ActivoComponent implements OnInit, AfterViewInit  {

  columnasTabla: string[]=['nombre','marca','codigo','estado','acciones'];
  dataInicio:Activo[]=[];
  mostrarLoading:boolean=false;
  dataListaActivos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;
  @ViewChild(MatSort) matSort! : MatSort;

  constructor(

    private dialog: MatDialog,
    private _activoServicio:ActivoService,
    private _utilidadServicio:UtilidadService
  ) { }

    obtenerActivos(){
      this.mostrarLoading= true;
      this._activoServicio.ListaSintrato().subscribe({
        next:(data)=>{
          if(data.status)
            this.dataListaActivos.data=data.value;
          else
            this._utilidadServicio.mostrarAlerta("No se encontraron datos!","Opps!")
        },
        complete : () =>{
          this.mostrarLoading=false;
        },
        error:(e)=>{}
      }) 
    }

  ngOnInit(): void {
    this.obtenerActivos();
  }

  ngAfterViewInit(): void {
    this.dataListaActivos.paginator= this.paginacionTabla;
    this.paginacionTabla._intl.itemsPerPageLabel ="Elementos por página";
    this.paginacionTabla._intl.nextPageLabel = "Siguiente página";
    this.paginacionTabla._intl.previousPageLabel = "Página anterior";
    this.paginacionTabla._intl.firstPageLabel = "Primera página"
    this.paginacionTabla._intl.lastPageLabel = "Ultima página";
    this.paginacionTabla._intl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
      if (length === 0) {
        return `Página 1 de 1`;
      }
      const amountPages = Math.ceil(length / pageSize);
      return `Página ${page + 1} de ${amountPages}`;
    }

    this.dataListaActivos.sort = this.matSort;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaActivos.filter= filterValue.trim().toLocaleLowerCase();
  }

  nuevoActivo(){
    this.dialog.open(ModalActivoComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado=>{
      if(resultado=='true') this.obtenerActivos();
    });
  }

  editarActivo(activo:Activo){
    this.dialog.open(ModalActivoComponent, {
      disableClose:true,
      data:activo
    }).afterClosed().subscribe(resultado=>{
      if(resultado=='true') this.obtenerActivos();
    });
  }


  contratoActivo(activo:Activo){
    this.dialog.open(ModalCreacionContratoComponent, {
      disableClose:true,
      data:activo
    }).afterClosed().subscribe(resultado=>{
      if(resultado=='true') this.obtenerActivos();
    });
  }

  eliminarActivo(activo:Activo){
    Swal.fire({
      title: '¿Desea eliminar el activo?',
      text: activo.nombre,
      icon:"warning",
      confirmButtonColor: '#d33',
      confirmButtonText:"Eliminar",
      showCancelButton:true,
      cancelButtonColor:'#303F9F',
      cancelButtonText: 'Volver'
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._activoServicio.eliminar(activo.idActivo).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El equipo fue eliminado","Exito!")
              this.obtenerActivos();
            }else
            this._utilidadServicio.mostrarAlerta("No se pudo eliminar","Error!")
          },
          error:(e)=>{}
        })
      }

    })
  }

}
