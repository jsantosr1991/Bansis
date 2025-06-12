import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { DataTableComponent } from '../../../../shared/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { DEFAULT_DATATABLE_OPTIONS } from '../../../../settings/datatables.config';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css'
})
export class ListarComponent implements OnInit{
  usuarios: any[] = [];
  dataTableOptions = {
    ...DEFAULT_DATATABLE_OPTIONS,
    pageLength: 5,
    order: [[0, 'asc']],
  };

  refreshToken = 0; // este valor cambiará para forzar la recarga

  constructor(private userService: UserService) {}

  

  ngOnInit(): void {
    this.userService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
     // Solo refresca DataTable si hay datos
      if (this.usuarios.length > 0) {
        this.refreshToken++; // Cambia el trigger para que DataTables se reinicialice
      }
      console.log(this.usuarios);
    });
  }
}
