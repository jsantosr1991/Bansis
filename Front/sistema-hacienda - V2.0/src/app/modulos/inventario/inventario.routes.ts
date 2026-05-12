import { Routes } from "@angular/router";
import { InventarioComponent } from "./pages/inventario/inventario.component";


export const INVENTARIO_ROUTES: Routes = [
    {
        path: '', component: InventarioComponent,
        data: { breadcrumb: 'Hoja de Inventario' }
    },
    {
        path: 'kardex',
        loadComponent: () => import('./components/kardex/kardex.component')
            .then(m => m.KardexComponent)
    },
    {
        path: 'movimientos',
        loadComponent: () => import('./components/movimiento-form/movimiento-form.component')
            .then(m => m.MovimientoFormComponent)
    },
    {
        path: 'productos',
        loadComponent: () => import('./components/producto-form/producto-form.component')
            .then(m => m.ProductoFormComponent)
    },
    {
        path: 'historialasignaciones',
        loadComponent: () => import('./pages/historialasignacion/historialasignacion.component')
            .then(m => m.HistorialasignacionComponent),
        data: { breadcrumb: 'Historial de Asignaciones' }
    }
]
