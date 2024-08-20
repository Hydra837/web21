import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User, UserFORM } from './Models/User';
import { mapUser } from './Outils/mapper'; // Assurez-vous que le chemin est correct
import { Login } from './Models/Login';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private authUrl = 'https://localhost:7233/api/Authentication';
  private apiUrl = 'https://localhost:7233/api/Users'; // URL pour obtenir les informations utilisateur
  private registerUrl = 'https://localhost:7233/api/Authentication/Register';
  private forgotPasswordUrl = 'https://localhost:7233/api/Authentication/forgot-password'; // URL pour réinitialisation de mot de passe

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { username, password })
      .pipe(
        map(response => {
          if (this.isBrowser) {
            sessionStorage.setItem('jwtToken', response.token);
          }
          return response;
        }),
        catchError(this.handleError('login'))
      );
  }


  getUserId(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        // Décoder le payload du JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id || null;
      } catch (e) {
        console.error('Erreur lors du décodage du token JWT:', e);
        return null;
      }
    }
    return null;
  }

  // Obtenir le rôle de l'utilisateur depuis le token JWT
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
      } catch (e) {
        console.error('Erreur lors du décodage du token JWT:', e);
        return null;
      }
    }
    return null;
  }

  // Obtenir le nom de l'utilisateur depuis le token JWT
  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.name || null;
      } catch (e) {
        console.error('Erreur lors du décodage du token JWT:', e);
        return null;
      }
    }
    return null;
  }

  // Définir le token JWT dans sessionStorage
  setToken(token: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem('jwtToken', token);
    }
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem('jwtToken');
    }
  }

  // Obtenir le token JWT
  getToken(): string | null {
    return this.isBrowser ? sessionStorage.getItem('jwtToken') : null;
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): Observable<User | null> {
    const token = this.getToken();
    if (!token) {
      return of(null); // Retourner null si le token n'est pas disponible
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/GetCurrentUser`, { headers }).pipe(
      map(user => mapUser(user)), // Assurez-vous que cette fonction mapUser est définie
      catchError(this.handleError<User>('getCurrentUser', undefined))
    );
  }

  // Enregistrer un nouvel utilisateur
  register(userData: UserFORM): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData).pipe(
      catchError(this.handleError<UserFORM>('register'))
    );
  }

  forgotPassword(login: Login): Observable<any> {
    return this.http.post<any>(this.forgotPasswordUrl, login).pipe(
      catchError(this.handleError('forgotPassword'))
    );
  }


  private handleError<T>(operation: string, result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      let errorMessage = 'Une erreur est survenue.';
  
 
      if (operation === 'register' && error.status === 400) {
        if (error.error?.Message === 'Ce pseudo est déjà pris.') {
          errorMessage = 'Ce pseudo est déjà pris.';
        } else {
          errorMessage = 'Les données envoyées sont invalides. Veuillez vérifier les champs.';
        }
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Requête invalide. Vérifiez les données envoyées.';
            break;
          case 401:
            errorMessage = 'Non autorisé. Veuillez vérifier vos informations d\'identification.';
            break;
          case 404:
            errorMessage = 'Compte introuvable.';
            break;
          case 500:
            errorMessage = `Erreur serveur: ${error.error?.Message || error.message}`;
            break;
          default:
            errorMessage = `Erreur inconnue: ${error.message}`;
            break;
        }
      }
  
      console.error(`${operation} a échoué: ${errorMessage}`);
      // Ensure the function always returns an Observable<T>
      return throwError(() => new Error(`${operation} a échoué: ${errorMessage}`));
    };
  }
  
}
