import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { Course } from '../Models/courseModel'; 
import { GetAllCoursForEachUsers } from '../Models/GetAllCoursForEachUsers'; 
import { catchError, of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseManagementService } from '../course-management.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = []; 
  newCourse: Course = {} as Course; 
  errorMessage: string = '';
  courseUser: GetAllCoursForEachUsers[] = []; 
  selectedCourse: Course | null = null; 
  updateCourseForm: FormGroup;
  professorId: number = 1; // Example professor ID, replace with actual logic for selecting professor

  constructor(
    private courseService: CourseService, 
    private courseManagementService: CourseManagementService, 
    private router: Router, 
    private fb: FormBuilder
  ) {
    this.updateCourseForm = this.fb.group({
      id: [''],
      Nom: ['', Validators.required],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      available: [false]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.getCoursEachUser();
  }

  private handleError(operation: string) {
    return (error: any) => {
      this.errorMessage = `Erreur lors de ${operation}.`;
      console.error(`${operation} échoué:`, error);
      return of(null); 
    };
  }

  loadCourses(): void {
    this.courseService.getCourses().pipe(
      catchError(this.handleError('chargement des cours'))
    ).subscribe(data => {
      if (data) {
        this.courses = data;
      }
    });
  }

  getCoursEachUser(): void {
    this.courseService.getAllCoursesForEachUsers().pipe(
      catchError(this.handleError('récupération des cours pour chaque utilisateur'))
    ).subscribe(data => {
      if (data) {
        this.courseUser = data;
      }
    });
  }

  createCourse(): void {
    this.courseService.createCourse(this.newCourse).pipe(
      catchError(this.handleError('création du cours'))
    ).subscribe(() => {
      this.loadCourses();
      this.newCourse = {} as Course; 
    });
  }

  updateCourse(id: number | undefined): void {
    if (id !== undefined) {
      const course = this.courses.find(c => c.id === id);
      if (course) {
        this.selectedCourse = course;
        this.updateCourseForm.setValue({
          id: course.id,
          Nom: course.Nom,
          description: course.description,
          dateDebut: course.dateDebut,
          dateFin: course.dateFin,
          available: course.available
        });
      } else {
        this.errorMessage = 'Cours introuvable.';
      }
    } else {
      this.errorMessage = 'ID du cours est introuvable.';
    }
  }

  saveUpdatedCourse(): void {
    if (this.updateCourseForm.valid) {
      const updatedCourse = this.updateCourseForm.value;
      this.courseService.updateCourse(updatedCourse.id, updatedCourse).pipe(
        catchError(this.handleError('mise à jour du cours'))
      ).subscribe(() => {
        this.loadCourses();
        this.selectedCourse = null; 
      });
    } else {
      this.errorMessage = 'Le formulaire de mise à jour contient des erreurs.';
    }
  }

  cancelUpdate(): void {
    this.selectedCourse = null;
  }

  deleteCourse(id: number | undefined): void {
    if (id !== undefined) {
      const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?');
      if (confirmed) {
        this.courseService.deleteCourse(id.toString()).pipe(
          catchError(this.handleError('suppression du cours'))
        ).subscribe(() => {
          this.loadCourses(); // Recharger la liste des cours après suppression
        });
      }
    } else {
      this.errorMessage = 'ID du cours est introuvable.';
    }
  }

  addUserToCourse(userId: number, courseId: number): void {
    this.courseManagementService.addUserToCourse(userId, courseId).pipe(
      catchError(this.handleError("ajout de l'utilisateur au cours"))
    ).subscribe(() => {
      console.log(`Utilisateur ${userId} ajouté au cours ${courseId} avec succès.`);
    });
  }
}

  // deleteCourse(id: number | undefined): void {
  //   if (id !== undefined) {
  //     this.router.navigate(['/delete-user-admin', id.toString()]);
  //   } else {
  //     this.errorMessage = 'ID du cours est introuvable.';
  //   }
 // }


