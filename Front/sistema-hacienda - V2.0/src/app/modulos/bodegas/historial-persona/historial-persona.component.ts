import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BodegahaciendaService } from '../../../services/bodegahacienda.service';
import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-historial-persona',
  standalone: true,
  imports: [NgFor, DatePipe, NgClass, DecimalPipe, NgIf],
  templateUrl: './historial-persona.component.html',
  styleUrl: './historial-persona.component.css'
})
export class HistorialPersonaComponent {
  idlotero!: number;
  idhacienda!: number;
  nombre = '';

  semana!: number;
  anio!: number;
  periodo!: number;

  loading = false;

  historial: any[] = [];
  movimientos: any[] = [];

  resumen = {
    total_entregado: 0,
    total_estimado: 0,
    cumplimiento: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BodegahaciendaService
  ) { }

  ngOnInit(): void {

    const params = this.route.snapshot.queryParams;

    this.idlotero = +params['idlotero'];
    this.idhacienda = +params['idhacienda'];
    this.nombre = params['nombre'] || '';

    // 🔥 CONTEXTO ERP
    this.semana = +params['semana'];
    this.anio = +params['anio'];
    this.periodo = +params['periodo'];

    this.cargarHistorial();
  }
  cargarHistorial() {

    if (!this.idlotero || !this.idhacienda) return;

    this.loading = true;

    this.service.getHistorialPersona({
      idlotero: this.idlotero,
      idhacienda: this.idhacienda
    }).subscribe({
      next: (res: any) => {
        this.historial = res.historial || [];
        this.movimientos = res.movimientos || [];
        this.resumen = res.resumen || this.resumen;
        this.loading = false;

      },
      error: () => this.loading = false
    });
  }

  // 🔥 VOLVER ERP REAL
  volver() {
    this.router.navigate(['bodegas/rollos'], {
      queryParams: {
        semana: this.semana,
        anio: this.anio,
        periodo: this.periodo,
        idhacienda: this.idhacienda,
        fromHistorial: 1 // 🔥 CLAVE
      }
    });
  }
}
