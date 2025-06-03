
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import { AuthserviceService } from '../../auth/authservice.service';
import { UserService } from '../../auth/user.service';
import { MenuItem } from '../../settings/menu.interface';
import { MenuService } from '../../settings/menu.service';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NavComponent,RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  username: string = '';
  menuItems: MenuItem[] = [];
  userRole = 0;
  userGroup = 0;

  constructor(
    public userService: UserService,
    private menuService: MenuService,
    private authService: AuthserviceService,
    private router: Router
  ) { }

  ngOnInit() {
    this.username = this.userService.getUsername() ?? '';
    this.userRole = Number(this.userService.getRolId()) || 0;
    this.userGroup = Number(this.userService.getGroupId()) || 0;
    this.menuItems = this.menuService.getMenuByUser(this.userRole, this.userGroup);

    console.log('rol:', this.userRole, 'grupo:', this.userGroup);
    console.log(this.menuItems)
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
