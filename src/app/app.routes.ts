import { Routes } from '@angular/router';

import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { TrabajosListComponent } from './features/trabajos/trabajos-list/trabajos-list';
import { UsuariosListComponent } from './features/usuarios/usuarios-list/usuarios-list';
import { ClientesListComponent } from './features/clientes/clientes-list/clientes-list';
import { TrabajoFormComponent } from './features/trabajos/trabajo-form/trabajo-form';
import { TrabajoDetalleComponent } from './features/trabajos/trabajo-detalle/trabajo-detalle';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { CambiarPasswordComponent } from './features/usuarios/cambiar-password/cambiar-password';

export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent,
        canActivate: [guestGuard]
    },

    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [
            authGuard
        ],

        children: [

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },

            {
                path: 'cambiar-password',
                component: CambiarPasswordComponent,
                canActivate: [authGuard]
            },

            {
                path: 'dashboard',
                component: DashboardComponent
            },


            {
                path: 'trabajos',
                component: TrabajosListComponent
            },
            {
                path: 'trabajos/nuevo',
                component: TrabajoFormComponent
            },
            {
                path: 'trabajos/:id',
                component: TrabajoDetalleComponent
            },
            {
                path: 'trabajos/:id/editar',
                component: TrabajoFormComponent
            },

            {
                path: 'usuarios',
                component: UsuariosListComponent
            },

            {
                path: 'clientes',
                component: ClientesListComponent
            },

        ]

    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }

];
