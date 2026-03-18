import {Component, OnInit} from '@angular/core';
import {BodegahaciendaService} from '../../../services/bodegahacienda.service';
import {AuthserviceService} from '../../../services/authservice.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LoaderComponent} from '../../../shared/spinner/loader/loader.component';
import {UserService} from '../../../services/user.service';
declare var $:any;
@Component({
  selector: 'app-itemsdespachados',
  standalone: true,
  imports: [

    FormsModule,

    LoaderComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './itemsdespachados.component.html',
  styleUrl: './itemsdespachados.component.css'
})
export class ItemsdespachadosComponent implements OnInit {

  loading = false;
  fechaSeleccionada = '';
  idhaciendaSeleccionada!: number;
  namehacienda: any = null;
  haciendas: any[] = [];
  haciendaCatalogo= [
    {id: 1, name: 'AGRICOLA E INDUSTRIAL PRIMOBANANO S.A.'},
    {id: 3, name: 'SOCIEDAD FIDUCIARIA E INMOBILIARIA C.A.'},

  ]

  dataTable: any = null;

  hoy = new Date().toISOString().split('T')[0]; // ?? límite máximo

  constructor(
    protected permisoService: AuthserviceService,
    private serviceBodega: BodegahaciendaService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
  //  this.cargarUltimaFechaDespacho();
    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();

    this.namehacienda = this.userService.getNomEmpresa();

    this.cargarHaciendas()
  }

  cargarHaciendas(): void {


    this.loading = true;

    this.serviceBodega.getUltimaFechaDespachoPorHacienda().subscribe({
      next: res => {

        this.haciendas = res.map(h => {
          const haciendaInfo = this.haciendaCatalogo.find(
            x => x.id === h.idhacienda
          );


          return {
            ...h,
            name: haciendaInfo?.name ?? 'Hacienda desconocida'
          };
        });

        const esMayordomo = this.permisoService.tieneGrupo('bodega');
        if(esMayordomo){

          if(this.idhaciendaSeleccionada == 8){
            this.idhaciendaSeleccionada = 3
          }

          const haciendaUsuario = this.haciendas.find(
            h =>  h.idhacienda === this.idhaciendaSeleccionada
          );

          if(haciendaUsuario){
            this.idhaciendaSeleccionada = haciendaUsuario.idhacienda;

            this.fechaSeleccionada = haciendaUsuario.fecha;

            this.cargarDespachados();

          }
        }

        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  cargarDespachados(): void {

    if (!this.fechaSeleccionada || !this.idhaciendaSeleccionada) return;

    this.loading = true;

    const payload = {
      fechai: this.fechaSeleccionada,
      idhacienda: this.idhaciendaSeleccionada,
    };

    this.serviceBodega.despachado(payload).subscribe({
      next: (data: any[]) => {

        if (this.dataTable) {
          this.dataTable.clear().destroy();
          this.dataTable = null;
        }

        this.dataTable = $('#tablaDespachos').DataTable({
          data: data ?? [],
          columns: [
            { data: 'Documento' },
            {
              data: 'FechaEmision',
              render: (data:any) => data ? new Date(data).toLocaleDateString('es-ES') : ''
            },
            { data: 'producto' },
            { data: 'usuario' },
            { data: 'Solicitante' },
            { data: 'TotalDespachado' },
            {
              data: 'fecha_despacho',
              render: (data:any) => data ? new Date(data).toLocaleDateString('es-ES') : ''
            }
          ],
          destroy: true,
          ordering: true,
          language: {
            emptyTable: 'No hay datos para la fecha seleccionada'
          }
        });

        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }


  onHaciendaChange(): void {

    const hacienda = this.haciendas.find(
      h => h.idhacienda == this.idhaciendaSeleccionada
    );

    if (!hacienda?.fecha) return;

    this.fechaSeleccionada = hacienda.fecha;

    this.cargarDespachados();
  }

  onFechaChange(): void {
    this.cargarDespachados();
  }

}

