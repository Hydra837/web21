import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Course } from '../Models/courseModel'; 
import { GetAllCoursForEachUsers } from '../Models/GetAllCoursForEachUsers'; 

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'https://localhost:7233/api/Cours'; 
  private apiCoursesForUsers = 'https://localhost:7233/api/UsersContoller/GetAllCourseEachCourse';
  private createCourseUrl = `${this.apiUrl}/Cours`;
  private availableCoursesUrl = `${this.apiUrl}/available`;
  private enrollCourseUrl = 'https://localhost:7233/api/StudentEnrollment/Insert?studentId=1&courseId={{{id}}}';
  private apiUpdate = 'https://localhost:7233/api/Cours/update'

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/GetAll`).pipe(
      map(data => data.map(item => this.mapToCourseModel(item))),
      catchError(this.handleError)
    );
  }

  createCourse(course: Course): Observable<any> {
    return this.http.post(this.createCourseUrl, course).pipe(
      catchError(this.handleError)
    );
  }

  updateCourse(id: string, course: Course): Observable<any> {
    return this.http.put(`${this.apiUpdate}/${id}`, course).pipe(
      catchError(this.handleError)
    );
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getAvailableCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.availableCoursesUrl).pipe(
      map(data => data.map(item => this.mapToCourseModel(item))),
      catchError(this.handleError)
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      map(data => this.mapToCourseModel(data)),
      catchError(this.handleError)
    );
  }

  getAllCoursesForEachUsers(): Observable<GetAllCoursForEachUsers[]> {
    return this.http.get<GetAllCoursForEachUsers[]>(this.apiCoursesForUsers).pipe(
      map(response => response.map(data => this.mapToGetAllCoursForEachUsers(data))),
      catchError(this.handleError)
    );
  }

  private mapToCourseModel(item: any): Course {
    return {
      id: item.id,
      Nom: item.nom,
      description: item.description,
      dateDebut: new Date(item.dateDebut),
      dateFin: new Date(item.dateFin),
      available: item.available
    };
  }

  private mapToGetAllCoursForEachUsers(item: any): GetAllCoursForEachUsers {
    return {
      userNom: item.userNom,
      userPrenom: item.userPrenom,
      coursNom: item.coursNom,
      disponible: item.disponible,
      profNom: item.profNom,
      profPrenom: item.profPrenom
    };
  }

  searchCourses(term: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?search=${term}`).pipe(
      catchError(error => {
        console.error('Search error:', error);
        return throwError('Search failed; please try again later.');
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
