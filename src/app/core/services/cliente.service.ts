import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { Combo } from '../models/combo';
import { ClienteCombo } from '../models/cliente-combo';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);

  //private api = 'https://localhost:44306/api/cliente';

  private api = 'https://localhost:7122/api/cliente';

  obtenerTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api);
  }

  obtenerCombo() {
    return this.http.get<ClienteCombo[]>(`${this.api}/combo`);
  }

  obtenerPorProvinciaCiudad(provinciaId: number, ciudadId: number): Observable<ClienteCombo[]> {
    return this.http.get<ClienteCombo[]>(
      `${this.api}/provincia/${provinciaId}/ciudad/${ciudadId}`
    );
  }

}