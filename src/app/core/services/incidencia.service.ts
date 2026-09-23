import { HttpClient } from "@angular/common/http";
import { CatalogosIncidencia } from "../models/catalogos-incidencia";
import { CrearIncidenciaDto } from "../models/crear-incidencia";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { IncidenciaPendiente } from "../models/incidencia-pendiente";
import { IncidenciaFinalizada } from "../models/incidencia-finalizada";

@Injectable({
    providedIn: 'root'
})
export class IncidenciasService {

    private apiUrl = `${environment.apiUrl}/incidencias`;

    constructor(private http: HttpClient) { }

    obtenerPendientes() {
        return this.http.get<IncidenciaPendiente[]>(
            `${this.apiUrl}/pendientes`
        );
    }

    obtenerFinalizadas() {
        return this.http.get<IncidenciaFinalizada[]>(
            `${this.apiUrl}/finalizadas`
        );
    }

    obtenerCatalogos() {
        return this.http.get<CatalogosIncidencia>(
            `${this.apiUrl}/catalogos`
        );
    }

    crear(dto: CrearIncidenciaDto) {
        return this.http.post(
            `${this.apiUrl}`,
            dto
        );
    }

    finalizar(id: number, trabajoRealizado: string) {
        return this.http.put(
            `${this.apiUrl}/${id}/finalizar`,
            {
                trabajoRealizado
            }
        );
    }

}