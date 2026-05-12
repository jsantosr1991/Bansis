import { Routes } from "@angular/router";

import { HojadesaldoComponent } from "./hojadesaldo/hojadesaldo.component";
import { MatascaidasComponent } from '../matascaidas/matascaidas.component';
import { HistoricoComponent } from '../matascaidas/historico/historico.component';
import { LaboresagricolasComponent } from "../laboresagricolas/laboresagricolas.component";

export const HOJASALDOS_ROUTES: Routes = [
  {
    path: '', component: HojadesaldoComponent,
    data: { breadcrumb: 'Hoja de Saldos' }
  },
  {
    path: 'matascaidas',
    component: MatascaidasComponent,
    data: { breadcrumb: 'Matas Caídas' }  // Título para la ruta secundaria
  },
  {
    path: 'laboresagricolas',
    component: LaboresagricolasComponent,
    data: { breadcrumb: 'Labores Agrícolas' }  // Título para la ruta secundaria
  },
  {
    path: 'historicomatascaidas',
    component: HistoricoComponent,
    data: { breadcrumb: 'Historico Matas Caídas' }  // Título para la ruta secundaria
  }
]
