import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { UserAssignment } from './Models/UserAssignement';

@Injectable({
  providedIn: 'root'
})
export class CourseManagementService {

  private baseUrl = "https://localhost:7233/api/StudentManagement";

  constructor(private http: HttpClient, private authService: AuthenticationService) { }


  private getHttpHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }


  addUserToCourse(userId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/Courses/${courseId}/Users/${userId}`;
    return this.http.post(url, {}, { headers: this.getHttpHeaders() }).pipe(
      catchError(this.handleError('addUserToCourse'))
    );
  }


  deleteEnrollment(studentId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/DeleteEnrollment?studentId=${studentId}&courseId=${courseId}`;
    return this.http.delete(url, { headers: this.getHttpHeaders() }).pipe(
      catchError(this.handleError('deleteEnrollment'))
    );
  }

  
  removeTeacher(teacherId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/Courses/${courseId}/Teachers/${teacherId}`;
    return this.http.delete(url, { headers: this.getHttpHeaders() }).pipe(
      catchError(this.handleError('removeTeacher'))
    );
  }


  updateTeacher(teacherId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/UpdateTeacher?teacherId=${teacherId}&courseId=${courseId}`;
    return this.http.put(url, {}, { headers: this.getHttpHeaders() }).pipe(
      catchError(this.handleError('updateTeacher'))
    );
  }

  getTeacher(teacherId: number): Observable<any> {
    const url = `${this.baseUrl}/Teachers/${teacherId}`;
    return this.http.get(url).pipe(
      catchError(this.handleError('getTeacher'))
    );
  }


  getUsersAssignmentsGradesForCourse(courseId: number): Observable<UserAssignment[]> {
    const url = `${this.baseUrl}/course/${courseId}/assignments`;
    return this.http.get<UserAssignment[]>(url, { headers: this.getHttpHeaders() }).pipe(
      catchError(this.handleError('getUsersAssignmentsGradesForCourse'))
    );
  }

  private handleError(operation = 'operation') {
    return (error: any): Observable<never> => {
      let errorMessage = 'Une erreur est survenue.';

      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide. Vérifiez les données envoyées.';
          break;
        case 401:
          errorMessage = 'Non autorisé. Vérifiez vos informations d\'identification.';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée.';
          break;
        case 500:
          errorMessage = `Erreur serveur: ${error.error?.Message || error.message}`;
          break;
        default:
          errorMessage = `Erreur inconnue: ${error.message || 'Aucune information disponible'}`;
          break;
      }

      console.error(`${operation} échoué: ${errorMessage}`);
      return throwError(() => new Error(errorMessage));
    };
  }
}
