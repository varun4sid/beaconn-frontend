import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/theme/theme.service';

const SAVED_CREDENTIALS_KEY = 'beaconn.login.credentials';

interface SavedCredentials {
  rollno: string;
  password: string;
}

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
  private readonly savedCredentials = this.readSavedCredentials();

  readonly loginForm = this.formBuilder.nonNullable.group({
    rollno: [this.savedCredentials?.rollno ?? '', [Validators.required]],
    password: [this.savedCredentials?.password ?? '', [Validators.required]],
  });

  submit(): void {
    if (this.loginForm.invalid || this.isSubmitting()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.saveCredentials(this.loginForm.getRawValue());
        this.router.navigate(['/dashboard']);
      },
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

  private readSavedCredentials(): SavedCredentials | null {
    const stored = localStorage.getItem(SAVED_CREDENTIALS_KEY);
    if (!stored) {
      return null;
    }

    try {
      const credentials = JSON.parse(stored) as Partial<SavedCredentials>;
      return typeof credentials.rollno === 'string' && typeof credentials.password === 'string'
        ? (credentials as SavedCredentials)
        : null;
    } catch {
      localStorage.removeItem(SAVED_CREDENTIALS_KEY);
      return null;
    }
  }

  private saveCredentials(credentials: SavedCredentials): void {
    localStorage.setItem(SAVED_CREDENTIALS_KEY, JSON.stringify(credentials));
  }
}
