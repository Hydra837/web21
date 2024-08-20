import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { StudentEnrollmentService } from '../services/student-enrollement.service';
import { GradeService } from '../grade.service'; // Service pour obtenir les notes
import { AssignementsService } from '../assignements.service'; // Service pour obtenir les devoirs
import { Course } from '../Models/courseModel';
import { User } from '../Models/User';
import { Grade } from '../Models/GradeModel'; // Assuming you have a Grade model
import { AssignementsDTO } from '../Models/assignementsModel'; // Assuming you have an Assignment model

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null; // Initialement null pour gérer l'état de chargement
  enrolledUsers: User[] = []; // Pour stocker la liste des utilisateurs inscrits
  selectedUser: User | null = null; // Utilisateur sélectionné pour afficher les détails
  selectedUserGrades: Grade[] | null = null;
  assignments: AssignementsDTO[] = []; // Liste des devoirs du cours
  errorMessage: string | null = null;
  isLoading: boolean = true; // Pour gérer l'état de chargement

  constructor(
    private courseService: CourseService,
    private studentEnrollmentService: StudentEnrollmentService,
    private gradeService: GradeService, // Injectez le service pour obtenir les notes
    private assignmentService: AssignementsService, // Injectez le service pour obtenir les devoirs
    private route: ActivatedRoute // Pour obtenir l'ID du cours à partir de l'URL
  ) { }

  ngOnInit(): void {
    // Obtenez l'ID du cours à partir des paramètres de l'URL
    this.route.paramMap.subscribe(params => {
      const courseId = +params.get('id')!;
      this.getCourseById(courseId);
      this.getAllUsersByCourse(courseId);
      this.getAssignmentsByCourse(courseId); // Récupère les devoirs
    });
  }

  getCourseById(id: number): void {
    this.courseService.getCourseById(id).subscribe({
      next: (course: Course) => {
        console.log(course); // Vérifiez les données reçues
        this.course = course;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Error fetching course details.';
        console.error(err);
        this.isLoading = false;
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

  getAssignmentsByCourse(id: number): void {
    this.assignmentService.getByCourse(id).subscribe({
      next: (assignments: AssignementsDTO[]) => {
        console.log(assignments); // Vérifiez les données reçues
        this.assignments = assignments;
      },
      error: (err: any) => {
        this.errorMessage = 'Error fetching assignments.';
        console.error(err);
      }
    });
  }

  viewUserDetails(userId: number): void {
    this.selectedUser = this.enrolledUsers.find(user => user.id === userId) || null;
    
    if (this.selectedUser) {
      const courseId = this.course?.id ?? 0;
      this.gradeService.getGradesByUserAndCourse(userId, courseId).subscribe({
        next: (grades: Grade[]) => {
          console.log('Grades received:', grades); // Affiche les données reçues pour débogage
          this.selectedUserGrades = grades;
        },
        error: (err: any) => {
          this.errorMessage = 'Error fetching grades.';
          console.error('Error details:', err); // Affiche les détails de l'erreur pour débogage
        }
      });
    } else {
      // Gérer le cas où l'utilisateur sélectionné n'a pas été trouvé
      this.errorMessage = 'User not found.';
    }
  }
}
