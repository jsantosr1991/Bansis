import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InventarioService } from '../../../../services/inventario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from "../../pages/modal/modal.component";
import { AlertService } from '../../../../services/alert.service';


@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule,
    FormsModule, ModalComponent],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent {
  categorias: any[] = [];
  @Input() producto: any = null; // 👈 para edición futura
  @Output() close = new EventEmitter();
  @Output() saved = new EventEmitter();

  form: any = {
    nombre: '',
    codigo: '',
    categoria_id: null,
    descripcion: '',
    unidad: 'unidad',
    stock_minimo: 0,

    // 🔥 NUEVOS
    stock_inicial: 0,
    bodega_id: 1
  };

  constructor(private api: InventarioService, private alert: AlertService) { }

  ngOnInit() {
    this.api.getCategorias().subscribe((res: any) => {
      this.categorias = res.data;

    });

    if (this.producto) {
      this.form = { ...this.producto };
    }
  }

  guardar() {

    this.alert.loading('Guardando producto...');

    this.api.crearProducto(this.form).subscribe({

      next: () => {

        this.alert.close();

        this.alert.success('Producto creado correctamente');

        this.saved.emit();
        this.close.emit();
      },

      error: err => {

        this.alert.close();

        this.alert.error(err.error?.message || 'Error al guardar');
      }

    });
  }
}
