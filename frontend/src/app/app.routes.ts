import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// Importación de componentes
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Usuarios } from './pages/usuarios/usuarios';
import { Productos } from './pages/productos/productos';
import { Categorias } from './pages/categorias/categorias';
import { CarritoAdmin } from './pages/carrito_admin/carrito';
import { Pedidos } from './pages/pedidos/pedidos';
import { Pagos } from './pages/pagos/pagos';
import { Resenas } from './pages/resenas/resenas';
import { Tienda } from './pages/tienda/tienda';
import { MiCarrito } from './pages/carrito_usuario/mi-carrito';
import { Registro } from './pages/registro/registro';
import { adminGuard } from './guards/admin.guard';
import { Perfil } from './pages/perfil/perfil';

// En tu arreglo de rutas:

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  
  // ¡LA TIENDA AHORA ES UNA RUTA PRINCIPAL Y PÚBLICA!
  { path: 'tienda', component: Tienda }, 
  { path: 'mi-carrito', component: MiCarrito },
  { path: 'perfil', component: Perfil },

  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [adminGuard], // Protegemos el dashboard completo
    children: [
      { path: 'usuarios', component: Usuarios },
      { path: 'productos', component: Productos },
      { path: 'categorias', component: Categorias },
      { path: 'carrito', component: CarritoAdmin },
      { path: 'pedidos', component: Pedidos },
      { path: 'pagos', component: Pagos },
      { path: 'resenas', component: Resenas },
      { path: '', redirectTo: 'productos', pathMatch: 'full' }
    ]
  },
  
  // Ruta comodín en caso de error
  { path: '**', redirectTo: 'login' }
];