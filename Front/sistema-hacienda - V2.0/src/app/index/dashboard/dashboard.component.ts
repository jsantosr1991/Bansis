import { Component, OnInit } from '@angular/core';

import { Router, RouterOutlet } from '@angular/router';


import { NgClass, NgForOf, NgIf } from '@angular/common';
import { AuthserviceService } from '../../services/authservice.service';
import { MENU_CONFIG } from '../../settings/menu.config';
import { MenuItem } from '../../settings/menu.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  menuItems: MenuItem[] = MENU_CONFIG;
  filteredMenu: MenuItem[] = [];
  cargando: boolean = true; // bandera para mostrar "cargando"

  constructor(
    private router: Router,
    private authService: AuthserviceService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Obtener info del usuario desde backend
    this.authService.getUserInfoFromBackend().subscribe({
      next: (data) => {
        if (data) {

          // Actualizar usuario y roles temporales
          this.authService.setUserInfo(data);

          // Filtrar menú AHORA que ya tenemos rol y grupo
          this.filtrarMenu();

          this.cargando = false; // menú cargado
        }
      },
      error: (err) => {
        console.error('Error al obtener info del usuario:', err);
        this.cargando = false;
      }
    });
  }



  filtrarMenu(): void {
    this.filteredMenu = this.menuItems
      .filter(item => this.hasAccess(item))
      .map(item => ({
        ...item,
        submenus: item.submenus?.filter(sub => this.hasAccess(sub)) || []
      }))
      .filter(item => item.submenus?.length || item.route);
  }

  hasAccess(item: MenuItem): boolean {
    const roleAllowed = !item.roles || this.authService.tieneAlgunRol(item.roles);

    const groupAllowed = !item.grupos || this.authService.tieneAlgunGrupo(item.grupos);

    return roleAllowed && groupAllowed;
  }

  irARuta(ruta?: string): void {
    if (ruta) {
      this.router.navigate([ruta]);
    }
  }

}
