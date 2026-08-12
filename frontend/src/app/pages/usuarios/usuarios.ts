import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  usuarios: any[] = [];
  filtroBusqueda: string = '';
  mostrarFormulario: boolean = false;
  
  // Basado en los campos requeridos en el documento
  usuarioActual: any = { nombre: '', email: '', password: '', rol: 'user' }; 
  esEdicion: boolean = false;

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService.getUsers().subscribe({
      next: (respuesta: any) => {
        if (Array.isArray(respuesta)) {
          this.usuarios = respuesta;
        } else if (respuesta && respuesta.usuarios) {
          this.usuarios = respuesta.usuarios;
        } else if (respuesta && respuesta.data) {
          this.usuarios = respuesta.data;
        } else {
          this.usuarios = [];
        }
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Falló la petición GET de usuarios:', err)
    });
  }

  get usuariosFiltrados() {
    if (!this.usuarios) return [];
    return this.usuarios.filter(u => {
      const nombre = u.nombre ? u.nombre.toLowerCase() : '';
      const busqueda = this.filtroBusqueda ? this.filtroBusqueda.toLowerCase() : '';
      return nombre.includes(busqueda);
    });
  }

  abrirFormulario(usuario?: any) {
    this.mostrarFormulario = true;
    if (usuario) {
      this.usuarioActual = { ...usuario };
      this.usuarioActual.password = ''; // Ocultamos la contraseña por seguridad al editar
      this.esEdicion = true;
    } else {
      this.usuarioActual = { nombre: '', email: '', password: '', rol: 'user' };
      this.esEdicion = false;
    }
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.usuarioActual = { nombre: '', email: '', password: '', rol: 'user' };
    this.cdr.detectChanges();
  }

  guardarUsuario() {
    if (this.esEdicion) {
      this.userService.updateUser(this.usuarioActual._id, this.usuarioActual).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarFormulario();
        },
        error: () => alert('Error al actualizar el usuario.')
      });
    } else {
      this.userService.createUser(this.usuarioActual).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarFormulario();
        },
        error: () => alert('El Backend rechazó el usuario. Revisa que el email no esté repetido.')
      });
    }
  }

  eliminarUsuario(id: string) {
    if(confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.cargarUsuarios()
      });
    }
  }
}