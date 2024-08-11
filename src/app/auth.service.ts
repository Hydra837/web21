// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any = null;

  constructor() {
    // Simuler un utilisateur avec ID = 1 et rôle 'Étudiant'
    this.setUser({
      id: 1,
      Nom:'Max',
      role: 'Étudiant',
      token: 'fake-jwt-token' // Simuler un token JWT si nécessaire
    });
  }

  getUser() {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }

  getUserRole(): string | null {
    return this.user?.role || null;
  }

  setUser(user: any) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    this.user = null;
    localStorage.removeItem('user');
  }
}
