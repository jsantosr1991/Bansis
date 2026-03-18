import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service'; // FIX: Redirigido al servicio central
import { MENU_CONFIG } from './menu.config';
import { MenuItem } from './menu.interface';

@Injectable({ providedIn: 'root' })
export class MenuService {

  getMenuByUser(roleId: number, groupId: number): MenuItem[] {
    return MENU_CONFIG
      .filter(item =>
        item.roles.includes(String(roleId)) &&
        (!item.grupos || item.grupos.includes(String(groupId)))
      )
      .map(item => ({
        ...item,
        submenus: item.submenus?.filter(sub =>
          sub.roles.includes(String(roleId)) &&
          (!sub.grupos || sub.grupos.includes(String(groupId)))
        ) || []
      }));
  }



}


