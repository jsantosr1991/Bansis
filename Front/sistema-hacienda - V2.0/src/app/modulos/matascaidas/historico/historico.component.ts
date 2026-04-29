import { Component, OnDestroy, OnInit } from '@angular/core';
import { HojasaldosService } from '../../../services/hojasaldos.service';
import { Router } from '@angular/router';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { LoaderComponent } from "../../../shared/spinner/loader/loader.component";

declare var $: any;
@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    LoaderComponent
  ],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.css'
})
export class HistoricoComponent implements OnInit, OnDestroy {

  allColumns: any[] = [];
  columns: any[] = [];
  viejaColumns: any[] = [];
  jovenColumns: any[] = [];

  rowsMatrix: any[] = [];
  registros: any[] = [];

  allLotes: string[] = [];
  columnTotals: any = {};
  grandTotal: number = 0;

  loading = false;
  idhaciendaSeleccionada: any = null;
  dataTable: any;

  datos: any = {
    cabecera: {},
    detalle: []
  };

  constructor(
    private service: HojasaldosService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();
    this.cargarHistorico();
  }

  // =============================
  // 📊 HISTÓRICO
  // =============================
  cargarHistorico() {
    this.service.listarHistorico().subscribe(resp => {

      const haciendas = [1, 8];

      this.registros = haciendas.includes(this.idhaciendaSeleccionada)
        ? resp.filter(item => item.idHacienda === this.idhaciendaSeleccionada)
        : resp;

      setTimeout(() => this.inicializarDatatable(), 0);
    });
  }

  inicializarDatatable(): void {
    if (this.dataTable) this.dataTable.destroy();

    this.dataTable = $('#tablaHistorico').DataTable({
      pageLength: 10,
      ordering: false,
      language: {
        emptyTable: 'No hay datos disponibles'
      }
    });
  }

  // =============================
  // 📄 REPORTE
  // =============================
  verReporte(id: number) {

    this.loading = true;

    this.service.verPorId(id).subscribe({
      next: (resp: any[]) => {

        if (!resp || resp.length === 0) {
          this.loading = false;
          return;
        }

        const cab = resp[0];
        this.setCabecera(cab);

        // 🔥 1. COLORES
        this.service.obtenerCintasMataCaidas(cab.semana).subscribe((cols: any[]) => {

          this.allColumns = cols.map(c => ({
            codigo: c.idcalendar,
            color: c.color
          })).reverse();

          // 🔥 2. LOTES DESDE BD
          this.service.obtenerLotesMayordomo(cab.idHacienda).subscribe((lotes: any[]) => {

            const codCab = String(cab.codEmpleado).trim();

            let lotesBD = lotes
              .filter(l => String(l.codempleado).trim() === codCab)
              .map(l => l.lote?.toString().trim());

            console.log('Empleado:', codCab);
            console.log('Lotes BD:', lotesBD);

            // 🔥 3. LOTES DESDE REPORTE (solo apoyo)
            const lotesResp = resp.map(r => r.lote?.toString().trim());

            // 🔥 4. UNIÓN INTELIGENTE (CLAVE)
            const todosLosLotes = [...lotesBD, ...lotesResp];

            this.allLotes = [...new Set(todosLosLotes)]
              .filter(l => l) // quitar null
              .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

            console.log('Lotes finales:', this.allLotes);

            // 🔥 5. ARMAR REPORTE
            this.buildColumns(this.allColumns);
            this.buildMatrixCompleta(resp);

            this.loading = false;

            setTimeout(() => {
              this.abrirModal('reporteModal');
            });

          });

        });

      },
      error: () => {
        this.loading = false;
        alert('Error generando reporte');
      }
    });
  }

  setCabecera(cab: any) {
    this.datos = {
      cabecera: {
        nombrehacienda: cab.nombrehacienda,
        semana: cab.semana,
        anio: cab.anio,
        empleado: cab.NOMBRE_CORTO
      },
      detalle: []
    };
  }

  // =============================
  // 🧱 COLUMNAS
  // =============================
  buildColumns(columnsData: any[]) {

    this.columns = columnsData.sort((a, b) => Number(a.codigo) - Number(b.codigo));

    const LIMITE_VIEJAS = 5;

    this.viejaColumns = this.columns.slice(0, LIMITE_VIEJAS);
    this.jovenColumns = this.columns.slice(LIMITE_VIEJAS);
  }

  // =============================
  // 🧮 MATRIZ COMPLETA (CON CEROS)
  // =============================
  buildMatrixCompleta(data: any[]) {

    const matrix: any = {};
    this.columnTotals = {};
    this.grandTotal = 0;

    // Inicializar columnas
    this.columns.forEach(col => this.columnTotals[col.codigo] = 0);

    // Inicializar matriz con TODOS los lotes
    this.allLotes.forEach(lote => {
      matrix[lote] = {};
      this.columns.forEach(col => matrix[lote][col.codigo] = 0);
    });

    // Llenar datos reales
    data.forEach(item => {

      const lote = item.lote?.toString().trim();
      if (!matrix[lote]) return;

      const val = Number(item.cantidad);

      matrix[lote][item.codigo] = val;
      this.columnTotals[item.codigo] += val;
      this.grandTotal += val;
    });

    // Construir filas
    this.rowsMatrix = this.allLotes.map(lote => {

      const row: any = { lote, total: 0 };

      this.columns.forEach(col => {
        const val = matrix[lote][col.codigo];
        row[col.codigo] = val;
        row.total += val;
      });

      return row;
    });
  }

  // =============================
  // 👁️ DETALLE
  // =============================
  verdetalle(id: number) {

    this.service.imprimirPorId(id).subscribe({
      next: (resp: any) => {

        this.datos = resp;

        this.grandTotal = resp.detalle.reduce(
          (acc: number, item: any) => acc + Number(item.cantidad), 0
        );

        this.abrirModal('previewModal');
      },
      error: () => alert('No se pudo cargar el detalle')
    });
  }

  // =============================
  // 🧰 UTILIDADES
  // =============================
  abrirModal(id: string) {
    setTimeout(() => {
      const modal = new (window as any).bootstrap.Modal(
        document.getElementById(id)
      );
      modal.show();
    });
  }

  fechaImpresion: string = '';

  imprimir() {
    const now = new Date();

    this.fechaImpresion = now.toLocaleString('es-EC', {
      dateStyle: 'short',
      timeStyle: 'short'
    });

    setTimeout(() => {
      window.print();
    }, 100);
  }

  getBackgroundColor(nombreColor: string) {
    const colores: any = {
      CAFE: 'brown',
      NEGRO: 'black',
      AZUL: 'blue',
      ROJO: 'red',
      VERDE: 'green',
      AMARILLO: 'yellow',
      BLANCO: 'white',
      NARANJA: 'orange',
      LILA: 'purple'
    };
    return colores[nombreColor] || nombreColor;
  }

  reimprimir(id: number) {
    this.loading = true;

    this.service.imprimirPorId(id).subscribe({
      next: () => this.loading = false,
      error: () => {
        alert('No se pudo imprimir');
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataTable) this.dataTable.destroy();
  }
}