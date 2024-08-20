import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Course } from '../Models/courseModel';
import { GetAllCoursForEachUsers } from '../Models/GetAllCoursForEachUsers';
import { UserService } from '../user.service'; // Assurez-vous d'importer le UserService

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'https://localhost:7233/api/Cours'; 
  private getCoursesByTeacherUrl = `${this.apiUrl}/Cours/cours/professeur`;
  private apiCoursesForUsers = 'https://localhost:7233/api/UsersContoller/GetAllCourseEachCourse';
  private createCourseUrl = `${this.apiUrl}/Cours`;
  private availableCoursesUrl = `${this.apiUrl}/available`;
  private enrollCourseUrl = 'https://localhost:7233/api/StudentEnrollment/Insert?studentId=1&courseId={{{id}}}';
  private apiUpdate = 'https://localhost:7233/api/Cours/update';
  private getUnenrolledCoursesUrl = 'https://localhost:7233/api/Cours/UnenrolledCourses'; // Nouvelle URL

  constructor(private http: HttpClient, private userService: UserService) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/GetAll`).pipe(
      map(data => data.map(item => this.mapToCourseModel(item))),
      catchError(this.handleError('getCourses', []))
    );
  }

  createCourse(course: Course): Observable<any> {
    return this.http.post(this.createCourseUrl, course).pipe(
      catchError(this.handleError('createCourse'))
    );
  }

  updateCourse(id: string, course: Course): Observable<any> {
    return this.http.put(`${this.apiUpdate}/${id}`, course).pipe(
      catchError(this.handleError('updateCourse'))
    );
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError('deleteCourse'))
    );
  }

  getAvailableCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.availableCoursesUrl).pipe(
      map(data => data.map(item => this.mapToCourseModel(item))),
      catchError(this.handleError('getAvailableCourses', []))
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      map(data => this.mapToCourseModel(data)),
      catchError(this.handleError('getCourseById'))
    );
  }

  getAllCoursesForEachUsers(): Observable<GetAllCoursForEachUsers[]> {
    return this.http.get<GetAllCoursForEachUsers[]>(this.apiCoursesForUsers).pipe(
      map(response => response.map(data => this.mapToGetAllCoursForEachUsers(data))),
      catchError(this.handleError('getAllCoursesForEachUsers', []))
    );
  }

  getUnenrolledCourses(studentId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.getUnenrolledCoursesUrl}/${studentId}`).pipe(
      map(data => data.map(item => this.mapToCourseModel(item))),
      catchError(this.handleError('getUnenrolledCourses', []))
    );
  }

  searchCourses(term: string): Observable<Course[]> {
    if (!term.trim()) {
      return of([]);
    }
    
    return this.http.get<Course[]>(`${this.apiUrl}/search?search=${term}`).pipe(
      map(data => data.map(item => this.mapToCourseModel(item))),
      catchError(this.handleError('searchCourses', []))
    );
  }

  getCoursesByTeacher(teacherId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.getCoursesByTeacherUrl}/${teacherId}`).pipe(
      catchError(this.handleError('getCoursesByTeacher', []))
    );
  }

  
  getTeacherName(courseId: number): Observable<string> {
    return this.http.get<Course>(`${this.apiUrl}/${courseId}`).pipe(
      map(course => course.professeurId), // Récupère l'ID du professeur
      switchMap(professeurId => this.userService.getUserById(professeurId)), // Utilise l'ID pour obtenir les détails du professeur
      map(user => `${user.nom} ${user.prenom}`), // Concatène le nom et le prénom du professeur
      catchError(error => {
        console.error('Erreur lors de la récupération du nom du professeur', error);
        return throwError(() => new Error('Erreur lors de la récupération du nom du professeur'));
      })
    );
  }

 
  private mapToCourseModel(item: any): Course {
    return {
      id: item.id,
      Nom: item.nom,
      description: item.description,
      dateDebut: new Date(item.dateDebut),
      dateFin: new Date(item.dateFin),
      available: item.available, 
      professeurId: item.professeurId
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


  private handleError(operation: string, result?: any) {
    return (error: any): Observable<any> => {
      let errorMessage = 'Une erreur est survenue.';

      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide. Vérifiez les données envoyées.';
          break;
        case 401:
          errorMessage = 'Non autorisé. Veuillez vérifier vos informations d\'identification.';
          break;
        case 404:
          errorMessage = 'Compte Introuvable.';
          break;
        case 500:
          errorMessage = `Erreur serveur: ${error.error?.Message || error.message}`;
          break;
        default:
          errorMessage = `Erreur inconnue: ${error.message}`;
          break;
      }

      console.error(`${operation} a échoué: ${errorMessage}`);
      return throwError(() => new Error(`${operation} a échoué: ${errorMessage}`));
    };
  }
}
