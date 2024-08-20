import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service'; // Assurez-vous que le chemin est correct
import { Router } from '@angular/router';
import { Login } from '../Models/Login'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      username: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  // Validator pour vérifier que les mots de passe correspondent
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.errorMessage = 'Veuillez remplir correctement le formulaire.';
      return;
    }

    const { username, newPassword } = this.forgotPasswordForm.value;

    const loginData: Login = {
      Pseudo: username,
      Password: newPassword
    };

    this.authService.forgotPassword(loginData).subscribe({
      next: () => {
        this.successMessage = 'Le mot de passe a été réinitialisé avec succès.';
        this.errorMessage = null;
        this.forgotPasswordForm.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Une erreur est survenue.';
        this.successMessage = null;
      }
    });
  }
}
