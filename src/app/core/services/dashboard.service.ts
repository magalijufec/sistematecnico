import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dashboard } from '../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private api = 'https://localhost:44306/api/dashboard';

  obtenerDashboard(): Observable<Dashboard> {

    return this.http.get<Dashboard>(this.api);

  }

}