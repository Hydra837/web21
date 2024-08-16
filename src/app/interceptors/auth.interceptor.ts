import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Liste des endpoints qui ne nécessitent pas d'authentification
    const authExcludedUrls = ['/api/Authentication/Login', '/api/Authentication/Register'];

    // Vérifiez si l'URL de la requête est dans la liste des URLs exclues
    if (authExcludedUrls.some(url => req.url.includes(url))) {
      // Si l'URL est dans la liste des endpoints exclus, ne pas ajouter l'en-tête Authorization
      return next.handle(req);
    }

    const token = this.authService.getToken();
    if (token) {
      // Cloner la requête et ajouter l'en-tête Authorization
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(clonedReq).pipe(
        catchError(err => {
          if (err.status === 401) {
            // Gérer le cas d'erreur 401 (non autorisé)
            console.error('Token expiré ou non valide, redirection vers la page de connexion.');
            this.authService.logout();  // Déconnexion de l'utilisateur
            this.router.navigate(['/login']);  // Redirection vers la page de connexion
          }
          return throwError(err);
        })
      );
    } else {
      // Si aucun token n'est présent, continuer avec la requête originale
      return next.handle(req);
    }
  }
}
