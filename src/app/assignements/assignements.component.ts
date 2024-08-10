import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { AssignementsService } from '../assignements.service';
import { AssignementsDTO } from '../Models/assignementsModel';
import { GradeService } from '../grade.service'; // Assurez-vous que le chemin est correct
import { Grade } from '../Models/GradeModel'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-assignements',
  templateUrl: './assignements.component.html',
  styleUrls: ['./assignements.component.css']
})
export class AssignementsComponent implements OnInit {
  @Input() courseId: number | null = null;

  assignments: AssignementsDTO[] = [];
  selectedAssignment: AssignementsDTO | null = null;
  selectedAssignmentId: number | null = null; // Ajouté pour gérer l'ID de l'assignement sélectionné
  showAddAssignmentForm = false;
  showEditAssignmentForm = false;
  showGradesForAssignment = false; // Ajouté pour afficher les grades
  addAssignmentForm: FormGroup;
  editAssignmentForm: FormGroup;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private assignementsService: AssignementsService,
    private gradeService: GradeService // Injection du service Grade
  ) {
    this.addAssignmentForm = this.fb.group({
      description: ['', Validators.required],
      isAvailable: [true]
    });

    this.editAssignmentForm = this.fb.group({
      id: [''],
      description: ['', Validators.required],
      isAvailable: [true]
    });
  }

  ngOnInit(): void {
    if (this.courseId) {
      this.loadAssignments(this.courseId);
    } else {
      this.route.paramMap.subscribe(params => {
        this.courseId = +params.get('courseId')!;
        if (this.courseId) {
          this.loadAssignments(this.courseId);
        }
      });
    }
  }

  private handleError(operation: string) {
    return (error: any) => {
      this.errorMessage = `Erreur lors de ${operation}.`;
      console.error(`${operation} échoué:`, error);
      return of([]);
    };
  }

  loadAssignments(courseId: number): void {
    this.assignementsService.getByCourse(courseId).pipe(
      catchError(this.handleError('chargement des assignements'))
    ).subscribe(data => {
      this.assignments = data;
    });
  }

  showAddForm(): void {
    this.showAddAssignmentForm = true;
  }

  submitNewAssignment(): void {
    if (this.addAssignmentForm.valid && this.courseId) {
      const newAssignment: AssignementsDTO = {
        id: 0,
        courseId: this.courseId,
        ...this.addAssignmentForm.value
      };

      this.assignementsService.create(newAssignment).pipe(
        catchError(this.handleError('ajout de l\'assignement'))
      ).subscribe(() => {
        this.loadAssignments(this.courseId!);
        this.addAssignmentForm.reset();
        this.showAddAssignmentForm = false;
      });
    } else {
      this.errorMessage = 'Le formulaire contient des erreurs.';
    }
  }

  cancelAdd(): void {
    this.showAddAssignmentForm = false;
    this.addAssignmentForm.reset();
  }

  editAssignment(assignment: AssignementsDTO): void {
    this.selectedAssignment = assignment;
    this.editAssignmentForm.setValue({
      id: assignment.id,
      description: assignment.description,
      isAvailable: assignment.isAvailable ?? false
    });
    this.showEditAssignmentForm = true;
  }

  saveUpdatedAssignment(): void {
    if (this.editAssignmentForm.valid) {
      const updatedAssignment: AssignementsDTO = {
        ...this.editAssignmentForm.value,
        courseId: this.selectedAssignment?.coursId || 0
      };

      this.assignementsService.update(updatedAssignment.id, updatedAssignment).pipe(
        catchError(this.handleError('mise à jour de l\'assignement'))
      ).subscribe({
        next: () => {
          this.loadAssignments(this.courseId!);
          this.editAssignmentForm.reset();
          this.selectedAssignment = null;
          this.showEditAssignmentForm = false;
        },
        error: () => {
          this.errorMessage = 'Une erreur est survenue lors de la mise à jour de l\'assignement.';
        }
      });
    } else {
      this.errorMessage = 'Le formulaire de mise à jour contient des erreurs.';
    }
  }

  cancelEdit(): void {
    this.showEditAssignmentForm = false;
    this.editAssignmentForm.reset();
    this.selectedAssignment = null;
  }

  deleteAssignment(id: number): void {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet assignement ?');
    if (confirmed) {
      this.assignementsService.delete(id).pipe(
        catchError(this.handleError('suppression de l\'assignement'))
      ).subscribe(() => {
        this.loadAssignments(this.courseId!);
      });
    }
  }

  showGrades(assignmentId: number): void {
    this.selectedAssignmentId = assignmentId;
    this.showGradesForAssignment = true;
    this.loadGradesForAssignment(assignmentId); // Charger les grades pour l'assignement sélectionné
  }

  private loadGradesForAssignment(assignmentId: number): void {
    this.gradeService.getGradesByAssignment(assignmentId).pipe(
      catchError(this.handleError('chargement des grades'))
    ).subscribe(data => {
      // Mettez à jour les grades et les utilisateurs inscrits si nécessaire
    });
  }
}
