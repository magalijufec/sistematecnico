export interface TrabajoDetalle{
    id:number;
    cliente:string;
    tecnico:string;
    tarea:string;
    fechaSolicitud:string;
    fechaTrabajo:string;
    estado:string;
    estadoColor:string;
    comentarios:string;
    trabajoRealizado:string;
    cantidadImagenes:number;
    tieneFactura:boolean;
}