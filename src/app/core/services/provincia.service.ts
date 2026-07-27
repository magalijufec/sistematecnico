import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Combo } from '../models/combo';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7122/api/provincia';

  obtenerCombo(): Observable<Combo[]> {
    return this.http.get<Combo[]>(
      `${this.apiUrl}/combo`
    );
  }

  obtenerPorId(id: number): Observable<Combo> {
    return this.http.get<Combo>(
      `${this.apiUrl}/${id}`
    );
  }
}