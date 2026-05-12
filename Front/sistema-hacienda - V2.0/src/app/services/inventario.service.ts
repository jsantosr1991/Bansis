import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  // 📦 PRODUCTOS
  getProductos() {
    return this.http.get(`${this.baseUrl}/inventario/productos`);
  }
  getCategorias() {
    return this.http.get(`${this.baseUrl}/inventario/categorias`);
  }

  crearProducto(data: any) {
    return this.http.post(`${this.baseUrl}/inventario/productos`, data);
  }

  // 🔄 MOVIMIENTOS
  getMovimientos() {
    return this.http.get(`${this.baseUrl}/inventario/movimientos`);
  }

  crearMovimiento(data: any) {
    return this.http.post(`${this.baseUrl}/inventario/movimientos`, data);
  }

  // 📊 STOCK
  getStockGeneral() {
    return this.http.get(`${this.baseUrl}/inventario/stock`);
  }

  getStockProducto(id: number) {
    return this.http.get(`${this.baseUrl}/inventario/stock/${id}`);
  }

  // 📘 KARDEX
  getKardex(id: number) {
    return this.http.get(`${this.baseUrl}/inventario/kardex/${id}`);
  }

  getBodegas() {
    return this.http.get(`${this.baseUrl}/inventario/bodegas`);
  }


  // 🔥 ASIGNAR PRODUCTO
  asignarProducto(data: any) {
    return this.http.post(`${this.baseUrl}/inventario/asignar`, data);
  }

  // 📊 HISTORIAL
  getAsignaciones() {
    return this.http.get<any[]>(`${this.baseUrl}/inventario/asignaciones`);
  }
  // 🔄 DEVOLVER
  devolverProducto(data: any) {
    return this.http.post(`${this.baseUrl}/inventario/devolver`, data);
  }

  // 👤 USUARIOS (DINÁMICO)
  getUsuarios() {
    return this.http.get(`${this.baseUrl}/users`);
  }
}
