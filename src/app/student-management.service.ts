import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentManagementService {
  private baseUrl = "https://localhost:7233/api/StudentManagement";

  constructor(private http: HttpClient) { }

  // Méthode pour ajouter un utilisateur à un cours
  addUserToCourse(userId: number, courseId: number): Observable<any> {
    const url = `${this.baseUrl}/InsertUserCourse?id=${userId}&courseId=${courseId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, {}, { headers });
  }

  // Méthode pour supprimer un enseignant
  removeTeacher(teacherId: number, courseId: number): Observable<void> {
    const url = `${this.baseUrl}/RemoveTeacher?teacherId=${teacherId}&courseId=${courseId}`;
    return this.http.delete<void>(url);
  }

  // Méthode pour supprimer l'inscription d'un étudiant
  deleteEnrollment(studentId: number, courseId: number): Observable<void> {
    const url = `${this.baseUrl}/DeleteEnrollment?studentId=${studentId}&courseId=${courseId}`;
    return this.http.delete<void>(url);
  }
}
