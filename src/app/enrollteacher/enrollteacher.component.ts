import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { CourseService } from '../services/course.service';
import { UserService } from '../user.service';
import { CourseManagementService } from '../course-management.service';
import { User } from '../Models/User';

@Component({
  selector: 'app-enrollteacher',
  templateUrl: './enrollteacher.component.html',
  styleUrls: ['./enrollteacher.component.css']
})
export class EnrollteacherComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  courses: any[] = []; // Assuming any type for courses
  addProfessorForm: FormGroup;
  showProfessorForm: boolean = false;
  errorMessage: string = '';

  constructor(
    private courseService: CourseService, 
    private userService: UserService,
    private courseManagementService: CourseManagementService, 
    private fb: FormBuilder
  ) {
    this.addProfessorForm = this.fb.group({
      selectedProfessorId: ['', Validators.required],
      selectedCourseId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadUsers();
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

  loadUsers(): void {
    this.userService.getUsers().pipe(
      catchError(this.handleError('chargement des utilisateurs'))
    ).subscribe((data) => {
      if (data) {
        this.users = data;
        this.filterUsers(); // Filtrer les utilisateurs après chargement
      }
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => user.role === 'Professeur');
  }

  showAddProfessorForm(): void {
    this.showProfessorForm = true;
  }

  selectCourseForAddingProfessor(courseId: number): void {
    this.addProfessorForm.patchValue({ selectedCourseId: courseId });
  }

  confirmAddProfessor(): void {
    if (this.addProfessorForm.valid) {
      const { selectedProfessorId, selectedCourseId } = this.addProfessorForm.value;

      if (selectedProfessorId && selectedCourseId) {
        this.courseManagementService.updateTeacher(selectedProfessorId, selectedCourseId).pipe(
          catchError(this.handleError('ajout du professeur'))
        ).subscribe(() => {
          this.loadCourses();
          this.addProfessorForm.reset();
          this.showProfessorForm = false;
        });
      } else {
        this.errorMessage = 'Veuillez sélectionner un professeur et un cours.';
      }
    } else {
      this.errorMessage = 'Le formulaire contient des erreurs.';
    }
  }

  cancelAddProfessor(): void {
    this.showProfessorForm = false;
    this.addProfessorForm.reset();
  }
}
