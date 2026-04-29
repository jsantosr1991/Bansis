import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InventarioService } from '../../../../services/inventario.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ModalComponent } from "../../pages/modal/modal.component";

@Component({
  selector: 'app-kardex',
  standalone: true,
  imports: [NgFor, NgClass, ModalComponent, NgIf],
  templateUrl: './kardex.component.html',
  styleUrl: './kardex.component.css'
})
export class KardexComponent {
  @Input() producto: any;
  @Output() close = new EventEmitter();
  formatearFecha(fecha: string) {
    return new Date(fecha).toLocaleString();
  }
  data: any[] = [];

  constructor(private api: InventarioService) { }

  ngOnInit() {
    this.api.getKardex(this.producto.id)
      .subscribe((res: any) => this.data = res);
  }
}
