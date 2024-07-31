import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://yourapiurl.com/api/students';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createStudent(student: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, student);
  }

  updateStudent(id: string, student: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
