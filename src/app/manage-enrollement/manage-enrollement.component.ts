import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentEnrollmentService } from '../services/student-enrollement.service';
import { StudentManagementService } from '../student-management.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-manage-enrollement',
  templateUrl: './manage-enrollement.component.html',
  styleUrls: ['./manage-enrollement.component.css']
})
export class ManageEnrollementComponent implements OnInit {
  @Input() courseId!: number;
  @Input() userId!: number;
  errorMessage: string = '';
  isProfessor: boolean = false;

  constructor(
    private enrollmentService: StudentEnrollmentService,
    private managementService: StudentManagementService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = +params.get('courseId')!;
      this.userId = +params.get('userId')!;

      // if (!this.courseId || !this.userId) {
      //   this.errorMessage = 'ID de cours ou d\'utilisateur non fourni.';
      //   return;
      // }

      this.checkUserRole();
    });
  }

  checkUserRole(): void {
    this.userService.getUserRole(this.userId).subscribe(
      role => {
        this.isProfessor = role === 'Professeur';
      },
      error => {
        this.errorMessage = 'Erreur lors de la récupération du rôle de l\'utilisateur.';
      }
    );
  }

  delete(): void {
    if (this.isProfessor) {
      this.managementService.removeTeacher(this.userId, this.courseId).subscribe(
        () => {
          this.router.navigate(['/user-management']);
        },
        error => {
          this.errorMessage = 'Erreur lors de la suppression du professeur.';
        }
      );
    } else {
      this.managementService.deleteEnrollment(this.courseId, this.userId).subscribe(
        () => {
          this.router.navigate(['/courses']);
        },
        error => {
          this.errorMessage = 'Erreur lors de la suppression de l\'inscription.';
        }
      );
    }
  }
}
