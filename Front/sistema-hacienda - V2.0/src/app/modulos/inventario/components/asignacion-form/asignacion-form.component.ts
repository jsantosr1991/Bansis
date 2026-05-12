import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InventarioService } from '../../../../services/inventario.service';
import { AlertService } from '../../../../services/alert.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from "../../pages/modal/modal.component";

@Component({
  selector: 'app-asignacion-form',
  standalone: true,
  imports: [NgFor, CommonModule,
    FormsModule, NgIf, ModalComponent],
  templateUrl: './asignacion-form.component.html',
  styleUrl: './asignacion-form.component.css'
})
export class AsignacionFormComponent {
  searchUsuario: string = '';
  usuariosFiltrados: any[] = [];
  showDropdown: boolean = false;

  @Input() producto: any;
  @Output() close = new EventEmitter();
  @Output() saved = new EventEmitter();

  usuarios: any[] = [];

  form = {
    usuario_recibe_id: null,
    cantidad: 1,
    observacion: ''
  };

  loading = false;

  constructor(
    private api: InventarioService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.api.getUsuarios().subscribe((res: any) => {
      this.usuarios = res;
      this.usuariosFiltrados = res;
    });

    // cerrar al hacer click fuera
    document.addEventListener('click', (e: any) => {
      if (!e.target.closest('.autocomplete')) {
        this.showDropdown = false;
      }
    });
  }

  guardar() {

    if (!this.form.usuario_recibe_id) {
      this.alert.warning('Seleccione un usuario');
      return;
    }

    const payload = {
      producto_id: this.producto.id,
      cantidad: this.form.cantidad,
      usuario_recibe_id: this.form.usuario_recibe_id,
      observacion: this.form.observacion,

      bodega_id: this.producto.bodega_id
    };
    console.log(payload)
    this.loading = true;

    this.api.asignarProducto(payload).subscribe({
      next: () => {

        this.alert.success('Producto asignado correctamente');

        this.saved.emit();
        this.close.emit();
      },
      error: err => {
        this.alert.error(err.error?.message || 'Error al asignar');
        this.loading = false;
      }
    });
  }

  filtrarUsuarios() {
    const term = (this.searchUsuario || '').toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter(u => {
      const nombre = (u.nombres || '').toLowerCase();
      const codigo = String(u.codempleado || '').toLowerCase();

      return nombre.includes(term) || codigo.includes(term);
    });
  }
  seleccionarUsuario(u: any) {
    this.form.usuario_recibe_id = u.codempleado; // 👈 tu lógica actual

    this.searchUsuario = `${u.nombres}`;
    this.showDropdown = false;
  }
}
