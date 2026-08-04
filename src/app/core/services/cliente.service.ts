import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Cliente,
  ClienteDetalle,
  ClienteCreate,
  ClienteUpdate
} from '../models/cliente';

import { ClienteCombo } from '../models/cliente-combo';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);
  private api = 'https://localhost:7122/api/cliente';

  obtenerTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api);
  }

  obtenerCombo(): Observable<ClienteCombo[]> {
    return this.http.get<ClienteCombo[]>(
      `${this.api}/combo`
    );
  }

  obtenerPorId(
    id: number
  ): Observable<ClienteDetalle> {

    return this.http.get<ClienteDetalle>(
      `${this.api}/${id}`
    );

  }

  crear(
    cliente: ClienteCreate
  ): Observable<void> {

    return this.http.post<void>(
      this.api,
      cliente
    );

  }

  actualizar(
    id: number,
    cliente: ClienteUpdate
  ): Observable<void> {

    return this.http.put<void>(
      `${this.api}/${id}`,
      cliente
    );

  }

  obtenerPorProvinciaCiudad(
    provinciaId: number,
    ciudadId: number
  ): Observable<ClienteCombo[]> {

    return this.http.get<ClienteCombo[]>(
      `${this.api}/provincia/${provinciaId}/ciudad/${ciudadId}`
    );

  }

}

