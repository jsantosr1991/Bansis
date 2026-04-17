import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MenuItem } from '../../settings/menu.interface';
import { UserService } from '../../services/user.service';
import { MenuService } from '../../services/menu.service';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { NgFor, NgIf } from '@angular/common';



@Component({
  selector: 'app-index',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterOutlet, NgIf, NgFor],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  username: string = '';
  menuItems: MenuItem[] = [];
  userRole = 0;
  userGroup = 0;

  isSidebarVisible: boolean = false;

  constructor(
    private userService: UserService,
    private menuService: MenuService,

  ) { }

  ngOnInit() {
    this.username = this.userService.getUsername() ?? '';
    this.userRole = Number(this.userService.getRolId()) || 0;
    this.userGroup = Number(this.userService.getGroupId()) || 0;
    this.menuItems = this.menuService.getMenuByUser();

  }


  toggleSidebar(force?: boolean) {
    if (force !== undefined) {
      this.isSidebarVisible = force;
    } else {
      this.isSidebarVisible = !this.isSidebarVisible;
    }
  }



}
