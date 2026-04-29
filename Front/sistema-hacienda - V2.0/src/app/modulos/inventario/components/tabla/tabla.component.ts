import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule,
    FormsModule],
  templateUrl: './tabla.component.html',
  styleUrl: './tabla.component.css'
})
export class TablaComponent {
  @Input() data: any[] = [];
  @Output() verKardex = new EventEmitter();

  page = 1;
  pageSize = 10;
  expandedRow: any = null;
  paginatedData: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {

      // ✅ SOLO resetear si la data realmente cambió de tamaño
      if (this.page > this.totalPages) {
        this.page = 1;
      }

      this.updatePagination();
    }
  }

  get totalPages() {
    return Math.ceil(this.data.length / this.pageSize) || 1;
  }

  get startIndex() {
    return (this.page - 1) * this.pageSize;
  }

  get endIndex() {
    return Math.min(this.startIndex + this.pageSize, this.data.length);
  }

  updatePagination() {
    const start = this.startIndex;
    const end = start + this.pageSize;
    this.paginatedData = this.data.slice(start, end);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagination();
    }
  }
  // 🔥 TOGGLE PRO
  toggleRow(row: any) {
    this.expandedRow = this.expandedRow === row ? null : row;
  }

  isExpanded(p: any): boolean {
    return this.expandedRow === p;
  }
}
