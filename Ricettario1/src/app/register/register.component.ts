import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../core/interfaces/user'; 
import { UserService } from '../core/services/user.service'; 

const letrasPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]*$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,}$/;

export function passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) return null;

    if (passwordControl.value !== confirmPasswordControl.value) {
      return { passwordMismatch: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] 
})
export class RegisterComponent {
  formRegister: FormGroup;
  passwordFieldType: string = 'password';
  passwordFieldTypeConfirm: string = 'password';
  mensajeRegistro: string = ''; // Nuevo mensaje para mostrar en la pantalla

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private userService: UserService 
  ) {
    this.formRegister = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.pattern(passwordPattern)]),
      password2: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      first_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(letrasPattern)]),
      last_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(letrasPattern)]),
    }, { validators: passwordMatchValidator('password', 'password2') });
  }

  get password() { return this.formRegister.get('password') as FormControl; }
  get email() { return this.formRegister.get('email') as FormControl; }
  get first_name() { return this.formRegister.get('first_name') as FormControl; }
  get last_name() { return this.formRegister.get('last_name') as FormControl; }

  registerUser(): void {
    if (this.formRegister.invalid) {
      this.formRegister.markAllAsTouched();
      return;
    }

    const objeto: User = {
      password: this.formRegister.value.password,
      password2: this.formRegister.value.password2,
      email: this.formRegister.value.email,
      first_name: this.formRegister.value.first_name,
      last_name: this.formRegister.value.last_name,
    };

    this.userService.registerUser(objeto).subscribe({
      next: (data: any) => {
        console.log("Utente registrato con successo:", data);
        this.mensajeRegistro = "✅ Registrazione avvenuta con successo! Reindirizzamento al login...";

        setTimeout(() => {
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          this.router.navigate(['/login']);
        }, 3000); // Espera 3 segundos antes de redirigir
      },
      error: (error: any) => {
        console.error('Errore durante la registrazione:', error);
        this.mensajeRegistro = "❌ Errore nella registrazione. Riprova.";
      }
    });
  }

  togglePassword(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  togglePasswordConfirm(): void {
    this.passwordFieldTypeConfirm = this.passwordFieldTypeConfirm === 'password' ? 'text' : 'password';
  }
}
