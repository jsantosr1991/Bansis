import {Component,  OnInit} from '@angular/core';
import {MenuItem} from '../../settings/menu.interface';
import {UserService} from '../../services/user.service';
import {MenuService} from '../../services/menu.service';
import {AuthserviceService} from '../../services/authservice.service';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

import {Breadcrumb} from '../../interface/breadcrumbs.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgForOf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  username: string = '';
  menuItems: MenuItem[] = [];
  userRole = 0;
  userGroup = 0;

  breadcrumbs$: Observable<Breadcrumb[]> | undefined;
  breadcrumbs: Array<{ label: string, url: string }> = []; //nuevo breadcrumbs
  isSidebarVisible:boolean = false;

  constructor(
    private userService: UserService,
    private menuService: MenuService,
    private authService: AuthserviceService,
    private router: Router,
    private route:ActivatedRoute,
    private readonly breadcrumbService:MenuService
  ) {

  }

  ngOnInit() {
    console.log('HeaderComponent cargado');
    this.username = this.userService.getUsername() ?? '';
    this.userRole = Number(this.userService.getRolId()) || 0;
    this.userGroup = Number(this.userService.getGroupId()) || 0;
    this.menuItems = this.menuService.getMenuByUser(this.userRole, this.userGroup);


    this.router.events

      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        console.log('navegacion completada');
        this.breadcrumbs = [];
        let currentRoute = this.route.root;

        // Recorremos todas las rutas activas para obtener los breadcrumbs
        while (currentRoute.children.length > 0) {
          currentRoute = currentRoute.children[0];
          const breadcrumbData = currentRoute.snapshot.data['breadcrumb'];

          if (breadcrumbData) {
            const url = this.getUrl(currentRoute);
            this.breadcrumbs.push({ label: breadcrumbData, url });
          }
        }
      });
  }


  private getUrl(route: ActivatedRoute): string {
    let url = '';
    let parentRoute = route.parent;

    while (parentRoute) {
      if (parentRoute.snapshot.url.length > 0) {
        url = '/' + parentRoute.snapshot.url.map(segment => segment.path).join('/') + url;
      }
      parentRoute = parentRoute.parent;
    }

    return url;
  }



  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
