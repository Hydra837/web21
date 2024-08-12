import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service'; // Assurez-vous du chemin correct

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userRole: string | null = null;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    //this.userRole = this.authService.getUserRole(); // Assurez-vous que cette méthode renvoie le rôle de l'utilisateur
  }
}
