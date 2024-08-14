import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mapToLogin } from './Outils/mapper';
import { Login } from './Models/Login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginUrl = 'https://localhost:7233/api/Authentication/Login';
  private readonly registerUrl = 'https://localhost:7233/api/Authentication/Register';

  private user: any = null;

  constructor(private http: HttpClient) {
    // Initialisation de l'utilisateur à partir de sessionStorage s'il existe
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  getUser() {
    return this.user;
  }

  getUserId(): number | null {
    return this.user?.id || null;
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }

  getUserRole(): string | null {
    return this.user?.role || null;
  }

  getToken(): string | null {
    return this.user?.token || null;
  }

  setUser(user: any) {
    this.user = user;
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    this.user = null;
    sessionStorage.removeItem('user');
  }

  login(credentials: any): Observable<any> {
    // Utilisation du mapper ici
    const loginData: Login = mapToLogin(credentials);
    return this.http.post<any>(this.loginUrl, loginData);
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData);
  }
}
