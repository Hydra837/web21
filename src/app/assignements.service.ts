// src/app/services/assignements.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssignementsDTO, AssignementsFORM } from '../app/Models/assignementsModel';

@Injectable({
  providedIn: 'root'
})
export class AssignementsService {
  private baseUrl: string = 'https://localhost:7233/api/Assignements';

  constructor(private http: HttpClient) { }

  // Get all assignments
  getAll(): Observable<AssignementsDTO[]> {
    return this.http.get<AssignementsDTO[]>(`${this.baseUrl}`);
  }

  // Get assignment by ID
  getById(id: number): Observable<AssignementsDTO> {
    return this.http.get<AssignementsDTO>(`${this.baseUrl}/${id}`);
  }

  // Get assignments by course ID
  getByCourse(courseId: number): Observable<AssignementsDTO[]> {
    return this.http.get<AssignementsDTO[]>(`${this.baseUrl}/by-course/${courseId}`);
  }

  // Get assignments by user ID
  getByUser(userId: number): Observable<AssignementsDTO[]> {
    return this.http.get<AssignementsDTO[]>(`${this.baseUrl}/by-user/${userId}`);
  }

  // Get assignments by teacher ID
  getByTeacher(teacherId: number): Observable<AssignementsDTO[]> {
    return this.http.get<AssignementsDTO[]>(`${this.baseUrl}/by-teacher/${teacherId}`);
  }

  // Create a new assignment
  create(assignement: AssignementsDTO): Observable<AssignementsDTO> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AssignementsDTO>(`${this.baseUrl}`, assignement, { headers });
  }

  // Update an existing assignment
  update(id: number, assignement: AssignementsDTO): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<void>(`${this.baseUrl}/${id}`, assignement, { headers });
  }

  // Delete an assignment
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
