import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GradeDTO, Grade } from './Models/GradeModel';
import { mapToGrade } from './Outils/mapper';
import { mapToGradeDTO } from './Outils/mapper';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = `https://localhost:7233/api/Grade`;

  constructor(private http: HttpClient) { }

  // Obtenir toutes les notes pour un assignement spécifique
  getGradesByAssignment(assignementsId: number): Observable<Grade[]> {
    return this.http.get<GradeDTO[]>(`${this.apiUrl}/assignments/${assignementsId}`).pipe(
      map(grades => grades.map(mapToGrade)) // Utilisation du mapper
    );
  }

  // Obtenir une note spécifique basée sur l'ID utilisateur et l'ID d'assignement
  getGradeByUserId(userId: number, assignementsId: number): Observable<Grade> {
    return this.http.get<GradeDTO>(`${this.apiUrl}/user/${userId}/assignments/${assignementsId}`).pipe(
      map(mapToGrade) // Utilisation du mapper
    );
  }

  // Ajouter une note (Assurez-vous de convertir en DTO avant d'envoyer)
  addGrade(grade: Grade): Observable<Grade> {
    const gradeDTO: GradeDTO = mapToGradeDTO(grade);
    return this.http.post<GradeDTO>(this.apiUrl, gradeDTO).pipe(
      map(mapToGrade) // Convertir la réponse en modèle Grade
    );
  }

  // Mettre à jour une note
  updateGrade(id: number, grade: Grade): Observable<Grade> {
    const gradeDTO: GradeDTO = mapToGradeDTO(grade);
    return this.http.put<GradeDTO>(`${this.apiUrl}/${id}`, gradeDTO).pipe(
      map(mapToGrade) // Convertir la réponse en modèle Grade
    );
  }

  // Supprimer une note
  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtenir toutes les notes pour un cours spécifique
  getGradesByCourse(courseId: number): Observable<Grade[]> {
    return this.http.get<GradeDTO[]>(`${this.apiUrl}/courses/${courseId}`).pipe(
      map(grades => grades.map(mapToGrade)) // Utilisation du mapper
    );
  }

  getGradesByUserAndCourse(userId: number, courseId: number): Observable<Grade[]> {
    return this.http.get<GradeDTO[]>(`${this.apiUrl}/user/${userId}/course/${courseId}`).pipe(
      map(grades => grades.map(mapToGrade)) // Utilisation du mapper
    );
  }
}
