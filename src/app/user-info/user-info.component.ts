import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../Models/User';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user: User | null = null;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(+userId).subscribe({
        next: (user: User | null) => {
          if (user) {
            this.user = user;
            this.redirectBasedOnRole(user);
          } else {
            this.errorMessage = 'Utilisateur non trouvé.';
            console.error('Utilisateur non trouvé');
          }
        },
        error: (error: any) => {
          this.errorMessage = 'Erreur lors de la récupération des informations de l\'utilisateur.';
          console.error(error);
        }
      });
    } else {
      this.errorMessage = 'ID utilisateur non fourni.';
      console.error('ID utilisateur non fourni');
    }
  }

  redirectBasedOnRole(user: User): void {
    if (user.role === 'Etudiant') {
      this.router.navigate(['/enrolled-courses', user.id]);
    } else if (user.role === 'Professeur') {
      this.router.navigate(['/courses-teacher', user.id]);
    }
  }
}
