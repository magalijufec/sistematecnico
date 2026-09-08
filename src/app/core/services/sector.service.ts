import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Combo } from '../models/combo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/sector`;

  obtenerTodas() {
    return this.http.get<Combo[]>(this.api);
  }

}