import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class DataTableService {
  init(selector: string, options: any = {}) {
    setTimeout(() => {
      // Destruye si ya existe una instancia previa
      if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
      }

      // Inicializa nueva tabla
      $(selector).DataTable(options);
    }, 100);
  }

  destroy(selector: string) {
    try {
      if ($.fn.DataTable.isDataTable(selector)) {
        const table = $(selector).DataTable();
        table.clear();
        table.destroy();
        console.log('🧹 DataTable destruido correctamente:', selector);
      }
    } catch (e) {
      console.warn('⚠️ No se pudo destruir DataTable (posiblemente no inicializado aún):', selector);
    }
  }
}
