import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          
          // Capturamos los datos completos del usuario
          const userData = res.usuario || res.user || res.data?.usuario; 
          
          if (userData) {
            localStorage.setItem('usuario', JSON.stringify(userData));
            
            // Guardamos el rol para el candado (Guard)
            localStorage.setItem('rol', userData.rol || 'user');
          }
        }
      })
    );
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Verifica si el usuario tiene un token activo
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Actualizar perfil del usuario
  actualizarPerfil(datos: any): Observable<any> {
    // Asumimos que la ruta en Node.js será PUT /api/auth/perfil o similar
    return this.http.put(`${this.apiUrl}/perfil`, datos);
  }
}