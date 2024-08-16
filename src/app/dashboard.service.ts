import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Course } from './Models/courseModel'; // Exemple de chemin
import { User } from './Models/User'; // Exemple de chemin
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

  constructor(private http: HttpClient) {}

  // Récupérer les cours inscrits pour un utilisateur
  getEnrolledCourses(userId: number): Observable<Course[]> {
    return this.http.get<any[]>(`${this.getEnrolledCoursesUrl}/${userId}`).pipe(
      map(data => data.map(item => mapToCourseModel(item))),
      catchError(error => {
        console.error('Erreur lors de la récupération des cours inscrits.', error);
        return of([]);
      })
    );
  }

  // Récupérer les cours enseignés par le professeur (URL mise à jour)
  getTeachingCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/Cours/GetTeachingCourses`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des cours enseignés.', error);
        return throwError(error);
      })
    );
  }

  // Récupérer tous les cours
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.getAllCoursesUrl).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération de tous les cours.', error);
        return throwError(error);
      })
    );
  }

  // Mettre à jour un utilisateur
  updateUser(userId: number, userData: User): Observable<User> {
    return this.http.put<User>(`${this.updateUserUrl}/${userId}`, userData).pipe(
      catchError(error => {
        console.error('Erreur lors de la mise à jour de l\'utilisateur.', error);
        return throwError(error);
      })
    );
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.getCurrentUserUrl}/${userId}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération de l\'utilisateur actuel.', error);
        return throwError(error);
      })
    );
  }

  // Récupérer les cours par professeur
  getCoursesByTeacher(teacherId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.getCoursesByTeacherUrl}/${teacherId}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des cours par professeur.', error);
        return throwError(error);
      })
    );
  }
}
