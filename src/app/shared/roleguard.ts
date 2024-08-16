import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication.service'; // Assurez-vous que le chemin est correct
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService, 
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRoles = route.data['roles'] as Array<string>; // Liste des rôles attendus

    // Vérifier si l'utilisateur est authentifié
    if (this.authService.isAuthenticated()) {
      // Extraire le rôle de l'utilisateur depuis le token JWT
      const userRole = this.authService.getUserRole();

      if (userRole && expectedRoles.includes(userRole)) {
        // Si le rôle de l'utilisateur correspond à l'un des rôles attendus
        return true;
      } else {
        // Rediriger vers la page d'accès refusé si le rôle ne correspond pas
        this.router.navigate(['/access-denied']);
        return false;
      }
    } else {
      // Rediriger vers la page de connexion si non authentifié
      this.router.navigate(['/login']);
      return false;
    }
  }
}
