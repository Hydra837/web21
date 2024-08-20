import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, UserFORM, UserUpdateFORM } from './Models/User';
import { mapUser } from './Outils/mapper'; // Assurez-vous que le chemin est correct
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7233/api/Users'; // Base URL pour l'API des utilisateurs

  constructor(private http: HttpClient, private authService: AuthenticationService) { }


  getUsers(): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAll`).pipe(
      map(data => data.map(user => mapUser(user))), // Utiliser le mapper ici
      catchError(this.handleError<User[]>('getUsers', []))
    );
  }

 
  getUserById(id: number): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/GetById/${id}`).pipe(
      map(user => mapUser(user)), // Utiliser le mapper ici
      catchError(this.handleError<User>(`getUserById id=${id}`))
    );
  }


  addUser(user: UserFORM): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/Create`, user).pipe(
      catchError(this.handleError<User>('addUser'))
    );
  }

 
  updateUser(id: number, user: UserFORM): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError<User>('updateUser'))
    );
  }
  updateUser1(id: number, user: UserUpdateFORM): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError<User>('updateUser'))
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`).pipe(
      catchError(this.handleError<void>('deleteUser'))
    );
  }


  searchUsers(searchTerm: string): Observable<User[]> {
    if (!searchTerm.trim()) {
     
      return of([]);
    }

    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<User[]>(`${this.apiUrl}/search`, { params }).pipe(
      map(data => data.map(user => mapUser(user))), 
      catchError(this.handleError<User[]>('searchUsers', []))
    );
  }

  
  getUserRole(userId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/GetUserRole/${userId}`).pipe(
      catchError(this.handleError<string>('getUserRole', 'Unknown'))
    );
  }

 
  getUsersByRole(role: string): Observable<User[]> {
    return this.getUsers().pipe(
      map(users => users.filter(user => user.role === role)),
      catchError(this.handleError<User[]>('getUsersByRole', []))
    );
  }

  getCurrentUser(): Observable<User | null> {
    const token = this.authService.getToken();
    if (!token) {
      return of(null); 
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/GetCurrentUser`, { headers }).pipe(
      map(user => mapUser(user)),
      catchError(this.handleError<User>('getCurrentUser', undefined))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      let errorMessage = 'Une erreur est survenue.';
      
  
    
      if (error.status === 400) {
       
        errorMessage = 'La requête est invalide. Vérifiez les données envoyées.';
      } else if (error.status === 409) {
     
        errorMessage = 'Conflit: Cette utilisateur existe déjà.';
      } else if (error.status === 500) {
   
        errorMessage = `Erreur serveur: ${error.error?.Message || error.message}`;
      }
  
      console.error(`${operation} échoué: ${errorMessage}`);
      return of(result as T);
    };
  }
}
