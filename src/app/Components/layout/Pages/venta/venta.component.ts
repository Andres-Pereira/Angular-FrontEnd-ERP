import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Cliente } from 'src/app/Interfaces/cliente';
import { ClienteService } from 'src/app/Services/cliente.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  listaProductos:Producto[]=[];
  listaUsuarios: Usuario[]=[];
  listaClientes: Cliente[]=[];
  listaProductosFiltro: Producto[]=[];
  listaClientesFiltro: Cliente[]=[];
  listaProductosParaVenta: DetalleVenta[]=[];
  listaIds: number [] = [];
  bloquearBotonRegistrar:boolean=false;
  productoSeleccionado!:Producto;
  totalPagar: number = 0;
  stockMaximo: number= 0;
  mostrarLoading: boolean= false;

  formularioProductoVenta:FormGroup;
  columnasTabla:string[]=['producto','cantidad','precio','total','accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  retornarProductosPorFiltro(busqueda:any):Producto[]{
    const valorBuscado = typeof busqueda == "string"? busqueda.toLocaleLowerCase():busqueda.nombre.toLocaleLowerCase();
    return this.listaProductos.filter(item=>item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  retornarClientesPorFiltro(busqueda:any):Cliente[]{
    const valorBuscado = typeof busqueda == "string"? busqueda.toLocaleLowerCase():busqueda.nombreCompleto.toLocaleLowerCase();
    return this.listaClientes.filter(item=>item.nombreCompleto.toLocaleLowerCase().includes(valorBuscado));
  }

  constructor(
    private fb:FormBuilder,
    private _productoServicio:ProductoService,
    private _usuarioServicio:UsuarioService,
    private _clienteServicio:ClienteService,
    private _ventaServicio:VentaService,
    private _utilidadServicio:UtilidadService

  ) { 
    this.formularioProductoVenta = this.fb.group({
      producto:['',Validators.required],
      cantidad:['',Validators.required],
      cliente:['',Validators.required],
      vendedor:['',Validators.required],
      tipoPago:['',Validators.required],
      esPagado:['',Validators.required]
    });
    
    this._productoServicio.lista().subscribe({
      next:(data)=>{
        if(data.status){
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p=>p.esActivo == 1 && p.stock > 0);
        }
      },
      error:(e)=>{}
    })

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value=>{
      this.listaProductosFiltro= this.retornarProductosPorFiltro(value);
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
          const lista3 = d.value as Cliente[];
          this.listaClientes = lista3.filter(u=>u.esActivo == 1);
        }
      },
      error:(e)=>{}
    })

    this.formularioProductoVenta.get('cliente')?.valueChanges.subscribe(value=>{
      this.listaClientesFiltro= this.retornarClientesPorFiltro(value);
    })

  }

  ngOnInit(): void {
  }

  mostrarProducto(producto:Producto):string{
    return producto.nombre;
  }
  
  productoParaVenta(event:any){
    this.productoSeleccionado = event.option .value;
    this.stockMaximo = this.productoSeleccionado.stock;
  }

  listaProd(){
    this.listaIds = [];
    if (this.listaProductosParaVenta.length>=1)
      {
        for(var i=0; i<this.listaProductosParaVenta.length; i++)
          {
            this.listaIds.push(this.listaProductosParaVenta[i].idProducto);
          }
      }
  }

  editarCantidad(id:number,cant:number, precio:number){
    for(var i=0; i<this.listaProductosParaVenta.length; i++)
      {
        if(id==this.listaProductosParaVenta[i].idProducto)
          {
            this.listaProductosParaVenta[i].cantidad = this.listaProductosParaVenta[i].cantidad +cant;
            var total = this.listaProductosParaVenta[i].cantidad * precio;
            this.listaProductosParaVenta[i].totalTexto = String(total.toFixed(2));
          }
          
      }

  }


  agregarProductoParaVenta(){
    const _cantidad:number = this.formularioProductoVenta.value.cantidad;
    const _precio:number = parseFloat(this.productoSeleccionado.precio);
    const _total:number = _cantidad * _precio;
    this.totalPagar =this.totalPagar + _total;
    this.listaProd();

    if(this.listaIds.includes(this.productoSeleccionado.idProducto))
      {
        this.editarCantidad(this.productoSeleccionado.idProducto,_cantidad, _precio);
      }
    else{
      this.listaProductosParaVenta.push({
        idProducto: this.productoSeleccionado.idProducto,
        descripcionProducto: this.productoSeleccionado.nombre,
        cantidad: _cantidad,
        precioTexto: String(_precio.toFixed(2)),
        totalTexto: String(_total.toFixed(2))
      })
    }

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
    this.formularioProductoVenta.patchValue({
      producto:"",
      cantidad:""
    })
  }

  eliminarProducto(detalle:DetalleVenta){
    this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto);
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p=> p.idProducto != detalle.idProducto);
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  }

  registrarVenta(){
    this.mostrarLoading=true;
    if(this.listaProductosParaVenta.length>0){
      this.bloquearBotonRegistrar = true;
      const request: Venta ={
        tipoPago:this.formularioProductoVenta.value.tipoPago,
        totalTexto: String(this.totalPagar.toFixed(2)),
        esPagado: this.formularioProductoVenta.value.esPagado,
        cliente:this.formularioProductoVenta.value.cliente,
        vendedor:this.formularioProductoVenta.value.vendedor.toString(),
        detalleVenta: this.listaProductosParaVenta
      }

      this._ventaServicio.registrar(request).subscribe({
        next:(response)=>{
          if(response.status){
            this.totalPagar = 0.00;
            this.listaProductosParaVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
            this.formularioProductoVenta.patchValue({
              cliente:"",
              tipoPago:"",
              esPagado:"",
              vendedor: ""
            })

            this._productoServicio.lista().subscribe({
              next:(data)=>{
                if(data.status){
                  const lista = data.value as Producto[];
                  this.listaProductos = lista.filter(p=>p.esActivo == 1 && p.stock > 0);
                }
              },
              error:(e)=>{}
            })

            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada!',
              text: `Numero de venta: ${response.value.numeroDocumento}`
            })
          }else
          this._utilidadServicio.mostrarAlerta("No se pudo registrar la venta!","Oops");
        },
        complete:()=>{
          this.bloquearBotonRegistrar = false;
          this.mostrarLoading=false;
        },
        error:(e)=>{}
      })
    }
  }


}
