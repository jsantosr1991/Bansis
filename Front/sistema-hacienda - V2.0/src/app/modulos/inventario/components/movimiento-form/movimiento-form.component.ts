import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { InventarioService } from '../../../../services/inventario.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from "../../pages/modal/modal.component";
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [NgFor, CommonModule,
    FormsModule, ModalComponent],
  templateUrl: './movimiento-form.component.html',
  styleUrl: './movimiento-form.component.css'
})
export class MovimientoFormComponent implements OnInit {

  @Input() tipo!: 'INGRESO' | 'SALIDA';
  @Output() close = new EventEmitter();
  @Output() saved = new EventEmitter();

  productos: any[] = [];
  bodegas: any[] = [];

  productoFiltrado: any[] = [];
  searchProducto = '';
  showDropdown = false;

  stockActual: number = 0;

  loading = false;
  touchedProducto = false;

  form: any = {
    producto_id: null,
    bodega_id: null,
    tipo: 'INGRESO',
    cantidad: null,
    motivo: null,
    documento: ''
  };

  // 🎯 MOTIVOS DINÁMICOS
  motivos: any = {
    INGRESO: ['COMPRA', 'DEVOLUCION', 'AJUSTE POSITIVO'],
    SALIDA: ['CONSUMO', 'VENTA', 'DAÑO'],
    AJUSTE: ['INVENTARIO FISICO']
  };

  constructor(private api: InventarioService, private alert: AlertService) { }

  ngOnInit() {
    this.form.tipo = this.tipo;
    this.cargarDatos();
  }

  cargarDatos() {
    this.api.getProductos().subscribe((res: any) => {
      this.productos = res.data || [];
    });

    this.api.getBodegas().subscribe((res: any) => {
      this.bodegas = res.data || [];
    });
  }

  // 🔍 BUSCAR
  filtrarProductos() {
    const texto = this.searchProducto?.toLowerCase() || '';

    if (!texto) {
      this.productoFiltrado = [];
      this.showDropdown = false;
      return;
    }

    this.productoFiltrado = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      (p.codigo || '').toLowerCase().includes(texto)
    );

    this.showDropdown = true;
  }

  // ✅ SELECCIONAR
  seleccionarProducto(p: any) {
    this.form.producto_id = p.id;
    this.searchProducto = `${p.nombre} (${p.codigo})`;

    this.productoFiltrado = [];
    this.showDropdown = false;
    this.touchedProducto = true;

    // 🔥 STOCK EN TIEMPO REAL
    this.api.getStockProducto(p.id).subscribe((res: any) => {
      this.stockActual = res[0]?.cantidad_actual || 0;
    });
  }

  // 🧠 CLICK FUERA
  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (!event.target.closest('.producto-search')) {
      this.showDropdown = false;
    }
  }

  get motivosFiltrados() {
    return this.motivos[this.form.tipo] || [];
  }

  // 🚫 VALIDAR SALIDA
  puedeGuardar(): boolean {
    if (!this.form.producto_id || !this.form.bodega_id || !this.form.cantidad) {
      return false;
    }

    if (this.tipo === 'SALIDA' && this.form.cantidad > this.stockActual) {
      return false;
    }

    return true;
  }

  guardar() {
    this.touchedProducto = true;

    if (!this.puedeGuardar()) {
      alert('Verifique los datos');
      return;
    }

    this.loading = true;
    this.alert.loading('Guardando...');

    this.api.crearMovimiento(this.form).subscribe({
      next: (res) => {


        this.loading = false;
        this.alert.close();
        this.alert.success('Guardado correctamente');

        this.saved.emit();
        this.close.emit();
      },

      error: err => {



        this.loading = false;
        this.alert.close();
        this.alert.error(err.error?.message || 'Error al guardar');
      }
    });
  }
}