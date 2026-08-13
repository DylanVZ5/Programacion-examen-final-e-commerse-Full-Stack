import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // 1. Importamos ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class Productos implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef); // 2. Lo inyectamos aquí (nuestro despertador)

  productos: any[] = [];
  filtroBusqueda: string = '';
  mostrarFormulario: boolean = false;
  
  productoActual: any = { nombre: '', precio: 0, stock: 0 }; 
  esEdicion: boolean = false;

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.getProducts().subscribe({
      next: (respuesta: any) => {
        if (Array.isArray(respuesta)) {
          this.productos = respuesta;
        } else if (respuesta && respuesta.productos) {
          this.productos = respuesta.productos;
        } else if (respuesta && respuesta.data) {
          this.productos = respuesta.data;
        } else {
          this.productos = [];
        }
        
        // 3. Forzamos a Angular a actualizar el HTML instantáneamente
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Falló la petición GET:', err);
      }
    });
  }

  get productosFiltrados() {
    if (!this.productos) return [];
    
    return this.productos.filter(p => {
      const nombreProd = p.nombre ? p.nombre.toLowerCase() : '';
      const busqueda = this.filtroBusqueda ? this.filtroBusqueda.toLowerCase() : '';
      return nombreProd.includes(busqueda);
    });
  }

  abrirFormulario(producto?: any) {
    this.mostrarFormulario = true;
    if (producto) {
      this.productoActual = { ...producto };
      this.esEdicion = true;
    } else {
      this.productoActual = { nombre: '', precio: 0, stock: 0 };
      this.esEdicion = false;
    }
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.productoActual = { nombre: '', precio: 0, stock: 0 };
    // Actualizamos la vista al cerrar
    this.cdr.detectChanges();
  }

  guardarProducto() {
    if (this.esEdicion) {
      this.productService.updateProduct(this.productoActual._id, this.productoActual).subscribe({
        next: () => {
          this.cargarProductos();
          this.cerrarFormulario();
        },
        error: (err) => alert('Error al actualizar.')
      });
    } else {
      this.productService.createProduct(this.productoActual).subscribe({
        next: () => {
          this.cargarProductos();
          this.cerrarFormulario();
        },
        error: (err) => alert('Error al crear.')
      });
    }
  }

  eliminarProducto(id: string) {
    if(confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.cargarProductos()
      });
    }
  }
}