

import { GeneralComponent } from './general/general.component';
import { Routes } from '@angular/router';
import { MandosmediosComponent } from './mandosmedios/mandosmedios.component';


export const ASISTENCIA_ROUTES: Routes = [
  {
    path: '', component: GeneralComponent,
    data: { breadcrumb: 'Asistencia ' },
  },
  {
    path: 'asistenciamandosmedios',
    component: MandosmediosComponent,
    data: { breadcrumb: 'Asistencia Haciendas' }
  }
]
