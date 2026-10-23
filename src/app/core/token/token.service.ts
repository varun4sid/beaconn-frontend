import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { TokenResponse } from './token.models';

const API_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly tokenState = signal<TokenResponse | null>(null);

  readonly token = this.tokenState.asReadonly();

  fetch(): Observable<TokenResponse> {
    const session = this.auth.currentSession();
    if (!session) {
      return throwError(() => new Error('You must be signed in to fetch a token.'));
    }

    return this.http.post<TokenResponse>(`${API_URL}/token`, {
      rollno: session.rollno,
      password: session.password,
    }).pipe(
      tap((response) => this.tokenState.set(response)),
    );
  }

  clear(): void {
    this.tokenState.set(null);
  }
}
