import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  credenciales = {
    email: '',
    password: ''
  };
  mensajeError: string = '';
  cargando: boolean = false;

  iniciarSesion() {
    if (!this.credenciales.email || !this.credenciales.password) {
      this.mensajeError = 'Por favor, completa todos los campos.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    this.authService.login(this.credenciales).subscribe({
      next: () => {
        // Si el login es exitoso y el token se guarda, vamos al dashboard
        this.router.navigate(['/dashboard/productos']);
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = 'Credenciales incorrectas o error en el servidor.';
        console.error('Error de autenticación', err);
      }
    });
  }
}