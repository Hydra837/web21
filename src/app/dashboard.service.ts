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

  getEnrolledCourses(userId: number): Observable<Course[]> {
    return this.http.get<any[]>(`${this.getEnrolledCoursesUrl}/${userId}`).pipe(
      map(data => data.map(item => mapToCourseModel(item))),
      catchError(error => {
        console.error('Erreur lors de la récupération des cours inscrits.', error);
        return of([]);
      })
    );
  }

  getTeachingCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/professor/courses`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des cours enseignés', error);
        return throwError(error);
      })
    );
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.getAllCoursesUrl).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération de tous les cours', error);
        return throwError(error);
      })
    );
  }

  updateUser(userId: number, userData: User): Observable<User> {
    return this.http.put<User>(`${this.updateUserUrl}/${userId}`, userData).pipe(
      catchError(error => {
        console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        return throwError(error);
      })
    );
  }

  getCurrentUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.getCurrentUserUrl}/${userId}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération de l\'utilisateur actuel', error);
        return throwError(error);
      })
    );
  }

  getCoursesByTeacher(teacherId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.getCoursesByTeacherUrl}/${teacherId}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des cours par professeur', error);
        return throwError(error);
      })
    );
  }
}
