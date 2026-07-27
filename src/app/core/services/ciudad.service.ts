import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Combo } from '../models/combo';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7122/api/ciudad';

  obtenerCombo(): Observable<Combo[]> {
    return this.http.get<Combo[]>(
      `${this.apiUrl}/combo`
    );
  }

  obtenerPorProvincia(provinciaId: number): Observable<Combo[]> {
    return this.http.get<Combo[]>(
      `${this.apiUrl}/provincia/${provinciaId}`
    );
  }

  obtenerPorId(id: number): Observable<Combo> {
    return this.http.get<Combo>(
      `${this.apiUrl}/${id}`
    );
  }

}