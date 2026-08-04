import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Combo } from '../models/combo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/perfil`;

  obtenerPerfiles(): Observable<Combo[]> {
    return this.http.get<Combo[]>(this.api);
  }

}