import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication.service'; // Assurez-vous que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role']; // Rôle attendu défini dans la route
    const userRole = this.authService.getUserRole(); // Méthode pour obtenir le rôle actuel de l'utilisateur

    // Vérification de l'authentification et du rôle de l'utilisateur
    if (this.authService.isAuthenticated() && userRole === expectedRole) {
      return true;
    } else {
      // Redirection vers la page d'accès refusé si le rôle ne correspond pas
      this.router.navigate(['/access-denied']);
      return false;
    }
  }
}
