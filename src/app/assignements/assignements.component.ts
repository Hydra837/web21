import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { AssignementsService } from '../assignements.service'; // Assurez-vous que le chemin est correct
import { AssignementsDTO } from '../Models/assignementsModel'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-assignements',
  templateUrl: './assignements.component.html',
  styleUrls: ['./assignements.component.css']
})
export class AssignementsComponent implements OnInit {
  @Input() courseId: number | null = null; // Utilisez @Input pour recevoir courseId

  assignments: AssignementsDTO[] = [];
  selectedAssignment: AssignementsDTO | null = null;
  showAddAssignmentForm = false;
  showEditAssignmentForm = false;
  addAssignmentForm: FormGroup;
  editAssignmentForm: FormGroup;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private assignementsService: AssignementsService
  ) {
    this.addAssignmentForm = this.fb.group({
      description: ['', Validators.required],
      isAvailable: [false]
    });

    this.editAssignmentForm = this.fb.group({
      id: [''],
      description: ['', Validators.required],
      isAvailable: [false]
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
    // Vérifiez que le formulaire est valide et que courseId est bien défini
    if (this.addAssignmentForm.valid && this.courseId) {
      
      // Créer un nouvel objet d'assignement en incluant courseId
      const newAssignment: AssignementsDTO = {
        id: 0, // Id initial pour une nouvelle entrée
        courseId: this.courseId, // Assurez-vous que courseId est bien passé ici
        ...this.addAssignmentForm.value // Inclure les autres valeurs du formulaire
      };
  
      // Appeler le service pour créer un nouvel assignement
      this.assignementsService.create(newAssignment).pipe(
        catchError(this.handleError('ajout de l\'assignement')) // Gérer les erreurs
      ).subscribe(() => {
        // Recharger les assignements après la création
        this.loadAssignments(this.courseId!); // Utiliser this.courseId car vous avez déjà vérifié sa présence
  
        // Réinitialiser le formulaire et masquer le formulaire d'ajout
        this.addAssignmentForm.reset();
        this.showAddAssignmentForm = false;
      });
    } else {
      // Afficher un message d'erreur si le formulaire contient des erreurs
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
        courseId: this.selectedAssignment?.coursId || 0 // Assurez-vous que courseId est défini
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
}
