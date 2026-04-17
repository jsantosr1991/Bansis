import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import {AuthserviceService} from '../services/authservice.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private permisosService: AuthserviceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const gruposPermitidos = route.data['grupos'] as string[] | undefined;

    // Si no hay grupos definidos, permitimos acceso
    if (!gruposPermitidos) {
      return true;
    }

    // Verificamos si el usuario tiene alguno de los grupos permitidos
    if (this.permisosService.tieneAlgunGrupo(gruposPermitidos)) {
      return true;
    }

    // Si no tiene permisos, redirigimos a una página de acceso denegado (puedes personalizar la ruta)
    return this.router.createUrlTree(['/acceso-denegado']);
  }
}
