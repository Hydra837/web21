import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Course } from '../Models/courseModel'; // Assurez-vous que le modèle Course est importé
import { mapToCourseModel } from '../Outils/mapper'; // Importez les fonctions de mappage

@Injectable({
  providedIn: 'root'
})
export class StudentEnrollmentService {
  private baseUrl = 'https://localhost:7233/api/StudentEnrollment';
  
  constructor(private http: HttpClient) { }

  enrollStudentCourse(courseId: number, studentId: number): Observable<any> {
    const url = `${this.baseUrl}/Insert?studentId=${studentId}&courseId=${courseId}`;
    return this.http.post<any>(url, {}, { observe: 'response' }).pipe(
      catchError(this.handleError('enrollStudentCourse'))
    );
  }

  getAllUsersByCourse(courseId: number): Observable<any> {
    const url = `${this.baseUrl}/GetalluserCourse/${courseId}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError('getAllUsersByCourse'))
    );
  }


  getCoursesByStudentId(studentId: number): Observable<Course[]> {
    const url = `${this.baseUrl}/GetAllCoursesForStudent/${studentId}`;
    return this.http.get<any[]>(url).pipe(
      map(data => data.map(item => mapToCourseModel(item))),
      catchError(this.handleError('getCoursesByStudentId', []))
    );
  }


  getEnrolledStudents(courseId: number): Observable<any> {
    const url = `${this.baseUrl}/EnrolledStudent/${courseId}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError('getEnrolledStudents'))
    );
  }


  deleteEnrollment(enrollmentId: number): Observable<any> {
    const url = `${this.baseUrl}/${enrollmentId}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError('deleteEnrollment'))
    );
  }

  updateGrades(userId: number, courseId: number, grade: number): Observable<any> {
    const url = `${this.baseUrl}/UpdateGrades?idUsers=${userId}&idCours=${courseId}&grade=${grade}`;
    return this.http.put<any>(url, {}).pipe(
      catchError(this.handleError('updateGrades'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      let errorMessage = 'Une erreur est survenue.';

      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide. Vérifiez les données envoyées.';
          break;
        case 401:
          errorMessage = 'Non autorisé. Veuillez vérifier vos informations d\'identification.';
          break;
        case 404:
          errorMessage = 'Aucune information trouvé.';
          break;
        case 500:
          errorMessage = `Erreur serveur: ${error.error?.Message || error.message}`;
          break;
        default:
          errorMessage = `Erreur inconnue: ${error.message}`;
          break;
      }

      console.error(`${operation} a échoué: ${errorMessage}`);
      return throwError(() => new Error(`${operation} a échoué: ${errorMessage}`));
    };
  }
}
