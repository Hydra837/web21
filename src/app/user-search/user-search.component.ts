import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importez Router pour la navigation
import { UserService } from '../user.service';
import { User } from '../Models/User';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  searchTerm: string = '';
  users: User[] = [];
  isLoading: boolean = false; // Ajouté pour gérer l'état de chargement

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void { }

  searchUsers(): void {
    if (this.searchTerm.trim()) { // Vérifiez si le terme de recherche n'est pas vide
      this.isLoading = true; // Activer l'état de chargement
      this.userService.searchUsers(this.searchTerm).subscribe({
        next: (data: User[]) => {
          this.users = data;
          this.isLoading = false; // Désactiver l'état de chargement
        },
        error: (error: any) => {
          console.error('Error searching users:', error);
          this.isLoading = false; // Désactiver l'état de chargement même en cas d'erreur
        }
      });
    } else {
      this.users = []; // Réinitialiser les résultats si le terme de recherche est vide
    }
  }

  viewUserInfo(userId: number): void {
    this.router.navigate(['/user-info', userId]);
  }
}
