import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grade } from '../app/Models/GradeModel';
//import { GradeDTO } from '';
import { map } from 'rxjs/operators';
import { mapToGradeModel, mapToGradeDTO } from '../app/Outils/mapper'; // Import the new mapping functions

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = 'https://localhost:7233/api/grades'; // Adjust the URL to match your API

  constructor(private http: HttpClient) { }

  // Get all grades
  getAllGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.apiUrl).pipe(
      map(dtoList => dtoList.map(dto => mapToGradeModel(dto))) // Use the mapper function
    );
  }

  // Get a single grade by ID
  getGradeById(id: number): Observable<Grade> {
    return this.http.get<Grade>(`${this.apiUrl}/${id}`).pipe(
      map(dto => mapToGradeModel(dto)) // Use the mapper function
    );
  }

  // Create a new grade
  createGrade(grade: Grade): Observable<Grade> {
    const dto = mapToGradeDTO(grade); // Use the mapper function
    return this.http.post<Grade>(this.apiUrl, dto).pipe(
      map(createdDto => mapToGradeModel(createdDto)) // Use the mapper function
    );
  }

  // Update an existing grade
  updateGrade(id: number, grade: Grade): Observable<Grade> {
    const dto = mapToGradeDTO(grade); // Use the mapper function
    return this.http.put<Grade>(`${this.apiUrl}/${id}`, dto).pipe(
      map(updatedDto => mapToGradeModel(updatedDto)) // Use the mapper function
    );
  }

  // Delete a grade
  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
