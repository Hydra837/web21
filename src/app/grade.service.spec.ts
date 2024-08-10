import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GradeDTO } from './Models/GradeModel';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = `https://localhost:7233/api/Grade`; // Assurez-vous que l'URL de l'API est correcte

  constructor(private http: HttpClient) { }

  // Obtenir toutes les notes pour un assignement spécifique
  getGradesByAssignment(assignementsId: number): Observable<GradeDTO[]> {
    return this.http.get<GradeDTO[]>(`${this.apiUrl}/assignments/${assignementsId}`);
  }

  // Obtenir une note spécifique basée sur l'ID utilisateur et l'ID d'assignement
  getGradeByUserId(userId: number, assignementsId: number): Observable<GradeDTO> {
    return this.http.get<GradeDTO>(`${this.apiUrl}/user/${userId}/assignments/${assignementsId}`);
  }

  // Ajouter une note
  addGrade(grade: GradeDTO): Observable<GradeDTO> {
    return this.http.post<GradeDTO>(this.apiUrl, grade);
  }

  // Mettre à jour une note
  updateGrade(id: number, grade: GradeDTO): Observable<GradeDTO> {
    return this.http.put<GradeDTO>(`${this.apiUrl}/${id}`, grade);
  }

  // Supprimer une note
  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
