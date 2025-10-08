import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {HeaderComponent} from '../header/header.component';
import {Router, RouterOutlet} from '@angular/router';
import {NavComponent} from '../nav/nav.component';
import {MenuItem} from '../../settings/menu.interface';
import {UserService} from '../../services/user.service';
import {MenuService} from '../../services/menu.service';
import {AuthserviceService} from '../../services/authservice.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  username: string = '';
  menuItems: MenuItem[] = [];
  userRole = 0;
  userGroup = 0;

  isSidebarVisible:boolean = false;

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

  }


}
