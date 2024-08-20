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
  courses: Course[] = []; // This will store all courses or unenrolled courses depending on the user role
  errorMessage: string = '';
  userId: number | null = 0;
  userRole: string | null = null; // Store the user's role
  isStudent: boolean = false; // Flag to determine if the user is a student

  constructor(
    private courseService: CourseService,
    private enrollmentService: StudentEnrollmentService,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loadUserId(); 
    this.loadCourses(); 
    this.loadCurrentUser(); 
    // this.userId = this.authService.getUserId();
    // this.userRole = this.authService.getUserRole(); 
  }

  loadUserId(): void {
    this.userId = this.authService.getUserId();
    this.userRole = this.authService.getUserRole(); 
    this.isStudent = this.userRole === 'Etudiant'; 
  }

  loadCourses(): void {
    if (this.isStudent && this.userId) {
      this.loadUnenrolledCourses(); 
    } else {
      this.courseService.getCourses().subscribe({
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
  }

  loadUnenrolledCourses(): void {
    this.courseService.getUnenrolledCourses(this.userId!).subscribe({
      next: (data) => {
        this.courses = data;
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
  loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: User | null) => {
        if (user) {
          this.userId = user.id;
          this.userRole = user.role;
          this.isStudent = this.userRole === 'Etudiant';
          this.loadCourses(); // Reload courses after setting user info
        } else {
          this.errorMessage = 'Utilisateur non connecté.';
          console.error('Utilisateur non connecté.');
        }
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des informations de l\'utilisateur.';
        console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
      }
    });
  }


  enroll(courseId: number | undefined): void {
    if (courseId !== undefined) {
      this.enrollmentService.enrollStudentCourse(courseId, this.userId!).subscribe({
        next: () => {
          alert('Inscription réussie !');
          this.loadCourses(); // Recharge les cours après inscription
        },
        error: (error) => {
          if (error.status === 400 && error.error.message === 'Déjà inscrit') {
            this.errorMessage = 'Vous êtes déjà inscrit à ce cours.';
          } else {
            this.errorMessage = 'Erreur lors de l\'inscription au cours.';
          }
          console.error('Erreur lors de l\'inscription au cours:', error);
        }
      });
    } else {
      this.errorMessage = 'L\'ID du cours est indéfini.';
      console.error('Cours non défini');
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
