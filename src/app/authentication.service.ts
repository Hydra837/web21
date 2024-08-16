import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './Models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private authUrl = 'https://localhost:7233/api/Authentication';
  private user: any = null;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  // Connexion de l'utilisateur
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { username, password })
      .pipe(map(response => {
        // Stocker le token JWT dans localStorage
        localStorage.setItem('jwtToken', response.token);
        return response;
      }));
  }

  // Obtenir l'ID de l'utilisateur depuis le token JWT
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


  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {

        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || null;
      } catch (e) {
        console.error('Erreur lors du décodage du token JWT:', e);
        return null;
      }
    }
    return null;
  }

 
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
  setToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    localStorage.removeItem('jwtToken');
  }

  // Obtenir le token JWT
  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('jwtToken');
    } else {
      return null;
    }
  }
 
  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }
}
