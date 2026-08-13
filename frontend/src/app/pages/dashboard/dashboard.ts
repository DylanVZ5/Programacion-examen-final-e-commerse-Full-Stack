import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], 
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);

  // Variable que el HTML usará para decidir qué opciones mostrar en el menú
  userRole: string = 'user';

  ngOnInit() {
    this.verificarYCargarRol();
  }

  // Método seguro para leer el rol desde el almacenamiento local
  private verificarYCargarRol() {
    const rolGuardado = localStorage.getItem('rol');
    
    // Sanitización básica en el frontend: solo permitimos valores estrictos esperados
    if (rolGuardado === 'admin' || rolGuardado === 'user') {
      this.userRole = rolGuardado;
    } else {
      // Si alguien alteró el localStorage con texto extraño, por defecto es un usuario seguro ('user')
      this.userRole = 'user';
    }
  }

  logout() {
    // Limpiamos los datos de sesión almacenados en el navegador
    localStorage.removeItem('rol');
    this.authService.logout();
  }
}