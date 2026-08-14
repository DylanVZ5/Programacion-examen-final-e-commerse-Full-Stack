import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // Modelo de datos
  usuario = {
    nombre: '',
    email: '',
    password: '' // Opcional: solo se enviará si el usuario escribe algo nuevo
  };

  cargando: boolean = false;

  // Sistema de Toasts
  toasts: { id: number, mensaje: string, tipo: 'success' | 'error' }[] = [];
  toastIdCounter = 0;

  ngOnInit() {
    // Cargamos los datos del localStorage al entrar a la página
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      const userData = JSON.parse(userStr);
      this.usuario.nombre = userData.nombre || '';
      this.usuario.email = userData.email || '';
    }
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
    const id = this.toastIdCounter++;
    this.toasts.push({ id, mensaje, tipo });
    this.cdr.detectChanges();
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
      this.cdr.detectChanges();
    }, 3000);
  }

  guardarCambios() {
    if (!this.usuario.nombre || !this.usuario.email) {
      this.mostrarToast('El nombre y el correo son obligatorios.', 'error');
      return;
    }

    this.cargando = true;

    this.authService.actualizarPerfil(this.usuario).subscribe({
      next: (res: any) => {
        this.cargando = false;
        
        // Actualizamos el localStorage con los datos nuevos que devuelva el backend
        if (res.usuario) {
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
        }
        
        this.mostrarToast('¡Perfil actualizado correctamente!', 'success');
        this.usuario.password = ''; // Limpiamos el campo de contraseña por seguridad
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al actualizar:', err);
        this.mostrarToast(err.error?.message || 'Ocurrió un error al actualizar tu perfil.', 'error');
      }
    });
  }
}