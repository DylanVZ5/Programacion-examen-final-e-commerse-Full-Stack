import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Aquí importamos las herramientas de enrutamiento que necesita el HTML
  imports: [RouterOutlet, RouterLink, RouterLinkActive], 
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  // Inyectamos el servicio de autenticación
  private authService = inject(AuthService);

  // Creamos la función que el HTML está intentando ejecutar
  logout() {
    this.authService.logout();
  }
}