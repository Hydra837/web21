import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../course.service'; // Assurez-vous que le chemin est correct
import { Course } from '../course.model'; // Assurez-vous que le modèle Course est bien importé

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent {
  @Output() courseAdded = new EventEmitter<void>();
  addCourseForm: FormGroup;

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    this.addCourseForm = this.fb.group({
      nom: ['', Validators.required], // Changement en minuscule pour suivre les conventions
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      available: [false]
    });
  }

  submitNewCourse(): void {
    if (this.addCourseForm.valid) {
      const newCourse = this.addCourseForm.value as Course;
      this.courseService.createCourse(newCourse).subscribe(
        () => {
          this.courseAdded.emit();
          this.addCourseForm.reset();
        },
        error => {
          console.error('Erreur lors de l\'ajout du cours:', error);
          // Optionnel: ajouter une gestion d'affichage de l'erreur pour l'utilisateur
        }
      );
    }
  }
}
