import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  // Tu ruta original para el cliente
  private apiUrlClient = 'http://localhost:3000/api/cart';
  
  // Ruta para el administrador (usualmente en plural para traer toda la colección)
  private apiUrlAdmin = 'http://localhost:3000/api/carts';

  constructor(private http: HttpClient) {}

  // ==========================================
  // LÓGICA DEL COMPRADOR (Tu código original)
  // ==========================================
  
  // Obtener el carrito del usuario actual (basado en el JWT)
  getCart(): Observable<any> { 
    return this.http.get(this.apiUrlClient); 
  }

  // Agregar un producto al carrito
  addToCart(productId: string, quantity: number): Observable<any> { 
    return this.http.post(this.apiUrlClient, { product: productId, quantity }); 
  }

  // Eliminar un ítem del carrito
  removeItem(itemId: string): Observable<any> { 
    return this.http.delete(`${this.apiUrlClient}/${itemId}`); 
  }

  // Vaciar el carrito completamente
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrlClient}/clear`);
  }

  // ==========================================
  // LÓGICA DEL ADMINISTRADOR (Para el Dashboard)
  // ==========================================
  
  // Obtener TODOS los carritos de la base de datos
  getCarts(): Observable<any> { 
    return this.http.get(this.apiUrlAdmin); 
  }
  
  // Crear un carrito manualmente desde el admin
  createCart(cart: any): Observable<any> { 
    return this.http.post(this.apiUrlAdmin, cart); 
  }
  
  // Actualizar un carrito desde el admin
  updateCart(id: string, cart: any): Observable<any> { 
    return this.http.put(`${this.apiUrlAdmin}/${id}`, cart); 
  }
  
  // Eliminar el carrito de un usuario
  deleteCart(id: string): Observable<any> { 
    return this.http.delete(`${this.apiUrlAdmin}/${id}`); 
  }
}