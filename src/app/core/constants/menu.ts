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