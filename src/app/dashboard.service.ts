import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api';
  private GetAll = 'https://localhost:7233/api/Cours/GetAll'
  private apiGetCourses = 'https://localhost:7233/api/StudentEnrollment/EnrolledStudent/1'

  constructor(private http: HttpClient) {}

  getEnrolledCourses(): Observable<any> {
    return this.http.get(`${this.apiGetCourses}`);
  }

  getTeachingCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/professor/courses`);
  }

  getAllCourses(): Observable<any> {
    return this.http.get(`${this.GetAll}`);
  }
}
