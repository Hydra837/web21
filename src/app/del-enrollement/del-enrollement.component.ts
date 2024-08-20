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
          next: () => console.log('Vous avez bien supprimé l enrollement'),
          error: err => console.error('erreur lors de la suppression:', err)
        });
    } else {
      console.error('les ids doivent  être partagé');
    }
  }
}
