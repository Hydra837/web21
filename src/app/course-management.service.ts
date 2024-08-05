import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseManagementService {

  private baseUrl = "https://localhost:7233/api/StudentManagement";

  constructor(private http: HttpClient) { }

  // Méthode pour ajouter un utilisateur à un cours
  addUserToCourse(userId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/Courses/${courseId}/Users/${userId}`;
    return this.http.post(url, {});
  }

  // Méthode pour supprimer une inscription d'un utilisateur à un cours
  deleteEnrollment(studentId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/Enrollments/${studentId}/${courseId}`;
    return this.http.delete(url);
  }

  // Méthode pour supprimer un enseignant d'un cours
  removeTeacher(teacherId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/Courses/${courseId}/Teachers/${teacherId}`;
    return this.http.delete(url);
  }

  // Méthode pour ajouter un enseignant à un cours
  updateTeacher(teacherId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/Courses/${courseId}/Teachers/${teacherId}`;
    return this.http.post(url, {});
  }

  // Méthode pour obtenir les informations d'un enseignant
  getTeacher(teacherId: number): Observable<any> {
    const url = `${this.baseUrl}/Teachers/${teacherId}`;
    return this.http.get(url);
  }
}
