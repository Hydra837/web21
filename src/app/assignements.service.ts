import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssignementsDTO, AssignementsFORM } from '../app/Models/assignementsModel';
import { mapToAssignement, mapToAssignementFORM, mapToGradeDTO } from './Outils/mapper';

@Injectable({
  providedIn: 'root'
})
export class AssignementsService {
  private baseUrl: string = 'https://localhost:7233/api/Assignements';

  constructor(private http: HttpClient) { }

  // Get all assignments
  getAll(): Observable<AssignementsDTO[]> {
    return this.http.get<AssignementsDTO[]>(`${this.baseUrl}`).pipe(
      map(assignments => assignments.map(mapToAssignement)) // Utilisation du mapper
    );
  }

  // Get assignment by ID
  getById(id: number): Observable<AssignementsDTO> {
    return this.http.get<AssignementsDTO>(`${this.baseUrl}/${id}`).pipe(
      map(mapToAssignement) // Utilisation du mapper
    );
  }

  // Get assignments by course ID
  getByCourse(courseId: number): Observable<AssignementsDTO[]> {
    return this.http.get<AssignementsDTO[]>(`${this.baseUrl}/by-course/${courseId}`).pipe(
      map(assignments => assignments.map(mapToAssignement)) // Utilisation du mapper
    );
  }

  // Get assignments by user ID
  getByUser(userId: number): Observable<AssignementsDTO[]> {
    return this.http.get<AssignementsDTO[]>(`${this.baseUrl}/by-user/${userId}`).pipe(
      map(assignments => assignments.map(mapToAssignement)) // Utilisation du mapper
    );
  }

  // Get assignments by teacher ID
  getByTeacher(teacherId: number): Observable<AssignementsDTO[]> {
    return this.http.get<AssignementsDTO[]>(`${this.baseUrl}/by-teacher/${teacherId}`).pipe(
      map(assignments => assignments.map(mapToAssignement)) // Utilisation du mapper
    );
  }

  // Create a new assignment
  // Create a new assignment
create(assignement: AssignementsFORM): Observable<AssignementsFORM> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  return this.http.post<AssignementsFORM>(`${this.baseUrl}`, assignement, { headers }).pipe(
    map(mapToAssignementFORM) // Utilisation du mapper pour transformer la réponse
  );
}



  // Update an existing assignment
  update(id: number, assignement: AssignementsDTO): Observable<void> {
    const assignementDTO: AssignementsDTO = mapToAssignement(assignement);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<void>(`${this.baseUrl}/${id}`, assignementDTO, { headers });
  }

  // Delete an assignment
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
