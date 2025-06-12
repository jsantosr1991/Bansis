import { MenuItem } from "./menu.interface";

export const MENU_CONFIG = [
  {
    title: 'Dashboard',
    icon: 'bi bi-speedometer2',
    route: '/dashboard',
    roles: [1, 2],
    grupos: [1, 20],
    submenus: []
  },
  {
    title: 'Gestión de Usuarios',
    icon: 'bi bi-people',
    roles: [1],
    submenus: [
      { title: 'Ver usuarios', route: '/usuarios', roles: [1], grupos: [1, 20] },
      { title: 'Crear usuario', route: '/usuarios/create', roles: [1], grupos: [1, 20] }
    ]
  },
 {
    title: 'Hoja de Saldo',
    icon: 'bi bi-card-text',
   
    roles: [1],
    submenus: [
      { title: 'Ver Hoja de Saldos', route: '/hojasaldos', roles: [1], grupos: [1, 20] },
      { title: 'Crear usuario', route: '/usuarios/create', roles: [1], grupos: [1, 20] }
    ]
 }
];
