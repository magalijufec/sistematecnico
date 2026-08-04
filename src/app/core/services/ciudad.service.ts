import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Combo } from '../models/combo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/ciudad`;

  obtenerCombo(): Observable<Combo[]> {
    return this.http.get<Combo[]>(
      `${this.api}/combo`
    );
  }

  obtenerPorProvincia(provinciaId: number): Observable<Combo[]> {
    return this.http.get<Combo[]>(
      `${this.api}/provincia/${provinciaId}`
    );
  }

  obtenerPorId(id: number): Observable<Combo> {
    return this.http.get<Combo>(
      `${this.api}/${id}`
    );
  }

}