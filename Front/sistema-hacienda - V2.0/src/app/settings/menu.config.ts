

export const MENU_CONFIG = [

  {
    title: 'Gestión de Usuarios',
    icon: 'bi bi-people',
    roles: ['superadmin'],
    grupos: ['administradores', 'sistemas'],
    submenus: [
      { title: 'Crear usuario', route: '/usuarios/createusuario', roles: ['superadmin'], grupos: ['administradores', 'sistemas'] },
      { title: 'Ver usuarios', route: '/usuarios', roles: ['superadmin'], grupos: ['administradores', 'sistemas'] },
      { title: 'Privilegios Temp', route: '/usuarios/privilegios-temporales', roles: ['superadmin'], grupos: ['administradores', 'sistemas'] },
    ]
  },
  {
    title: 'Balanza',
    icon: 'bi bi-upc-scan',
    roles: ['todos'],
    grupos: ['campo', 'oficina'],
    submenus: [
      { title: 'Ver Hoja de Saldos', route: '/balanza', roles: ['todos'], grupos: ['campo', 'oficina'] },
      { title: 'Matas Caidas', route: '/balanza/matascaidas', roles: ['superadmin', 'usercampo'], grupos: ['campo', 'oficina'] },
      { title: 'Lab Agricolas', route: '/balanza/laboresagricolas', roles: ['superadmin', 'usercampo', 'usermmfito'], grupos: ['campo', 'oficina'] },
      { title: 'H. Matas Caidas', route: '/balanza/historicomatascaidas', roles: ['todos'], grupos: ['campo', 'oficina'] },

    ]
  },
  {
    title: 'Estadisticas',
    icon: 'bi bi-graph-up',
    roles: ['todos'],
    grupos: ['campo', 'oficina'],
    submenus: [
      { title: 'Cinta Barrida', route: '/estadisticas', roles: ['todos'], grupos: ['campo', 'oficina'] },
    ]
  },
  {
    title: 'Asistencia',
    icon: 'bi bi-ui-checks',
    roles: ['todos'],
    grupos: ['campo', 'oficina', 'jefes'],
    submenus: [
      { title: 'Asistencia Haciendas', route: '/asistencia/asistenciamandosmedios', roles: ['todos'], grupos: ['todos'] },
    ]
  },
  {
    title: 'Bodegas',
    icon: 'bi bi-shop-window',
    roles: ['todos'],
    grupos: ['bodega', 'sistemas', 'administradores'],
    submenus: [
      { title: 'Solicitudes', route: '/bodegas/bodegahacienda', roles: ['todos'], grupos: ['sistemas', 'administradores', 'bodega'] },
      { title: 'Historico Despachos', route: '/bodegas/itemdespachado', roles: ['todos'], grupos: ['sistemas', 'administradores', 'bodega'] },
      { title: 'Rollos por Enfunde', route: '/bodegas/rollos', roles: ['todos'], grupos: ['sistemas', 'administradores', 'bodega'] },

    ]
  },
  {
    title: 'Talento Humano',
    icon: 'bi bi-person-badge',
    image: 'assets/images/SistemaHac/Logo/talento-humano.svg',
    route: '/solicitud-empleo/pages/listaSolicitudes',
    roles: ['todos'],
    grupos: ['administradores', 'rrhh', 'sistemas'],
    submenus: [
      {
        title: 'Ver Solicitudes',
        route: '/solicitud-empleo/pages/listaSolicitudes',
        roles: ['todos'],
        grupos: ['administradores', 'sistemas', 'rrhh']
      },
      {
        title: 'Nueva Solicitud',
        route: '/solicitud-empleo/pages/nuevaSolicitud',
        roles: ['todos'],
        grupos: ['administradores', 'rrhh', 'sistemas']
      }
    ]
  },
  {
    title: 'Soporte Técnico',
    icon: 'bi bi-headset',
    roles: ['todos'],
    grupos: ['todos'],
    submenus: [
      {
        title: 'Nueva Solicitud',
        route: '/soporte-tecnico/nueva',
        roles: ['todos'],
        grupos: ['todos']
      },
      {
        title: 'Mis Solicitudes',
        route: '/soporte-tecnico/lista',
        roles: ['todos'],
        grupos: ['todos']
      },

      {
        title: 'Gestión Sistemas',
        route: '/soporte-tecnico/gestion',
        roles: ['todos'],
        grupos: ['sistemas', 'administradores']
      }
    ]
  },
  {
    title: 'Inventario',
    icon: 'bi bi-box-seam',
    roles: ['superadmin'],
    grupos: ['sistemas', 'administradores'],
    submenus: [
      {
        title: 'Vista General',
        route: '/inventario',
        roles: ['todos'],
        grupos: ['sistemas', 'administradores']
      },
      {
        title: 'Historial Asignacion',
        route: '/inventario/historialasignaciones',
        roles: ['todos'],
        grupos: ['sistemas', 'administradores']
      }

    ]
  }
];
