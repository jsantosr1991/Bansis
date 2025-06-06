import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { MenuItem } from '../settings/menu.interface';
import { MENU_CONFIG } from '../settings/menu.config';


@Injectable({ providedIn: 'root' })
export class MenuService {

  getMenuByUser(roleId: number, groupId: number): MenuItem[] {
    return MENU_CONFIG
      .filter(item =>
        item.roles.includes(roleId) &&
        (!item.grupos || item.grupos.includes(groupId))
      )
      .map(item => ({
        ...item,
        submenus: item.submenus?.filter(sub =>
          sub.roles.includes(roleId) &&
          (!sub.grupos || sub.grupos.includes(groupId))
        ) || []
      }));
  }



}


