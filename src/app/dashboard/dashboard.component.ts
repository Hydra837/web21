import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { CourseService } from '../services/course.service';
import { UserService } from '../user.service';
import { AuthenticationService } from '../authentication.service';
import { StudentManagementService } from '../student-management.service';
import { Course } from '../Models/courseModel';
import { User, UserCours } from '../Models/User';
import { catchError, of } from 'rxjs';
import { UserAssignment } from '../Models/UserAssignement';

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
  usersWithCourses: UserCours[] = []; 
  grades: UserAssignment [] = []; // To hold the grades for a student

  constructor(
    private router: Router, 
    private dashboardService: DashboardService, 
    private courseService: CourseService,
    private userService: UserService, 
    private authService: AuthenticationService,
    private studentManagement: StudentManagementService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors de la récupération des informations de l\'utilisateur.';
        console.error(error);
        return of(null);
      })
    ).subscribe(user => {
      if (user) {
        this.userId = user.id; 
        this.userRole = user.role; 
        this.userName = `${user.nom} ${user.prenom}`; 
        this.loadUserSpecificData();
      } else {
        this.errorMessage = 'Utilisateur non connecté.';
        console.error('Utilisateur non connecté');
      }
    });
  }

  loadUserSpecificData(): void {
    if (this.userRole === 'Professeur') {
      this.getTeachingCourses(this.userId!);
    } else if (this.userRole === 'Etudiant') {
      this.getUnenrolledCourses(this.userId!);
      this.getEnrolledCourses(this.userId!);
      this.getGrades(this.userId!);

    } else if (this.userRole === 'Admin') {
      this.getUsersWithCourses();
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

  getGrades(userId: number): void {
    this.studentManagement.getUserAssignments(userId).pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors de la récupération des notes.';
        console.error(error);
        return of([]);
      })
    ).subscribe(data => this.grades = data);
  }

  editUser(): void {
    if (this.userId) {
      this.router.navigate(['/update-user', this.userId]);
    } else {
      console.error('Utilisateur introuvable.');
    }
  }

  showAssignments(courseId: number, userId: number): void {
    this.router.navigate(['/assignments-student'], { queryParams: { courseId, userId } });
  }

  viewAllGrades(userId: number): void {
    this.router.navigate(['/all-grade', userId]);
  }
}
