import { DetalleVenta } from "./detalle-venta"

export interface Venta {
    idVenta?:number,
    numeroDocumento?:string,
    tipoPago:string,
    totalTexto:string,
    esPagado:number,
    cliente:string,
    vendedor:string,
    fechaRegistro?:string
    detalleVenta: DetalleVenta[]
}
