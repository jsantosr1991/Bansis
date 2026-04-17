import {Routes} from '@angular/router';
import {CintaBarridaComponent} from './cinta-barrida/cinta-barrida.component';

export const ESTADISCITCAS_ROUTES: Routes = [
  {
    path : '', component: CintaBarridaComponent ,
    data: { breadcrumb: 'CintaBarrida' },
  }
]
