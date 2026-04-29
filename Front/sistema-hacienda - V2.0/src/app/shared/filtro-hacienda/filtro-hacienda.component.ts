import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthserviceService } from '../../services/authservice.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Hacienda {
  id: number;
  name: string;
}

@Component({
  selector: 'app-filtro-hacienda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro-hacienda.component.html'
})
export class FiltroHaciendaComponent implements OnInit {

  @Input() grupoOcultar: string = '';
  @Input() gruposPermitidos: string[] = [];

  @Output() cambioHacienda = new EventEmitter<any>();

  idhaciendaSeleccionada: number | null = null;
  namehacienda: string | null = null;

  ocultarFiltro: boolean = false;

  // 🔥 NOMBRE CORRECTO
  haciendas: Hacienda[] = [
    { id: 1, name: 'AGRICOLA E INDUSTRIAL PRIMOBANANO S.A.' },
    { id: 3, name: 'SOFCA C.A.' }
  ];

  constructor(
    private permisoService: AuthserviceService,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    this.idhaciendaSeleccionada = this.userService.getCodEmpresa();
    this.namehacienda = this.userService.getNomEmpresa();

    const tieneGrupoOcultar = this.grupoOcultar
      ? this.permisoService.tieneGrupo(this.grupoOcultar)
      : false;

    const tienePermitidos = this.gruposPermitidos.length > 0
      ? this.gruposPermitidos.some(g => this.permisoService.tieneGrupo(g))
      : true;

    this.ocultarFiltro = tieneGrupoOcultar && !tienePermitidos;

    // 🔥 emitir valor inicial
    if (this.idhaciendaSeleccionada) {
      let id = this.idhaciendaSeleccionada;
      if (id === 8) id = 3;

      const hacienda = this.haciendas.find((h: Hacienda) => h.id === id);

      if (hacienda) {
        this.cambioHacienda.emit(hacienda);
      }
    }
  }

  onChange(): void {
    const hacienda = this.haciendas.find(
      (h: any) => h.id === this.idhaciendaSeleccionada
    );

    if (hacienda) {
      this.cambioHacienda.emit(hacienda); // 🔥 ahora envía TODO
    }
  }
}