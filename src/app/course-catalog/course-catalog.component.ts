import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { StudentEnrollmentService } from '../services/student-enrollement.service';
import { AuthenticationService } from '../authentication.service';
import { Course } from '../Models/courseModel';
import { User } from '../Models/User';

@Component({
  selector: 'app-course-catalog',
  templateUrl: './course-catalog.component.html',
  styleUrls: ['./course-catalog.component.css']
})
export class CourseCatalogComponent implements OnInit {
  courses: Course[] = [];
  unenrolledCourses: Course[] = [];
  errorMessage: string = '';
  userId: number | null = 0;
  user!: User;
  userRole: string | null = null; // Store the user's role
  isStudent: boolean = false; // Flag to determine if the user is a student

  constructor(
    private courseService: CourseService,
    private enrollmentService: StudentEnrollmentService,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loadUserId(); // Load user ID and role
    this.loadCourses();
  }

  loadUserId(): void {
    this.userId = this.authService.getUserId(); // Get the user ID
    this.userRole = this.authService.getUserRole(); // Get the user role
    this.isStudent = this.userRole === 'Etudiant'; // Check if the user has the "Student" role
  }

  loadCourses(): void {
    this.courseService.getAvailableCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des cours.';
        console.error('Erreur lors du chargement des cours:', error);
      },
      complete: () => {
        console.log('Chargement des cours terminé');
      }
    });
  }

  loadUnenrolledCourses(): void {
    this.courseService.getUnenrolledCourses(this.userId!).subscribe({
      next: (data) => {
        this.unenrolledCourses = data;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des cours non inscrits.';
        console.error('Erreur lors du chargement des cours non inscrits:', error);
      },
      complete: () => {
        console.log('Chargement des cours non inscrits terminé');
      }
    });
  }

  enroll(courseId: number | undefined): void {
    if (courseId !== undefined) {
      this.enrollmentService.enrollStudentCourse(courseId, this.userId!).subscribe({
        next: () => {
          alert('Inscription réussie !');
          this.loadUnenrolledCourses(); // Reload unenrolled courses after successful enrollment
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de l\'inscription au cours.';
          console.error('Erreur lors de l\'inscription au cours:', error);
        }
      });
    } else {
      console.error('Course ID is undefined');
      this.errorMessage = 'L\'ID du cours est indéfini.';
    }
  }

  viewCourseDetail(courseId: number | undefined): void {
    if (courseId !== undefined) {
      this.router.navigate(['/course-detail', courseId.toString()]);
    } else {
      console.error('Course ID is undefined');
      this.errorMessage = 'L\'ID du cours est indéfini.';
    }
  }
}
