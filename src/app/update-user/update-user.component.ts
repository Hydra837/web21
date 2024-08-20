import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../user.service';
import { User, UserUpdateFORM } from '../Models/User'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  userForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router, 
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      pseudo: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Obtenir l'ID de l'utilisateur depuis les paramètres de la route
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(user => {

        this.userForm.patchValue(user);
      });
    }
  }
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.errorMessage = 'Veuillez remplir correctement le formulaire.';
      return;
    }

    const updatedUser: UserUpdateFORM = this.userForm.value;

    if (this.userId) {
      this.userService.updateUser1 (this.userId, updatedUser).subscribe({
        next: () => {
          this.successMessage = 'Utilisateur mis à jour avec succès.';
          this.errorMessage = null;
          // Rediriger l'utilisateur après la mise à jour
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Une erreur est survenue.';
          this.successMessage = null;
        }
      });
    }
  }
}
