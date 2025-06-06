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
export class ListarComponent implements OnInit {
  usuarios: any[] = [];
  dataTableOptions = {
    ...DEFAULT_DATATABLE_OPTIONS,
    pageLength: 5,
    order: [[0, 'asc']]
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
      console.log(this.usuarios);
    });
  }
}
