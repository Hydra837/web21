import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { CourseService } from '../services/course.service';
import { UserService } from '../user.service';
import { Course } from '../Models/courseModel';
import { User } from '../Models/User';
import { CourseManagementService } from '../course-management.service';
import { StudentEnrollmentService } from '../services/student-enrollement.service';
import { AuthenticationService } from '../authentication.service';
import { EnrollStudentComponent } from '../enroll-student/enroll-student.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  users: User[] = [];
  filteredUsers: User[] = [];
  enrolledUsers: any[] = [];
  selectedCourse: Course | null = null;
  selectedCourseWithUsers: Course | null = null;
  selectedCourseIdForAssignments: number | null = null;
  isProfessor: boolean = false; 
  selectedprof: number | undefined;
  
  addProfessorForm: FormGroup;
  addCourseForm: FormGroup;
  updateCourseForm: FormGroup;
  showAddCourseFormFlag: boolean = false;
  showProfessorForm: boolean = false;
  errorMessage: string = '';
  userRole: string | null = null;  
  userId: number | null = null; 
  user!: User | null;
  teacherName: string | null = null; 
  isLoading: boolean = false; // Variable de chargement

  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private courseManagementService: CourseManagementService,
    private studentEnrollmentService: StudentEnrollmentService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {
    this.addProfessorForm = this.fb.group({
      selectedProfessorId: ['', Validators.required],
      selectedCourseId: ['', Validators.required]
    });

    this.addCourseForm = this.fb.group({
      Nom: ['', Validators.required],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      available: [false]
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
    this.isLoading = true; // Démarrer le chargement
    this.authService.getCurrentUser().pipe(
      catchError(this.handleError('chargement des informations de l\'utilisateur'))
    ).subscribe(user => {
      this.user = user;
      if (user) {
        this.userRole = user.role;
        this.userId = user.id;
        this.isProfessor = this.userRole === 'Professeur';

        if (this.isProfessor && this.userId) {
          this.loadCoursesForProfessor(this.userId);
          this.selectedprof = this.userId;
        } else {
          this.loadCourses(); // Charger tous les cours si ce n'est pas un professeur
        }
      }
      this.loadUsers();
    });
  }

  private handleError(operation: string) {
    return (error: any) => {
      this.errorMessage = `Erreur lors de ${operation}.`;
      console.error(`${operation} échoué:`, error);
      this.isLoading = false; // Arrêter le chargement en cas d'erreur
      return of(null);
    };
  }

  loadCourses(): void {
    this.isLoading = true; // Démarrer le chargement
    this.courseService.getCourses().pipe(
      catchError(this.handleError('chargement des cours'))
    ).subscribe(data => {
      if (data) {
        this.courses = data;
      }
      this.isLoading = false; // Arrêter le chargement après la fin
    });
  }

  loadCoursesForProfessor(professorId: number): void {
    this.isLoading = true; // Démarrer le chargement
    this.courseService.getCoursesByTeacher(professorId).pipe(
      catchError(this.handleError('chargement des cours du professeur'))
    ).subscribe(data => {
      if (data) {
        this.courses = data;
      }
      this.isLoading = false; // Arrêter le chargement après la fin
    });
  }

  loadUsers(): void {
    this.isLoading = true; // Démarrer le chargement
    this.userService.getUsers().pipe(
      catchError(this.handleError('chargement des utilisateurs'))
    ).subscribe((data) => {
      if (data) {
        this.users = data;
        this.filterUsers();
      }
      this.isLoading = false; // Arrêter le chargement après la fin
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => user.role === 'Professeur');
    if(this.user?.role === 'Professeur')
    {
      this.addProfessorForm.get('selectedProfessorId')?.setValue(this.user.id);
      this.addProfessorForm.get('selectedProfessorId')?.disable();
      this.courses = this.courses.filter(course => !course.professeurId);
      if (this.courses.length === 0) {
        this.addProfessorForm.get('selectedCourseId')?.disable();
      } else {
        this.addProfessorForm.get('selectedCourseId')?.enable();
      }  
    } else {
      this.filteredUsers = this.users.filter(user => user.role === 'Professeur');
      this.addProfessorForm.get('selectedProfessorId')?.enable();
    }
  }

  showAddCourseForm(): void {
    this.showAddCourseFormFlag = true;
  }

  isProfesseur(): boolean {
    return this.userRole === 'Professeur';
  }

  submitNewCourse(): void {
    if (this.addCourseForm.valid) {
      const newCourse = this.addCourseForm.value as Course;
      this.isLoading = true; // Démarrer le chargement
      this.courseService.createCourse(newCourse).pipe(
        catchError(this.handleError('ajout du cours'))
      ).subscribe(() => {
        this.loadCourses();
        this.addCourseForm.reset();
        this.showAddCourseFormFlag = false;
        this.isLoading = false; // Arrêter le chargement après la fin
      });
    } else {
      this.errorMessage = 'Le formulaire contient des erreurs.';
    }
  }

  cancelAddCourse(): void {
    this.showAddCourseFormFlag = false;
    this.addCourseForm.reset();
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
        this.isLoading = true; // Démarrer le chargement
        this.courseManagementService.updateTeacher(selectedProfessorId, selectedCourseId).pipe(
          catchError(this.handleError('ajout du professeur'))
        ).subscribe(() => {
          this.loadCourses();
          this.addProfessorForm.reset();
          this.showProfessorForm = false;
          this.isLoading = false; // Arrêter le chargement après la fin
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
    const course = this.courses.find(c => c.id === id);
    if (course) {
      this.selectedCourse = course;
      this.updateCourseForm.setValue({
        id: course.id,
        Nom: course.Nom,
        description: course.description,
        dateDebut: course.dateDebut,
        dateFin: course.dateFin,
        available: course.available ?? false
      });
    } else {
      this.errorMessage = 'Cours introuvable.';
    }
  }

  saveUpdatedCourse(): void {
    if (this.updateCourseForm.valid) {
      const updatedCourse = this.updateCourseForm.value as Course;
      if (updatedCourse.id) {
        this.isLoading = true; // Démarrer le chargement
        this.courseService.updateCourse(updatedCourse.id.toString(), updatedCourse).pipe(
          catchError(this.handleError('mise à jour du cours'))
        ).subscribe(() => {
          this.loadCourses();
          this.updateCourseForm.reset();
          this.selectedCourse = null;
          this.isLoading = false; // Arrêter le chargement après la fin
        });
      } else {
        this.errorMessage = 'L\'ID du cours est manquant.';
      }
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
        this.isLoading = true; // Démarrer le chargement
        this.courseService.deleteCourse(id.toString()).pipe(
          catchError(this.handleError('suppression du cours'))
        ).subscribe(() => {
          this.loadCourses();
          this.isLoading = false; // Arrêter le chargement après la fin
        });
      }
    } else {
      this.errorMessage = 'ID du cours est introuvable.';
    }
  }

  showEnrolledUsers(courseId: number): void {
    this.selectedCourseWithUsers = this.courses.find(c => c.id === courseId) || null;
    if (this.selectedCourseWithUsers) {
      this.isLoading = true; // Démarrer le chargement
      this.studentEnrollmentService.getAllUsersByCourse(courseId).pipe(
        catchError(this.handleError('chargement des utilisateurs inscrits'))
      ).subscribe(data => {
        if (data) {
          this.enrolledUsers = data;
        }
        this.isLoading = false; // Arrêter le chargement après la fin
      });
    }
  }

  deleteEnrollment(userId: number, courseId: number): void {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?');
    if (confirmed) {
      this.isLoading = true; // Démarrer le chargement
      this.courseManagementService.deleteEnrollment(userId, courseId).pipe(
        catchError(this.handleError('suppression de l\'inscription'))
      ).subscribe(() => {
        this.loadCourses();
        this.showEnrolledUsers(this.selectedCourseWithUsers?.id || 0);
        this.isLoading = false; // Arrêter le chargement après la fin
      });
    }
  }

  updateGrade(userId: number, idCours: number, grade: number): void {
    if (grade != null && idCours != null) {
      this.isLoading = true; // Démarrer le chargement
      this.studentEnrollmentService.updateGrades(userId, idCours, grade).pipe(
        catchError(this.handleError('mise à jour de la note'))
      ).subscribe(() => {
        this.loadCourses();
        this.showEnrolledUsers(this.selectedCourseWithUsers?.id || 0);
        this.isLoading = false; // Arrêter le chargement après la fin
      });
    } else {
      this.errorMessage = 'Veuillez entrer une note valide.';
    }
  }

  cancelShowEnrolledUsers(): void {
    this.selectedCourseWithUsers = null;
    this.enrolledUsers = [];
  }

  showAssignments(courseId: number): void {
    this.selectedCourseIdForAssignments = courseId;
  }

  openEnrollStudentDialog(): void {
    const dialogRef = this.dialog.open(EnrollStudentComponent, {
      width: '600px' // Adjust the dialog width as needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Inscription réussie:', result);
        this.loadCourses();
      }
    });
  }

  GetTeacherName(userId: number): void {
    if (userId) {
      this.userService.getUserById(userId).pipe(
        catchError(this.handleError('chargement du professeur'))
      ).subscribe(user => {
        if (user) {
          this.teacherName = `${user.prenom} ${user.nom}`;
        } else {
          this.teacherName = 'Nom du professeur introuvable';
        }
      });
    } else {
      this.teacherName = 'ID utilisateur manquant';
    }
  }
}
