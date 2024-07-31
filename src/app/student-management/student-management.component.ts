// src/app/user-management/user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../Models/User';

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})
export class StudentManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  errorMessage: string | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => this.users = users,
      error: (err: any) => this.errorMessage = 'Error loading users'
    });
  }

  selectUser(user: User): void {
    this.selectedUser = { ...user };
  }

  saveUser(): void {
    if (this.selectedUser) {
      if (this.selectedUser.id) {
        this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
          next: () => this.loadUsers(),
          error: (err: any) => this.errorMessage = 'Error saving user'
        });
      } else {
        this.userService.addUser(this.selectedUser).subscribe({
          next: () => this.loadUsers(),
          error: (err: any) => this.errorMessage = 'Error creating user'
        });
      }
      this.selectedUser = null;
    }
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err: any) => this.errorMessage = 'Error deleting user'
    });
  }

  addUser(): void {
    this.selectedUser = {
      id: 0,
      prenom: 'Jon',
      nom: 'suit',
      password: '1111',
      //email: '',
      role: 'student'
    };
  }
}
