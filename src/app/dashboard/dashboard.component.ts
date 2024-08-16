// dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { DashboardService } from '../dashboard.service';
import { Course } from '../Models/courseModel';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CourseService } from '../services/course.service';
import { UserService } from '../user.service'; // Importation du service utilisateur
import { AuthenticationService } from '../authentication.service';

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
  userId: number | null = null; // Modifié de 0 à null pour correspondre à l'initialisation

  constructor(
    private router: Router, 
    private dashboardService: DashboardService, 
    private courseService: CourseService,
    private userService: UserService, 
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Récupérer les informations de l'utilisateur connecté
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userId = user.id; // Récupérer l'ID de l'utilisateur
        this.userRole = user.role; // Récupérer le rôle de l'utilisateur
        this.userName = `${user.nom} ${user.prenom}`; // Récupérer le nom complet de l'utilisateur
        this.loadCourses(); // Charger les cours après avoir récupéré les informations de l'utilisateur
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des informations de l\'utilisateur.';
        console.error(error);
      }
    });
  }

  loadCourses(): void {
    if (this.userId) {
      if (this.userRole === 'Professeur') {
        this.getTeachingCourses(this.userId);
      } else if (this.userRole === 'Etudiant') {
        this.getUnenrolledCourses(this.userId);
         this.getEnrolledCourses(this.userId);
      }
     
      //this.getAllCoursesWithEnrollments();
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

  editUser(): void {
    console.log('Edit user functionality goes here');
  }

  showAssignments(courseId: number): void {
    this.router.navigate(['/assignments-student'], { queryParams: { courseId, userId: this.userId } });
  }
}
