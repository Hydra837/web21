import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { Course } from '../Models/courseModel';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-enrolledcourse',
  templateUrl: './enrolledcourse.component.html',
  styleUrls: ['./enrolledcourse.component.css']
})
export class EnrolledcourseComponent implements OnInit {
  @Input() userId: number | undefined;
  courses: Course[] = [];
  errorMessage: string = '';

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit(): void {
    if (this.userId !== undefined) {
      this.getEnrolledCourses(this.userId);
    } else {
      this.errorMessage = 'Aucun ID utilisateur fourni.';
    }
  }

  getEnrolledCourses(userId: number): void {
    this.dashboardService.getEnrolledCourses(userId).pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors de la récupération des cours inscrits.';
        console.error(error);
        return of([]);
      })
    ).subscribe(data => {
      this.courses = data;
    });
  }

  goToAssignements(courseId: number): void {
    if (this.userId !== undefined) {
      // Navigue vers le composant AssignementStudentComponent avec l'ID utilisateur et l'ID du cours
      this.router.navigate(['/assignement-student', this.userId, courseId]);
    } else {
      this.errorMessage = 'Aucun ID utilisateur disponible pour naviguer.';
    }
  }
}
