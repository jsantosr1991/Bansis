import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LoaderComponent } from "../../../../shared/spinner/loader/loader.component";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    LoaderComponent
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  @Output() usuarioCreado = new EventEmitter<void>();

  searchTerm: string = '';
  usuariosEncontrados: any[] = [];

  usuario: any = {};
  usernameGenerado: string = '';

  roles: any[] = [];
  grupos: any[] = [];
  loading = false;

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarRoles();
    this.cargarGrupos();

  }
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


  buscarUsuario() {
    this.loading = true;
    if (!this.searchTerm.trim()) {
      Swal.fire('Advertencia', 'Ingrese un nombre o apellido', 'info');
      return;
    }

    forkJoin({
      administrativos: this.userService.buscarUsuario(this.searchTerm),
      otros: this.userService.buscarOtrosEmpleados(this.searchTerm)
    }).subscribe({
      next: (resp) => {
        const listaA = resp.administrativos || [];
        const listaB = resp.otros || [];

        // unir resultados
        this.usuariosEncontrados = [...listaA, ...listaB];

        if (this.usuariosEncontrados.length === 0) {
          Swal.fire('Advertencia', 'No se encontraron empleados', 'warning');
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Error al buscar empleados', 'error');
      }
    });
  }


  seleccionarUsuario(user: any) {
    this.usuario = this.limpiarCampos(user);
    this.usuariosEncontrados = [];

    this.generarNombreUsuario();
    this.generarPassword();
  }


  limpiarCampos(usuario: any) {
    const limpio: any = {};
    for (const key in usuario) {
      if (usuario.hasOwnProperty(key)) {
        const valor = usuario[key];
        // Si el valor es string, quitamos espacios
        limpio[key] = typeof valor === 'string' ? valor.trim() : valor;
      }
    }
    return limpio;
  }

  // 👤 Generar nombre de usuario automáticamente
  generarNombreUsuario() {
    if (this.usuario.NOMBRE_1 && this.usuario.APELLIDO_1) {
      const inicial = this.usuario.NOMBRE_1.trim().charAt(0).toLowerCase();
      const apellido = this.usuario.APELLIDO_1.trim().toLowerCase().replace(/\s+/g, '');
      this.usernameGenerado = `${inicial}${apellido}`;
    }
  }

  // 🔐 Generar password a partir del número de cédula
  generarPassword() {
    if (this.usuario.NUM_CEDULA) {
      this.usuario.password = this.usuario.NUM_CEDULA.toString();
    }
  }

  // 📧 Validar formato de email
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 💾 Guardar usuario
  guardarUsuario() {
    this.usuario = this.limpiarCampos(this.usuario);

    if (!this.usuario.NOMBRE_1 || !this.usuario.APELLIDO_1) {
      Swal.fire('Advertencia', 'Debe llenar los campos de nombre y apellido', 'warning');
      return;
    }

    if (!this.usuario.EMAIL || !this.validarEmail(this.usuario.EMAIL)) {
      Swal.fire('Advertencia', 'Debe ingresar un correo electrónico válido', 'warning');
      return;
    }


    if (!this.usuario.idRol) {
      Swal.fire('Advertencia', 'Debe seleccionar un Rol', 'warning');
      return;
    }

    if (!this.usuario.idGrupo) {
      Swal.fire('Advertencia', 'Debe seleccionar un Grupo', 'warning');
      return;
    }
    Swal.fire({
      title: 'Guardando usuario...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });


    this.generarPassword();

    const nuevoUsuario = {
      nombre: this.usuario.NOMBRE_1,
      apellido: this.usuario.APELLIDO_1,
      email: this.usuario.EMAIL,
      password: this.usuario.password,
      empresa: this.usuario.EMPRESA,
      username: this.usernameGenerado,

      // ⚙️ Campos ocultos pero importantes
      codEmpleado: this.usuario.COD_TRABAJ,
      idEmpresa: this.usuario.COD_EMPRESA,
      idRol: this.usuario.idRol,
      idGrupo: this.usuario.idGrupo,
    };

    this.userService.guardarUsuario(nuevoUsuario).subscribe({
      next: () => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Usuario guardado correctamente',
          text: '✅ El usuario se ha registrado en el sistema.',
          timer: 2500,
          showConfirmButton: false
        });
        // 🧹 Limpiar los campos después de guardar
        /* this.usuario = {};
         this.usernameGenerado = '';
         this.searchTerm = '';*/
        this.usuarioCreado.emit(this.usuario); //avisa al padre
        this.resetFormulario();

      },
      error: (err) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: 'No se pudo guardar el usuario. Intente nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  resetFormulario() {
    this.usuario = {};
    this.usernameGenerado = '';
    this.searchTerm = '';
    this.usuariosEncontrados = [];

  }


}


