import { Component, OnInit } from '@angular/core';
import { Chart,registerables } from 'chart.js';
import { DashBoardService } from 'src/app/Services/dash-board.service';
import { FormBuilder,FormGroup} from '@angular/forms';
Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {

  totalIngresos:string="0";
  totalVentas:string="0";
  totalProductos:string="0";
  numeroVendedores:string="0";
  formularioDashboard:FormGroup;
  añoActual:number = new Date().getFullYear();
  mostrarLoading:boolean=false;

  opcionesBusqueda: any [] = [
    {value:"intervalo", desripcion: "Intervalo"},
    {value:"mes", desripcion: "Mes"},
    {value:"año", desripcion: "Año"},
    {value:"vendedor", desripcion: "Vendedores"},
    {value:"productos", desripcion: "Productos"}
  ]

  listaAnos: any [] = [
    {value:this.añoActual-3, desripcion:(this.añoActual-3).toString()},
    {value:this.añoActual-2, desripcion:(this.añoActual-2).toString()},
    {value:this.añoActual-1, desripcion:(this.añoActual-1).toString()},
    {value:this.añoActual, desripcion:(this.añoActual).toString()}
  ]

  constructor(
    private _dashboardServicio:DashBoardService,
    private fb:FormBuilder
  ) {

    this.formularioDashboard = this.fb.group({
      buscarPor: ['intervalo'],
      intervalo: ['7'],
      mes:['5'],
      año:[this.listaAnos[3].value]
    })

    this.formularioDashboard.get("buscarPor")?.valueChanges.subscribe(value=>{
      this.formularioDashboard.patchValue({
        intervalo: "7",
        mes: "1",
        año:this.listaAnos[3].value
      })
      this.obtenerDatos();
    })
   }

  mostrarGrafico(labelGrafico:any[], dataGrafico:any[]){
    var chartExist = Chart.getChart("chartBarras");
    if (chartExist != undefined)  
      chartExist.destroy(); 

    const chartBarras = new Chart('chartBarras',{
      type:"bar",
      data:{
        labels: labelGrafico,
        datasets:[{
          label:"Numero de ventas",
          data: dataGrafico,
          backgroundColor:[
            '#3f51b5'
          ],
          borderColor:[
            'rgba(0,0,0,.87)'
          ],
          borderWidth:2
        }]
      },
      options:{
        maintainAspectRatio:false,
        responsive:true,
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    });
  }

  mostrarHistograma(labelGrafico:any[], dataGrafico:any[]){

    var chartExist = Chart.getChart("chartBarras");
    if (chartExist != undefined)  
      chartExist.destroy(); 

    const chartBarras = new Chart('chartBarras',{
      type:"line",
      data:{
        labels: labelGrafico,
        datasets:[{
          label:"Numero de ventas",
          data: dataGrafico,
          backgroundColor:[
            'rgba(0,0,0,.87)'
          ],
          borderColor:[
            '#3f51b5'
          ],
          borderWidth:1
        }]
      },
      options:{
        maintainAspectRatio:false,
        responsive:true,
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    });
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
        for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
  }

  mostrarPie(labelGrafico:any[], dataGrafico:any[]){
    var chartExist = Chart.getChart("chartBarras");
    if (chartExist != undefined)  
      chartExist.destroy(); 
    const chartBarras = new Chart('chartBarras',{
      type:"pie",
      data:{
        labels: labelGrafico,
        datasets:[{
          label:"Numero de ventas.",
          data: dataGrafico,
          backgroundColor:[
            this.getRandomColor(),this.getRandomColor(),this.getRandomColor(),this.getRandomColor(),
            this.getRandomColor(),this.getRandomColor(),this.getRandomColor(),this.getRandomColor(),this.getRandomColor()
          ],
          borderColor:[
            'rgba(0,0,0,.87)'
          ],
          borderWidth:1
        }]
      },
      options:{
        maintainAspectRatio:false,
        responsive:true,
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    });
  }

  obtenerDatos(){

    this.mostrarLoading = true;
    if(this.formularioDashboard.value.buscarPor == 'intervalo')
      {
        this._dashboardServicio.resumen(Number(this.formularioDashboard.value.intervalo)).subscribe({
          next:(data)=>{
            if(data.status){
              this.totalIngresos=data.value.totalIngresos;
              this.totalVentas = data.value.totalVentas;
              this.totalProductos = data.value.totalProductos;
              const arrayData: any[] = data.value.datosDash;
              const labelTemp = arrayData?.map((value)=>value.descripcion);
              const dataTemp = arrayData?.map((value)=>value.total);
              this.mostrarGrafico(labelTemp, dataTemp);
            }
          },
          complete : () =>{
            this.mostrarLoading=false;
          },
          error:(e)=>{}
        })
      }

    if(this.formularioDashboard.value.buscarPor == 'mes')
      {
        
        this._dashboardServicio.resumenMes(Number(this.formularioDashboard.value.mes),Number(this.formularioDashboard.value.año)).subscribe({
          next:(data)=>{
            if(data.status){
              this.totalIngresos=data.value.totalIngresos;
              this.totalVentas = data.value.totalVentas;
              this.totalProductos = data.value.totalProductos;
    
              const arrayData: any[] = data.value.datosDash;
    
              const labelTemp = arrayData?.map((value)=>value.descripcion);
              const dataTemp = arrayData?.map((value)=>value.total);
              this.mostrarGrafico(labelTemp, dataTemp);
            }
          },
          complete : () =>{
            this.mostrarLoading=false;
          },
          error:(e)=>{}
        })

      }

    if(this.formularioDashboard.value.buscarPor == 'año')
      {
        this._dashboardServicio.resumenAño(Number(this.formularioDashboard.value.año)).subscribe({
          next:(data)=>{
            if(data.status){
              this.totalIngresos=data.value.totalIngresos;
              this.totalVentas = data.value.totalVentas;
              this.totalProductos = data.value.totalProductos;
    
              const arrayData: any[] = data.value.datosDash;
    
              const labelTemp = arrayData?.map((value)=>value.descripcion);
              const dataTemp = arrayData?.map((value)=>value.total);
              this.mostrarHistograma(labelTemp, dataTemp);
            }
          },
          complete : () =>{
            this.mostrarLoading=false;
          },
          error:(e)=>{}
        })

      }

      if(this.formularioDashboard.value.buscarPor == 'vendedor')
        {

          this._dashboardServicio.resumenVendedores(Number(this.formularioDashboard.value.año)).subscribe({
            next:(data)=>{
              if(data.status){
                this.totalIngresos=data.value.totalIngresos;
                this.totalVentas = data.value.totalVentas;
                this.totalProductos = data.value.totalVendedores;
      
                const arrayData: any[] = data.value.datosDash;
      
                const labelTemp = arrayData?.map((value)=>value.descripcion);
                const dataTemp = arrayData?.map((value)=>value.total);
                this.mostrarPie(labelTemp, dataTemp);
              }
            },
            complete : () =>{
              this.mostrarLoading=false;
            },
            error:(e)=>{}
          })

        }

      if(this.formularioDashboard.value.buscarPor == 'productos')
        {

          this._dashboardServicio.resumenProductos(Number(this.formularioDashboard.value.año)).subscribe({
            next:(data)=>{
              if(data.status){
                this.totalIngresos=data.value.totalIngresos;
                this.totalVentas = data.value.totalVentas;
                this.totalProductos = data.value.totalProductos;
      
                const arrayData: any[] = data.value.datosDash;
      
                const labelTemp = arrayData?.map((value)=>value.descripcion);
                const dataTemp = arrayData?.map((value)=>value.total);
                this.mostrarPie(labelTemp, dataTemp);
              }
            },
            complete : () =>{
              this.mostrarLoading=false;
            },
            error:(e)=>{}
          })

        }

    

  }

  ngOnInit(): void {

    this.mostrarLoading=true;
    this._dashboardServicio.resumen(Number(this.formularioDashboard.value.intervalo)).subscribe({
      next:(data)=>{
        if(data.status){
          this.totalIngresos=data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayData: any[] = data.value.datosDash;

          const labelTemp = arrayData?.map((value)=>value.descripcion);
          const dataTemp = arrayData?.map((value)=>value.total);
          this.mostrarGrafico(labelTemp, dataTemp);
        }
      },
      complete : () =>{
        this.mostrarLoading=false;
      },
      error:(e)=>{}
    })
    
  }

}
