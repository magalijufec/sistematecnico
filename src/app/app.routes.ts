import { Routes } from '@angular/router';

import {
    MainLayoutComponent
} from './shared/layouts/main-layout/main-layout';

import {
    DashboardComponent
} from './features/dashboard/dashboard/dashboard';

import {
    TrabajosListComponent
} from './features/trabajos/trabajos-list/trabajos-list';

import {
    UsuariosListComponent
} from './features/usuarios/usuarios-list/usuarios-list';

import {
    ClientesListComponent
} from './features/clientes/clientes-list/clientes-list';

import {
    TrabajoFormComponent
} from './features/trabajos/trabajo-form/trabajo-form';

import {
    TrabajoDetalleComponent
} from './features/trabajos/trabajo-detalle/trabajo-detalle';

import {
    LoginComponent
} from './features/auth/login/login';

import {
    authGuard
} from './core/guards/auth.guard';

import {
    guestGuard
} from './core/guards/guest.guard';

import {
    CambiarPasswordComponent
} from './features/usuarios/cambiar-password/cambiar-password';

import {
    TrabajosFinalizadosComponent
} from './features/trabajos/trabajos-finalizados/trabajos-finalizados';

import {
    TrabajosPendientePagoComponent
} from './features/trabajos/trabajos-pendiente-pago/trabajos-pendiente-pago';

import {
    UsuarioFormComponent
} from './features/usuarios/usuario-form/usuario-form';

import {
    ClienteFormComponent
} from './features/clientes/cliente-form/cliente-form';

import {
    roleGuard
} from './core/guards/role.guard';


export const routes: Routes = [

    {
        path: 'login',

        component: LoginComponent,

        canActivate: [
            guestGuard
        ]

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
                path: 'dashboard',

                component: DashboardComponent

            },

            {
                path: 'cambiar-password',

                component:
                    CambiarPasswordComponent

            },

            {
                path: 'clientes',

                canActivate: [

                    roleGuard([
                        'Administrador'
                    ])

                ],

                children: [

                    {
                        path: '',

                        component:
                            ClientesListComponent

                    },

                    {
                        path: 'nuevo',

                        component:
                            ClienteFormComponent

                    },

                    {
                        path: ':id',

                        component:
                            ClienteFormComponent

                    }

                ]

            },

            {
                path: 'usuarios',

                canActivate: [

                    roleGuard([
                        'Administrador'
                    ])

                ],

                children: [

                    {
                        path: '',

                        component:
                            UsuariosListComponent

                    },

                    {
                        path: 'nuevo',

                        component:
                            UsuarioFormComponent

                    },

                    {
                        path: ':id',

                        component:
                            UsuarioFormComponent

                    }

                ]

            },


            // ============================
            // TRABAJOS
            // ADMINISTRADOR
            // SISTEMAS
            // TECNICO
            // FARMACIA
            // ============================

            {
                path: 'trabajos',

                canActivate: [

                    roleGuard([
                        'Administrador',
                        'Sistemas',
                        'Tecnico',
                        'Farmacia'
                    ])

                ],

                children: [

                    {
                        path: '',

                        component:
                            TrabajosListComponent

                    },

                    {
                        path: 'nuevo',

                        component:
                            TrabajoFormComponent,

                        canActivate: [

                            roleGuard([
                                'Administrador',
                                'Sistemas'
                            ])

                        ]

                    },

                    {
                        path: ':id',

                        component:
                            TrabajoDetalleComponent

                    },

                    {
                        path: ':id/editar',

                        component:
                            TrabajoFormComponent,

                        canActivate: [

                            roleGuard([
                                'Administrador',
                                'Sistemas'
                            ])

                        ]

                    }

                ]

            },


            // ============================
            // TRABAJOS FINALIZADOS
            // ============================

            {
                path:
                    'trabajos-finalizados',

                component:
                    TrabajosFinalizadosComponent,

                canActivate: [

                    roleGuard([
                        'Administrador',
                        'Sistemas',
                        'Pagos'
                    ])

                ]

            },


            // ============================
            // PENDIENTES DE PAGO
            // ============================

            {
                path:
                    'trabajos-pendiente-pago',

                component:
                    TrabajosPendientePagoComponent,

                canActivate: [

                    roleGuard([
                        'Administrador',
                        'Pagos'
                    ])

                ]

            }

        ]

    },

    {
        path: '**',

        redirectTo: 'dashboard'

    }

];
