import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Course } from '../app/Models/courseModel';
import { User } from '../app/Models/User'; // Ensure the import path is correct
import { mapToCourseModel } from '../app/Outils/mapper'; // Ensure the import path is correct

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admin';
  private getAllCoursesUrl = 'https://localhost:7233/api/Cours/GetAll';
  private getAllUsersUrl = 'https://localhost:7233/api/UsersContoller/GetAll'; // Corrected the spelling

  constructor(private http: HttpClient) { }

  // Handle any errors that occur during the HTTP request
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  // Map raw course data to Course model
  private mapToCourseModel(item: any): Course {
    return mapToCourseModel(item);
  }

  // Get all courses
  getAllCourses(): Observable<Course[]> {
    return this.http.get<any[]>(this.getAllCoursesUrl).pipe(
      map((data: any[]) => data.map((item: any) => this.mapToCourseModel(item))),
      catchError(this.handleError)
    );
  }

  // Create a new course
  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses`, course)
      .pipe(catchError(this.handleError));
  }

  // Update an existing course
  updateCourse(courseId: string, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${courseId}`, course)
      .pipe(catchError(this.handleError));
  }

  // Delete a course
  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${courseId}`)
      .pipe(catchError(this.handleError));
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.getAllUsersUrl}`)
      .pipe(catchError(this.handleError));
  }

  // Create a new user (admin or teacher)
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user)
      .pipe(catchError(this.handleError));
  }

  // Update user information
  updateUser(userId: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, user)
      .pipe(catchError(this.handleError));
  }

  // Delete a user
  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`)
      .pipe(catchError(this.handleError));
  }
}


 