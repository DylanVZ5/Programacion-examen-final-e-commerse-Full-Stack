import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resenas.html',
  styleUrls: ['./resenas.css']
})
export class Resenas implements OnInit {
  private reviewService = inject(ReviewService);
  private cdr = inject(ChangeDetectorRef);

  resenas: any[] = [];
  filtroBusqueda: string = '';
  mostrarFormulario: boolean = false;
  
  // Campos obligatorios según el documento del proyecto
  resenaActual: any = { producto: '', comentario: '' }; 
  esEdicion: boolean = false;

  ngOnInit() {
    this.cargarResenas();
  }

  cargarResenas() {
    this.reviewService.getReviews().subscribe({
      next: (respuesta: any) => {
        if (Array.isArray(respuesta)) {
          this.resenas = respuesta;
        } else if (respuesta && respuesta.resenas) {
          this.resenas = respuesta.resenas;
        } else if (respuesta && respuesta.data) {
          this.resenas = respuesta.data;
        } else {
          this.resenas = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar reseñas:', err)
    });
  }

  get resenasFiltradas() {
    if (!this.resenas) return [];
    return this.resenas.filter(r => {
      // Filtramos por el contenido del comentario
      const comentario = r.comentario ? r.comentario.toLowerCase() : '';
      const busqueda = this.filtroBusqueda ? this.filtroBusqueda.toLowerCase() : '';
      return comentario.includes(busqueda);
    });
  }

  abrirFormulario(resena?: any) {
    this.mostrarFormulario = true;
    if (resena) {
      this.resenaActual = { ...resena };
      // Si el producto viene como un objeto completo desde Node, extraemos solo el ID
      if (typeof this.resenaActual.producto === 'object' && this.resenaActual.producto !== null) {
        this.resenaActual.producto = this.resenaActual.producto._id || this.resenaActual.producto.nombre;
      }
      this.esEdicion = true;
    } else {
      this.resenaActual = { producto: '', comentario: '' };
      this.esEdicion = false;
    }
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.resenaActual = { producto: '', comentario: '' };
    this.cdr.detectChanges();
  }

  guardarResena() {
    if (this.esEdicion) {
      this.reviewService.updateReview(this.resenaActual._id, this.resenaActual).subscribe({
        next: () => {
          this.cargarResenas();
          this.cerrarFormulario();
        },
        error: () => alert('Error al actualizar la reseña.')
      });
    } else {
      this.reviewService.createReview(this.resenaActual).subscribe({
        next: () => {
          this.cargarResenas();
          this.cerrarFormulario();
        },
        error: () => alert('Error al crear la reseña. Verifica que el ID del producto exista en tu base de datos.')
      });
    }
  }

  eliminarResena(id: string) {
    if(confirm('¿Estás seguro de eliminar este comentario?')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => this.cargarResenas()
      });
    }
  }
}