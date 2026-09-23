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
    TrabajosPagadosComponent
} from './features/trabajos/trabajos-pagados/trabajos-pagados';

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
import { TrabajoSolicitudComponent } from './features/trabajos/trabajo-solicitud/trabajo-solicitud';
import { TrabajosSolicitudListComponent } from './features/trabajos/trabajos-solicitud-list/trabajos-solicitud-list';
import { NuevaIncidenciaComponent } from './features/incidencias/nueva-incidencia/nueva-incidencia';
import { IncidenciasPendientesComponent } from './features/incidencias/incidencias-pendiente/incidencias-pendiente';
import { IncidenciasFinalizadasComponent } from './features/incidencias/incidencias-finalizadas/incidencias-finalizadas';

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

            {
                path: 'trabajos',
                canActivate: [
                    roleGuard([
                        'Administrador',
                        'Sistemas',
                        'Mantenimiento',
                        'Monitoreo',
                        'Tecnico',
                        'Farmacia',
                        'Pagos'
                    ])
                ],

                children: [
                    {
                        path: '',
                        component:
                            TrabajosListComponent,
                        canActivate: [
                            roleGuard([
                                'Administrador',
                                'Sistemas',
                                'Mantenimiento',
                                'Monitoreo',
                                'Tecnico',
                                'Farmacia'
                            ])
                        ]

                    },

                    {
                        path: 'nuevo',

                        component:
                            TrabajoFormComponent,

                        canActivate: [

                            roleGuard([
                                'Administrador',
                                'Sistemas',
                                'Mantenimiento',
                                'Monitoreo',
                                'Farmacia'
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

            // trabajo solicitud
            {
                path: 'trabajo-solicitud',
                component: TrabajoSolicitudComponent,
                canActivate: [
                    roleGuard([
                        'Administrador',
                        'Sistemas',
                        'Mantenimiento',
                        'Monitoreo',
                        'Tecnico',
                        'Farmacia'
                    ])
                ]
            },

            // trabajo solicitud
            {
                path: 'trabajo-solicitud/:id',
                component: TrabajoSolicitudComponent,
                canActivate: [
                    roleGuard([
                        'Administrador',
                        'Sistemas',
                        'Mantenimiento',
                        'Monitoreo',
                        'Tecnico',
                        'Farmacia'
                    ])
                ]
            },

            // trabajos solicitud list
            {
                path: 'trabajos-solicitud-list',
                component: TrabajosSolicitudListComponent,
                canActivate: [
                    roleGuard([
                        'Administrador',
                        'Sistemas',
                        'Mantenimiento',
                        'Monitoreo',
                        'Tecnico',
                        'Farmacia'
                    ])
                ]
            },
            // PENDIENTES DE PAGO
            {
                path: 'trabajos-pendiente-pago',
                component: TrabajosPendientePagoComponent,
                canActivate: [
                    roleGuard([
                        'Administrador',
                        'Pagos',
                        'Farmacia',
                        'Tecnico'
                    ])

                ]

            },

            // TRABAJOS PAGADOS
            {
                path: 'trabajos-pagados',
                component: TrabajosPagadosComponent,
                canActivate: [
                    roleGuard([
                        'Administrador',
                        'Sistemas',
                        'Mantenimiento',
                        'Monitoreo',
                        'Pagos',
                        'Tecnico',
                        'Farmacia'
                    ])
                ]
            },
            {
                path: 'incidencias',
                canActivate: [
                    roleGuard([
                        'Administrador',
                        'Sistemas'
                    ])
                ],
                children: [
                    {
                        path: 'nueva-incidencia',
                        component: NuevaIncidenciaComponent
                    },
                    {
                        path: 'pendientes',
                        component: IncidenciasPendientesComponent
                    },
                    {
                        path: 'finalizadas',
                        component: IncidenciasFinalizadasComponent
                    }
                ]
            }

        ]

    },

    {
        path: '**',

        redirectTo: 'dashboard'

    }

];
