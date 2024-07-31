import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradeeService {
  private apiUrl = 'http://yourapiurl.com/api/courses';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createCourse(course: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, course);
  }

  updateCourse(id: string, course: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
