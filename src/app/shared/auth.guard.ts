import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  // Vérification de l'authentification
  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Redirection vers la page de connexion si non authentifié
    return router.createUrlTree(['/login']);
  }
};
