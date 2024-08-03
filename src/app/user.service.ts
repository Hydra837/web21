import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, UserFORM } from './Models/User';
import { mapUser } from './Outils/mapper'; // Assurez-vous que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7233/api/Users'; // Base URL pour l'API des utilisateurs

  constructor(private http: HttpClient) { }

  // Récupérer tous les utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAll`).pipe(
      map(data => data.map(user => mapUser(user))), // Utiliser le mapper ici
      catchError(this.handleError<User[]>('getUsers', []))
    );
  }

  // Récupérer un utilisateur par ID
  getUserById(id: number): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/GetById/${id}`).pipe(
      map(user => mapUser(user)), // Utiliser le mapper ici
      catchError(this.handleError<User>(`getUserById id=${id}`))
    );
  }

  // Ajouter un nouvel utilisateur
  addUser(user: UserFORM): Observable<User> { 
    return this.http.post<User>(`${this.apiUrl}/Create`, user).pipe(
      catchError(this.handleError<User>('addUser'))
    );
  }

  // Mettre à jour un utilisateur
  updateUser(id: number, user: UserFORM): Observable<User> { 
    return this.http.put<User>(`${this.apiUrl}/Update/${id}`, user).pipe(
      catchError(this.handleError<User>('updateUser'))
    );
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`).pipe(
      catchError(this.handleError<void>('deleteUser'))
    );
  }

  // Recherche d'utilisateurs
  searchUsers(searchTerm: string): Observable<User[]> {
    let params = new HttpParams().set('q', searchTerm);
    return this.http.get<User[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(this.handleError<User[]>('searchUsers', []))
    );
  }

  // Gestion des erreurs
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
