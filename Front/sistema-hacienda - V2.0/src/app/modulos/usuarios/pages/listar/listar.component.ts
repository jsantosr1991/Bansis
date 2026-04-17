import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { DataTableComponent } from '../../../../shared/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { DEFAULT_DATATABLE_OPTIONS } from '../../../../settings/datatables.config';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CreateComponent } from '../create/create.component';
import { LoaderComponent } from '../../../../shared/spinner/loader/loader.component';
declare const bootstrap: any;
@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, DataTableComponent, FormsModule, CreateComponent, LoaderComponent],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css'
})
export class ListarComponent implements OnInit {
  usuarios: any[] = [];
  usuarioEdit: any = {}; // Usuario en edición
  loading = false;
  grupos: any[] = [];
  roles: any[] = [];

  dataTableOptions = {
    ...DEFAULT_DATATABLE_OPTIONS,
    pageLength: 10,
    order: [[0, 'asc']],
  };

  refreshToken = 0; // este valor cambiará para forzar la recarga

  constructor(private userService: UserService, private router: Router) { }
  // 🔄 Cargar roles desde el backend
  cargarRoles() {
    this.loading = true;
    this.userService.getRol().subscribe({
      next: (data) => {
        this.roles = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al obtener roles:', err);
      },
    });
  }
  refrescarUsuarios() {
    window.location.reload()
  }


  // 🔄 Cargar grupos desde el backend
  cargarGrupos() {
    this.loading = true;
    this.userService.getGrupo().subscribe({
      next: (data) => {
        this.grupos = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al obtener grupos:', err);
      },
    });
  }


  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
    this.cargarGrupos();
  }

  /*  cargarUsuarios(): void {
      this.userService.getUsuarios().subscribe((data) => {
        this.usuarios = data;
  
        // 🔄 Forzamos un refresco del DataTable en un nuevo ciclo de detección
        setTimeout(() => {
          this.refreshToken = Date.now(); // cambia el valor del trigger
        }, 0);
      });
    }*/
  cargarUsuarios(): void {
    this.loading = true;
    this.userService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
        // ?? Forzar refresh del DataTable
        setTimeout(() => {
          this.refreshToken = Date.now();
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar usuarios', err);
      }
    });
  }


  editarUsuario(u: any): void {


    const rol = this.roles.find(r => r.nombre === u.tipousuario);

    const grupo = this.grupos.find(g => g.grupo === u.grupo);

    this.usuarioEdit = {
      id: u.id,
      nombres: u.NOMBRE_CORTO,
      username: u.username,
      empresa: u.empe_nom,
      email: u.email,
      idRol: rol ? rol.id : null,
      idGrupo: grupo ? grupo.id : null,
      password: '', // vacío por defecto
    };

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('editarModal')
    );
    modal.show();
  }

  guardarCambios(): void {
    Swal.fire({
      title: 'Actualizando usuario...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.userService.actualizarUsuario(this.usuarioEdit.id, this.usuarioEdit).subscribe({
      next: (res: any) => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: '✅ Usuario actualizado correctamente',
          text: '✅ El usuario se ha actualizado en el sistema.',
          timer: 2500,
          showConfirmButton: false
        })

        this.cargarUsuarios();
        setTimeout(() => {
          this.refreshToken = Date.now(); // 🔥 Forzar reinit de la tabla
        }, 500);
        // 🧹 Cerrar modal y limpiar
        const modalInstance = (window as any).bootstrap.Modal.getInstance(document.getElementById('editarModal'));
        if (modalInstance) modalInstance.hide();
        this.usuarioEdit = {};
      },
      error: (err) => {
        console.error(err);
        //  alert('❌ Error al actualizar usuario');
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: 'No se pudo guardar el usuario. Intente nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      },
    });
  }

  cambiarEstado(u: any, checked: boolean) {
    const nuevoStatus = checked ? 1 : 0;

    this.userService.actualizarStatus(u.id, nuevoStatus).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: nuevoStatus ? 'Usuario activado' : 'Usuario desactivado',
          showConfirmButton: false,
          timer: 1500
        });
        u.status = nuevoStatus; // reflejar en la tabla
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cambiar estado',
        });

        // revertir visualmente el cambio si falló
        u.status = u.status ? 0 : 1;
      }
    });
  }

  onUsuarioCreado() {
    this.cargarUsuarios(); // refresca la tabla

    const modalEl = document.getElementById('modalCrearUsuario');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
