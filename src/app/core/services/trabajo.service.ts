import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trabajo } from '../models/trabajo';
import { TrabajoCreate } from '../models/trabajo-create';
import { TrabajoDetalle } from '../models/trabajo-detalle';
import { CambiarEstado } from '../models/cambiar-estado';

@Injectable({
  providedIn: 'root'
})
export class TrabajoService {

  private http = inject(HttpClient);

  private api = 'https://localhost:44306/api/trabajo';

  obtenerTodos(): Observable<Trabajo[]> {
    return this.http.get<Trabajo[]>(this.api);
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

}