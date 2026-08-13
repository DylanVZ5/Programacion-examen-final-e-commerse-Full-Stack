import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// Importación de componentes
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Usuarios } from './pages/usuarios/usuarios';
import { Productos } from './pages/productos/productos';
import { Categorias } from './pages/categorias/categorias';
import { Carrito } from './pages/carrito/carrito';
import { Pedidos } from './pages/pedidos/pedidos';
import { Pagos } from './pages/pagos/pagos';
import { Resenas } from './pages/resenas/resenas';
import { Tienda } from './pages/tienda/tienda';
import { MiCarrito } from './pages/carrito_usuario/mi-carrito'; // Ajusta la ruta si es necesario

// En tu arreglo de rutas:

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  
  // ¡LA TIENDA AHORA ES UNA RUTA PRINCIPAL Y PÚBLICA!
  { path: 'tienda', component: Tienda }, 
  { path: 'mi-carrito', component: MiCarrito },

  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard], // Protegemos el dashboard completo
    children: [
      { path: 'usuarios', component: Usuarios },
      { path: 'productos', component: Productos },
      { path: 'categorias', component: Categorias },
      { path: 'carrito', component: Carrito },
      { path: 'pedidos', component: Pedidos },
      { path: 'pagos', component: Pagos },
      { path: 'resenas', component: Resenas },
      { path: '', redirectTo: 'productos', pathMatch: 'full' }
    ]
  },
  
  // Ruta comodín en caso de error
  { path: '**', redirectTo: 'login' }
];