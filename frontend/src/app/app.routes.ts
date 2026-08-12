import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// Importación de componentes (Asegúrate de exportarlos en sus respectivos archivos .ts)
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Usuarios } from './pages/usuarios/usuarios';
import { Productos } from './pages/productos/productos';
import { Categorias } from './pages/categorias/categorias';
import { Carrito } from './pages/carrito/carrito';
import { Pedidos } from './pages/pedidos/pedidos';
import { Pagos } from './pages/pagos/pagos';
import { Resenas } from './pages/resenas/resenas';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
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
  { path: '**', redirectTo: 'login' }
];