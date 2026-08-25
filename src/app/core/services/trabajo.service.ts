import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trabajo } from '../models/trabajo';
import { TrabajoCreate } from '../models/trabajo-create';
import { TrabajoDetalle } from '../models/trabajo-detalle';
import { TrabajoFinalizado } from '../models/trabajo-finalizado';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrabajoService {

  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/trabajo`;

  obtenerNoFinalizados(): Observable<Trabajo[]> {
    return this.http.get<Trabajo[]>(`${this.api}/no-finalizados`);
  }

  obtenerFinalizados(): Observable<TrabajoFinalizado[]> {
    return this.http.get<TrabajoFinalizado[]>(`${this.api}/finalizados`);
  }

  obtenerPendientePago(): Observable<TrabajoFinalizado[]> {
    return this.http.get<TrabajoFinalizado[]>(`${this.api}/pendiente-pago`);
  }

  obtenerPorId(id: number): Observable<Trabajo> {
    return this.http.get<Trabajo>(`${this.api}/${id}`);
  }

  crear(trabajo: TrabajoCreate): Observable<Trabajo> {
    const formData = new FormData();
    formData.append('IdCliente', trabajo.idCliente.toString());
    formData.append('IdTecnico', trabajo.idTecnico.toString());
    formData.append('IdTarea', trabajo.idTarea.toString());
    formData.append('Comentarios', trabajo.comentarios ?? '');

    trabajo.archivos?.forEach(a => {
      formData.append('Archivos', a);
    });

    return this.http.post<Trabajo>(
      this.api,
      formData
    );
  }

  actualizar(id: number, trabajo: TrabajoCreate): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, trabajo);
  }

  obtenerDetalle(id: number) {
    return this.http.get<TrabajoDetalle>(`${this.api}/${id}`);
  }

  iniciarTrabajo(id: number): Observable<any> {
    return this.http.put(
      `${this.api}/${id}/iniciar`,
      {}
    );
  }

  finalizarTrabajo(
    id: number,
    trabajoRealizado: string
  ): Observable<any> {

    return this.http.put(
      `${this.api}/${id}/finalizar`,
      {
        trabajoRealizado: trabajoRealizado
      }
    );
  }

  solicitarMejora(
    id: number,
    comentario: string
  ): Observable<any> {

    return this.http.put(
      `${this.api}/${id}/solicitar-mejora`,
      {
        comentario: comentario
      }
    );
  }

  aprobarTrabajo(id: number): Observable<any> {
    return this.http.put(
      `${this.api}/${id}/aprobar`,
      {}
    );
  }

  registrarPago(id: number): Observable<any> {
    return this.http.put(
      `${this.api}/${id}/registrar-pago`,
      {}
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

  subirFactura(
    idTrabajo: number,
    archivo: File
  ) {
    const formData = new FormData();
    formData.append('archivo', archivo);

    return this.http.post(
      `${this.api}/${idTrabajo}/factura`,
      formData
    );
  }



}