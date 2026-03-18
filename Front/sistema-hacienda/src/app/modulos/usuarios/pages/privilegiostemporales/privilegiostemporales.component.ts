import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import Swal from 'sweetalert2';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';

@Component({
  selector: 'app-privilegiostemporales',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    NgForOf,
    NgIf,
    NgxPaginationModule
  ],
  templateUrl: './privilegiostemporales.component.html',
  styleUrl: './privilegiostemporales.component.css'
})
export class PrivilegiostemporalesComponent implements OnInit {
  page: number = 1;

  minDate:string = '';
  usuarioActual: any = {} ; // para guardar el nombre del usuario logueado
  privilegios: any[] = [];
  usuarios: any[] = []; // Lista de usuarios
  roles: any[] = [];
  nuevoPrivilegio:{
    usuario_id:number | null;
    otorgado_por:string |null;
    rol_delegado_id:number | null;
    fecha_inicio:string;
    fecha_fin:string;
    usuario:string |null;
  } = {
    usuario_id: null,
    otorgado_por:null,
    rol_delegado_id: null,
    fecha_inicio: '',
    fecha_fin: '',
    usuario:''
  };
  constructor(private userService: UserService) {}
  ngOnInit() {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes inicia en 0
    const dd = String(hoy.getDate()).padStart(2, '0');

    this.minDate = `${yyyy}-${mm}-${dd}`;

    this.cargarPrivilegios();
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarUsuarios() {
    this.userService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,

      error: (err) => console.error(err)
    });

  }
  cargarRoles() {
    this.userService.getRol().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error(err)
    });
  }

  cargarPrivilegios() {
    this.userService.obtenerTodos().subscribe({
      next: (data) => (this.privilegios = data),
      error: (err) => console.error(err)
    });
  }

  otorgar() {

    this.nuevoPrivilegio.usuario = this.userService.getUsername();
    this.userService.otorgarPrivilegio(this.nuevoPrivilegio).subscribe({
      next: (res) => {
        Swal.fire('✅ Éxito', res.message, 'success');
        this.cargarPrivilegios();
      },
      error: (err) => Swal.fire('❌ Error', 'No se pudo otorgar el privilegio', 'error')
    });
  }

  desactivar(id: number) {
    Swal.fire({
      title: '¿Desactivar privilegio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.desactivarPrivilegio(id).subscribe({
          next: (res) => {
            Swal.fire('✅ Desactivado', res.message, 'success');
            this.cargarPrivilegios();
          },
          error: (err) => Swal.fire('❌ Error', 'No se pudo desactivar', 'error')
        });
      }
    });
  }
}
