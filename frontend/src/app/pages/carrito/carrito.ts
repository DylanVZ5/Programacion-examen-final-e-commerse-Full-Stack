import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class Carrito implements OnInit {
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  carritos: any[] = [];
  filtroBusqueda: string = '';
  mostrarFormulario: boolean = false;
  
  // Para simplificar la administración, solo pediremos el ID del usuario
  carritoActual: any = { usuario: '' }; 
  esEdicion: boolean = false;

  ngOnInit() {
    this.cargarCarritos();
  }

  cargarCarritos() {
    this.cartService.getCarts().subscribe({
      next: (respuesta: any) => {
        if (Array.isArray(respuesta)) {
          this.carritos = respuesta;
        } else if (respuesta && respuesta.carritos) {
          this.carritos = respuesta.carritos;
        } else if (respuesta && respuesta.data) {
          this.carritos = respuesta.data;
        } else {
          this.carritos = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar carritos:', err)
    });
  }

  get carritosFiltrados() {
    if (!this.carritos) return [];
    return this.carritos.filter(c => {
      // Filtramos por el ID o nombre del usuario propietario del carrito
      const idUsuario = typeof c.usuario === 'object' && c.usuario ? c.usuario._id : c.usuario;
      const busqueda = this.filtroBusqueda ? this.filtroBusqueda.toLowerCase() : '';
      return idUsuario ? idUsuario.toLowerCase().includes(busqueda) : false;
    });
  }

  abrirFormulario(carrito?: any) {
    this.mostrarFormulario = true;
    if (carrito) {
      this.carritoActual = { ...carrito };
      if (typeof this.carritoActual.usuario === 'object' && this.carritoActual.usuario !== null) {
        this.carritoActual.usuario = this.carritoActual.usuario._id;
      }
      this.esEdicion = true;
    } else {
      this.carritoActual = { usuario: '' };
      this.esEdicion = false;
    }
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.carritoActual = { usuario: '' };
    this.cdr.detectChanges();
  }

  guardarCarrito() {
    if (this.esEdicion) {
      this.cartService.updateCart(this.carritoActual._id, this.carritoActual).subscribe({
        next: () => {
          this.cargarCarritos();
          this.cerrarFormulario();
        },
        error: () => alert('Error al actualizar el carrito.')
      });
    } else {
      this.cartService.createCart(this.carritoActual).subscribe({
        next: () => {
          this.cargarCarritos();
          this.cerrarFormulario();
        },
        error: () => alert('Error al crear el carrito. Verifica que el ID del usuario exista y no tenga ya un carrito.')
      });
    }
  }

  eliminarCarrito(id: string) {
    if(confirm('¿Estás seguro de eliminar este carrito y todo su contenido?')) {
      this.cartService.deleteCart(id).subscribe({
        next: () => this.cargarCarritos()
      });
    }
  }
}