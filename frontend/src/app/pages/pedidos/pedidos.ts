import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrls: ['./pedidos.css']
})
export class Pedidos implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  pedidos: any[] = [];
  filtroBusqueda: string = '';
  mostrarFormulario: boolean = false;
  
  // Refleja los campos exigidos: usuario, total, estado
  pedidoActual: any = { usuario: '', total: 0, estado: 'pendiente' }; 
  esEdicion: boolean = false;

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.orderService.getOrders().subscribe({
      next: (respuesta: any) => {
        if (Array.isArray(respuesta)) {
          this.pedidos = respuesta;
        } else if (respuesta && respuesta.pedidos) {
          this.pedidos = respuesta.pedidos;
        } else if (respuesta && respuesta.data) {
          this.pedidos = respuesta.data;
        } else {
          this.pedidos = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar pedidos:', err)
    });
  }

  get pedidosFiltrados() {
    if (!this.pedidos) return [];
    return this.pedidos.filter(p => {
      // Filtramos por estado para encontrar pedidos más rápido
      const estado = p.estado ? p.estado.toLowerCase() : '';
      const busqueda = this.filtroBusqueda ? this.filtroBusqueda.toLowerCase() : '';
      return estado.includes(busqueda);
    });
  }

  abrirFormulario(pedido?: any) {
    this.mostrarFormulario = true;
    if (pedido) {
      this.pedidoActual = { ...pedido };
      // Si el backend devuelve el usuario poblado (objeto), extraemos solo el ID para el formulario
      if (typeof this.pedidoActual.usuario === 'object' && this.pedidoActual.usuario !== null) {
        this.pedidoActual.usuario = this.pedidoActual.usuario._id || this.pedidoActual.usuario.nombre;
      }
      this.esEdicion = true;
    } else {
      this.pedidoActual = { usuario: '', total: 0, estado: 'pendiente' };
      this.esEdicion = false;
    }
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.pedidoActual = { usuario: '', total: 0, estado: 'pendiente' };
    this.cdr.detectChanges();
  }

  guardarPedido() {
    if (this.esEdicion) {
      this.orderService.updateOrderStatus(this.pedidoActual._id, this.pedidoActual).subscribe({
        next: () => {
          this.cargarPedidos();
          this.cerrarFormulario();
        },
        error: () => alert('Error al actualizar el pedido.')
      });
    } else {
      this.orderService.createOrder(this.pedidoActual).subscribe({
        next: () => {
          this.cargarPedidos();
          this.cerrarFormulario();
        },
        error: () => alert('Error al crear el pedido. Revisa que el ID del usuario exista.')
      });
    }
  }

  eliminarPedido(id: string) {
    if(confirm('¿Estás seguro de eliminar este registro de pedido?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => this.cargarPedidos()
      });
    }
  }
}