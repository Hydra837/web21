import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './Models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (user) => {
        this.user = user;
        console.log('Utilisateur actuel:', this.user);
      },
      (error) => {
        console.error('Erreur:', error);
      }
    );
  }
}
