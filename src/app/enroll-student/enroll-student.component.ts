import { Component, OnInit } from '@angular/core';
import { StudentEnrollmentService } from '../services/student-enrollement.service';
import { UserService } from '../user.service';
import { CourseService } from '../services/course.service'; // Assurez-vous que le chemin est correct
import { Course } from '../Models/courseModel';
import { User } from '../Models/User';

@Component({
  selector: 'app-enroll-student',
  templateUrl: './enroll-student.component.html',
  styleUrls: ['./enroll-student.component.css']
})
export class EnrollStudentComponent implements OnInit {
  courses: Course[] = [];
  students: User[] = [];
  selectedCourseId: number | undefined;
  selectedStudentId: number | undefined;
  message: string = '';

  constructor(
    private enrollmentService: StudentEnrollmentService,
    private userService: UserService,
    private courseService: CourseService
  ) { }

  ngOnInit(): void {
    this.loadCourses();
    this.loadStudents();
  }

  // Charger les cours disponibles
  loadCourses(): void {
    this.courseService.getAvailableCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des cours:', error);
        this.message = 'Erreur lors du chargement des cours.';
      }
    });
  }

  // Charger les étudiants
  loadStudents(): void {
    this.userService.getUsersByRole('Etudiant').subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des étudiants:', error);
        this.message = 'Erreur lors du chargement des étudiants.';
      }
    });
  }

  // Inscrire l'étudiant au cours sélectionné
  enrollUser(): void {
    if (this.selectedStudentId === undefined || this.selectedCourseId === undefined) {
      this.message = 'Veuillez sélectionner un étudiant et un cours.';
      return;
    }

    // Inscrire l'utilisateur au cours
    this.enrollmentService.enrollStudentCourse(this.selectedCourseId, this.selectedStudentId).subscribe({
      next: () => {
        this.message = 'Inscription réussie.';
        // Réinitialiser les sélections après l'inscription
        this.selectedCourseId = undefined;
        this.selectedStudentId = undefined;
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription:', error);
        this.message = 'Erreur lors de l\'inscription.';
      }
    });
  }
}
