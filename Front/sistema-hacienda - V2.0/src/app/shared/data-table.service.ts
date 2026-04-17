import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({ providedIn: 'root' })
export class DataTableService {
  init(selector: string, options: any = {}) {
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
      }
      $(selector).DataTable(options);
    }, 50);
  }


  destroy(selector: string) {
    try {
      const table = $(selector).DataTable();
      if (table) {
        table.clear();
        table.destroy();
      }
    } catch (e) {
      console.warn('Tabla no existente al intentar destruir:', selector);
    }
  }


}
