import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
  toasts: { id: number, mensaje: string, tipo: 'success' | 'error' }[] = [];
  toastIdCounter = 0;

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

  // --- VARIABLES DEL MODAL ---
  productoSeleccionado: any = null;
  mostrarModal: boolean = false;
  cantidadSeleccionada: number = 1;
  agregando: boolean = false; // Para cambiar el texto del botón mientras carga

  // ... (deja tu ngOnInit, cargarProductosPublicos y get productosFiltrados igual) ...

  // --- LÓGICA DEL MODAL ---
  abrirModal(producto: any) {
    this.productoSeleccionado = producto;
    this.cantidadSeleccionada = 1; // Siempre iniciamos en 1
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    setTimeout(() => this.productoSeleccionado = null, 300); // Pequeño retraso para la animación
  }

  aumentarCantidad() {
    this.cantidadSeleccionada++;
  }

  disminuirCantidad() {
    if (this.cantidadSeleccionada > 1) {
      this.cantidadSeleccionada--;
    }
  }

  confirmarAgregarAlCarrito() {
    if (!this.productoSeleccionado) return;
    this.agregando = true;
    
    this.cartService.addToCart(this.productoSeleccionado._id, this.cantidadSeleccionada).subscribe({
      next: () => {
        this.agregando = false;
        this.cerrarModal(); 
        
        // ¡Llamamos al sistema dinámico!
        this.mostrarToast(`¡${this.cantidadSeleccionada} artículo(s) agregado(s) a tu carrito!`, 'success');
      },
      error: (err) => {
        this.agregando = false;
        console.error('Error al agregar el producto', err);
        this.cerrarModal();
        
        // ¡Llamamos al sistema dinámico con error!
        this.mostrarToast('Ocurrió un error al intentar guardar en el carrito.', 'error');
      }
    });
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
    // 1. Le damos un ID único a esta notificación específica
    const id = this.toastIdCounter++;
    
    // 2. Lo empujamos al arreglo para que aparezca en pantalla
    this.toasts.push({ id, mensaje, tipo });
    this.cdr.detectChanges(); // Forzamos a Angular a dibujarlo
    
    // 3. Programamos que ESTE toast específico desaparezca en 3 segundos
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
      this.cdr.detectChanges();
    }, 5000);
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