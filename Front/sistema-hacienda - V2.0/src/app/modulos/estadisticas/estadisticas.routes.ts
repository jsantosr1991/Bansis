import { Routes } from '@angular/router';
import { CintaBarridaComponent } from './cinta-barrida/cinta-barrida.component';
import { RacimosrecusadosComponent } from './racimosrecusados/racimosrecusados.component';

export const ESTADISCITCAS_ROUTES: Routes = [
  {
    path: 'cintabarrida', component: CintaBarridaComponent,
    data: { breadcrumb: 'CintaBarrida' },
  },

  {
    path: 'racimosrecusados', component: RacimosrecusadosComponent,
    data: { breadcrumb: 'Racimos Recusados' }
  }
]
