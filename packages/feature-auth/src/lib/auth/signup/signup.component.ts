import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@employee-management/data';
import { CustomInputComponent } from '@employee-management/shared-ui';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CustomInputComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public signupError = '';

  public signupForm = this.formBuilder.nonNullable.group(
    {
      name: ['', Validators.required],

      username: ['', [
        Validators.required,
        Validators.minLength(3),
      ]],

      email: ['', [
        Validators.required,
        Validators.email,
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(6),
      ]],

      confirmPassword: ['', Validators.required],
    },
    {
      validators: this.passwordMatchValidator(),
    }
  );

  public get passwordMismatchError(): string {
    return this.signupForm.controls.confirmPassword.touched &&
      this.signupForm.hasError('passwordMismatch')
      ? 'Passwords do not match.'
      : '';
  }

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      if (!password || !confirmPassword) {
        return null;
      }

      return password === confirmPassword
        ? null
        : { passwordMismatch: true };
    };
  }

  public onSubmit(): void {
    this.signupError = '';

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const {
      name,
      username,
      email,
      password,
    } = this.signupForm.getRawValue();

    const signupSuccessful = this.authService.signup({
      name,
      username,
      email,
      password,
    });

    if (!signupSuccessful) {
      this.signupError = 'Username or email already exists.';
      return;
    }
    this.router.navigate(['/login']);
  }
}