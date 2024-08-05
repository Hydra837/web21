import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { User } from '../Models/User';
import { UserFORM } from '../Models/User';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { StudentManagementService } from '../student-management.service'; // Import du service

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})
export class StudentManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = []; // Utilisé pour les utilisateurs filtrés
  selectedUser: User | null = null; // Utilisé pour les utilisateurs existants
  userForm: UserFORM | null = null; // Utilisé pour les nouveaux utilisateurs
  errorMessage: string | null = null;
  selectedRole: string = ''; // Valeur pour filtrer par rôle

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private studentManagementService: StudentManagementService // Injection du service
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
      this.filteredUsers = this.users; // Afficher tous les utilisateurs si aucun filtre
    }
  }

  selectUser(user: User): void {
    this.selectedUser = { ...user }; // Copier les données de l'utilisateur existant
    this.userForm = null; // Réinitialiser le formulaire pour un nouvel utilisateur
  }

  saveUser(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: () => {
          this.loadUsers();
          this.selectedUser = null; // Réinitialiser l'utilisateur sélectionné
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
    this.selectedUser = null; // Réinitialiser l'utilisateur sélectionné
  }

  saveNewUser(): void {
    if (this.userForm) {
      this.userService.addUser(this.userForm).subscribe({
        next: () => {
          this.loadUsers();
          this.userForm = null; // Réinitialiser le formulaire après l'ajout
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

  addUserToCourse(userId: number, courseId: number): void {
    this.studentManagementService.addUserToCourse(userId, courseId).subscribe({
      next: () => {
        console.log(`Utilisateur ${userId} ajouté au cours ${courseId} avec succès.`);
      },
      error: (err: any) => this.errorMessage = `Erreur lors de l'ajout de l'utilisateur au cours: ${err.message}`
    });
  }
}
