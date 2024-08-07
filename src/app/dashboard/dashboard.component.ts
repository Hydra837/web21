import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Course } from '../Models/courseModel'; // Assurez-vous d'avoir un modèle Course
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userRole: string = '';
  userName: string = ''; // Ajouter cette propriété pour afficher le nom de l'utilisateur
  courses: Course[] = []; // Utilisez le type Course si vous avez un modèle Course
  errorMessage: string = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user) {
      // Default user for testing purposes
      user = { id: 1, role: 'Etudiant', name: 'John Doe' }; // Ajoutez un nom par défaut pour tester
      localStorage.setItem('user', JSON.stringify(user));
    }

    this.userRole = user.role;
    this.userName = user.name; // Récupérez le nom de l'utilisateur

    this.loadCourses(user.id);
  }

  loadCourses(userId: number): void {
    if (this.userRole === 'Etudiant') {
      this.getEnrolledCourses(userId);
    } else if (this.userRole === 'Professeur') {
      this.getTeachingCourses(userId);
    } else if (this.userRole === 'Admin') {
      this.getAllCourses();
    } else {
      this.errorMessage = 'Role inconnu.';
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

  getAllCourses(): void {
    this.dashboardService.getAllCourses().pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors de la récupération de tous les cours.';
        console.error(error);
        return of([]);
      })
    ).subscribe(data => this.courses = data);
  }

  editUser(): void {
    console.log('Edit user functionality goes here');
  }
}
