import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trabajo } from '../models/trabajo';
import { TrabajoCreate } from '../models/trabajo-create';
import { TrabajoDetalle } from '../models/trabajo-detalle';
import { CambiarEstado } from '../models/cambiar-estado';
import { TrabajoFinalizado } from '../models/trabajo-finalizado';

@Injectable({
  providedIn: 'root'
})
export class TrabajoService {

  private http = inject(HttpClient);

  //private api = 'https://localhost:44306/api/trabajo';
  private api = 'https://localhost:7122/api/trabajo';
   //private api = 'http://localhost:5010/api/trabajo';   

  obtenerNoFinalizados(): Observable<Trabajo[]> {
    return this.http.get<Trabajo[]>( `${this.api}/no-finalizados`);
  }

  obtenerFinalizados(): Observable<TrabajoFinalizado[]> {
    return this.http.get<TrabajoFinalizado[]>( `${this.api}/finalizados`);
  }

  obtenerPendientePago(): Observable<TrabajoFinalizado[]> {
    return this.http.get<TrabajoFinalizado[]>( `${this.api}/pendiente-pago`);
  }

  obtenerPorId(id: number): Observable<Trabajo> {
    return this.http.get<Trabajo>(`${this.api}/${id}`);
  }

  crear(trabajo: TrabajoCreate): Observable<Trabajo> {
    return this.http.post<Trabajo>(this.api, trabajo);
  }

  actualizar(id: number, trabajo: TrabajoCreate): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, trabajo);
  }

  obtenerDetalle(id: number) {
    return this.http.get<TrabajoDetalle>(`${this.api}/${id}`);
  }

  cambiarEstado(id: number, dto: CambiarEstado) {
    return this.http.put(
      `${this.api}/${id}/estado`,
      dto
    );
  }

  guardarTrabajoRealizado(id: number, texto: string) {
    return this.http.put(
      `${this.api}/${id}/trabajo-realizado`,
      {
        trabajoRealizado: texto
      }
    );
  }

  subirImagenes(idTrabajo: number, archivos: File[], tipo: number) {
    const formData = new FormData();
    formData.append("tipo", tipo.toString());
    archivos.forEach(x => {
      formData.append("files", x);
    });

    return this.http.post(
      `${this.api}/${idTrabajo}/imagenes`,
      formData
    );
  }

  subirImagen(
    idTrabajo: number,
    archivo: File,
    esAntes: boolean) {

    const form = new FormData();

    form.append('archivo', archivo);
    form.append('esAntes', esAntes.toString());

    return this.http.post(
      `${this.api}/${idTrabajo}/imagenes`,
      form
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

  registrarPago(id: number): Observable<void> {
    return this.http.put<void>(
      `${this.api}/${id}/registrar-pago`,
      {}
    );
  }

}