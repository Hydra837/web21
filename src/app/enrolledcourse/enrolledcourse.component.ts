import { Component, Input, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { DashboardService } from '../dashboard.service';
import { UserService } from '../user.service';
import { Course } from '../Models/courseModel';
import { User } from '../Models/User';
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
  isTeacher: boolean = false; // Indicates if the user is a teacher

  constructor(
    private dashboardService: DashboardService,
    private courseService: CourseService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
 
    
  }

  // checkUserRole(userId: number): void {
  //   this.userService.getUserById(userId).pipe(
  //     catchError(error => {
  //       this.errorMessage = 'Erreur lors de la récupération des informations de l\'utilisateur.';
  //       console.error(error);
  //       return of({ role: '' } as User); // Return a default user with an empty role
  //     })
  //   ).subscribe(user => {
  //     this.isTeacher = user.role === 'Professeur'; 
  //     this.getCourses();
  //   });
  // }

  getCourses(): void {
    if (this.userId !== undefined) {
      if (this.isTeacher) {
        this.courseService.getCoursesByTeacher(this.userId).pipe(
          catchError(error => {
            this.errorMessage = 'Erreur lors de la récupération des cours du professeur.';
            console.error(error);
            return of([]); // Return an empty array on error
          })
        ).subscribe(data => {
          this.courses = data;
        });
      } else {
        this.dashboardService.getEnrolledCourses(this.userId).pipe(
          catchError(error => {
            this.errorMessage = 'Erreur lors de la récupération des cours inscrits.';
            console.error(error);
            return of([]); // Return an empty array on error
          })
        ).subscribe(data => {
          this.courses = data;
        });
      }
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
