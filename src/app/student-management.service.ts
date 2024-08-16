import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentManagementService {
  private baseUrl = 'https://localhost:7233/api/StudentManagement';

  constructor(private http: HttpClient) { }

  // Méthode pour ajouter un utilisateur à un cours
  addUserToCourse(userId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/InsertUserCourse`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = { userId, courseId }; // Corps de la requête

    return this.http.post(url, body, { headers }).pipe(
      catchError(this.handleError<any>('addUserToCourse'))
    );
  }

  // Méthode pour supprimer un enseignant d'un cours
  removeTeacher(teacherId: number, courseId: number): Observable<void> {
    const url = `${this.baseUrl}/RemoveTeacher?teacherId=${teacherId}&courseId=${courseId}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<void>('removeTeacher'))
    );
  }

  // Méthode pour supprimer l'inscription d'un étudiant à un cours
  deleteEnrollment(studentId: number, courseId: number): Observable<void> {
    const url = `${this.baseUrl}/DeleteEnrollment?studentId=${studentId}&courseId=${courseId}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<void>('deleteEnrollment'))
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
