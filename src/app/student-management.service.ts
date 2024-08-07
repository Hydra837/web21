import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class StudentManagementService {

  private url = "https://localhost:7233/api/StudentManagement";
  private urlget = "https://localhost:7233/api/StudentEnrollment/GetalluserCourse/2"
  private pullurl = "https://localhost:7233/api/StudentEnrollment/GetalluserCourse/2"
  constructor(private http: HttpClient) { }

  // Méthode pour ajouter un utilisateur à un cours
  addUserToCourse(userId: number, courseId: number): Observable<any> {
    const url = `${this.url}/InsertUserCourse?id=${userId}&courseId=${courseId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, {}, { headers });
  }
}
