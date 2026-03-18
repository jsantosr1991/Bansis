import { Injectable } from '@angular/core';

import { MenuItem } from '../settings/menu.interface';
import { MENU_CONFIG } from '../settings/menu.config';
import {BehaviorSubject, filter} from 'rxjs';
import {Breadcrumb} from '../interface/breadcrumbs.model';
import {ActivatedRouteSnapshot, NavigationEnd, Router,Data} from '@angular/router';
import {AuthserviceService} from './authservice.service';

@Injectable({ providedIn: 'root' })
export class MenuService {
// Subject emitting the breadcrumb hierarchy
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  // Observable exposing the breadcrumb hierarchy
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router, private service: AuthserviceService) {
    this.router.events.pipe(
      // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(event => {
      // Construct the breadcrumb hierarchy
      const root = this.router.routerState.snapshot.root;
      const breadcrumbs: Breadcrumb[] = [];
      this.addBreadcrumb(root, [], breadcrumbs);

      // Emit the new hierarchy
      this._breadcrumbs$.next(breadcrumbs);
    });
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot | null, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
    if (route) {
      // Construct the route URL
      const routeUrl = parentUrl.concat(route.url.map(url => url.path));

      // Add an element for the current route part
      if (route.data['breadcrumb']) {
        const breadcrumb = {
          label: this.getLabel(route.data),
          url: '/' + routeUrl.join('/')
        };
        breadcrumbs.push(breadcrumb);
      }

      // Add another element for the next route part
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }

  private getLabel(data: Data) {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof data['breadcrumb'] === 'function' ? data['breadcrumb'](data) : data['breadcrumb'];
  }


  // ✅ Versión final con tipos string[]
/*  getMenuByUser(): MenuItem[] {
    return MENU_CONFIG
      .filter(item =>
        this.service.tieneAlgunRol(item.roles || []) &&
        this.service.tieneAlgunGrupo(item.grupos || [])
      )
      .map(item => ({
        ...item,
        submenus: item.submenus?.filter(sub =>
          this.service.tieneAlgunRol(sub.roles || []) &&
          this.service.tieneAlgunGrupo(sub.grupos || [])
        ) || []
      }));
  }*/
  getMenuByUser(): MenuItem[] {
    return MENU_CONFIG;
  }

}


