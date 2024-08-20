import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { UserFORM } from '../Models/User'; // Assurez-vous d'importer votre interface UserFORM

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) {
    // Initialisation du formulaire
    this.registerForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]], // Validation de l'email
      password: ['', [Validators.required, Validators.minLength(6)]],
      pseudo: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit() {
    if (this.registerForm.valid) {
      const userData: UserFORM = this.registerForm.value;
  
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Enregistrement réussi!', response);
        },
        error: (error) => {
          this.errorMessage = error.message;
          console.error('Erreur lors de l\'enregistrement', error);
        }
      });
    } else {
      console.log('Formulaire invalide:', this.registerForm.controls);
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }
}
