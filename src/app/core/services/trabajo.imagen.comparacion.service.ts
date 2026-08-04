import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrabajoImagenComparacion } from '../models/imagen';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrabajoImagenComparacionService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/trabajo-imagen-comparacion`;

  obtenerPorTrabajo(idTrabajo: number): Observable<TrabajoImagenComparacion[]> {
    return this.http.get<TrabajoImagenComparacion[]>(
      `${this.api}/trabajo/${idTrabajo}`
    );
  }

  crear(idTrabajo: number): Observable<TrabajoImagenComparacion> {
    return this.http.post<TrabajoImagenComparacion>(
      `${this.api}/trabajo/${idTrabajo}`,
      {}
    );
  }

  subirAntes(idComparacion: number, archivo: File): Observable<void> {
    const formData = new FormData();

    formData.append(
      'archivo',
      archivo
    );

    return this.http.post<void>(
      `${this.api}/${idComparacion}/antes`,
      formData
    );
  }

  subirDespues(idComparacion: number, archivo: File): Observable<void> {
    const formData = new FormData();
    formData.append(
      'archivo',
      archivo
    );

    return this.http.post<void>(
      `${this.api}/${idComparacion}/despues`,
      formData
    );
  }

  eliminar(idComparacion: number): Observable<void> {
    return this.http.delete<void>(
      `${this.api}/${idComparacion}`
    );
  }
}