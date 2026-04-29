import { Routes } from '@angular/router';
import { BodegahaciendaComponent } from './bodegahacienda/bodegahacienda.component';
import { HomebodegaComponent } from './homebodega/homebodega.component';
import { ItemsdespachadosComponent } from './itemsdespachados/itemsdespachados.component';
import { RollosComponent } from './rollos/rollos.component';
import { HistorialPersonaComponent } from './historial-persona/historial-persona.component';

export const BODEGAS_ROUTES: Routes = [
  {
    path: '', component: HomebodegaComponent,
    data: { breadcrumb: 'Homebodega' },
    children: [
      {
        path: 'bodegahacienda', component: BodegahaciendaComponent,
        data: { breadcrumb: 'Bodega Hacienda' }
      },
      {
        path: 'itemdespachado', component: ItemsdespachadosComponent,
        data: { breadcrumb: 'Material Despachado' }
      },
      {
        path: 'rollos', component: RollosComponent,
        data: { breadcrumb: 'Rollos Por Despachar' }
      },
      {
        path: 'historial-persona', component: HistorialPersonaComponent,
        data: { breadcrumb: 'Historial' }
      },

    ]
  }
]
