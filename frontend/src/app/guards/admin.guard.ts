import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Revisamos quién está intentando entrar
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  // Si tiene token y su rol es admin, le abrimos la puerta
  if (token && rol === 'admin') {
    return true; 
  }

  // Si es un usuario normal o un intruso sin iniciar sesión, lo pateamos a la tienda
  router.navigate(['/tienda']);
  return false; 
};