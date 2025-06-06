import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({ providedIn: 'root' })
export class DataTableService {
  init(selector: string, options: any = {}) {
    $(document).ready(() => {
      $(selector).DataTable(options);
    });
  }

  destroy(selector: string) {
    const table = $(selector).DataTable();
    if (table) table.destroy();
  }
}
