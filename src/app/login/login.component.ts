import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

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
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        const token = response.token; // Assurez-vous que la réponse contient un jeton
        sessionStorage.setItem('jwtToken', token); // Stocker le token dans sessionStorage
        this.router.navigate(['/dashboard']); // Redirection après connexion
      },
      error: (err) => {
        this.errorMessage = 'Échec de la connexion. Veuillez vérifier vos identifiants.';
        console.error(err);
      }
    });
  }
}
