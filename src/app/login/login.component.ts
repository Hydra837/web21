import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Assurez-vous que le chemin est correct
import { mapToLogin } from '../path-to-your-mapper';
import { Login } from '../path-to-your-login-interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Utiliser le bon service
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      Pseudo: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    // Utiliser le mapper pour formater les données de connexion
    const loginData: Login = mapToLogin(this.loginForm.value);

    this.authService.login(loginData).subscribe({
      next: (response) => {
        const token = response.token; // Assurez-vous que la réponse contient un jeton
        if (token) {
          this.authService.setUser({
            ...response.user, // Assurez-vous que votre API renvoie l'utilisateur
            token
          });
          sessionStorage.setItem('jwtToken', token); // Stocker le token dans sessionStorage
          this.router.navigate(['/dashboard']); // Redirection après connexion
        } else {
          this.errorMessage = 'Jeton non reçu. Échec de la connexion.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Échec de la connexion. Veuillez vérifier vos identifiants.';
        console.error(err);
      }
    });
  }
}
