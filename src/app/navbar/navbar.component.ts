import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service'; // Assurez-vous du chemin correct

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userRole: string | null = null;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
  }

  logout(): void {
    this.authService.logout(); // Gère la déconnexion
    this.router.navigate(['/login']); // Redirection vers la page de connexion
  }
}
