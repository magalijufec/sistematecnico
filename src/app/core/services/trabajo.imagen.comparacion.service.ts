import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrabajoImagenComparacion } from '../models/imagen';

@Injectable({
  providedIn: 'root'
})
export class TrabajoImagenComparacionService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7122/api/trabajo-imagen-comparacion';

  obtenerPorTrabajo(idTrabajo: number): Observable<TrabajoImagenComparacion[]> {
    return this.http.get<TrabajoImagenComparacion[]>(
      `${this.apiUrl}/trabajo/${idTrabajo}`
    );
  }

  crear(idTrabajo: number): Observable<TrabajoImagenComparacion> {
    return this.http.post<TrabajoImagenComparacion>(
      `${this.apiUrl}/trabajo/${idTrabajo}`,
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
      `${this.apiUrl}/${idComparacion}/antes`,
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
      `${this.apiUrl}/${idComparacion}/despues`,
      formData
    );
  }

  eliminar(idComparacion: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${idComparacion}`
    );
  }
}