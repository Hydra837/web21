import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Course } from './Models/courseModel'; // Exemple de chemin
import { User, UserCours } from './Models/User'; // Exemple de chemin
import { mapToCourseModel } from './Outils/mapper';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://localhost:7233/api';
  private getAllCoursesUrl = `${this.apiUrl}/Cours/GetAll`;
  private getEnrolledCoursesUrl = `${this.apiUrl}/StudentEnrollment/GetAllCoursesForStudent`;
  private updateUserUrl = `${this.apiUrl}/Users`;
  private getCurrentUserUrl = `${this.apiUrl}/Users/GetById`;
  private getCoursesByTeacherUrl = `${this.apiUrl}/Cours/cours/professeur`;
  private apiUrl1 = 'https://localhost:7233/api/StudentEnrollment/students'

  constructor(private http: HttpClient) {}

  // Récupérer les cours inscrits pour un utilisateur
  getEnrolledCourses(userId: number): Observable<Course[]> {
    return this.http.get<any[]>(`${this.getEnrolledCoursesUrl}/${userId}`).pipe(
      map(data => data.map(item => mapToCourseModel(item))),
      catchError(this.handleError<Course[]>('getEnrolledCourses', []))
    );
  }

  // Récupérer les cours enseignés par le professeur
  getTeachingCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/Cours/GetTeachingCourses`).pipe(
      catchError(this.handleError<Course[]>('getTeachingCourses', []))
    );
  }

  // Récupérer tous les cours
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.getAllCoursesUrl).pipe(
      catchError(this.handleError<Course[]>('getAllCourses', []))
    );
  }

  // Mettre à jour un utilisateur
  updateUser(userId: number, userData: User): Observable<User> {
    return this.http.put<User>(`${this.updateUserUrl}/${userId}`, userData).pipe(
      catchError(this.handleError<User>('updateUser'))
    );
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.getCurrentUserUrl}/${userId}`).pipe(
      catchError(this.handleError<User>('getCurrentUser'))
    );
  }

  // Récupérer les cours par professeur
  getCoursesByTeacher(teacherId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.getCoursesByTeacherUrl}/${teacherId}`).pipe(
      catchError(this.handleError<Course[]>('getCoursesByTeacher', []))
    );
  }
  getStudents(): Observable<UserCours[]> {
    return this.http.get<UserCours[]>(this.apiUrl1);
  }
  // Gestion des erreurs
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      let errorMessage = 'Une erreur est survenue.';

      // Gestion des erreurs spécifiques
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide. Vérifiez les données envoyées.';
          break;
        case 404:
          errorMessage = 'rien à afficher.';
          break;
        case 409:
          errorMessage = 'existe déjà.';
          break;
        case 500:
          errorMessage = `Erreur serveur: ${error.error?.Message || error.message}`;
          break;
        default:
          errorMessage = `Erreur inconnue: ${error.message}`;
          break;
      }

      console.error(`${operation} échoué: ${errorMessage}`);
      return of(result as T);
    };
  }
}
