import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Combo } from '../models/combo';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private http = inject(HttpClient);

  private api = 'https://localhost:7122/api/perfil';

  obtenerPerfiles(): Observable<Combo[]> {
    return this.http.get<Combo[]>(this.api);
  }

}