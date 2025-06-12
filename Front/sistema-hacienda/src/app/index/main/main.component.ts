import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavComponent } from '../nav/nav.component';
import { UserService } from '../../services/user.service';
import { MenuService } from '../../services/menu.service';
import { AuthserviceService } from '../../services/authservice.service';
import { MenuItem } from '../../settings/menu.interface';

@Component({
  selector: 'main-app',
  standalone: true,
  imports: [CommonModule, RouterModule, NavComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  username: string = '';
  menuItems: MenuItem[] = [];
  userRole = 0;
  userGroup = 0;

  isSidebarVisible = true;

  constructor(
    private userService: UserService,
    private menuService: MenuService,
    private authService: AuthserviceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = this.userService.getUsername() ?? '';
    this.userRole = Number(this.userService.getRolId()) || 0;
    this.userGroup = Number(this.userService.getGroupId()) || 0;
    this.menuItems = this.menuService.getMenuByUser(this.userRole, this.userGroup);
    this.updateSidebarVisibility();
  }

   @HostListener('window:resize', ['$event'])
      onResize() {
    this.updateSidebarVisibility();
  }

  updateSidebarVisibility() {
//    if (window.innerWidth < 768) {
   //   this.isSidebarVisible = false;
  //  } else {
  //    this.isSidebarVisible = true;
  //  }
  this.isSidebarVisible = window.innerWidth >= 768;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
