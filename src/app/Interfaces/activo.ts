export interface Activo {
    idActivo:number,
    nombre:string,
    marca:string,
    codigo:string,
    cliente?:string,
    encargado?:String,
    esContrato?:number,
    esActivo:number,
    fechaCaducidad?:string
}
