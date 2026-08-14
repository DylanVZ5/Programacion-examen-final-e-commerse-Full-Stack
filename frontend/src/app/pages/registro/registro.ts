import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Modelo de datos para el formulario
  usuario = {
    nombre: '',
    email: '',
    password: ''
  };

  cargando: boolean = false;
  mensajeError: string = '';
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' = 'success';

  registrar() {
    // Validación básica en el frontend
    if (!this.usuario.nombre || !this.usuario.email || !this.usuario.password) {
      this.mensajeError = 'Por favor, completa todos los campos.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    this.authService.register(this.usuario).subscribe({
      next: (res) => {
        this.cargando = false;
        this.toastTipo = 'success';
        this.toastMensaje = '¡Registro exitoso! Redirigiendo al login...';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500); 
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error en registro:', err);
        this.mostrarError(err.error?.message || 'Hubo un problema al crear tu cuenta. Intenta con otro correo.');
      }
    });
  }

  mostrarError(mensaje: string) {
    this.toastTipo = 'error';
    this.toastMensaje = mensaje;
    this.cdr.detectChanges(); // <-- ¡OBLIGAMOS A DIBUJAR EL TOAST ROJO!
    
    setTimeout(() => { 
      this.toastMensaje = ''; 
      this.cdr.detectChanges(); // Lo ocultamos
    }, 3500); 
  }
}