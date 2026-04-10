import { Component, OnDestroy, OnInit } from '@angular/core';
import { HojasaldosService } from '../../../services/hojasaldos.service';
import { Router } from '@angular/router';
import { DatePipe, NgForOf } from '@angular/common';
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
  registros: any[] = [];
  loading = false;
  idhaciendaSeleccionada: any = null;
  dataTable: any;
  datos: any = {
    cabecera: {},
    detalle: []
  };


  constructor(private service: HojasaldosService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarHistorico();
    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();


  }

  cargarHistorico() {

    this.service.listarHistorico().subscribe(resp => {
      const haciendas = [1, 8]
      let idhacienda = this.idhaciendaSeleccionada

      if (haciendas.includes(idhacienda)) {


        const respuestaFiltrada = resp.filter(item => item.idHacienda === this.idhaciendaSeleccionada);
        this.registros = respuestaFiltrada

      } else {
        this.registros = resp;
        console.log("registros:", this.registros)
      }

      setTimeout(() => this.inicializarDatatable(), 0);
    });
  }

  verdetalle(id: number) {

    this.service.verPorId(id).subscribe({
      next: (resp) => {
        this.datos = resp;
        console.log(resp)


        // ?? Abrimos el modal SOLO cuando ya hay datos
        setTimeout(() => {
          const modal = new (window as any).bootstrap.Modal(
            document.getElementById('previewModal')
          );
          modal.show();
        });
      },
      error: () => {
        alert('No se pudo cargar el detalle');
      }
    });

  }

  inicializarDatatable(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    this.dataTable = $('#tablaHistorico').DataTable({
      pageLength: 10,
      ordering: false, // 👈 DESACTIVA TODAS las columnas
      language: {
        emptyTable: 'No hay datos para la fecha seleccionada'
      }


    });

  }

  /* reimprimir(id: number): void {
    this.router.navigate(['/imprimir', id]);
  } */

  reimprimir(id: number) {
    this.loading = true;
    this.service.imprimirPorId(id).subscribe({
      next: (resp) => {
        console.log(resp)
        this.loading = false;
      },
      error: () => {
        alert('No se pudo imprimir');
        this.loading = false;
      }
    });
  }


  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
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
    return colores[nombreColor] || { background: nombreColor, text: 'black' };
  }



  verReporte(id: number) {
    const body = { idcab: id };
    this.service.generarReporte(body)
      .subscribe((data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }, error => {
        console.error('Error al generar reporte', error);
      });
  }

}
