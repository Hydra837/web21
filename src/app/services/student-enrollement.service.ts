import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentEnrollmentService {
  private baseUrl = 'https://localhost:7233/api/StudentEnrollment/Insert';
  private getUserUrl = 'https://localhost:7233/api/StudentEnrollment/GetalluserCourse';

  constructor(private http: HttpClient) { }

  enrollStudentCourse(idcourse: number, iduser: number): Observable<any> {
    const url = `${this.baseUrl}?studentId=${iduser}&courseId=${idcourse}`;
    return this.http.post(url, {});
  }

  getAllUserByCourse(id: number): Observable<any> {
    const url = `${this.getUserUrl}/${id}`;
    return this.http.get(url);
  }
}
