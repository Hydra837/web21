import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseManagementService {

  private baseUrl = "https://localhost:7233/api/StudentManagement";
  private updateteacher = "https://localhost:7233/api/StudentManagement/UpdateTeacher?teacherId=1&courseId=16"

  constructor(private http: HttpClient) { }

  // Méthode pour ajouter un utilisateur à un cours
  addUserToCourse(userId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/Courses/${courseId}/Users/${userId}`;
    return this.http.post(url, {});
  }

  // Méthode pour supprimer une inscription d'un utilisateur à un cours
  deleteEnrollment(studentId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/Enrollments/${studentId}/${courseId}`;
    return this.http.delete(url);
  }

  // Méthode pour supprimer un enseignant d'un cours
  removeTeacher(teacherId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/Courses/${courseId}/Teachers/${teacherId}`;
    return this.http.delete(url);
  }

  updateTeacher(teacherId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/UpdateTeacher?teacherId=${teacherId}&courseId=${courseId}`;
    return this.http.put(url, {}).pipe(
      catchError(this.handleError('updateTeacher'))
    );
  }
  // Méthode pour obtenir les informations d'un enseignant
  getTeacher(teacherId: number): Observable<any> {
    const url = `${this.baseUrl}/Teachers/${teacherId}`;
    return this.http.get(url);
  }
  private handleError(operation = 'operation') {
    return (error: any): Observable<never> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`${operation} failed`));
    };
}
}
