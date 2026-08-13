import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl =`${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any> { return this.http.get(this.apiUrl); }
  getOrderById(id: string): Observable<any> { return this.http.get(`${this.apiUrl}/${id}`); }
  createOrder(order: any): Observable<any> { return this.http.post(this.apiUrl, order); }
  updateOrderStatus(id: string, status: any): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, status); }
  deleteOrder(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}