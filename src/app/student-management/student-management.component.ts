import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { User } from '../Models/User';
import { UserFORM } from '../Models/User';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { StudentManagementService } from '../student-management.service';
import { EnrollStudentComponent } from '../enroll-student/enroll-student.component';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service'; 
import { Course } from '../Models/courseModel';
import { StudentEnrollmentService } from '../services/student-enrollement.service';
import { CourseManagementService } from '../course-management.service';

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})
export class StudentManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  enrolledUsers: any[] = [];
  selectedUser: User | null = null;
  userForm: UserFORM | null = null;
  errorMessage: string | null = null;
  selectedCourseWithUsers: Course | null = null;
  selectedCourseIdForAssignments: number | null = null;
  selectedRole: string = '';
  courses: Course[] = []; 

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private studentManagementService: StudentManagementService,
    private router: Router,
    private enr: StudentEnrollmentService,
    private courseService: CourseService,
    private coursemanagement: CourseManagementService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.filterUsers(); // Appliquer le filtre initialement
      },
      error: (err: any) => this.errorMessage = 'Erreur lors du chargement des utilisateurs.'
    });
  }

  filterUsers(): void {
    if (this.selectedRole) {
      this.filteredUsers = this.users.filter(user => user.role === this.selectedRole);
    } else {
      this.filteredUsers = this.users;
    }
  }

  selectUser(user: User): void {
    this.selectedUser = { ...user };
    this.userForm = null;
  }

  saveUser(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: () => {
          this.loadUsers();
          this.selectedUser = null;
        },
        error: (err: any) => this.errorMessage = 'Erreur lors de la sauvegarde de l’utilisateur.'
      });
    }
  }

  addUser(): void {
    this.userForm = {
      prenom: '',
      nom: '',
      password: '',
      role: '',
      mail: '',
      pseudo: ''
    };
    this.selectedUser = null;
  }

  saveNewUser(): void {
    if (this.userForm) {
      this.userService.addUser(this.userForm).subscribe({
        next: () => {
          this.loadUsers();
          this.userForm = null;
        },
        error: (err: any) => this.errorMessage = 'Erreur lors de la création de l’utilisateur.'
      });
    }
  }

  deleteUser(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(id).subscribe({
          next: () => this.loadUsers(),
          error: (err: any) => this.errorMessage = 'Erreur lors de la suppression de l’utilisateur.'
        });
      }
    });
  }

  openEnrollStudentDialog(): void {
    const dialogRef = this.dialog.open(EnrollStudentComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Inscription réussie:', result);
      }
    });
  }
  

  showEnrolledUsers(courseId: number): void {
    this.selectedCourseWithUsers = this.courses.find(c => c.id === courseId) || null;
    if (this.selectedCourseWithUsers) {
      this.enr.getAllUsersByCourse(courseId).subscribe({
        next: (data) => {
          this.enrolledUsers = data;
        },
        error: (err: any) => this.errorMessage = 'Erreur lors de la récupération des utilisateurs inscrits.'
      });
    }
  }

  showAssignments(courseId: number): void {
    this.selectedCourseIdForAssignments = courseId;
    this.router.navigate(['/assignments', courseId]);
  }

  viewCoursesForUser(userId: number): void {
    this.enr.getCoursesByStudentId(userId).subscribe({
      next: (data: Course[]) => {
        this.courses = data;
        console.log('Courses for user:', this.courses);
      //  this.openCoursesDialog (this.courses);
      },
      error: (err: any) => {
        this.errorMessage = 'Erreur lors de la récupération des cours.';
        console.error(err);
      }
    });
  }

  openCoursesDialog(courses: Course[]): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: { courses }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle result if necessary
    });
  }
  deleteEnrollment(userId: number, courseId: number): void {
    this.coursemanagement.deleteEnrollment(userId, courseId).subscribe({
      next: () => {
        alert('Inscription supprimée avec succès.');
      },
      error: (err) => {
 
        console.error('Erreur lors de la suppression de l\'inscription:', err);
   
        alert('Une erreur est survenue lors de la suppression de l\'inscription.');
      }
    });
  }
}
  



