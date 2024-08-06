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

  constructor(private http: HttpClient) {}

  // Obtenir les cours auxquels un utilisateur est inscrit
  getEnrolledCourses(userId: number): Observable<any> {
    return this.http.get(`${this.getEnrolledCoursesUrl}?userId=${userId}`);
  }

  // Obtenir les cours enseignés par le professeur connecté
  getTeachingCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/professor/courses`);
  }

  // Obtenir tous les cours
  getAllCourses(): Observable<any> {
    return this.http.get(`${this.getAllCoursesUrl}`);
  }

  // Mettre à jour les informations d'un utilisateur
  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.updateUserUrl}/${userId}`, userData);
  }

  // Obtenir les détails de l'utilisateur actuel par ID
  getCurrentUser(userId: number): Observable<any> {
    return this.http.get(`${this.getCurrentUserUrl}/${userId}`);
  }
}
