import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexTooltip,
  ApexLegend,
  ApexNonAxisChartSeries
} from 'ng-apexcharts';

import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

import { EstadisticasService } from '../../../services/estadisticas.service';
import { BodegahaciendaService } from '../../../services/bodegahacienda.service';
import { FiltroHaciendaComponent } from "../../../shared/filtro-hacienda/filtro-hacienda.component";
import { LoaderComponent } from "../../../shared/spinner/loader/loader.component";

@Component({
  selector: 'app-racimosrecusados',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgFor,
    NgApexchartsModule,
    FiltroHaciendaComponent,
    LoaderComponent
  ],
  templateUrl: './racimosrecusados.component.html',
  styleUrl: './racimosrecusados.component.css'
})

export class RacimosrecusadosComponent implements OnInit {

  chartLabels: string[] = [];

  chartLegend: ApexLegend = {
    position: 'bottom'
  };
  chartTooltip: ApexTooltip = {

    shared: true,

    intersect: false,

    y: {

      formatter: (value: number) => {

        return value + ' recusados';

      }

    },



  };

  chartTooltipLotes: ApexTooltip = {

    shared: false,

    intersect: false,

    x: {
      show: false
    },

    marker: {
      show: false
    },

    y: {
      title: {
        formatter: () => ''
      }
    },

    custom: ({ series, dataPointIndex, w }) => {

      //------------------------------------------------
      // TOTAL
      //------------------------------------------------

      const total = series.reduce(
        (acc: number, current: any) =>
          acc + (current[dataPointIndex] || 0),
        0
      );

      //------------------------------------------------
      // LOTE
      //------------------------------------------------

      const lote =
        w.globals.categoryLabels[dataPointIndex] || '';

      //------------------------------------------------
      // DETALLE
      //------------------------------------------------

      let detalle = '';

      w.config.series.forEach(
        (serie: any, index: number) => {

          const valor =
            series[index][dataPointIndex];

          if (valor > 0) {

            detalle += `

            <div style="
              display:flex;
              justify-content:space-between;
              gap:15px;
              margin:4px 0;
            ">

              <span>
                ${serie.name}
              </span>

              <strong>
                ${valor}
              </strong>

            </div>

          `;
          }

        }
      );

      return `

      <div style="
        padding:12px;
        min-width:220px;
      ">

        <div style="
          font-weight:700;
          margin-bottom:8px;
        ">

          ${lote}

        </div>

        ${detalle}

        <hr>

        <div style="
          display:flex;
          justify-content:space-between;
          font-weight:700;
        ">

          <span>TOTAL</span>

          <span>${total}</span>

        </div>

      </div>

    `;
    }

  };

  desde: string = '';
  hasta: string = '';
  // KPIs
  totalRecusado = 0;

  totalNivel1 = 0;
  totalNivel2 = 0;
  totalNivel3 = 0;

  // TOP SECCIONES
  topSecciones: any[] = [];

  // RESUMEN POR DAÑO
  resumenDanos: any[] = [];

  resumenEdades: any[] = [];

  // =========================================
  // KPI LOTE CRITICO
  // =========================================

  loteCritico = '';

  danoCritico = '';

  totalCritico = 0;

  loading = false;

  mostrarFiltros = false;
  mostrarDropdownDano = false;

  mostrarDropdownNivel = false;

  mostrarDropdownEdad = false;

  tipoFiltro: | 'dia' | 'semana' | 'periodo' | 'anio' | 'rango' | 'personalizado' = 'semana';



  // 🔥 HACIENDA
  idhaciendaSeleccionada!: number;

  namehacienda: any = null;

  CONFIG_FILTRO = {
    grupoOcultar: ['mayordomo'],
    gruposPermitidos: ['gerencia', 'administradores']
  };

  // 🔥 FECHA
  fecha: string = '';

  semana: number = 0;

  periodo: number = 0;

  anio: number = new Date().getFullYear();

  // 🔥 FILTROS
  filtroDano = '';

  filtroNivel = '';

  filtroEdad = '';

  // 🔥 DATA
  datos: any[] = [];

  datosFiltrados: any[] = [];

  danos: string[] = [];

  niveles: number[] = [];

  edades: any[] = [];

  // 🔥 AUTO BUSQUEDA
  private triggerBusqueda$ = new Subject<void>();

  // 🔥 CHART
  chartSeries: ApexNonAxisChartSeries = [];
  chartDetails: ApexChart = {
    type: 'bar',
    height: 450,
    toolbar: {
      show: true
    }
  };

  chartXAxis: ApexXAxis = {
    categories: []
  };

  chartDataLabels: ApexDataLabels = {
    enabled: true
  };

  chartPlotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      borderRadius: 6,
      columnWidth: '55%'
    }
  };



  // =========================================
  // CHART LOTES
  // =========================================

  chartSeriesLotes: any[] = [];

  chartDetailsLotes: ApexChart = {
    type: 'bar',
    height: 550,
    stacked: true,
    toolbar: {
      show: true
    }
  };

  chartXAxisLotes: ApexXAxis = {
    categories: []
  };

  chartPlotOptionsLotes: ApexPlotOptions = {
    bar: {
      horizontal: false,
      borderRadius: 6,
      columnWidth: '55%'
    }
  };

  chartDataLabelsLotes: ApexDataLabels = {
    enabled: false
  };



  constructor(
    private estadisticaService: EstadisticasService,
    private rollosService: BodegahaciendaService
  ) { }

  //------------------------------------------------
  // INIT
  //------------------------------------------------

  ngOnInit(): void {

    this.fecha = new Date()
      .toISOString()
      .substring(0, 10);

    this.calcularDesdeFecha();

    this.triggerBusqueda$
      .pipe(debounceTime(500))
      .subscribe(() => {

        this.autoBuscar();
      });
  }

  //------------------------------------------------
  // HACIENDA
  //------------------------------------------------

  onHaciendaChange(hacienda: any): void {

    this.idhaciendaSeleccionada = hacienda.id;

    this.namehacienda = hacienda.name;

    this.triggerBusqueda$.next();
  }


  //------------------------------------------------
  // CAMBIO FILTRO
  //------------------------------------------------

  onFiltroChange(): void {

    this.triggerBusqueda$.next();

  }



  seleccionarTipoFiltro(
    tipo:
      | 'dia'
      | 'semana'
      | 'periodo'
      | 'anio'
      | 'rango'
      | 'personalizado'
  ): void {

    this.tipoFiltro = tipo;

    //------------------------------------------------
    // MANTENER FECHA ACTUAL
    //------------------------------------------------

    if (!this.fecha) {

      this.fecha = new Date()
        .toISOString()
        .substring(0, 10);
    }

    //------------------------------------------------
    // RECALCULAR SEMANA/PERIODO
    //------------------------------------------------

    this.rollosService
      .getSemana(this.fecha)
      .subscribe({

        next: (res: any) => {

          this.semana = res?.semana ?? this.semana;

          this.periodo = res?.periodo ?? this.periodo;

          this.anio = res?.anio ?? new Date().getFullYear();

          this.triggerBusqueda$.next();
        }

      });

  }





  //------------------------------------------------
  // FECHA → SEMANA/PERIODO
  //------------------------------------------------

  calcularDesdeFecha(): void {

    this.loading = true;

    this.rollosService
      .getSemana(this.fecha)
      .subscribe({

        next: (res: any) => {

          this.semana = res?.semana ?? 0;

          this.periodo = res?.periodo ?? 0;

          this.anio = res?.anio ?? new Date().getFullYear();

          this.triggerBusqueda$.next();
        },

        complete: () => {
          this.loading = false;
        },

        error: () => {
          this.loading = false;
        }
      });
  }

  //------------------------------------------------
  // AUTO BUSCAR
  //------------------------------------------------

  autoBuscar(): void {

    if (!this.idhaciendaSeleccionada) return;


    //------------------------------------------------
    // VALIDAR SEGÚN TIPO
    //------------------------------------------------

    if (this.tipoFiltro === 'dia') {

      if (!this.fecha) return;

    }

    if (this.tipoFiltro === 'semana') {

      if (!this.semana) return;

    }

    if (this.tipoFiltro === 'periodo') {

      if (!this.periodo) return;

    }

    if (this.tipoFiltro === 'anio') {

      if (!this.anio) return;

    }

    if (this.tipoFiltro === 'rango') {

      if (!this.desde || !this.hasta) return;

    }

    if (this.tipoFiltro === 'personalizado') {

      if (
        !this.semana &&
        !this.periodo &&
        !this.anio
      ) return;

    }



    this.buscar();
  }

  //------------------------------------------------
  // BUSCAR
  //------------------------------------------------


  buscar(): void {

    if (!this.idhaciendaSeleccionada) return;

    this.loading = true;

    //------------------------------------------------
    // PAYLOAD BASE
    //------------------------------------------------

    const payload: any = {

      codhac: this.idhaciendaSeleccionada,

      tipoFiltro: this.tipoFiltro
    };

    //------------------------------------------------
    // FILTRO DIA
    //------------------------------------------------

    if (this.tipoFiltro === 'dia') {

      payload.fecha = this.fecha;
    }

    //------------------------------------------------
    // FILTRO SEMANA
    //------------------------------------------------

    if (this.tipoFiltro === 'semana') {

      payload.semana = this.semana;

      payload.anio = this.anio;
    }

    //------------------------------------------------
    // FILTRO PERIODO
    //------------------------------------------------

    if (this.tipoFiltro === 'periodo') {

      payload.periodo = this.periodo;

      payload.anio = this.anio;
    }

    //------------------------------------------------
    // FILTRO AÑO
    //------------------------------------------------

    if (this.tipoFiltro === 'anio') {

      payload.anio = this.anio;
    }

    //------------------------------------------------
    // FILTRO RANGO
    //------------------------------------------------

    if (this.tipoFiltro === 'rango') {

      payload.desde = this.desde;

      payload.hasta = this.hasta;
    }

    //------------------------------------------------
    // FILTRO PERSONALIZADO
    //------------------------------------------------

    if (this.tipoFiltro === 'personalizado') {

      if (this.semana) {

        payload.semana = this.semana;
      }

      if (this.periodo) {

        payload.periodo = this.periodo;
      }

      if (this.anio) {

        payload.anio = this.anio;
      }

      if (this.fecha) {

        payload.fecha = this.fecha;
      }

      if (this.desde && this.hasta) {

        payload.desde = this.desde;

        payload.hasta = this.hasta;
      }
    }

    //------------------------------------------------
    // CONSULTA
    //------------------------------------------------

    this.estadisticaService
      .getRacimosRecusados(payload)
      .subscribe({

        next: (resp: any[]) => {

          this.datos = resp ?? [];

          this.datosFiltrados = [...this.datos];

          //------------------------------------------------
          // CATALOGOS
          //------------------------------------------------

          this.danos = [
            ...new Set(
              this.datos.map(x => x.Dano)
            )
          ];

          this.niveles = [
            ...new Set(
              this.datos.map(x =>
                Number(x['Nivel Daño'])
              )
            )
          ];

          this.edades = [
            ...new Set(
              this.datos.map(x => x.Edad)
            )
          ].sort((a, b) => b - a);

          this.cargarGrafico();
          this.cargarGraficoLotes();
          this.cargarDashboard();

          this.loading = false;
        },

        error: (err) => {

          console.error(err);

          this.loading = false;
        }
      });
  }


  //------------------------------------------------
  // FILTRAR
  //------------------------------------------------

  filtrarDatos(): void {

    this.datosFiltrados = this.datos.filter(x => {

      const cumpleDano =
        !this.filtroDano ||
        x.Dano === this.filtroDano;

      const cumpleNivel =
        !this.filtroNivel ||
        this.getNombreNivel(x['Nivel Daño']) === this.filtroNivel;

      const cumpleEdad =
        !this.filtroEdad ||
        x.Edad == this.filtroEdad;

      return (
        cumpleDano &&
        cumpleNivel &&
        cumpleEdad
      );
    });

    this.cargarGrafico();
    this.cargarGraficoLotes();
    this.cargarDashboard();
  }

  //------------------------------------------------
  // CHART
  //------------------------------------------------
  cargarGrafico(): void {

    //------------------------------------------------
    // AGRUPAR POR DAÑO
    //------------------------------------------------

    const mapDanos: any = {};

    this.datosFiltrados.forEach(x => {

      const dano = x.Dano || 'SIN DAÑO';

      if (!mapDanos[dano]) {

        mapDanos[dano] = 0;
      }

      mapDanos[dano] += Number(
        x.Recusado ?? 0
      );

    });

    //------------------------------------------------
    // LABELS
    //------------------------------------------------

    this.chartLabels = Object.keys(mapDanos);

    //------------------------------------------------
    // SERIES
    //------------------------------------------------

    this.chartSeries = Object.values(mapDanos);

    //------------------------------------------------
    // CONFIG PIE
    //------------------------------------------------

    this.chartDetails = {

      type: 'pie',

      height: 500,

      toolbar: {
        show: true
      }

    };

    //------------------------------------------------
    // DATALABELS
    //------------------------------------------------

    this.chartDataLabels = {

      enabled: true,

      formatter: function (val: number) {

        return val.toFixed(1) + '%';
      }

    };

    this.chartTooltip = {

      y: {

        formatter: (value: number) => {

          return value + ' recusados';

        }

      }

    };

  }


  /*   cargarGrafico(): void {
  
      //------------------------------------------------
      // LOTES ORDENADOS
      //------------------------------------------------
  
      const lotes = [
        ...new Set(
          this.datosFiltrados.map(x => x.Lote)
        )
      ]
        .sort((a: string, b: string) => {
  
          //------------------------------------------------
          // EXTRAER NUMERO
          //------------------------------------------------
  
          const numA = parseInt(
            a.match(/\d+/)?.[0] || '0',
            10
          );
  
          const numB = parseInt(
            b.match(/\d+/)?.[0] || '0',
            10
          );
  
          //------------------------------------------------
          // EXTRAER LETRA
          //------------------------------------------------
  
          const letraA =
            a.match(/[A-Z]+/)?.[0] || '';
  
          const letraB =
            b.match(/[A-Z]+/)?.[0] || '';
  
          //------------------------------------------------
          // ORDEN NUMERICO
          //------------------------------------------------
  
          if (numA !== numB) {
  
            return numA - numB;
          }
  
          //------------------------------------------------
          // SI EL NUMERO ES IGUAL
          //------------------------------------------------
  
          return letraA.localeCompare(letraB);
  
        });
  
      //------------------------------------------------
      // COMBINACIONES DAÑO + NIVEL
      //------------------------------------------------
  
      const combinaciones = [
        ...new Set(
          this.datosFiltrados.map(
            x => `${x.Dano}|${x['Nivel Daño']}`
          )
        )
      ];
  
      //------------------------------------------------
      // COLORES POR DAÑO
      //------------------------------------------------
  
      const coloresDano: any = {
  
        'ERWINIA': '#198754',
  
        'INSECTOS': '#dc3545',
  
        'SOBREGRADO': '#0d6efd',
  
        'COCHINILLA': '#6f42c1',
  
        'ESTROPEO': '#fd7e14',
  
        'POBRES': '#20c997',
  
        'LLENOS': '#6610f2',
  
        'OTROS CAMPO': '#6c757d',
  
        'DAÑO ANIMAL': '#ffc107',
  
        'ALTERADOS': '#fd7e14'
      };
  
      //------------------------------------------------
      // SERIES
      //------------------------------------------------
  
      this.chartSeries = combinaciones.map(combo => {
  
        const partes = combo.split('|');
  
        const dano = partes[0];
  
        const nivel = Number(partes[1]);
  
        return {
  
          //------------------------------------------------
          // LABEL
          //------------------------------------------------
  
          name: `${dano} - N${nivel}`,
  
          //------------------------------------------------
          // COLOR POR DAÑO
          //------------------------------------------------
  
          color:
            coloresDano[dano] || '#198754',
  
          //------------------------------------------------
          // DATA
          //------------------------------------------------
  
          data: lotes.map(lote => {
  
            return this.datosFiltrados
              .filter(x =>
  
                x.Lote === lote &&
  
                x.Dano === dano &&
  
                Number(x['Nivel Daño']) === nivel
  
              )
              .reduce(
                (acc, x) =>
                  acc + Number(x.Recusado ?? 0),
                0
              );
  
          })
        };
  
      });
  
      //------------------------------------------------
      // XAXIS
      //------------------------------------------------
  
      this.chartXAxis = {
  
        categories: lotes,
  
        labels: {
  
          rotate: -45,
  
          style: {
  
            fontSize: '11px'
          }
        }
      };
  
      //------------------------------------------------
      // CHART
      //------------------------------------------------
  
      this.chartDetails = {
  
        type: 'bar',
  
        height: 650,
  
        stacked: true,
  
        toolbar: {
          show: true
        },
  
  
      };
  
      //------------------------------------------------
      // PLOT OPTIONS
      //------------------------------------------------
  
      this.chartPlotOptions = {
  
        bar: {
  
          horizontal: true,
  
          borderRadius: 6,
  
          barHeight: '70%'
        }
      };
  
    }
   */


  cambiarSemana(valor: number): void {

    this.semana = Number(this.semana || 0) + valor;

    if (this.semana < 1) {
      this.semana = 1;
    }

    if (this.semana > 53) {
      this.semana = 53;
    }

    this.onFiltroChange();
  }

  sumarPorNivel(nivel: number): number {

    return this.datosFiltrados
      .filter(x => Number(x['Nivel Daño']) === nivel)
      .reduce((acc, x) => acc + Number(x.Recusado ?? 0), 0);

  }


  cargarDashboard(): void {

    //------------------------------------------------
    // TOTAL GENERAL
    //------------------------------------------------

    this.totalRecusado = this.datosFiltrados.reduce(
      (acc, x) => acc + Number(x.Recusado ?? 0),
      0
    );

    //------------------------------------------------
    // KPIs POR NIVEL
    //------------------------------------------------

    this.totalNivel1 = this.sumarPorNivel(1);

    this.totalNivel2 = this.sumarPorNivel(2);

    this.totalNivel3 = this.sumarPorNivel(3);

    //------------------------------------------------
    // TOP SECCIONES
    //------------------------------------------------

    const mapSecciones: any = {};

    this.datosFiltrados.forEach(x => {

      const seccion =
        x.Lote ||
        x.lote ||
        'SIN LOTE';

      if (!mapSecciones[seccion]) {

        mapSecciones[seccion] = 0;
      }

      mapSecciones[seccion] += Number(
        x.Recusado ?? 0
      );

    });

    //------------------------------------------------
    // ORDENAR SECCIONES
    //------------------------------------------------


    this.topSecciones = Object.keys(mapSecciones)
      .map(key => ({

        seccion: key,

        total: mapSecciones[key]

      }))
      .sort((a, b) => b.total - a.total);


    //------------------------------------------------
    // RESUMEN DAÑOS
    //------------------------------------------------

    const mapDanos: any = {};

    this.datosFiltrados.forEach(x => {

      const dano = x.Dano;

      if (!mapDanos[dano]) {

        mapDanos[dano] = 0;
      }

      mapDanos[dano] += Number(
        x.Recusado ?? 0
      );

    });

    this.resumenDanos = Object.keys(mapDanos)
      .map(key => ({

        dano: key,

        total: mapDanos[key]

      }))
      .sort((a, b) => b.total - a.total);

    //------------------------------------------------
    // RESUMEN EDADES
    //------------------------------------------------

    const mapEdades: any = {};

    this.datosFiltrados.forEach(x => {

      const edad = x.Edad || 'SIN EDAD';

      if (!mapEdades[edad]) {

        mapEdades[edad] = 0;
      }

      mapEdades[edad] += Number(
        x.Recusado ?? 0
      );

    });

    this.resumenEdades = Object.keys(mapEdades)
      .map(key => ({

        edad: key,

        total: mapEdades[key]

      }))
      .sort((a, b) => Number(b.edad) - Number(a.edad));

    //------------------------------------------------
    // LOTE MAS CRITICO
    //------------------------------------------------

    const mapLotesDanos: any = {};

    this.datosFiltrados.forEach(x => {

      const lote =
        x.Lote || 'SIN LOTE';

      const dano =
        x.Dano || 'SIN DAÑO';

      const key = `${lote}|${dano}`;

      if (!mapLotesDanos[key]) {

        mapLotesDanos[key] = 0;
      }

      mapLotesDanos[key] += Number(
        x.Recusado ?? 0
      );

    });

    //------------------------------------------------
    // OBTENER MAYOR
    //------------------------------------------------

    let max = 0;

    Object.keys(mapLotesDanos)
      .forEach(key => {

        const total =
          mapLotesDanos[key];

        if (total > max) {

          max = total;

          const partes = key.split('|');

          this.loteCritico = partes[0];

          this.danoCritico = partes[1];

          this.totalCritico = total;

        }

      });
  }


  cargarGraficoLotes(): void {

    //------------------------------------------------
    // LOTES
    //------------------------------------------------

    const lotes = [
      ...new Set(
        this.datosFiltrados.map(x => x.Lote)
      )
    ];

    //------------------------------------------------
    // DAÑOS
    //------------------------------------------------

    const danos = [
      ...new Set(
        this.datosFiltrados.map(x => x.Dano)
      )
    ];

    //------------------------------------------------
    // COLORES
    //------------------------------------------------

    const coloresDano: any = {

      'ERWINIA': '#198754',

      'INSECTOS': '#dc3545',

      'SOBREGRADO': '#0d6efd',

      'COCHINILLA': '#6f42c1',

      'ESTROPEO': '#fd7e14',

      'POBRES': '#20c997',

      'LLENOS': '#6610f2',

      'OTROS CAMPO': '#6c757d',

      'DAÑO ANIMAL': '#ffc107',

      'ALTERADOS': '#fd7e14'
    };

    //------------------------------------------------
    // SERIES
    //------------------------------------------------

    this.chartSeriesLotes = danos.map(dano => {

      return {

        name: dano,

        color: coloresDano[dano] || '#198754',

        data: lotes.map(lote => {

          return this.datosFiltrados
            .filter(x =>

              x.Lote === lote &&
              x.Dano === dano

            )
            .reduce(
              (acc, x) =>
                acc + Number(x.Recusado ?? 0),
              0
            );

        })

      };

    });

    //------------------------------------------------
    // XAXIS
    //------------------------------------------------

    this.chartXAxisLotes = {

      categories: lotes,

      labels: {

        rotate: -45,

        style: {

          fontSize: '11px'
        }
      }

    };

  }
  getNombreNivel(nivel: number | string): string {

    switch (Number(nivel)) {

      case 1:
        return 'SEVERO';

      case 2:
        return 'MODERADO';

      case 3:
        return 'LEVE';

      default:
        return 'SIN NIVEL';
    }

  }

}

