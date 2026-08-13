import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> { return this.http.get(this.apiUrl); }
  getCategoryById(id: string): Observable<any> { return this.http.get(`${this.apiUrl}/${id}`); }
  createCategory(category: any): Observable<any> { return this.http.post(this.apiUrl, category); }
  updateCategory(id: string, category: any): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, category); }
  deleteCategory(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}