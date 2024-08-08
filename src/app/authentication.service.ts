import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private authUrl = 'https://localhost:7233/api/auth';

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  // Connexion de l'utilisateur
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { username, password })
      .pipe(map(response => {
        // Stocker le token JWT dans sessionStorage
        sessionStorage.setItem('jwtToken', response.token);
        return response;
      }));
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    sessionStorage.removeItem('jwtToken');
  }

  // Obtenir le token JWT
  getToken(): string | null {
    return sessionStorage.getItem('jwtToken');
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    const token = this.getToken(); // Utiliser sessionStorage pour obtenir le token
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  // Obtenir le rôle de l'utilisateur depuis le token
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Décoder le payload du JWT
      return payload.role;
    }
    return null;
  }
}
