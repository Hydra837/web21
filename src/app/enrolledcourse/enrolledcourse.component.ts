import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  courses: Course[] = [];
  errorMessage: string = '';
  userId: number | undefined;

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('userId');
      if (userId) {
        this.userId = +userId;
        this.getCourses();
      } else {
        this.errorMessage = 'Aucun ID utilisateur disponible.';
      }
    });
  }

  getCourses(): void {
    if (this.userId !== undefined) {
      this.dashboardService.getEnrolledCourses(this.userId).pipe(
        catchError(error => {
          this.errorMessage = 'Erreur lors de la récupération des cours inscrits.';
          console.error(error);
          return of([]); // Retourner un tableau vide en cas d'erreur
        })
      ).subscribe(data => {
        this.courses = data;
      });
    }
  }

  goToAssignments(courseId: number): void {
    if (this.userId !== undefined) {
      this.router.navigate(['/assignment-student', this.userId, courseId]);
    } else {
      this.errorMessage = 'Aucun ID utilisateur disponible pour naviguer.';
    }
  }
}
