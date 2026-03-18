import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MenuItem } from '../../settings/menu.interface';
import { UserService } from '../../services/user.service';
import { MenuService } from '../../services/menu.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
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

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible; // Alterna la visibilidad
    //console.log('Sidebar visible:', this.isSidebarVisible); // Para verificar en consola
  }



}
