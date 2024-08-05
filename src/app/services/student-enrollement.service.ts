import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentEnrollmentService {
  private baseUrl = 'https://localhost:7233/api/StudentEnrollment/Insert';
  private getUserUrl = 'https://localhost:7233/api/StudentEnrollment/GetalluserCourse';
  private getbyUser = 'https://localhost:7233/api/StudentEnrollment/course'; // À compléter avec un ID dynamique
  private enrolledStudent = 'https://localhost:7233/api/StudentEnrollment/EnrolledStudent'; // À compléter avec un ID dynamique
  private deleteUrl = 'https://localhost:7233/api/StudentEnrollment'; // À compléter avec un ID dynamique
  private GetAllUserFor1course = 'https://localhost:7233/api/StudentEnrollment/GetalluserCourse';
   private updateGradeUrl = 'https://localhost:7233/api/StudentEnrollment/UpdateGrade'

  constructor(private http: HttpClient) { }

  // Méthode pour inscrire un étudiant à un cours
  enrollStudentCourse(idcourse: number, iduser: number): Observable<any> {
    const url = `${this.baseUrl}?studentId=${iduser}&courseId=${idcourse}`;
    return this.http.post(url, {});
  }

  // Méthode pour obtenir tous les utilisateurs inscrits à un cours spécifique
  getAllUserByCourse(id: number): Observable<any> {
    const url = `${this.getUserUrl}/${id}`;
    return this.http.get(url);
  }

  // Méthode pour obtenir les cours d'un étudiant spécifique
  getCoursesByStudentId(studentId: number): Observable<any> {
    const url = `${this.getbyUser}/${studentId}`;
    return this.http.get(url);
  }

  // Méthode pour obtenir les étudiants inscrits à un cours spécifique
  getEnrolledStudents(courseId: number): Observable<any> {
    const url = `${this.enrolledStudent}/${courseId}`;
    return this.http.get(url);
  }

  // Méthode pour supprimer une inscription d'étudiant à un cours
  deleteEnrollment(id: number): Observable<any> {
    const url = `${this.deleteUrl}/${id}`;
    return this.http.delete(url);
  }

  // Méthode pour obtenir tous les utilisateurs inscrits à un cours spécifique
  getAllUsersForCourse(courseId: number): Observable<any> {
    const url = `${this.GetAllUserFor1course}/${courseId}`;
    return this.http.get(url);
  }
  updateGrade(id: number, grade: number): Observable<any> {
    const url = `${this.updateGradeUrl}?id=${id}&grade=${grade}`;
    return this.http.put(url, {});
  }
}
