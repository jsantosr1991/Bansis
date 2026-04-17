import { Routes} from "@angular/router";
import { ListarComponent } from "./pages/listar/listar.component";
import {CreateComponent} from './pages/create/create.component';
import {PrivilegiostemporalesComponent} from './pages/privilegiostemporales/privilegiostemporales.component';

export const USUARIOS_ROUTES: Routes =[
    { path : '', component: ListarComponent ,
      data: {
        breadcrumb: 'Lista de Usuarios' } },
  {
    path:'createusuario',
    component:CreateComponent,
    data:{ breadcrumb: 'Crear Usuarios' }
  },
  {
    path:'privilegios-temporales',
    component:PrivilegiostemporalesComponent,
    data:{ breadcrumb: 'Privilegios Temporales' }
  },

]
