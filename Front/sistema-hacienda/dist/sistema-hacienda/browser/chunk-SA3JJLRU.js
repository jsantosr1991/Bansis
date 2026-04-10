// src/app/settings/menu.config.ts
var MENU_CONFIG = [
  /*{
    title: 'Dashboard',
    icon: 'bi bi-speedometer2',
    route: '/dashboard',
    roles: ['todos'],
    grupos: ['todos'],
    submenus: []
  },*/
  {
    title: "Gesti\xF3n de Usuarios",
    icon: "bi bi-people",
    roles: ["superadmin"],
    grupos: ["administradores", "sistemas"],
    submenus: [
      { title: "Ver usuarios", route: "/usuarios", roles: ["superadmin"], grupos: ["administradores", "sistemas"] },
      { title: "Crear usuario", route: "/usuarios/createusuario", roles: ["superadmin"], grupos: ["administradores", "sistemas"] },
      { title: "Privilegios Temporales", route: "/usuarios/privilegios-temporales", roles: ["superadmin"], grupos: ["administradores", "sistemas"] }
    ]
  },
  {
    title: "Balanza",
    icon: "bi bi-upc-scan",
    roles: ["todos"],
    grupos: ["campo", "oficina"],
    submenus: [
      { title: "Ver Hoja de Saldos", route: "/balanza", roles: ["todos"], grupos: ["campo", "oficina"] },
      { title: "Historial", route: "/balanza/historicomatascaidas", roles: ["todos"], grupos: ["campo", "oficina"] },
      { title: "Matas Caidas", route: "/balanza/matascaidas", roles: ["superadmin", "usercampo"], grupos: ["campo", "oficina"] }
    ]
  },
  {
    title: "Estadisticas",
    icon: "bi bi-graph-up",
    roles: ["todos"],
    grupos: ["campo", "oficina"],
    submenus: [
      { title: "Cinta Barrida", route: "/estadisticas", roles: ["todos"], grupos: ["campo", "oficina"] }
    ]
  },
  {
    title: "Asistencia",
    icon: "bi bi-ui-checks",
    roles: ["todos"],
    grupos: ["campo", "oficina", "jefe"],
    submenus: [
      { title: "Asistencia General", route: "/asistencia", roles: ["superadmin"], grupos: ["administradores"] },
      { title: "Asistencia Haciendas", route: "/asistencia/asistenciamandosmedios", roles: ["todos"], grupos: ["todos"] }
    ]
  },
  {
    title: "Bodegas",
    icon: "bi bi-shop-window",
    roles: ["todos"],
    grupos: ["bodega", "sistemas", "administradores"],
    submenus: [
      { title: "Ver Solicitudes", route: "/bodegas/bodegahacienda", roles: ["todos"], grupos: ["todos"] },
      { title: "Ver Despachos", route: "/bodegas/itemdespachado", roles: ["todos"], grupos: ["oficina", "bodega"] }
    ]
  }
];

export {
  MENU_CONFIG
};
//# sourceMappingURL=chunk-SA3JJLRU.js.map
