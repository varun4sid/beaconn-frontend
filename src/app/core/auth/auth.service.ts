import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthSession, LoginRequest, LoginResponse } from './auth.models';

const API_URL = 'http://localhost:8080';
const SESSION_KEY = 'beaconn.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = signal<AuthSession | null>(this.readSession());
  readonly currentSession = this.session.asReadonly();

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, credentials).pipe(
      tap((response) => {
        if (response.status !== 'success') {
          throw new Error('The server did not confirm the login.');
        }

        const session: AuthSession = {
          username: response.username || credentials.rollno,
          rollno: credentials.rollno,
          password: credentials.password,
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        this.session.set(session);
      }),
    );
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.session.set(null);
  }

  private readSession(): AuthSession | null {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as AuthSession;
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }
}
