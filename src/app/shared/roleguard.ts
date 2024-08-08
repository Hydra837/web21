import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication.service'; // Assurez-vous du chemin correct

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const userRole = this.authService.getUserRole(); // Méthode à implémenter pour obtenir le rôle de l'utilisateur

    if (this.authService.isAuthenticated() && userRole === expectedRole) {
      return true;
    } else {
      this.router.navigate(['/access-denied']); // Rediriger vers une page d'accès refusé si rôle non autorisé
      return false;
    }
  }
}
