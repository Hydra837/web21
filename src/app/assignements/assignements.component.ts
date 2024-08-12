import { Component, OnInit, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, Subscription } from 'rxjs';
import { AssignementsService } from '../assignements.service';
import { AssignementsDTO, AssignementsFORM } from '../Models/assignementsModel';
import { GradeService } from '../grade.service';

@Component({
  selector: 'app-assignements',
  templateUrl: './assignements.component.html',
  styleUrls: ['./assignements.component.css']
})
export class AssignementsComponent implements OnInit, OnDestroy {
  @Input() courseId: number | null = null;

  assignments: AssignementsDTO[] = [];
  selectedAssignment: AssignementsDTO | null = null;
  selectedAssignmentId: number | null = null;
  showAddAssignmentForm = false;
  showEditAssignmentForm = false;
  showGradesForAssignment = false;
  addAssignmentForm: FormGroup;
  editAssignmentForm: FormGroup;
  errorMessage = '';
  private routeSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private assignementsService: AssignementsService,
    private gradeService: GradeService
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
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.courseId = +params.get('courseId')!;
      if (this.courseId) {
        this.loadAssignments(this.courseId);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseId'] && this.courseId) {
      this.resetComponent();
      this.loadAssignments(this.courseId);
    }
  }
  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  private handleError(operation: string) {
    return (error: any) => {
      this.errorMessage = `Erreur lors de ${operation}.`;
      console.error(`${operation} échoué:`, error);
      return of([]);
    };
  }

  private loadAssignments(courseId: number): void {
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
      const newAssignment: AssignementsFORM = {
        ...this.addAssignmentForm.value,
        courseId: this.courseId
      };

      console.log('New assignment data:', newAssignment);

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
    this.loadGradesForAssignment(assignmentId);
  }

  private loadGradesForAssignment(assignmentId: number): void {
    this.gradeService.getGradesByAssignment(assignmentId).pipe(
      catchError(this.handleError('chargement des grades'))
    ).subscribe(data => {
      // Mettez à jour les grades et les utilisateurs inscrits si nécessaire
    });
  }

  // Méthode appelée pour afficher les assignements lors du clic sur un nouveau cours
  showAssignments(courseId: number): void {
    this.courseId = courseId;
    this.resetComponent();
  }

  // Méthode pour réinitialiser le composant
  resetComponent(): void {
    this.assignments = [];
    this.selectedAssignment = null;
    this.addAssignmentForm.reset();
    this.editAssignmentForm.reset();
    this.showAddAssignmentForm = false;
    this.showEditAssignmentForm = false;
    this.showGradesForAssignment = false;

    if (this.courseId) {
        this.loadAssignments(this.courseId);
    }
}

}
