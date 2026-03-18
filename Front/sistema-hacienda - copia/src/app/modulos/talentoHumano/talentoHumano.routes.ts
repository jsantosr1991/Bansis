import { Routes } from '@angular/router';
import { RoleGuard } from '../../auth/role.guard';

export const TALENTO_HUMANO_ROUTES: Routes = [
    {
        path: '',
        canActivate: [RoleGuard],
        data: { grupos: ['administradores', 'rrhh'] },
        children: [
            {
                path: 'pages/nuevaSolicitud',
                loadComponent: () => import('./pages/nueva-solicitud/nueva-solicitud.component').then(m => m.NuevaSolicitudComponent),
                data: { title: 'Nueva Solicitud', breadcrumb: 'Nueva Solicitud' }
            },
            {
                path: 'pages/listaSolicitudes',
                loadComponent: () => import('./pages/lista-solicitudes/lista-solicitudes.component').then(m => m.ListaSolicitudesComponent),
                data: { title: 'Ver Solicitudes', breadcrumb: 'Ver Solicitudes' }
            },
            {
                path: 'pages/verSolicitud/:id',
                loadComponent: () => import('./pages/ver-solicitud/ver-solicitud.component').then(m => m.VerSolicitudComponent),
                data: { title: 'Detalle Solicitud', breadcrumb: 'Detalle Solicitud' }
            },
            {
                path: '',
                redirectTo: 'pages/listaSolicitudes',
                pathMatch: 'full'
            }
        ]
    }
];
