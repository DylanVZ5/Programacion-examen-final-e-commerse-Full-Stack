import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // <-- 1. Añadimos ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-mi-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './mi-carrito.html',
  styleUrls: ['./mi-carrito.css']
})
export class MiCarrito implements OnInit {
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef); // <-- 2. Inyectamos la herramienta

  cart: any = { productos: [] };
  cargando: boolean = true;

  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        // Aseguramos que si el carrito viene nulo, no se rompa la vista
        this.cart = res || { productos: [] }; 
        this.cargando = false;
        this.cdr.detectChanges(); // <-- 3. ¡Despertamos a Angular!
      },
      error: (err) => {
        console.error('Error al cargar tu carrito', err);
        this.cargando = false;
        this.cdr.detectChanges(); // <-- Quitamos la rueda de carga incluso si hay error
      }
    });
  }

  eliminarItem(productoId: string) {
    if (!productoId) return;
    
    this.cartService.removeFromCart(productoId).subscribe({
      next: (res: any) => {
        this.cart = res; 
        this.cdr.detectChanges(); // <-- Actualizamos visualmente al borrar
      },
      error: (err) => console.error('Error al eliminar', err)
    });
  }

  // Calculamos el total dinámicamente sumando (precio * cantidad)
  get totalCarrito() {
    if (!this.cart || !this.cart.productos) return 0;
    return this.cart.productos.reduce((total: number, item: any) => {
      const precio = item.producto?.precio || 0;
      return total + (precio * item.cantidad);
    }, 0);
  }
}