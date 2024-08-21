import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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

  // Méthode pour obtenir les en-têtes HTTP
  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN' // Remplacez YOUR_TOKEN par le jeton réel si nécessaire
    });
  }

  getGradesByAssignment(assignmentsId: number): Observable<Grade[]> {
    return this.http.get<GradeDTO[]>(`${this.apiUrl}/assignments/${assignmentsId}`, { headers: this.getHttpHeaders() }).pipe(
      map(grades => grades.map(mapToGrade)), // Utilisation du mapper
      catchError(this.handleError<Grade[]>('getGradesByAssignment', []))
    );
  }

  getGradeByUserId(userId: number, assignmentsId: number): Observable<Grade> {
    return this.http.get<GradeDTO>(`${this.apiUrl}/user/${userId}/assignments/${assignmentsId}`, { headers: this.getHttpHeaders() }).pipe(
      map(mapToGrade), // Utilisation du mapper
      catchError(this.handleError<Grade>('getGradeByUserId'))
    );
  }

  addGrade(grade: Grade): Observable<Grade> {
    const gradeDTO: GradeDTO = mapToGradeDTO(grade);
    return this.http.post<GradeDTO>(this.apiUrl, gradeDTO, { headers: this.getHttpHeaders() }).pipe(
      map(mapToGrade), // Convertir la réponse en modèle Grade
      catchError(this.handleError<Grade>('addGrade'))
    );
  }

  updateGrade(id: number, grade: Grade): Observable<Grade> {
    const gradeDTO: GradeDTO = mapToGradeDTO(grade);
    return this.http.put<GradeDTO>(`${this.apiUrl}/upgrade/${id}`, gradeDTO, { headers: this.getHttpHeaders() }).pipe(
      map(mapToGrade), // Convertir la réponse en modèle Grade
      catchError(this.handleError<Grade>('updateGrade'))
    );
  }

  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHttpHeaders() }).pipe(
      catchError(this.handleError<void>('deleteGrade'))
    );
  }

  getGradesByCourse(courseId: number): Observable<Grade[]> {
    return this.http.get<GradeDTO[]>(`${this.apiUrl}/courses/${courseId}`, { headers: this.getHttpHeaders() }).pipe(
      map(grades => grades.map(mapToGrade)), // Utilisation du mapper
      catchError(this.handleError<Grade[]>('getGradesByCourse', []))
    );
  }

  getGradesByUserAndCourse(userId: number, courseId: number): Observable<Grade[]> {
    return this.http.get<GradeDTO[]>(`${this.apiUrl}/user/${userId}/course/${courseId}`, { headers: this.getHttpHeaders() }).pipe(
      map(grades => grades.map(mapToGrade)), // Utilisation du mapper
      catchError(this.handleError<Grade[]>('getGradesByUserAndCourse', []))
    );
  }

  // Gestion des erreurs
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      let errorMessage = 'Une erreur est survenue.';

      // Gestion des erreurs spécifiques
      if (error.status === 400) {
        errorMessage = 'Requête invalide. Vérifiez les données envoyées.';
      } else if (error.status === 404) {
        errorMessage = 'Aucun grade à afficher.';
      } else if (error.status === 409) {
        errorMessage = 'L étudiant possède déjà une note.';
      } else if (error.status === 500) {
        errorMessage = `Erreur serveur: ${error.error?.Message || error.message}`;
      }

      console.error(`${operation} échoué: ${errorMessage}`);
      return of(result as T);
    };
  }
}
