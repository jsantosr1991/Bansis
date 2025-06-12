import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges,  SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../settings/menu.interface';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnChanges {
@Input() userRole!: number;
@Input() userGroup!: number;
@Input() menuItems: MenuItem[] = [];
@Input() sidebarVisible = true; // ⬅️ lo recibe desde el padre

  filteredMenu: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
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
