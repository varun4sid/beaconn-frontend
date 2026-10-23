import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly themeService = inject(ThemeService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly showPassword = signal(false);

  readonly loginForm = this.formBuilder.nonNullable.group({
    rollno: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.loginForm.invalid || this.isSubmitting()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (error: { status?: number }) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          error.status === 401
            ? 'The roll number or password is incorrect.'
            : 'Could not reach Beaconn. Check that the backend is running.',
        );
      },
    });
  }

  togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }
}
