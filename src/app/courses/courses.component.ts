import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { CourseService } from '../services/course.service';
import { UserService } from '../user.service';
import { Course } from '../Models/courseModel';
import { User } from '../Models/User';
import { CourseManagementService } from '../course-management.service';
import { StudentEnrollmentService } from '../services/student-enrollement.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  users: User[] = [];
  filteredUsers: User[] = [];
  enrolledUsers: any[] = []; // Stocke les utilisateurs inscrits à un cours
  selectedCourseForProfessor: number | null = null;
  selectedCourse: Course | null = null; // Variable pour stocker le cours sélectionné pour la mise à jour
  selectedCourseWithUsers: Course | null = null; // Variable pour stocker le cours sélectionné pour afficher les utilisateurs
  addProfessorForm: FormGroup;
  updateCourseForm: FormGroup;
  showProfessorForm: boolean = false;
  errorMessage: string = '';

  constructor(
    private courseService: CourseService, 
    private userService: UserService,
    private courseManagementService: CourseManagementService, 
    private studentEnrollmentService: StudentEnrollmentService,
    private fb: FormBuilder
  ) {
    this.addProfessorForm = this.fb.group({
      selectedProfessorId: ['', Validators.required],
      selectedCourseId: ['', Validators.required]
    });

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
    this.selectedCourseForProfessor = courseId;
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
          this.selectedCourseForProfessor = null;
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

  updateCourse(id: number): void {
    console.log('Attempting to update course with ID:', id);
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
  }

  saveUpdatedCourse(): void {
    if (this.updateCourseForm.valid) {
      const updatedCourse = this.updateCourseForm.value;
      this.courseService.updateCourse(updatedCourse.id, updatedCourse).pipe(
        catchError(this.handleError('mise à jour du cours'))
      ).subscribe(() => {
        this.loadCourses();
        this.updateCourseForm.reset();
        this.selectedCourse = null;
      });
    } else {
      this.errorMessage = 'Le formulaire de mise à jour contient des erreurs.';
    }
  }

  cancelUpdate(): void {
    this.updateCourseForm.reset();
    this.selectedCourse = null;
  }

  deleteCourse(id: number): void {
    if (id) {
      const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?');
      if (confirmed) {
        this.courseService.deleteCourse(id.toString()).pipe(
          catchError(this.handleError('suppression du cours'))
        ).subscribe(() => {
          this.loadCourses();
        });
      }
    } else {
      this.errorMessage = 'ID du cours est introuvable.';
    }
  }

  showEnrolledUsers(courseId: number): void {
    this.selectedCourseWithUsers = this.courses.find(c => c.id === courseId) || null;
    if (this.selectedCourseWithUsers) {
      this.studentEnrollmentService.getAllUserByCourse(courseId).pipe(
        catchError(this.handleError('chargement des utilisateurs inscrits'))
      ).subscribe(data => {
        if (data) {
          this.enrolledUsers = data;
        }
      });
    }
  }

  deleteEnrollment(userId: number): void {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?');
    if (confirmed) {
      this.studentEnrollmentService.deleteEnrollment(userId).pipe(
        catchError(this.handleError('suppression de l\'inscription'))
      ).subscribe(() => {
        this.loadCourses(); // Recharger les cours après suppression
        this.showEnrolledUsers(this.selectedCourseWithUsers?.id || 0); // Recharger les utilisateurs pour le cours sélectionné
      });
    }
  }

  updateGrade(userId: number, grade: number): void {
    if (grade != null) {
      this.studentEnrollmentService.updateGrade(userId, grade).pipe(
        catchError(this.handleError('mise à jour de la note'))
      ).subscribe(() => {
        this.loadCourses(); // Recharger les cours après mise à jour
        this.showEnrolledUsers(this.selectedCourseWithUsers?.id || 0); // Recharger les utilisateurs pour le cours sélectionné
      });
    } else {
      this.errorMessage = 'Veuillez entrer une note valide.';
    }
  }

  cancelShowEnrolledUsers(): void {
    this.selectedCourseWithUsers = null;
    this.enrolledUsers = [];
  }
}


  // Méthodes pour d'autres actions comme updateCourse, deleteCourse, etc.

  // hasTeacher(courseId: number): void {
  //   this.courseService.getCourseById(courseId).pipe(
  //     catchError(this.handleError('vérification de l\'enseignant pour le cours'))
  //   ).subscribe(course => {
  //     if (course) {
  //       const hasTeacher = course.professeurId !== null;
  //       console.log(`Le cours ${courseId} a-t-il un enseignant ? ${hasTeacher}`);
  //       return hasTeacher;
  //     } else {
  //       return false;
  //     }
  //   });
  // }

  
  // Vérifie si un cours a un enseignant assigné en utilisant les données du composant
//   hasTeacher(courseId: number): boolean {
//     const course = this.courses.find(cu => cu.courseId === courseId);
//     return course ? course.teacherId !== null : false;
//   }
// }


  // deleteCourse(id: number | undefined): void {
  //   if (id !== undefined) {
  //     this.router.navigate(['/delete-user-admin', id.toString()]);
  //   } else {
  //     this.errorMessage = 'ID du cours est introuvable.';
  //   }
 // }


