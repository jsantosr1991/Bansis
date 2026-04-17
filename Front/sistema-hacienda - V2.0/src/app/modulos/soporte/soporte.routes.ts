import { Routes } from '@angular/router';

export const SOPORTE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'nueva',
        loadComponent: () => import('./pages/nueva-solicitud/nueva-solicitud.component').then(m => m.NuevaSolicitudComponent),
        data: { title: 'Nueva Solicitud', breadcrumb: 'Nueva Solicitud' }
      },
      {
        path: 'lista',
        loadComponent: () => import('./pages/lista-solicitudes/lista-solicitudes.component').then(m => m.ListaSolicitudesComponent),
        data: { title: 'Mis Solicitudes', breadcrumb: 'Mis Solicitudes' }
      },
      {
        path: 'gestion',
        loadComponent: () => import('./pages/gestion-sistemas/gestion-sistemas.component').then(m => m.GestionSistemasComponent),
        data: { title: 'Gestión Sistemas', breadcrumb: 'Gestión' }
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./pages/detalle-solicitud/detalle-solicitud.component').then(m => m.DetalleSolicitudComponent),
        data: { title: 'Detalle de Solicitud', breadcrumb: 'Detalle' }
      },
      { path: '', redirectTo: 'lista', pathMatch: 'full' }
    ]
  }
];
