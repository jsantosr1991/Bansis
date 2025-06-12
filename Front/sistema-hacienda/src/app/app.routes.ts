import { Routes } from '@angular/router';
import { MainComponent } from './index/main/main.component';

import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./index/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { title: 'Dashboard' } ,    
      
      },
        {
        path:'usuarios',
        loadChildren: ()=>
          import('./modulos/usuarios/usuarios.routes').then(m=>m.USUARIOS_ROUTES),
        data: { title: 'Usuarios' } ,   
      },
      {
        path:'hojasaldos',
        loadChildren:()=> import('./modulos/HojaSaldo/hojasaldo.routes').then(m =>m.HOJASALDOS_ROUTES),
        data:{title: 'Hoja de Saldos'},
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent),
    data: { title: 'Página no encontrada'    }
  }
];
