import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthserviceService } from '../../services/authservice.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginMessage: string = '';
  messageClass: string = ''; // clase CSS de Bootstrap según el tipo de mensaje

  isLoading: boolean = false;
  username = '';
  password = '';
  errorMessage = '';
  invalidLogin: boolean = false;

  constructor(private auth: AuthserviceService, private router: Router) { }
  onSubmit() {
    if(!this.username || !this.password) return;
    this.isLoading = true;
    this.invalidLogin = false;
    this.errorMessage = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loginMessage = 'Inicio de sesión exitoso. Redirigiendo...';
        this.messageClass = 'alert-success';
        this.router.navigate(['/dashboard']); // o cualquier ruta protegida
      },
      error: (err) => {
        //mostrar error
        this.invalidLogin = true;
        this.isLoading = false;
        this.errorMessage = 'Credenciales incorrectas';
        document.body.classList.remove('loading');
        console.error(err);
      },
      complete: () => {
        this.isLoading = false;
        document.body.classList.remove('loading');
      }
    });
  }
}
