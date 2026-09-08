import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trabajo } from '../models/trabajo';
import { TrabajoCreate } from '../models/trabajo-create';
import { TrabajoDetalle } from '../models/trabajo-detalle';
import { TrabajoFinalizado } from '../models/trabajo-finalizado';
import { environment } from '../../environments/environment';
import { RegistrarPagoFacturaResponse } from '../models/registrar-pago-factura';
import { TrabajoSolicitud } from '../models/trabajo-solicitud';

@Injectable({
  providedIn: 'root'
})
export class TrabajoService {

  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/trabajo`;

  obtenerSolicitudesDeTrabajo(): Observable<TrabajoSolicitud[]> {
    return this.http.get<TrabajoSolicitud[]>(`${this.api}/solicitudes`);
  }

  obtenerNoFinalizados(): Observable<Trabajo[]> {
    return this.http.get<Trabajo[]>(`${this.api}/no-finalizados`);
  }

  obtenerPagados(): Observable<TrabajoFinalizado[]> {
    return this.http.get<TrabajoFinalizado[]>(`${this.api}/pagados`);
  }

  obtenerPendientePago(): Observable<TrabajoFinalizado[]> {
    return this.http.get<TrabajoFinalizado[]>(`${this.api}/pendiente-pago`);
  }

  obtenerPorId(id: number): Observable<Trabajo> {
    return this.http.get<Trabajo>(`${this.api}/${id}`);
  }

  crear(trabajo: TrabajoCreate) {
    const formData =
      this.crearFormData(trabajo);

    return this.http.post(
      this.api,
      formData
    );
  }


  actualizar(idTrabajo: number, trabajo: TrabajoCreate) {
    const formData =
      this.crearFormData(trabajo);

    return this.http.put(
      `${this.api}/${idTrabajo}`,
      formData
    );
  }

  decidirSolicitud(idTrabajo: number, aprobado: boolean, motivoRechazo: string | null) {
    return this.http.put<{
      mensaje: string;
    }>(
      `${this.api}/${idTrabajo}/decision-solicitud`,
      {
        aprobado,
        motivoRechazo
      }
    );
  }

  asignarTecnicos(idTrabajo: number, idsTecnicos: number[]) {
    return this.http.put(
      `${this.api}/${idTrabajo}/asignar-tecnicos`,
      idsTecnicos
    );
  }

  private crearFormData(trabajo: TrabajoCreate): FormData {

    const formData =
      new FormData();

    formData.append(
      'idUsuarioCreacion',
      trabajo.idUsuarioCreacion.toString()
    );

    formData.append(
      'idCliente',
      trabajo.idCliente.toString()
    );

    formData.append(
      'idSector',
      trabajo.idSector.toString()
    );

    formData.append(
      'idTarea',
      trabajo.idTarea.toString()
    );

    formData.append(
      'comentarios',
      trabajo.comentarios ?? ''
    );

    trabajo.idsTecnicos.forEach(
      tecnicoId => {

        formData.append(
          'idsTecnicos',
          tecnicoId.toString()
        );
      }
    );

    trabajo.archivos.forEach(
      archivo => {

        formData.append(
          'archivos',
          archivo,
          archivo.name
        );
      }
    );

    return formData;
  }

  obtenerDetalle(id: number) {
    return this.http.get<TrabajoDetalle>(`${this.api}/${id}`);
  }

  // finalizarTrabajo(id: number, trabajoRealizado: string): Observable<any> {
  //   return this.http.put(
  //     `${this.api}/${id}/finalizar`,
  //     {
  //       trabajoRealizado: trabajoRealizado
  //     }
  //   );
  // }

  solicitarMejora(id: number, comentario: string): Observable<any> {
    return this.http.put(
      `${this.api}/${id}/solicitar-mejora`,
      { comentario: comentario }
    );
  }

  aprobarTrabajo(id: number): Observable<any> {
    return this.http.put(
      `${this.api}/${id}/aprobar`,
      {}
    );
  }

  registrarPagoFactura(idTrabajo: number, idFactura: number): Observable<RegistrarPagoFacturaResponse> {
    return this.http.put<RegistrarPagoFacturaResponse>(
      `${this.api}/${idTrabajo}/facturas/${idFactura}/registrar-pago`,
      {}
    );
  }

  registrarPago(
    idTrabajo: number
  ) {

    return this.http.put<{
      mensaje?: string;
    }>(
      `${this.api}/${idTrabajo}/registrar-pago`,
      {}
    );
  }

  finalizarTrabajo(
  idTrabajo: number,
  trabajoRealizado: string,
  fechaInicio: string,
  fechaFin: string
) {
  return this.http.put<{
    mensaje?: string;
  }>(
    `${this.api}/${idTrabajo}/finalizar`,
    {
      trabajoRealizado,
      fechaInicio,
      fechaFin
    }
  );
}

  descargarInformePdf(id: number): Observable<Blob> {
    return this.http.get(
      `${this.api}/${id}/informe-pdf`,
      {
        responseType: 'blob'
      }
    );
  }

  subirFacturas(idTrabajo: number, archivos: File[]) {
    const formData = new FormData();

    archivos.forEach(archivo => {
      formData.append(
        'archivos',
        archivo,
        archivo.name
      );
    });

    return this.http.post<{
      mensaje: string;
      cantidad: number;
    }>(
      `${this.api}/${idTrabajo}/facturas`,
      formData
    );
  }

  cargarMateriales(idTrabajo: number, materiales: string) {
    return this.http.put<{ mensaje?: string }>(
      `${this.api}/${idTrabajo}/materiales`,
      {
        materiales
      }
    );
  }

  marcarMaterialesEnviados(idTrabajo: number) {
    return this.http.put<{ mensaje?: string }>(
      `${this.api}/${idTrabajo}/materiales-enviados`,
      { idTrabajo }
    );
  }

}