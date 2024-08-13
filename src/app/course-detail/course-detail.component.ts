import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { StudentEnrollmentService } from '../services/student-enrollement.service';
import { GradeService } from '../grade.service'; // Service pour obtenir les notes
import { Course } from '../Models/courseModel';
import { User } from '../Models/User';
import { Grade } from '../Models/GradeModel'; // Assuming you have a Grade model

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null; // Initialement null pour gérer l'état de chargement
  enrolledUsers: User[] = []; // Pour stocker la liste des utilisateurs inscrits
  selectedUser: User | null = null; // Utilisateur sélectionné pour afficher les détails
  selectedUserGrades: Grade[] | null = null; // Pour stocker les notes de l'utilisateur sélectionné
  errorMessage: string | null = null;

  constructor(
    private courseService: CourseService,
    private studentEnrollmentService: StudentEnrollmentService,
    private gradeService: GradeService, // Injectez le service pour obtenir les notes
    private route: ActivatedRoute // Pour obtenir l'ID du cours à partir de l'URL
  ) { }

  ngOnInit(): void {
    // Obtenez l'ID du cours à partir des paramètres de l'URL
    this.route.paramMap.subscribe(params => {
      const courseId = +params.get('id')!;
      this.getCourseById(courseId);
      this.getAllUsersByCourse(courseId);
    });
  }

  getCourseById(id: number): void {
    this.courseService.getCourseById(id).subscribe({
      next: (course: Course) => {
        console.log(course); // Vérifiez les données reçues
        this.course = course;
      },
      error: (err: any) => {
        this.errorMessage = 'Error fetching course details.';
        console.error(err);
      }
    });
  }

  getAllUsersByCourse(id: number): void {
    this.studentEnrollmentService.getAllUsersByCourse(id).subscribe({
      next: (users: User[]) => {
        console.log(users); // Vérifiez les données reçues
        this.enrolledUsers = users;
      },
      error: (err: any) => {
        this.errorMessage = 'Error fetching enrolled users.';
        console.error(err);
      }
    });
  }

  viewUserDetails(userId: number): void {
    this.selectedUser = this.enrolledUsers.find(user => user.id === userId) || null;

    if (this.selectedUser) {
      this.gradeService.getGradesByUserAndCourse(userId, this.course?.id || 0).subscribe({
        next: (grades: Grade[]) => {
          console.log(grades); // Vérifiez les données reçues
          this.selectedUserGrades = grades;
        },
        error: (err: any) => {
          this.errorMessage = 'Error fetching grades.';
          console.error(err);
        }
      });
    }
  }
}
