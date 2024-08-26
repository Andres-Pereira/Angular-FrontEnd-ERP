import { Component, OnInit, AfterViewInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from 'src/app/Interfaces/producto';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { MatSort, MatSortModule} from '@angular/material/sort';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit {

  columnasTabla: string[]=['nombre','categoria','compatibilidad','stock','precio','estado','acciones'];
  dataInicio:Producto[]=[];
  mostrarLoading:boolean=false;
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;
  @ViewChild(MatSort) matSort! : MatSort;
  searchForm: any;

  constructor(

    private dialog: MatDialog,
    private _productoServicio:ProductoService,
    private _utilidadServicio:UtilidadService
  ) { }

    obtenerProductos(){
      this.mostrarLoading=true;
      this._productoServicio.lista().subscribe({
        next:(data)=>{
          if(data.status)
            this.dataListaProductos.data=data.value;
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
    this.obtenerProductos();
    
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator= this.paginacionTabla;
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

    this.dataListaProductos.sort = this.matSort;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter= filterValue.trim().toLocaleLowerCase();
  }

  nuevoProducto(){
    this.dialog.open(ModalProductoComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado=>{
      if(resultado=='true') this.obtenerProductos();
    });
  }

  editarProducto(producto:Producto){
    this.dialog.open(ModalProductoComponent, {
      disableClose:true,
      data:producto
    }).afterClosed().subscribe(resultado=>{
      if(resultado=='true') this.obtenerProductos();
    });
  }

  eliminarProducto(producto:Producto){
    Swal.fire({
      title: '¿Desea eliminar el producto?',
      text: producto.nombre,
      icon:"warning",
      confirmButtonColor: '#d33',
      confirmButtonText:"Eliminar",
      showCancelButton:true,
      cancelButtonColor:'#303F9F',
      cancelButtonText: 'Volver'
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._productoServicio.eliminar(producto.idProducto).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El producto fue eliminado","Exito!")
              this.obtenerProductos();
            }else
            this._utilidadServicio.mostrarAlerta("No se pudo eliminar","Error!")
          },
          error:(e)=>{}
        })
      }

    })
  }

}
