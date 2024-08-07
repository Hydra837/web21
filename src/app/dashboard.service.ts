import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // URLs API
  private apiUrl = 'http://localhost:3000/api'; // Assurez-vous que cette URL est correcte
  private getAllCoursesUrl = 'https://localhost:7233/api/Cours/GetAll'; // Obtenir tous les cours
  private getEnrolledCoursesUrl = 'https://localhost:7233/api/StudentEnrollment/EnrolledStudent';
  private updateUserUrl = 'https://localhost:7233/api/Users'; // Mise à jour des utilisateurs
  private getCurrentUserUrl = 'https://localhost:7233/api/Users/GetById'; // Obtenir l'utilisateur actuel
  private getallcourset = "https://localhost:7233/api/Cours/cours/professeur"

  constructor(private http: HttpClient) {}

 
  getEnrolledCourses(userId: number): Observable<any> {
    return this.http.get(`${this.getEnrolledCoursesUrl}?userId=${userId}`);
  }
  getTeachingCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/professor/courses`);
  }
  getAllCourses(): Observable<any> {
    return this.http.get(`${this.getAllCoursesUrl}`);
  }
  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.updateUserUrl}/${userId}`, userData);
  }
  getCurrentUser(userId: number): Observable<any> {
    return this.http.get(`${this.getCurrentUserUrl}/${userId}`);
  }
  getCoursesByTeacher(teacherId: number): Observable<any> {
    return this.http.get(`${this.getallcourset}/${teacherId}`);
  }
}
