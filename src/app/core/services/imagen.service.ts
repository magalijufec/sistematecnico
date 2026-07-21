import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Imagen } from '../models/imagen';

@Injectable({
    providedIn: 'root'
})
export class ImagenService {

    private http = inject(HttpClient);

    private api =
        'https://localhost:44306/api/trabajo';


    obtenerPorTrabajo(idTrabajo: number) {

        return this.http.get<Imagen[]>(
            `${this.api}/${idTrabajo}/imagenes`
        );

    }

    subir(
        idTrabajo: number,
        antes: boolean,
        archivos: File[]
    ) {
        const formData = new FormData();

        formData.append(
            'antes',
            antes.toString()
        );

        archivos.forEach(file => {
            formData.append(
                'archivos',
                file
            );

        });

        return this.http.post(
            `${this.api}/${idTrabajo}/imagenes`,
            formData
        );

    }

    eliminar(id: number) {
        return this.http.delete(
            `${this.api}/imagenes/${id}`
        );

    }

}