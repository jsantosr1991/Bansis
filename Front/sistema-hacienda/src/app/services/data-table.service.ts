import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class DataTableService {
  private dataTable: any;

  init(selector: string, options: any) {
    setTimeout(() => {
      this.dataTable = $(selector).DataTable(options);
    }, 0);
  }

  reload(selector: string, newData: any[]) {
    if (this.dataTable) {
      this.dataTable.clear();
      this.dataTable.rows.add(newData);
      this.dataTable.draw();
    }
  }

  destroy(selector: string) {
    const table = $(selector).DataTable();
    if (table) {
      table.clear().destroy();
    }
  }
}
