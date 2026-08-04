import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Combo } from '../models/combo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/provincia`;

  obtenerCombo(): Observable<Combo[]> {
    return this.http.get<Combo[]>(
      `${this.api}/combo`
    );
  }

  obtenerPorId(id: number): Observable<Combo> {
    return this.http.get<Combo>(
      `${this.api}/${id}`
    );
  }
}