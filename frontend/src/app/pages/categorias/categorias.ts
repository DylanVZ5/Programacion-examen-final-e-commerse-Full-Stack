import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css']
})
export class Categorias implements OnInit {
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  categorias: any[] = [];
  filtroBusqueda: string = '';
  mostrarFormulario: boolean = false;
  
  // Solo requiere el campo nombre según el documento
  categoriaActual: any = { nombre: '' }; 
  esEdicion: boolean = false;

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoryService.getCategories().subscribe({
      next: (respuesta: any) => {
        if (Array.isArray(respuesta)) {
          this.categorias = respuesta;
        } else if (respuesta && respuesta.categorias) {
          this.categorias = respuesta.categorias;
        } else if (respuesta && respuesta.data) {
          this.categorias = respuesta.data;
        } else {
          this.categorias = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  get categoriasFiltradas() {
    if (!this.categorias) return [];
    return this.categorias.filter(c => {
      const nombre = c.nombre ? c.nombre.toLowerCase() : '';
      const busqueda = this.filtroBusqueda ? this.filtroBusqueda.toLowerCase() : '';
      return nombre.includes(busqueda);
    });
  }

  abrirFormulario(categoria?: any) {
    this.mostrarFormulario = true;
    if (categoria) {
      this.categoriaActual = { ...categoria };
      this.esEdicion = true;
    } else {
      this.categoriaActual = { nombre: '' };
      this.esEdicion = false;
    }
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.categoriaActual = { nombre: '' };
    this.cdr.detectChanges();
  }

  guardarCategoria() {
    if (this.esEdicion) {
      this.categoryService.updateCategory(this.categoriaActual._id, this.categoriaActual).subscribe({
        next: () => {
          this.cargarCategorias();
          this.cerrarFormulario();
        },
        error: () => alert('Error al actualizar la categoría.')
      });
    } else {
      this.categoryService.createCategory(this.categoriaActual).subscribe({
        next: () => {
          this.cargarCategorias();
          this.cerrarFormulario();
        },
        error: () => alert('Error al crear la categoría.')
      });
    }
  }

  eliminarCategoria(id: string) {
    if(confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.cargarCategorias()
      });
    }
  }
}