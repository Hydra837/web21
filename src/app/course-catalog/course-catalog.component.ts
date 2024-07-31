import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { StudentEnrollmentService } from '../services/student-enrollement.service';
import { Course } from '../Models/courseModel';

@Component({
  selector: 'app-course-catalog',
  templateUrl: './course-catalog.component.html',
  styleUrls: ['./course-catalog.component.css']
})
export class CourseCatalogComponent implements OnInit {
  courses: Course[] = [];
  errorMessage: string = '';
  userId: number = 1; // This should be dynamically obtained in a real scenario

  constructor(
    private courseService: CourseService,
    private enrollmentService: StudentEnrollmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCourses();
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

  enroll(courseId: number | undefined): void {
    if (courseId !== undefined) {
      this.enrollmentService.enrollStudentCourse(courseId, this.userId).subscribe({
        next: () => {
          alert('Inscription réussie !');
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
      this.router.navigate(['/course-detail', courseId.toString()]); // Convertir l'ID en chaîne de caractères
    } else {
      console.error('Course ID is undefined');
      this.errorMessage = 'L\'ID du cours est indéfini.';
    }
  }
}
