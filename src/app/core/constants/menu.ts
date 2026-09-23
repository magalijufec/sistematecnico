import { MenuItem } from '../models/menu-item';

export const MENU: MenuItem[] = [

  {
    text: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    roles: ['Administrador', 'Sistemas', 'Mantenimiento', 'Monitoreo', 'Tecnico', 'Farmacia', 'Pagos']
  },
  {
    text: 'Usuarios',
    icon: 'people',
    route: '/usuarios',
    roles: ['Administrador']
  },
  {
    text: 'Clientes',
    icon: 'store',
    route: '/clientes',
    roles: ['Administrador']
  },
  {
    text: 'Solicitudes de trabajos',
    icon: 'assignment_add',
    route: '/trabajos-solicitud-list',
    roles: ['Administrador', 'Sistemas', 'Mantenimiento', 'Monitoreo', 'Tecnico', 'Farmacia']
  },
  {
    text: 'Trabajos en proceso',
    icon: 'engineering',
    route: '/trabajos',
    roles: ['Administrador', 'Sistemas', 'Mantenimiento', 'Monitoreo', 'Tecnico', 'Farmacia']
  },
  {
    text: 'Pendientes de pago',
    icon: 'payments',
    route: '/trabajos-pendiente-pago',
    roles: ['Administrador', 'Pagos', 'Tecnico', 'Farmacia']
  },
  {
    text: 'Trabajos pagados',
    icon: 'task_alt', route: '/trabajos-pagados',
    roles: ['Administrador', 'Sistemas', 'Mantenimiento', 'Monitoreo', 'Pagos', 'Tecnico', 'Farmacia']
  },
  {
    text: 'Incidencias pendientes',
    icon: 'pending_actions',
    route: '/incidencias/pendientes',
    roles: ['Administrador', 'Sistemas']
  },
  {
    text: 'Incidencias finalizadas',
    icon: 'task_alt',
    route: '/incidencias/finalizadas',
    roles: ['Administrador', 'Sistemas']
  }

];