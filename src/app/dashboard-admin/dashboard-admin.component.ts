import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service'; // Assurez-vous que le chemin d'importation est correct
import { Course } from '../Models/courseModel';
import { User } from '../Models/User';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  courses: Course[] = [];
  users: User[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadCourses();
    this.loadUsers();
  }

  // Charger la liste des cours
  loadCourses() {
    this.adminService.getAllCourses().subscribe({
      next: (data: any[]) => this.courses = data,
      error: (error) => console.error('Erreur lors de la récupération des cours', error)
    });
  }

  // Charger la liste des utilisateurs
  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data: any[]) => this.users = data,
      error: (error) => console.error('Erreur lors de la récupération des utilisateurs', error)
    });
  }

  // Supprimer un cours
  deleteCourse(courseId: string) {
    this.adminService.deleteCourse(courseId).subscribe({
      next: () => this.loadCourses(), // Recharger les cours après suppression
      error: (error) => console.error('Erreur lors de la suppression du cours', error)
    });
  }

  // Supprimer un utilisateur
  deleteUser(userId: string) {
    this.adminService.deleteUser(userId).subscribe({
      next: () => this.loadUsers(), // Recharger les utilisateurs après suppression
      error: (error) => console.error('Erreur lors de la suppression de l\'utilisateur', error)
    });
  }
}
