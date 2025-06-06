
import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({ providedIn: 'root' })
export class DataTableService {
  init(selector: string, options: any = {}): void {
  setTimeout(() => {
  if ($ && $.fn && $.fn.DataTable && !$.fn.DataTable.isDataTable(selector)) {
    $(selector).DataTable(options);
  }
}, 0);

  }

  destroy(selector: string): void {
    const table = $(selector).DataTable();
    if (table) {
      table.clear().destroy();
    }
  }
}
