import { MenuItem } from '../models/menu-item';

export const MENU: MenuItem[] = [

  {
    icon: 'dashboard',
    text: 'Dashboard',
    route: '/dashboard',
    soloAdministrador: false
  },

  {
    icon: 'build',
    text: 'Trabajos',
    route: '/trabajos',
    soloAdministrador: false
  },

  {
    text: 'Trabajos finalizados',
    icon: 'task_alt',
    route: '/trabajos-finalizados',
    soloAdministrador: false
  },

  {
    text: 'Pendientes de pago',
    icon: 'payment',
    route: '/trabajos-pendiente-pago',
    soloAdministrador: false  
  },

  {
    text: 'Clientes',
    icon: 'business',
    route: '/clientes',
    soloAdministrador: true
  },
  {
    text: 'Usuarios',
    icon: 'people',
    route: '/usuarios',
    soloAdministrador: true
  }

];