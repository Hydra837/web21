import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GradeDTO, Grade } from './Models/GradeModel';
import { mapToGrade, mapToGradeDTO } from './Outils/mapper';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = 'https://localhost:7233/api/Grade';

  constructor(private http: HttpClient) { }

  // Obtenir toutes les notes pour un assignement spécifique
  getGradesByAssignment(assignmentsId: number): Observable<Grade[]> {
    return this.http.get<GradeDTO[]>(`${this.apiUrl}/assignments/${assignmentsId}`).pipe(
      map(grades => grades.map(mapToGrade)), // Utilisation du mapper
      catchError(this.handleError<Grade[]>('getGradesByAssignment', []))
    );
  }

  // Obtenir une note spécifique basée sur l'ID utilisateur et l'ID d'assignement
  getGradeByUserId(userId: number, assignmentsId: number): Observable<Grade> {
    return this.http.get<GradeDTO>(`${this.apiUrl}/user/${userId}/assignments/${assignmentsId}`).pipe(
      map(mapToGrade), // Utilisation du mapper
      catchError(this.handleError<Grade>('getGradeByUserId'))
    );
  }

  // Ajouter une note (Assurez-vous de convertir en DTO avant d'envoyer)
  addGrade(grade: Grade): Observable<Grade> {
    const gradeDTO: GradeDTO = mapToGradeDTO(grade);
    return this.http.post<GradeDTO>(this.apiUrl, gradeDTO).pipe(
      map(mapToGrade), // Convertir la réponse en modèle Grade
      catchError(this.handleError<Grade>('addGrade'))
    );
  }

  // Mettre à jour une note
  updateGrade(id: number, grade: Grade): Observable<Grade> {
    const gradeDTO: GradeDTO = mapToGradeDTO(grade);
    return this.http.put<GradeDTO>(`${this.apiUrl}/${id}`, gradeDTO).pipe(
      map(mapToGrade), // Convertir la réponse en modèle Grade
      catchError(this.handleError<Grade>('updateGrade'))
    );
  }

  // Supprimer une note
  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<void>('deleteGrade'))
    );
  }

  // Obtenir toutes les notes pour un cours spécifique
  getGradesByCourse(courseId: number): Observable<Grade[]> {
    return this.http.get<GradeDTO[]>(`${this.apiUrl}/courses/${courseId}`).pipe(
      map(grades => grades.map(mapToGrade)), // Utilisation du mapper
      catchError(this.handleError<Grade[]>('getGradesByCourse', []))
    );
  }

  // Obtenir toutes les notes d'un utilisateur pour un cours spécifique
  getGradesByUserAndCourse(userId: number, courseId: number): Observable<Grade[]> {
    return this.http.get<GradeDTO[]>(`${this.apiUrl}/user/${userId}/course/${courseId}`).pipe(
      map(grades => grades.map(mapToGrade)), // Utilisation du mapper
      catchError(this.handleError<Grade[]>('getGradesByUserAndCourse', []))
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
