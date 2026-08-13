import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // <-- NUEVO
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tienda.html',
  styleUrls: ['./tienda.css']
})
export class Tienda implements OnInit {
  private cdr = inject(ChangeDetectorRef); // Inyectamos el detector de cambios
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService); // <-- NUEVO
  private router = inject(Router); // <-- NUEVO

  productos: any[] = [];
  filtroBusqueda: string = '';
  cargando: boolean = true;

  ngOnInit() {
    this.cargarProductosPublicos();
  }

  cargarProductosPublicos() {
    this.productService.getProducts().subscribe({
      next: (respuesta: any) => {
        this.productos = respuesta.data || respuesta.productos || respuesta || [];
        this.cargando = false;
        this.cdr.detectChanges(); // Le obligamos a actualizar la pantalla
      },
      error: (err) => {
        console.error('Error al cargar la tienda:', err);
        this.cargando = false;
        this.cdr.detectChanges(); // Si hay error, también quitamos la rueda de carga
      }
    });
  }

  get productosFiltrados() {
    if (!this.productos) return [];
    return this.productos.filter(p => {
      const busqueda = this.filtroBusqueda.toLowerCase();
      const nombre = p.nombre ? p.nombre.toLowerCase() : '';
      const categoria = p.categoria && p.categoria.nombre ? p.categoria.nombre.toLowerCase() : '';
      return nombre.includes(busqueda) || categoria.includes(busqueda);
    });
  }

  agregarAlCarrito(productoId: string) {
    // Agregamos 1 unidad por defecto
    this.cartService.addToCart(productoId, 1).subscribe({
      next: () => {
        alert('¡Producto agregado a tu carrito exitosamente!');
      },
      error: () => {
        alert('Error al agregar el producto. Verifica tu conexión o inicia sesión.');
      }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('rol'); // Limpiamos el rol
    this.authService.logout(); // Tu servicio ya debería limpiar el token y redirigir al login
  }

  // Nueva función para forzar la navegación al carrito
  irAlCarrito() {
    this.router.navigate(['/mi-carrito']);
  }
}