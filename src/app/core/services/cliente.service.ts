import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { Combo } from '../models/combo';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);

  //private api = 'https://localhost:44306/api/cliente';

  private api = 'https://localhost:7721/api/cliente';

  obtenerTodos(): Observable<Cliente[]>{
      return this.http.get<Cliente[]>(this.api);
  }

  obtenerCombo() {

    return this.http.get<Combo[]>(`${this.api}/combo`);

  }

}