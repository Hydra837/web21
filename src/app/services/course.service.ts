import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  private getCoursesByTeacherUrl = `/Cours/${this.apiUrl}/professeur`;
  private getteacher ='https://localhost:7233/api/Cours/cours/professeur'
  private apiCoursesForUsers = 'https://localhost:7233/api/UsersContoller/GetAllCourseEachCourse';
  private createCourseUrl = 'https://localhost:7233/api/Cours/Cours'; // Utilise l'URL de base pour la création
  private availableCoursesUrl = `${this.apiUrl}/available`;
  private apiUpdate = `${this.apiUrl}/update`; // Correction de l'URL
  private getUnenrolledCoursesUrl = `${this.apiUrl}/UnenrolledCourses`; // Correction de l'URL

  constructor(private http: HttpClient, private userService: UserService) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/GetAll`).pipe(
      map(data => data.map(item => this.mapToCourseModel(item))),
      catchError(this.handleError('getCourses', []))
    );
  }

  createCourse(course: Course): Observable<any> {
    return this.http.post(this.createCourseUrl, course)
    .pipe(
      catchError(this.handleError('createCourse'))
    );
  }

  updateCourse(id: number, course: Course): Observable<any> {
    return this.http.put(`${this.apiUpdate}/${id}`, course, { observe: 'response', responseType: 'text' }).pipe(
      map(response => {
        try {
          // Si la réponse est au format JSON, on la parse, sinon on retourne la réponse brute
          return JSON.parse(response.body || '{}');
        } catch (e) {
          return response.body || '';
        }
      }),
      catchError(this.handleError('updateCourse'))
    );
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { observe: 'response' }).pipe(
      map(response => response.body),
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
    
    return this.http.get<Course[]>(`${this.apiUrl}/search`, { params: { search: term } }).pipe(
      map(data => data.map(item => this.mapToCourseModel(item))),
      catchError(this.handleError('searchCourses', []))
    );
  }

  getCoursesByTeacher(teacherId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.getteacher}/${teacherId}`).pipe(
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
    return (error: HttpErrorResponse): Observable<any> => {
      let errorMessage = 'Une erreur est survenue.';

      if (error.error instanceof ErrorEvent) {
        // Erreur côté client
        errorMessage = `Erreur: ${error.error.message}`;
      } else {
        // Erreur côté serveur
        switch (error.status) {
          case 400:
            errorMessage = error.error?.Message || 'Requête invalide. Vérifiez les données envoyées.';
            break;
          case 401:
            errorMessage = error.error?.Message || 'Non autorisé. Veuillez vérifier vos informations d\'identification.';
            break;
          case 404:
            errorMessage = error.error?.Message || 'Cours introuvable.';
            break;
          case 409:
            errorMessage = error.error?.Message || 'Conflit de données: Une entrée similaire existe déjà.';
            break;
          case 500:
            errorMessage = error.error?.Message || `Erreur serveur: ${error.message}`;
            break;
          default:
            errorMessage = `Erreur inconnue: ${error.message}`;
            break;
        }
      }

      console.error(`${operation} a échoué: ${errorMessage}`);
      return throwError(() => new Error(`${operation} a échoué: ${errorMessage}`));
    };
  }
}
