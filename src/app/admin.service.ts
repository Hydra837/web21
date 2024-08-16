import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Course } from '../app/Models/courseModel';
import { User } from '../app/Models/User'; // Assurez-vous que le chemin est correct
import { mapToCourseModel } from '../app/Outils/mapper'; // Assurez-vous que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://localhost:7233/api'; // Corriger le chemin API si nécessaire
  private getAllCoursesUrl = `${this.apiUrl}/Cours/GetAll`;
  private getAllUsersUrl = `${this.apiUrl}/UsersContoller/GetAll`; // Corrigé le nom

  constructor(private http: HttpClient) { }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue !';
    if (error.error instanceof ErrorEvent) {

      errorMessage = `Erreur : ${error.error.message}`;
    } else {

      errorMessage = `Code d'erreur : ${error.status}\nMessage : ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }


  private mapToCourseModel(item: any): Course {
    return mapToCourseModel(item);
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<any[]>(this.getAllCoursesUrl).pipe(
      map(data => data.map(this.mapToCourseModel.bind(this))),
      catchError(this.handleError)
    );
  }

 
  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/Courses`, course).pipe(
      catchError(this.handleError)
    );
  }


  updateCourse(courseId: string, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/Courses/${courseId}`, course).pipe(
      catchError(this.handleError)
    );
  }

 
  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Courses/${courseId}`).pipe(
      catchError(this.handleError)
    );
  }

  
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.getAllUsersUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Créer un nouvel utilisateur (admin ou enseignant)
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/Users`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Mettre à jour les informations d'un utilisateur
  updateUser(userId: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/Users/${userId}`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer un utilisateur
  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Users/${userId}`).pipe(
      catchError(this.handleError)
    );
  }
}
