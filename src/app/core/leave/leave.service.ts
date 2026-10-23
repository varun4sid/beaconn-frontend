import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LeaveRequest, LeaveResponse } from './leave.models';

const API_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  apply(request: Omit<LeaveRequest, 'rollno' | 'password'>): Observable<LeaveResponse> {
    const session = this.auth.currentSession();
    if (!session) {
      return throwError(() => new Error('You must be signed in to apply for leave.'));
    }

    return this.http.post<LeaveResponse>(`${API_URL}/leave/apply`, {
      ...request,
      rollno: session.rollno,
      password: session.password,
    });
  }
}
