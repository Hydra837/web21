import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Course } from '../Models/courseModel'; // Assurez-vous que le chemin est correct
import { GetAllCoursForEachUsers } from '../Models/GetAllCoursForEachUsers'; // Assurez-vous que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'https://localhost:7233/api/Cours/GetAll'; // Remplacez par l'URL de votre API
  private api1 = 'https://localhost:7233/api/UsersContoller/GetAllCourseEachCourse';
  private create_course = 'https://localhost:7233/api/Cours/Cours';
  private a_cours = 'https://localhost:7233/api/Cours/available';
  private enroll_cours = 'https://localhost:7233/api/StudentEnrollment/Insert?studentId=1&courseId={{{id}}}';
  private courseByIdUrl = 'https://localhost:7233/api/Cours'; // Base URL pour récupérer un cours par ID

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl).pipe(
      map((data: any) => data.map((item: any) => this.mapToCourseModel(item))),
      catchError(this.handleError)
    );
  }

  createCourse(course: Course): Observable<any> {
    return this.http.post(this.create_course, course).pipe(
      catchError(this.handleError)
    );
  }

  updateCourse(id: string, course: Course): Observable<any> {
    const updateUrl = `${this.apiUrl}/${id}`;
    return this.http.put(updateUrl, course).pipe(
      catchError(this.handleError)
    );
  }

  deleteCourse(id: string): Observable<any> {
    const deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete(deleteUrl).pipe(
      catchError(this.handleError)
    );
  }

  getAvailableCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.a_cours).pipe(
      map((data: any) => data.map((item: any) => this.mapToCourseModel(item))),
      catchError(this.handleError)
    );
  }

  getCourseById(id: number): Observable<Course> {
    const url = `https://localhost:7233/api/Cours/${id}`;
    return this.http.get<any>(url).pipe(
      map(data => this.mapToCourseModel(data)),
      catchError(this.handleError)
    );
  }

  getAllCoursesForEachUsers(): Observable<GetAllCoursForEachUsers[]> {
    return this.http.get<any[]>(this.api1).pipe(
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
    const url = `${this.apiUrl}?search=${term}`;
    return this.http.get<any>(url).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return [];
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
