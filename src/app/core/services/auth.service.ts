import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { Login } from '../models/login';
import { LoginResponse } from '../models/login-response';
import { Router } from '@angular/router';
import { CambiarPassword } from '../models/cambiar-password';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient);
    private router = inject(Router);
    private api = 'https://localhost:7122/api/auth';

    login(dto: Login): Observable<LoginResponse> {

        return this.http
            .post<LoginResponse>(
                `${this.api}/login`,
                dto
            )
            .pipe(

                tap(response => {

                    localStorage.setItem(
                        'token',
                        response.token
                    );

                    localStorage.setItem(
                        'usuario',
                        JSON.stringify(response)
                    );

                })

            );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.router.navigate(
            ['/login']
        );
    }

    obtenerToken(): string | null {
        return localStorage.getItem('token');
    }

    obtenerUsuario(): LoginResponse | null {
        const usuario = localStorage.getItem('usuario');
        if (!usuario)
            return null;
        return JSON.parse(usuario);
    }

    estaLogueado(): boolean {
        return !!this.obtenerToken();
    }

    cambiarPassword(datos: CambiarPassword): Observable<any> {
        return this.http.post(
            `${this.api}/cambiar-password`,
            datos
        );
    }

    obtenerRol(): string | null {
        const token =
            this.obtenerToken();
        if (!token) {
            return null;
        }
        try {
            const partes =
                token.split('.');

            const payload =
                JSON.parse(
                    atob(partes[1])
                );

            return (
                payload[
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                ] ?? null
            );

        } catch (error) {

            console.error(
                'Error al leer JWT',
                error
            );
            return null;
        }
    }

    esAdministrador(): boolean {
        return this.obtenerRol() === 'Administrador';
    }

    tieneRol(...roles: string[]): boolean {
        const rol = this.obtenerRol();
        return !!rol && roles.includes(rol);
    }
}