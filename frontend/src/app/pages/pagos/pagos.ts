import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service'; 

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.html',
  styleUrls: ['./pagos.css']
})
export class Pagos implements OnInit {
  private paymentService = inject(PaymentService);
  private cdr = inject(ChangeDetectorRef);

  pagos: any[] = [];
  filtroBusqueda: string = '';
  mostrarFormulario: boolean = false;
  
  pagoActual: any = { metodo: 'tarjeta', estado: 'completado' }; 
  esEdicion: boolean = false;

  ngOnInit() {
    this.cargarPagos();
  }

  cargarPagos() {
    this.paymentService.getPayments().subscribe({
      next: (respuesta: any) => {
        if (Array.isArray(respuesta)) {
          this.pagos = respuesta;
        } else if (respuesta && respuesta.pagos) {
          this.pagos = respuesta.pagos;
        } else if (respuesta && respuesta.data) {
          this.pagos = respuesta.data;
        } else {
          this.pagos = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar pagos:', err)
    });
  }

  get pagosFiltrados() {
    if (!this.pagos) return [];
    return this.pagos.filter(p => {
      const metodo = p.metodo ? p.metodo.toLowerCase() : '';
      const busqueda = this.filtroBusqueda ? this.filtroBusqueda.toLowerCase() : '';
      return metodo.includes(busqueda);
    });
  }

  abrirFormulario(pago?: any) {
    this.mostrarFormulario = true;
    if (pago) {
      this.pagoActual = { ...pago };
      this.esEdicion = true;
    } else {
      this.pagoActual = { metodo: 'tarjeta', estado: 'completado' };
      this.esEdicion = false;
    }
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.pagoActual = { metodo: 'tarjeta', estado: 'completado' };
    this.cdr.detectChanges();
  }

  guardarPago() {
    if (this.esEdicion) {
      this.paymentService.updatePayment(this.pagoActual._id, this.pagoActual).subscribe({
        next: () => {
          this.cargarPagos();
          this.cerrarFormulario();
        },
        error: () => alert('Error al actualizar el pago.')
      });
    } else {
      this.paymentService.createPayment(this.pagoActual).subscribe({
        next: () => {
          this.cargarPagos();
          this.cerrarFormulario();
        },
        error: () => alert('Error al registrar el pago manual.')
      });
    }
  }

  eliminarPago(id: string) {
    if(confirm('¿Estás seguro de eliminar este registro de pago?')) {
      this.paymentService.deletePayment(id).subscribe({
        next: () => this.cargarPagos()
      });
    }
  }
}