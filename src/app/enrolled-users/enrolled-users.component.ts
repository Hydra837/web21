import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { catchError, of } from 'rxjs';
import { StudentEnrollmentService } from '../services/student-enrollement.service'; // Assurez-vous que le chemin est correct
import { User } from '../Models/User'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-enrolled-users',
  templateUrl: './enrolled-users.component.html',
  styleUrls: ['./enrolled-users.component.css']
})
export class EnrolledUsersComponent implements OnChanges {
  @Input() courseId: number | null = null;
  enrolledUsers: User[] = [];
  errorMessage = '';

  constructor(private studentEnrollmentService: StudentEnrollmentService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseId'] && this.courseId !== null) {
      this.loadEnrolledUsers();
    }
  }

  private handleError(operation: string) {
    return (error: any) => {
      this.errorMessage = `Erreur lors de ${operation}.`;
      console.error(`${operation} échoué:`, error);
      return of([]);
    };
  }

  loadEnrolledUsers(): void {
    if (this.courseId !== null) {
      this.studentEnrollmentService.getCoursesByStudentId(this.courseId).pipe(
        catchError(this.handleError('chargement des utilisateurs inscrits'))
      ).subscribe(data => {
        if (data) {
         // this.enrolledUsers = data;
        }
      });
    }
  }
}
