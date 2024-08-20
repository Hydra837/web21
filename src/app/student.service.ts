import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Course } from './Models/courseModel'
import { AssignementsDTO } from './Models/assignementsModel';
import { Grade } from './Models/GradeModel';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'https://localhost:7233/api'; // URL de base pour les API
  private coursetu = 'https://localhost:7233/api/StudentEnrollment/EnrolledStudent'
  private assignement  ='https://localhost:7233/api/Assignements/by-course'
  private gradea = 'https://localhost:7233/api/Grade/assignments'

  constructor(private http: HttpClient) { }

  // Obtenir tous les cours pour un étudiant
  getCoursesForStudent(studentId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.coursetu}/${studentId}`).pipe(
      catchError(this.handleError('getCoursesForStudent', []))
    );
  }

  // Obtenir les devoirs pour un cours
  getAssignmentsForCourse(courseId: number): Observable<AssignementsDTO[]> {
    return this.http.get<AssignementsDTO[]>(`${this.assignement}/${courseId}`).pipe(
      catchError(this.handleError('getAssignmentsForCourse', []))
    );
  }

  // Obtenir les notes pour un devoir
  getGradesForAssignment(assignmentId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.gradea}/${assignmentId}`).pipe(
      catchError(this.handleError('getGradesForAssignment', []))
    );
  }

  // Obtenir les cours avec devoirs et notes
  getCoursesWithAssignmentsAndGrades(studentId: number): Observable<Course[]> {
    return this.getCoursesForStudent(studentId).pipe(
      switchMap(courses => {
        // Pour chaque cours, obtenir les devoirs et les notes
        const courseRequests = courses.map(course =>
          this.getAssignmentsForCourse(course.id!).pipe(
            switchMap(assignments => {
              const assignmentRequests = assignments.map(assignment =>
                this.getGradesForAssignment(assignment.id).pipe(
                  map(grades => ({ ...assignment, grades }))
                )
              );
              return forkJoin(assignmentRequests).pipe(
                map(assignmentsWithGrades => ({
                  ...course,
                  assignments: assignmentsWithGrades
                }))
              );
            })
          )
        );
        return forkJoin(courseRequests);
      }),
      catchError(this.handleError('getCoursesWithAssignmentsAndGrades', []))
    );
  }

  // Gestion des erreurs
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
