import { MenuItem } from '../models/menu-item';

export const MENU: MenuItem[] = [

  {
    icon: 'dashboard',
    text: 'Dashboard',
    route: '/dashboard'
  },

  {
    icon: 'build',
    text: 'Trabajos',
    route: '/trabajos'
  },

  {
    text: 'Trabajos finalizados',
    icon: 'task_alt',
    route: '/trabajos-finalizados'
  },

  {
    icon: 'store',
    text: 'Clientes',
    route: '/clientes'
  },

  {
    icon: 'people',
    text: 'Usuarios',
    route: '/usuarios'
  },

  {
    icon: 'settings',
    text: 'Configuración',
    route: '/configuracion'
  }

];