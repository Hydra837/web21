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
  unenrolledCourses: Course[] = []; // Pour stocker les cours non inscrits
  errorMessage: string = '';
  userId: number = 1; // ID de l'utilisateur

  constructor(
    private courseService: CourseService,
    private enrollmentService: StudentEnrollmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
   // this.loadCourses();
    this.loadUnenrolledCourses(); // Charger les cours non inscrits
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
    this.courseService.getUnenrolledCourses(this.userId).subscribe({
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
      this.enrollmentService.enrollStudentCourse(courseId, this.userId).subscribe({
        next: () => {
          alert('Inscription réussie !');
          this.loadUnenrolledCourses(); // Recharger les cours non inscrits après inscription
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
