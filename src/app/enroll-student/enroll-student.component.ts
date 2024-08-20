import { Component, OnInit } from '@angular/core';
import { StudentEnrollmentService } from '../services/student-enrollement.service';
import { UserService } from '../user.service';
import { CourseService } from '../services/course.service';
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
    this.loadStudents();
  }

  loadCourses(): void {
    if (this.selectedStudentId !== undefined) {
      this.courseService.getUnenrolledCourses(this.selectedStudentId).subscribe({
        next: (data) => {
          this.courses = data;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des cours:', error);
          this.message = 'Erreur lors du chargement des cours.';
        }
      });
    }
  }

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

  onStudentChange(): void {
    this.loadCourses();
  }

  enrollUser(): void {
    if (this.selectedStudentId === undefined || this.selectedCourseId === undefined) {
      this.message = 'Veuillez sélectionner un étudiant et un cours.';
      return;
    }

    this.enrollmentService.enrollStudentCourse(this.selectedCourseId, this.selectedStudentId).subscribe({
      next: () => {
        this.message = 'Inscription réussie.';
        this.selectedCourseId = undefined;
        this.selectedStudentId = undefined;
        this.courses = []; 
      }
    });
  }
}
