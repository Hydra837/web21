import { Component, Input } from '@angular/core';
import { StudentManagementService } from '../student-management.service';

@Component({
  selector: 'app-del-enrollement',
  templateUrl: './del-enrollement.component.html',
  styleUrls: ['./del-enrollement.component.css']
})
export class DelEnrollementComponent {
  @Input() idCours!: number;
  @Input() idUser!: number;

  constructor(private studentManagementService: StudentManagementService) {}

  deleteEnrollment(): void {
    if (this.idUser && this.idCours) {
      this.studentManagementService.deleteEnrollment(this.idUser, this.idCours)
        .subscribe({
          next: () => console.log('Enrollment deleted successfully'),
          error: err => console.error('Error deleting enrollment:', err)
        });
    } else {
      console.error('User ID and Course ID must be provided.');
    }
  }
}
