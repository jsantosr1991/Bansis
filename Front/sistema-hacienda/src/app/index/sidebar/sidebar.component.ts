import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MenuItem} from '../../settings/menu.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnChanges{
  @Input() userRole!: number;
  @Input() userGroup!: number;
  @Input() menuItems: MenuItem[] = [];
  @Input() sidebarVisible = false; // ⬅️ lo recibe desde el padre

  filteredMenu: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    console.log("rol:",this.userRole);
    if(changes['menuItems']){
      this.filteredMenu = this.menuItems
        .filter(item => this.hasAccess(item))
        .map(item => ({
          ...item,

          submenus: item.submenus?.filter(sub => this.hasAccess(sub)) || []
        }))
        .filter(item => item.submenus?.length || item.route);

    }
  }


  toggleDropdown(item: any) {
    this.filteredMenu.forEach(i => { if (i !== item) i.active = false; });
    item.active = !item.active;
  }

  hasAccess(item: any): boolean {

    const roleAllowed = !item.roles || item.roles.includes(this.userRole);
    const groupAllowed = !item.grupos || item.grupos.includes(this.userGroup);

    return roleAllowed && groupAllowed;
  }
}
