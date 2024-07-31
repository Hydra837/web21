// user-search.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'; // Assurez-vous que le chemin est correct
import { User } from '../Models/User'; // Assurez-vous que le modèle est correct

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  searchTerm: string = '';
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void { }

  searchUsers(): void {
    this.userService.searchUsers(this.searchTerm).subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (error: any) => {
        console.error('Error searching users:', error);
      }
    });
  }
}
