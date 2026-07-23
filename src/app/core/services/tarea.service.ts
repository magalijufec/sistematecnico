import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Combo } from '../models/combo';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private http = inject(HttpClient);

  //private api = 'https://localhost:44306/api/tarea';
  private api = 'https://localhost:7122/api/tarea';

  obtenerTodas() {

  return this.http.get<Combo[]>(this.api);

}

}