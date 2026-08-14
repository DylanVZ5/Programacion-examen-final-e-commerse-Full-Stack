import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-carrito-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class CarritoAdmin implements OnInit {
  private cartService = inject(CartService);
  
  // 🔥 Inyectamos el actualizador de pantalla de Angular
  private cdr = inject(ChangeDetectorRef); 
  
  carritos: any[] = [];
  cargando: boolean = true;

  ngOnInit() {
    this.cargarLogCarritos();
  }

  cargarLogCarritos() {
    console.log('FRONTEND: Pidiendo carritos al servidor...');
    
    this.cartService.getAllCarts().subscribe({
      next: (res) => {
        console.log('FRONTEND: ¡Datos recibidos con éxito!', res);
        
        // Guardamos los datos
        this.carritos = res;
        this.cargando = false; // Apagamos el mensaje de carga
        
        // 🔥 EL FIX: Forzamos a Angular a redibujar el HTML en este instante exacto
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('FRONTEND: Ocurrió un error en la red:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Función para calcular cuánto dinero hay en cada carrito
  calcularTotal(carrito: any): number {
    if (!carrito.productos || carrito.productos.length === 0) return 0;
    
    return carrito.productos.reduce((total: number, item: any) => {
      if (!item.producto) return total; 
      return total + (item.producto.precio * item.cantidad);
    }, 0);
  }
}