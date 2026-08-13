import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '${environment.apiUrl}/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Login: Guarda el token tras una respuesta exitosa
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          // Opcional: guardar datos del usuario
          // localStorage.setItem('user', JSON.stringify(res.user));
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
}