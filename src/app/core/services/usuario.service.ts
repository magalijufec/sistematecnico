import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Combo } from '../models/combo';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);

  //private api = 'https://localhost:44306/api/usuario';
  private api = 'https://localhost:7122/api/usuario';

  obtenerTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.api);
  }

  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.api}/${id}`);
  }

  crear(usuario: any) {
    return this.http.post(this.api, usuario);
  }

  actualizar(id: number, usuario: any) {
    return this.http.put(`${this.api}/${id}`, usuario);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  obtenerTecnicos(): Observable<Combo[]> {
    return this.http.get<Combo[]>(`${this.api}/tecnicos`);
  }

}