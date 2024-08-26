import { Component, OnInit, AfterViewInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalClienteComponent } from '../../Modales/modal-cliente/modal-cliente.component';
import { Cliente } from 'src/app/Interfaces/cliente';
import { ClienteService } from 'src/app/Services/cliente.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { MatSort, MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit, AfterViewInit {

  columnasTabla: string[]=['nombreCompleto','correo','contacto','estado','acciones'];
  dataInicio:Cliente[]=[];
  mostrarLoading:boolean=false;
  dataListaClientes = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;
  @ViewChild(MatSort) matSort! : MatSort;

  constructor(
    private dialog: MatDialog,
    private _clienteServicio:ClienteService,
    private _utilidadServicio:UtilidadService
  ) { }

    obtenerClientes(){
      this.mostrarLoading=true;
      this._clienteServicio.lista().subscribe({
        next:(data)=>{
          if(data.status)
            this.dataListaClientes.data=data.value;
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
    this.obtenerClientes();
  }

  ngAfterViewInit(): void {
    this.dataListaClientes.paginator= this.paginacionTabla;
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

    this.dataListaClientes.sort = this.matSort;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaClientes.filter= filterValue.trim().toLocaleLowerCase();
  }

  nuevoCliente(){
    this.dialog.open(ModalClienteComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado=>{
      if(resultado=='true') this.obtenerClientes();
    });
  }

  editarCliente(cliente:Cliente){
    this.dialog.open(ModalClienteComponent, {
      disableClose:true,
      data:cliente
    }).afterClosed().subscribe(resultado=>{
      if(resultado=='true') this.obtenerClientes();
    });
  }

  eliminarCliente(cliente:Cliente){
    Swal.fire({
      title: '¿Desea eliminar al cliente?',
      text: cliente.nombreCompleto,
      icon:"warning",
      confirmButtonColor: '#d33',
      confirmButtonText:"Eliminar",
      showCancelButton:true,
      cancelButtonColor:'#303F9F',
      cancelButtonText: 'Volver'
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._clienteServicio.eliminar(cliente.idCliente).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El cliente fue eliminado","Exito!")
              this.obtenerClientes();
            }else
            this._utilidadServicio.mostrarAlerta("No se pudo eliminar","Error!")
          },
          error:(e)=>{}
        })
      }

    })
  }
}
