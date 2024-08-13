import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { GradeService } from '../grade.service';
import { StudentEnrollmentService } from '../services/student-enrollement.service'; // Assurez-vous que le chemin est correct
import { Grade } from '../Models/GradeModel';
import { User } from '../Models/User'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnChanges {
  @Input() assignementsId: number | null = null;
  @Input() courseId: number | null = null; // Ajouté pour recevoir le courseId

  grades: Grade[] = [];
  enrolledUsers: User[] = [];
  addGradeForm: FormGroup;
  editGradeForm: FormGroup;
  errorMessage = '';
  showAddGradeForm = false;
  showEditGradeForm = false;
  selectedGrade: Grade | null = null;

  constructor(
    private fb: FormBuilder,
    private gradeService: GradeService,
    private studentEnrollmentService: StudentEnrollmentService
  ) {
    this.addGradeForm = this.fb.group({
      grade: ['', Validators.required],
      userId: ['', Validators.required]
    });

    this.editGradeForm = this.fb.group({
      id: [''],
      grade: ['', Validators.required],
      userId: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assignementsId'] && this.assignementsId) {
      this.loadGrades();
    }

    if (changes['courseId'] && this.courseId) {
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

  loadGrades(): void {
    if (this.assignementsId !== null) {
      this.gradeService.getGradesByAssignment(this.assignementsId).pipe(
        catchError(this.handleError('chargement des grades'))
      ).subscribe(data => {
        this.grades = data;
      });
    }
  }

  loadEnrolledUsers(): void {
    if (this.courseId !== null) {
      this.studentEnrollmentService.getAllUsersByCourse(this.courseId).pipe(
        catchError(this.handleError('chargement des utilisateurs inscrits'))
      ).subscribe(data => {
        this.enrolledUsers = data;
      });
    }
  }

  getUserName(userId: number): string {
    const user = this.enrolledUsers.find(u => u.id === userId);
    return user ? user.nom : 'Inconnu';
  }

  showAddForm(): void {
    this.showAddGradeForm = true;
  }

  submitNewGrade(): void {
    if (this.addGradeForm.valid) {
      const newGrade: Grade = {
        grade: this.addGradeForm.value.grade,
        userId: this.addGradeForm.value.userId,
        assignementsId: this.assignementsId!,
        id: 0
      };

      this.gradeService.addGrade(newGrade).pipe(
        catchError(this.handleError('ajout de la note'))
      ).subscribe(() => {
        this.loadGrades();
        this.addGradeForm.reset();
        this.showAddGradeForm = false;
      });
    } else {
      this.errorMessage = 'Le formulaire contient des erreurs.';
    }
  }

  cancelAdd(): void {
    this.showAddGradeForm = false;
    this.addGradeForm.reset();
  }

  editGrade(grade: Grade): void {
    this.selectedGrade = grade;
    this.editGradeForm.setValue({
      id: grade.id,
      grade: grade.grade,
      userId: grade.userId
    });
    this.showEditGradeForm = true;
  }

  saveUpdatedGrade(): void {
    if (this.editGradeForm.valid) {
      const updatedGrade: Grade = {
        id: this.editGradeForm.value.id,
        grade: this.editGradeForm.value.grade,
        userId: this.editGradeForm.value.userId,
        assignementsId: this.assignementsId!
      };

      this.gradeService.updateGrade(updatedGrade.id, updatedGrade).pipe(
        catchError(this.handleError('mise à jour de la note'))
      ).subscribe(() => {
        this.loadGrades();
        this.editGradeForm.reset();
        this.selectedGrade = null;
        this.showEditGradeForm = false;
      });
    } else {
      this.errorMessage = 'Le formulaire de mise à jour contient des erreurs.';
    }
  }

  cancelEdit(): void {
    this.showEditGradeForm = false;
    this.editGradeForm.reset();
    this.selectedGrade = null;
  }

  deleteGrade(id: number): void {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?');
    if (confirmed) {
      this.gradeService.deleteGrade(id).pipe(
        catchError(this.handleError('suppression de la note'))
      ).subscribe(() => {
        this.loadGrades();
      });
    }
  }
}
