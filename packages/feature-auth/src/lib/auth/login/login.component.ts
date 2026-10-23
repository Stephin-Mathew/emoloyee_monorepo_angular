import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@employee-management/data';
import { CustomInputComponent } from '@employee-management/shared-ui';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CustomInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private  formBuilder = inject(FormBuilder);
  private  authService = inject(AuthService);
  private  router = inject(Router);

  public loginError = '';

  public loginForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  public onSubmit(): void {
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.getRawValue();

    const isValid = this.authService.login(credentials);

    if (!isValid) {
      this.loginError = 'Invalid username or password.';
      return;
    }

    this.router.navigate(['/employees/table']);
  }
}