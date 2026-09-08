import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PresupuestoDetalle } from '../models/presupuesto-detalle';

@Injectable({
    providedIn: 'root'
})
export class PresupuestoService {

    private http = inject(HttpClient);
    private api = `${environment.apiUrl}/presupuesto`;

    obtenerPorTrabajo(trabajoId: number) {
        return this.http.get<PresupuestoDetalle[]>(
            `${this.api}/trabajo/${trabajoId}`
        );
    }

    crear(trabajoId: number, tecnicoId: number, descripcion: string, archivo: File) {
        const formData = new FormData();

        formData.append(
            'trabajoId',
            trabajoId.toString()
        );

        formData.append(
            'tecnicoId',
            tecnicoId.toString()
        );

        formData.append(
            'descripcion',
            descripcion
        );

        formData.append(
            'archivo',
            archivo,
            archivo.name
        );

        return this.http.post<{
            mensaje: string;
        }>(
            `${this.api}/${trabajoId}`,
            formData
        );

    }

    actualizar(presupuestoId: number, descripcion: string, archivo: File | null) {
        const formData =
            new FormData();

        formData.append(
            'descripcion',
            descripcion
        );

        if (archivo) {
            formData.append(
                'archivo',
                archivo,
                archivo.name
            );
        }

        return this.http.put(
            `${this.api}/${presupuestoId}`,
            formData
        );
    }

    aprobar(id: number, idUsuarioDecision: number) {
        return this.http.put(
            `${this.api}/${id}`,
            {
                idUsuarioDecision,
                rechazo: false,
                motivoRechazo: null
            }
        );
    }

    rechazar(id: number, idUsuarioDecision: number, motivoRechazo: string) {
        return this.http.put(
            `${this.api}/${id}`,
            {
                idUsuarioDecision,
                rechazo: true,
                motivoRechazo
            }
        );
    }

}