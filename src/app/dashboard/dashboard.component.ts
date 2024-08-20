import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { CourseService } from '../services/course.service';
import { UserService } from '../user.service';
import { AuthenticationService } from '../authentication.service';
import { Course } from '../Models/courseModel';
import { User, UserCours } from '../Models/User';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userRole: string | null = ''; 
  userName: string | null = ''; 
  courses: Course[] = []; 
  unenrolledCourses: Course[] = []; 
  errorMessage: string = '';
  allCoursesWithEnrollments: any[] = []; 
  selectedCourseIdForAssignments: number | null = null;
  userId: number | null = null;
  usersWithCourses: UserCours[] = []; // Ajout de la propriété

  constructor(
    private router: Router, 
    private dashboardService: DashboardService, 
    private courseService: CourseService,
    private userService: UserService, 
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user: User | null) => {
        if (user) {
          this.userId = user.id; 
          this.userRole = user.role; 
          this.userName = `${user.nom} ${user.prenom}`; 
          this.loadCourses(); 

          if (user.role === 'Admin') {
            this.getUsersWithCourses();
          }
        } else {
          this.errorMessage = 'Utilisateur non connecté.';
          console.error('Utilisateur non connecté');
        }
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des informations de l\'utilisateur.';
        console.error(error);
      }
    });
  }

  loadCourses(): void {
    if (this.userId && this.userRole) {
      if (this.userRole === 'Professeur') {
        this.getTeachingCourses(this.userId);
      } else if (this.userRole === 'Etudiant') {
        this.getUnenrolledCourses(this.userId);
        this.getEnrolledCourses(this.userId);
      }
    }
  }

  getEnrolledCourses(userId: number): void {
    this.dashboardService.getEnrolledCourses(userId).pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors de la récupération des cours inscrits.';
        console.error(error);
        return of([]);
      })
    ).subscribe(data => this.courses = data);
  }

  getTeachingCourses(userId: number): void {
    this.dashboardService.getCoursesByTeacher(userId).pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors de la récupération des cours enseignés.';
        console.error(error);
        return of([]);
      })
    ).subscribe(data => this.courses = data);
  }

  getAllCoursesWithEnrollments(): void {
    this.dashboardService.getAllCourses().pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors de la récupération de tous les cours et des inscriptions.';
        console.error(error);
        return of([]);
      })
    ).subscribe(data => this.allCoursesWithEnrollments = data);
  }

  getUnenrolledCourses(studentId: number): void {
    this.courseService.getUnenrolledCourses(studentId).pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors de la récupération des cours non inscrits.';
        console.error(error);
        return of([]);
      })
    ).subscribe(data => this.unenrolledCourses = data);
  }

  getUsersWithCourses(): void {
    this.dashboardService.getStudents().pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors de la récupération des utilisateurs avec leurs cours.';
        console.error(error);
        return of([]);
      })
    ).subscribe(data => this.usersWithCourses = data);
  }

  editUser(): void {
    if (this.userId) {
      // Naviguer vers le composant de mise à jour avec l'ID de l'utilisateur
      this.router.navigate(['/update-user', this.userId]);
    } else {
      console.error('User ID is not available.');
    }
  }

  showAssignments(courseId: number, userid:number): void {
    this.router.navigate(['/assignments-student'], { queryParams: { courseId, userId: this.userId } });
  }
}
