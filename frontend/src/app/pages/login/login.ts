import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  credenciales = { email: '', password: '' };
  cargando: boolean = false;
  
  // Variables centralizadas para las notificaciones
  toastMensaje: string = ''; 
  toastTipo: 'success' | 'error' = 'success';

  iniciarSesion() {
    if (!this.credenciales.email || !this.credenciales.password) {
      this.mostrarError('Por favor, ingresa tu correo electrónico y contraseña.');
      return;
    }

    this.cargando = true;

    this.authService.login(this.credenciales).subscribe({
      next: (res: any) => {
        this.cargando = false;
        
        // 1. Preparamos y mostramos el Toast VERDE
        this.toastTipo = 'success';
        this.toastMensaje = '¡Bienvenido a ShopSmart! Entrando...';
        
        // 2. Forzamos a Angular a pintar la pantalla AHORA MISMO
        this.cdr.detectChanges(); 
        
        // 3. Bloqueamos cualquier redirección dentro de este temporizador
        setTimeout(() => {
          // Leemos el rol que el auth.service acaba de guardar en localStorage
          const rolUsuario = localStorage.getItem('rol'); 
          
          if (rolUsuario === 'admin') {
            this.router.navigate(['/dashboard/productos']);
          } else {
            this.router.navigate(['/tienda']); 
          }
        }, 2000); // <-- 2000 milisegundos (2 segundos) exactos de espera
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error de login:', err);
        const mensajeBackend = err.error?.message || 'Credenciales incorrectas. Verifica tus datos.';
        this.mostrarError(mensajeBackend);
      }
    });
  }

  // Función maestra que controla todos los errores visuales
  mostrarError(mensaje: string) {
    this.toastTipo = 'error';
    this.toastMensaje = mensaje;
    this.cdr.detectChanges(); // Forzamos a que aparezca inmediatamente
    
    // Lo ocultamos a los 3.5 segundos
    setTimeout(() => { 
      this.toastMensaje = ''; 
      this.cdr.detectChanges(); 
    }, 3500); 
  }
}