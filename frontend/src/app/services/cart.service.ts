import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient) {}

  // Obtener el carrito del usuario actual (basado en el JWT)
  getCart(): Observable<any> { 
    return this.http.get(this.apiUrl); 
  }

  // Agregar un producto al carrito
  addToCart(productId: string, quantity: number): Observable<any> { 
    return this.http.post(this.apiUrl, { product: productId, quantity }); 
  }

  // Eliminar un ítem del carrito
  removeItem(itemId: string): Observable<any> { 
    return this.http.delete(`${this.apiUrl}/${itemId}`); 
  }

  // Vaciar el carrito completamente
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`);
  }
}