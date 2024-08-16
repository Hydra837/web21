import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service'; // Assurez-vous de mettre le bon chemin vers votre service
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Assurez-vous que le chemin vers les styles est correct
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    // Initialisation du formulaire réactif
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Connexion via le service d'authentification
      this.authService.login(username, password).subscribe({
        next: (response) => {
          console.log('Connexion réussie:', response);
          this.authService.setToken(response.token); // Stockez le token dans le service d'authentification
          this.router.navigate(['/home']); // Redirection après connexion réussie
        },
        error: (error) => {
          console.error('Erreur lors de la connexion:', error);
          this.errorMessage = 'Login failed. Please check your username and password.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }

  // Méthode pour vérifier si un champ du formulaire est invalide
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);

    if (!control) {
      return false; // or true if you want to handle undefined controls as invalid
    }

    return control.invalid && (control.touched || control.dirty);
  }

  // Méthode pour obtenir le message d'erreur pour un champ
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required.';
    }
    // Ajouter d'autres messages d'erreur ici si nécessaire
    return '';
  }
}
