import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { InventarioService } from '../../../../services/inventario.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TablaComponent } from "../../components/tabla/tabla.component";
import { ProductoFormComponent } from "../../components/producto-form/producto-form.component";
import { MovimientoFormComponent } from "../../components/movimiento-form/movimiento-form.component";
import { KardexComponent } from "../../components/kardex/kardex.component";
import { AsignacionFormComponent } from "../../components/asignacion-form/asignacion-form.component";

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule,
    FormsModule, TablaComponent, ProductoFormComponent, MovimientoFormComponent, KardexComponent, NgIf, AsignacionFormComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent {
  @Output() asignar = new EventEmitter();
  productos: any[] = [];
  productosFiltrados: any[] = [];
  loading = false;
  showAsignacion = false;
  filtro = {
    texto: '',
    stock: ''
  };
  sinStock = 0;
  stockBajo = 0;
  stockOk = 0;

  // MODALES
  showProducto = false;
  showMovimiento = false;
  showKardex = false;

  tipoMovimiento: 'INGRESO' | 'SALIDA' = 'INGRESO';
  productoSeleccionado: any = null;

  filtrar() {
    if (!Array.isArray(this.productos)) {
      this.productosFiltrados = [];
      return;
    }

    const texto = (this.filtro.texto || '').toLowerCase().trim();

    this.productosFiltrados = this.productos.filter(p => {

      const matchTexto =
        !texto ||
        p.nombre?.toLowerCase().includes(texto) ||
        (p.codigo || '').toLowerCase().includes(texto);

      const matchStock =
        this.filtro.stock === 'bajo'
          ? p.stock <= 2
          : true;

      return matchTexto && matchStock;
    });

    // 🔥 KPI SIEMPRE SE CALCULA AQUÍ (CLAVE)
    this.calcularKPIs();
  }

  calcularKPIs() {
    const data = this.productos; // 👈 importante (NO filtrados)


    this.sinStock = data.filter(p => Number(p.stock) === 0).length;
    this.stockBajo = data.filter(p => Number(p.stock) > 0 && p.stock <= 2).length;
    this.stockOk = data.filter(p => Number(p.stock) > 2).length;
  }
  constructor(private api: InventarioService) { }

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.api.getProductos().subscribe((res: any) => {

      this.productos = res.data || [];

      this.filtrar(); // 🔥 IMPORTANTE
      this.loading = false;
    });
  }


  // ACCIONES
  openProducto() {
    this.showProducto = true;
  }

  openMovimiento(tipo: 'INGRESO' | 'SALIDA') {
    this.tipoMovimiento = tipo;
    this.showMovimiento = true;
  }

  openKardex(producto: any) {
    this.productoSeleccionado = producto;
    this.showKardex = true;
  }
  abrirAsignacion(producto: any) {
    this.productoSeleccionado = producto;
    this.showAsignacion = true;
  }
}
