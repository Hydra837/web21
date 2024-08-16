import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Course } from '../Models/courseModel'; // Assurez-vous que le modèle Course est importé
import { mapToCourseModel } from '../Outils/mapper'; // Importez les fonctions de mappage

@Injectable({
  providedIn: 'root'
})
export class StudentEnrollmentService {
  private baseUrl = 'https://localhost:7233/api/StudentEnrollment';
  
  constructor(private http: HttpClient) { }

  // Inscrire un étudiant à un cours
  enrollStudentCourse(courseId: number, studentId: number): Observable<any> {
    const url = `${this.baseUrl}/Insert?studentId=${studentId}&courseId=${courseId}`;
    return this.http.post(url, {});
  }

  // Obtenir tous les utilisateurs inscrits à un cours spécifique
  getAllUsersByCourse(courseId: number): Observable<any> {
    const url = `${this.baseUrl}/GetalluserCourse/${courseId}`;
    return this.http.get(url);
  }

  // Obtenir les cours d'un étudiant
  getCoursesByStudentId(studentId: number): Observable<Course[]> {
    const url = `${this.baseUrl}/GetAllCoursesForStudent/${studentId}`;
    return this.http.get<any[]>(url).pipe(
      map(data => data.map(item => mapToCourseModel(item)))
    );
  }

  // Obtenir les étudiants inscrits à un cours spécifique
  getEnrolledStudents(courseId: number): Observable<any> {
    const url = `${this.baseUrl}/EnrolledStudent/${courseId}`;
    return this.http.get(url);
  }

  // Supprimer une inscription
  deleteEnrollment(enrollmentId: number): Observable<any> {
    const url = `${this.baseUrl}/${enrollmentId}`;
    return this.http.delete(url);
  }

  // Mettre à jour les notes des étudiants
  updateGrades(userId: number, courseId: number, grade: number): Observable<any> {
    const url = `${this.baseUrl}/UpdateGrades?idUsers=${userId}&idCours=${courseId}&grade=${grade}`;
    return this.http.put(url, {});
  }
}
