import { Component, OnInit, AfterViewInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { MatSort, MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  columnasTabla: string[]=['nombreCompleto','correo','rolDescripcion','estado','acciones'];
  dataInicio:Usuario[]=[];
  mostrarLoading:boolean=false;
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;
  @ViewChild(MatSort) matSort! : MatSort;
  filtroPorDefecto:string = '';

  constructor(
    private dialog: MatDialog,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio:UtilidadService
  ) { }

    obtenerUsuarios(){
      this.mostrarLoading=true;
      this._usuarioServicio.lista().subscribe({
        next:(data)=>{
          if(data.status)
            this.dataListaUsuarios.data=data.value;
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
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator= this.paginacionTabla;
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

    this.dataListaUsuarios.sort = this.matSort;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter= filterValue.trim().toLocaleLowerCase();
  }
  aplicarFiltro(a: any){
    this.dataListaUsuarios.filter= a.trim().toLocaleLowerCase();
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado=>{
      if(resultado=='true') this.obtenerUsuarios();
    });
  }

  editarUsuario(usuario:Usuario){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose:true,
      data:usuario
    }).afterClosed().subscribe(resultado=>{
      if(resultado=='true') this.obtenerUsuarios();
    });
  }

  eliminarUsuario(usuario:Usuario){
    Swal.fire({
      title: '¿Desea eliminar al usuario?',
      text: usuario.nombreCompleto,
      icon:"warning",
      confirmButtonColor: '#d33',
      confirmButtonText:"Eliminar",
      showCancelButton:true,
      cancelButtonColor:'#303F9F',
      cancelButtonText: 'Volver'
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._usuarioServicio.eliminar(usuario.idUsuario).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El usuario fue eliminado","Exito!")
              this.obtenerUsuarios();
            }else
            this._utilidadServicio.mostrarAlerta("No se pudo eliminar","Error!")
          },
          error:(e)=>{}
        })
      }

    })
  }

}
