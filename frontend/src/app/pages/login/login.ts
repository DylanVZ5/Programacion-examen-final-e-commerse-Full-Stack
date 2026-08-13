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
      // Modificamos el next para recibir la respuesta (res) del backend
      next: (res: any) => {
        // Extraemos el rol. Asegúrate de que la ruta coincida con lo que envía tu Node.js
        const rolUsuario = res.user?.rol || res.rol || 'user';
        
        // Guardamos el token y el rol en el navegador
        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', rolUsuario);

        // Redirección inteligente basada en el rol
        if (rolUsuario === 'admin') {
          this.router.navigate(['/dashboard/productos']);
        } else {
          // Si es un comprador normal, lo mandamos a la tienda principal
          this.router.navigate(['/tienda']); 
        }
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = 'Credenciales incorrectas o error en el servidor.';
        console.error('Error de autenticación', err);
      }
    });
  }
}