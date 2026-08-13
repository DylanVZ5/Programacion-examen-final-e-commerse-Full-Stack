import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  // Asegúrate de que esta URL coincida con la de tu backend (usualmente es en plural)
  private apiUrl = `${environment.apiUrl}/payments`; 

  constructor(private http: HttpClient) {}

  getPayments(): Observable<any> { 
    return this.http.get(this.apiUrl); 
  }
  
  getPaymentById(id: string): Observable<any> { 
    return this.http.get(`${this.apiUrl}/${id}`); 
  }
  
  createPayment(payment: any): Observable<any> { 
    return this.http.post(this.apiUrl, payment); 
  }
  
  updatePayment(id: string, payment: any): Observable<any> { 
    return this.http.put(`${this.apiUrl}/${id}`, payment); 
  }
  
  deletePayment(id: string): Observable<any> { 
    return this.http.delete(`${this.apiUrl}/${id}`); 
  }
}