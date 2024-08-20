import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserAssignment } from './Models/UserAssignement';

@Injectable({
  providedIn: 'root'
})
export class StudentManagementService {
  private baseUrl = 'https://localhost:7233/api/StudentManagement';
  private baseUrl1 = 'https://localhost:7233/api/StudentManagement';

  constructor(private http: HttpClient) { }

  addUserToCourse(userId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/InsertUserCourse`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = { userId, courseId };

    return this.http.post(url, body, { headers }).pipe(
      catchError(this.handleError<any>('addUserToCourse'))
    );
  }


  removeTeacher(teacherId: number, courseId: number): Observable<void> {
    const url = `${this.baseUrl}/RemoveTeacher?teacherId=${teacherId}&courseId=${courseId}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<void>('removeTeacher'))
    );
  }


  deleteEnrollment(studentId: number, courseId: number): Observable<void> {
    const url = `${this.baseUrl}/DeleteEnrollment?studentId=${studentId}&courseId=${courseId}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<void>('deleteEnrollment'))
    );
  }
  getUserAssignments(userId: number): Observable<UserAssignment[]> {
    const url = `${this.baseUrl1}/userAssignment/${userId}`;
    return this.http.get<UserAssignment[]>(url).pipe(
      catchError(this.handleError<UserAssignment[]>('getUserAssignments', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }





}
