import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Course } from '../Models/courseModel';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userRole: string = 'Etudiant';
  userName: string = 'Jon Jon'; 
  courses: Course[] = []; 
  unenrolledCourses: Course[] = []; // Cours non inscrits pour les étudiants
  errorMessage: string = '';
  allCoursesWithEnrollments: any[] = []; // Pour les admins

  constructor(private dashboardService: DashboardService, private CourseService: CourseService) {}

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user || !user.id) {
      user = { id: 1, role: 'Etudiant', name: 'John Doe' };
      localStorage.setItem('user', JSON.stringify(user));
    }

    this.userRole = user.role;
    //this.userName = user.name;
    this.userName = 'Jon Jon'

    this.loadCourses(user.id);
  }

  loadCourses(userId: number): void {
    if (this.userRole === 'Etudiant') {
      this.getEnrolledCourses(userId);
    //  this.getUnenrolledCourses(userId); // Charger les cours non inscrits
    } else if (this.userRole === 'Professeur') {
      this.getTeachingCourses(userId);
    } else if (this.userRole === 'Admin') {
      this.getAllCoursesWithEnrollments();
    } else {
      this.errorMessage = 'Rôle inconnu.';
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
    this.CourseService.getUnenrolledCourses (studentId).pipe(
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
}
