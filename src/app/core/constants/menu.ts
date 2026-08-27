import { MenuItem } from '../models/menu-item';

export const MENU: MenuItem[] = [

  { 
    text: 'Dashboard', 
    icon: 'dashboard', 
    route: '/dashboard', 
    roles: [ 'Administrador', 'Sistemas', 'Tecnico', 'Farmacia', 'Pagos' ] 
  }, 
  { 
    text: 'Trabajos',     
    icon: 'engineering', 
    route: '/trabajos', 
    roles: [ 'Administrador', 'Sistemas', 'Tecnico', 'Farmacia', 'Pagos' ] 
  }, 
  { 
    text: 'Usuarios', 
    icon: 'people', 
    route: '/usuarios', 
    roles: [ 'Administrador' ] 
  }, 
  { 
    text: 'Clientes', 
    icon: 'store', 
    route: '/clientes', 
    roles: [ 'Administrador' ] 
  },   
  { 
    text: 'Pendientes de pago', 
    icon: 'payments', 
    route: '/trabajos-pendiente-pago', 
    roles: [ 'Administrador', 'Pagos', 'Farmacia' ] 
  },
  { 
    text: 'Trabajos finalizados', 
    icon: 'task_alt', route: '/trabajos-finalizados', 
    roles: [ 'Administrador', 'Sistemas', 'Pagos', 'Tecnico', 'Farmacia' ] 
  }

];