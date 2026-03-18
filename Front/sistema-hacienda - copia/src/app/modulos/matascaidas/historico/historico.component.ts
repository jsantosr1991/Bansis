import {Component, OnDestroy, OnInit} from '@angular/core';
import {HojasaldosService} from '../../../services/hojasaldos.service';
import {Router} from '@angular/router';
import {DatePipe, NgForOf} from '@angular/common';
import {UserService} from '../../../services/user.service';

declare var $:any;
@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe
  ],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.css'
})
export class HistoricoComponent implements OnInit, OnDestroy {
  registros: any[] = [];

  idhaciendaSeleccionada: any = null;
  dataTable: any;
  datos: any = {
    cabecera: {},
    detalle: []
  };


    constructor(private service: HojasaldosService,
                private userService: UserService,
                private router: Router
               ) {}

      ngOnInit():void {
      this.cargarHistorico();
      this.idhaciendaSeleccionada = this.userService.getCodEmpresa();


      }

      cargarHistorico(){

      this.service.listarHistorico().subscribe(resp =>{
        const haciendas = [1,8]
        let idhacienda = this.idhaciendaSeleccionada

        if(haciendas.includes(idhacienda)){
          if(idhacienda ===8 ){
            this.idhaciendaSeleccionada = 3
          }
          const respuestaFiltrada = resp.filter(item => item.hacienda_id === this.idhaciendaSeleccionada);
          this.registros = respuestaFiltrada
        } else {
          this.registros = resp;
        }

           setTimeout(()=> this.inicializarDatatable(),0);
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

      inicializarDatatable():void{
      if (this.dataTable){
        this.dataTable.destroy();
      }
        this.dataTable = $('#tablaHistorico').DataTable({
          pageLength: 10,
          order:[[1, 'desc']],
          language: {
            emptyTable: 'No hay datos para la fecha seleccionada'
          }

        });
      }

      reimprimir(id:number):void {
        this.router.navigate(['/imprimir', id]);
      }

      ngOnDestroy():void {
      if(this.dataTable){
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
    return colores[nombreColor] || {background: nombreColor, text: 'black'};
  }
    }
