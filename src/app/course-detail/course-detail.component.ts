import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { StudentEnrollmentService } from '../services/student-enrollement.service';
import { GradeService } from '../grade.service';
import { AssignementsService } from '../assignements.service';
import { CourseManagementService } from '../course-management.service'; // Importer le nouveau service
import { Course } from '../Models/courseModel';
import { User } from '../Models/User';
import { Grade } from '../Models/GradeModel';
import { AssignementsDTO } from '../Models/assignementsModel';
import { UserAssignment } from '../Models/UserAssignement'; // Importer le modèle de données

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  enrolledUsers: User[] = [];
  selectedUser: User | null = null;
  selectedUserGrades: Grade[] | null = null;
  assignments: AssignementsDTO[] = [];
  userAssignmentsGrades: UserAssignment[] = []; // Nouveau tableau pour les données
  errorMessage: string | null = null;
  isLoading: boolean = true;
  cc: number = 0;

  constructor(
    private courseService: CourseService,
    private studentEnrollmentService: StudentEnrollmentService,
    private gradeService: GradeService,
    private assignmentService: AssignementsService,
    private courseManagementService: CourseManagementService, // Ajouter le service ici
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const courseId = +params.get('id')!;
      this.cc = courseId;
      this.getCourseById(courseId);
      this.getAllUsersByCourse(courseId);
      this.getAssignmentsByCourse(courseId);
      this.getUsersAssignmentsGradesForCourse(courseId); // Appeler la nouvelle méthode
    });
  }

  getCourseById(id: number): void {
    this.courseService.getCourseById(id).subscribe({
      next: (course: Course) => {
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
        this.enrolledUsers = users;
      },
      error: (err: any) => {
        this.errorMessage = 'Aucun utilisateur trouvé.';
        console.error(err);
      }
    });
  }

  getAssignmentsByCourse(id: number): void {
    this.assignmentService.getByCourse(id).subscribe({
      next: (assignments: AssignementsDTO[]) => {
        this.assignments = assignments;
      },
      error: (err: any) => {
        this.errorMessage = 'Aucun devoirs trouvé';
        console.error(err);
      }
    });
  }

  getUsersAssignmentsGradesForCourse(courseId: number): void {
    this.courseManagementService.getUsersAssignmentsGradesForCourse(courseId).subscribe({
      next: (data: UserAssignment[]) => {
        this.userAssignmentsGrades = data;
      },
      error: (err: any) => {
        this.errorMessage = 'Erreur lors de la récupération des utilisateurs, devoirs et notes.';
        console.error(err);
      }
    });
  }

  viewUserDetails(userId: number): void {
    this.selectedUser = this.enrolledUsers.find(user => user.id === userId) || null;

    if (this.selectedUser) {
      // Charger les notes pour chaque assignement
      this.loadGradesForUser(userId);
    } else {
      this.errorMessage = 'Aucun utilisateur.';
    }
  }

  loadGradesForUser(userId: number): void {
    if (this.assignments.length > 0) {
      // Charger les notes pour chaque assignement
      this.selectedUserGrades = [];
      this.assignments.forEach(assignment => {
        this.gradeService.getGradeByUserId(userId, assignment.id).subscribe({
          next: (grade: Grade) => {
            this.selectedUserGrades?.push(grade);
          },
          error: (err: any) => {
            console.error('Aucune note trouvé:', err);
            this.errorMessage = 'Aucune note trouvé.';
          }
        });
      });
    } else {
      this.errorMessage = 'Pas de devoir.';
    }
  }

  getAssignmentName(assignmentId: number): string {
    const assignment = this.assignments.find(a => a.id === assignmentId);
    return assignment ? assignment.description! : 'Devoirs inconnu';
  }
}
