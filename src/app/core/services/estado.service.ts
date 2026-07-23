import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Combo } from '../models/combo';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  private http = inject(HttpClient);

  //private api = 'https://localhost:44306/api/estadotrabajo';
  private api = 'https://localhost:7122/api/estadotrabajo';

obtenerCombo() {
    return this.http.get<Combo[]>(`${this.api}/combo`);
}

obtenerEstadosSiguientes(idTrabajo: number) {
  return this.http.get<Combo[]>(
    `${this.api}/siguientes/${idTrabajo}`
  );

}

}