import { Routes } from '@angular/router';


import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './index/dashboard/dashboard.component';
import { IndexComponent } from './index/index/index.component';
import { RoleGuard } from './auth/role.guard';
import { ImprimirComponent } from './shared/imprimir/imprimir.component';
import { ForgotpasswordComponent } from './auth/forgotpassword/forgotpassword.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  {
    path: '',
    component: IndexComponent,
    canActivate: [AuthGuard],
    children: [
      // ?? RUTA POR DEFECTO
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        loadComponent: () => import('./index/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { title: 'Dashboard' },

      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./modulos/usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES),
        canActivate: [RoleGuard],
        data: { grupos: ['administradores', 'sistemas'], title: 'Usuarios' }
      },
      {
        path: 'balanza',
        loadChildren: () => import('./modulos/HojaSaldo/hojasaldo.routes').then(m => m.HOJASALDOS_ROUTES),
        canActivate: [RoleGuard],
        data: {
          title: 'Balanza',
          breadcrumb: 'Balanza'
        },

      },
      {
        path: 'estadisticas',
        loadChildren: () => import('./modulos/estadisticas/estadisticas.routes').then(m => m.ESTADISCITCAS_ROUTES),
        canActivate: [RoleGuard],
        data: {
          title: 'Estadisticas',
          breadcrumb: 'Estadisticas'
        }
      },
      {
        path: 'asistencia',
        loadChildren: () => import('./modulos/asistencia/asistencia.routes').then(m => m.ASISTENCIA_ROUTES),
        canActivate: [RoleGuard],
        data: {
          title: 'Asistencia General',
          breadcrumb: 'Asistencia General'
        }
      },
      {
        path: 'bodegas',
        loadChildren: () => import('./modulos/bodegas/bodegas.routes').then(m => m.BODEGAS_ROUTES),
        canActivate: [RoleGuard],
        data: {
          title: 'Bodegas',
        }
      },
      {
        path: 'solicitud-empleo',
        loadChildren: () => import('./modulos/talentoHumano/talentoHumano.routes').then(m => m.TALENTO_HUMANO_ROUTES),
        canActivate: [RoleGuard],
        data: {
          title: 'Talento Humano',
          breadcrumb: 'Talento Humano'
        }
      },
      {
        path: 'soporte-tecnico',
        loadChildren: () => import('./modulos/soporte/soporte.routes').then(m => m.SOPORTE_ROUTES),
        canActivate: [RoleGuard],
        data: {
          title: 'Soporte Técnico',
          breadcrumb: 'Soporte Técnico'
        }
      },
      {
        path: 'inventario',
        loadChildren: () => import('./modulos/inventario/inventario.routes').then(m => m.INVENTARIO_ROUTES),
        canActivate: [RoleGuard],
        data: {
          title: 'Inventario',
          breadcrumb: 'Inventario Sisemas'
        }
      }
    ]
  },
  { path: 'imprimir/:id', component: ImprimirComponent },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent),
    data: { title: 'Página no encontrada' }
  }


];
