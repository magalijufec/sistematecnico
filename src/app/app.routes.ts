import { Routes } from '@angular/router';

import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { TrabajosListComponent } from './features/trabajos/trabajos-list/trabajos-list';
import {  UsuariosListComponent } from './features/usuarios/usuarios-list/usuarios-list';
import { ClientesListComponent } from './features/clientes/clientes-list/clientes-list';
import { TrabajoFormComponent } from './features/trabajos/trabajo-form/trabajo-form';
import { TrabajoDetalleComponent } from './features/trabajos/trabajo-detalle/trabajo-detalle';

export const routes: Routes = [

{
path:'',
component:MainLayoutComponent,

children:[

{
path:'',
redirectTo:'dashboard',
pathMatch:'full'
},

{
path:'dashboard',
component:DashboardComponent
},

{
path:'trabajos',
component:TrabajosListComponent
},

{
    path: 'trabajos/nuevo',
    component: TrabajoFormComponent
},
{
    path: 'trabajos/:id',
    component: TrabajoFormComponent
},
{
    path:'trabajos/:id/editar',
    component: TrabajoDetalleComponent
},

{
path:'usuarios',
component:UsuariosListComponent
},

{
path:'clientes',
component:ClientesListComponent
}

]

}

];
