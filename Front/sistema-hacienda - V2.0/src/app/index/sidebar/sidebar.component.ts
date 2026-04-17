import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MenuItem } from '../../settings/menu.interface';
import { AuthserviceService } from '../../services/authservice.service';
import { MenuService } from '../../services/menu.service';
import { filter } from 'rxjs';
import { UserService } from '../../services/user.service';
type SidebarMenuItem = MenuItem & {
  active?: boolean;
};

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
export class SidebarComponent implements OnInit, OnChanges {

  @Input() menuItems: any[] = [];
  @Input() sidebarVisible: boolean = false;

  @Output() close = new EventEmitter<boolean>();


  filteredMenu: SidebarMenuItem[] = [];

  constructor(private authService: AuthserviceService) { }

  ngOnInit(): void {
    // Obtener info del usuario desde backend
    this.authService.getUserInfoFromBackend().subscribe({
      next: (data) => {
        if (data) {
          // Actualizar usuario y roles temporales
          this.authService.setUserInfo(data);
          // Filtrar menú AHORA que ya tenemos rol y grupo
          this.filtrarMenu();
        }
      },
      error: (err) => {
        console.error('Error al obtener info del usuario:', err);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuItems']) {
      this.filtrarMenu();
    }
  }

  filtrarMenu(): void {
    this.filteredMenu = this.menuItems
      .filter(item => this.hasAccess(item))
      .map(item => ({
        ...item,
        submenus: item.submenus?.filter((sub: any) => this.hasAccess(sub)) || []

      }))
      .filter(item => item.submenus?.length || item.route);
  }

  hasAccess(item: MenuItem): boolean {
    const roleAllowed = !item.roles || this.authService.tieneAlgunRol(item.roles);

    const groupAllowed = !item.grupos || this.authService.tieneAlgunGrupo(item.grupos);

    return roleAllowed && groupAllowed;
  }


  /* 
    toggleDropdown(item: any) {
      this.filteredMenu.forEach(i => { if (i !== item) i.active = false; });
      item.active = !item.active;
    } */

  toggleDropdown(item: any) {
    this.filteredMenu.forEach(i => {
      if (i !== item) i.active = false;
    });

    item.active = !item.active;
  }

  // 🔥 CERRAR SIDEBAR (CLAVE)
  closeSidebar() {
    this.close.emit(false);
  }

}

