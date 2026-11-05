import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LeaveRequest, LeaveResponse } from './leave.models';
import { config } from '../config.generated';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  apply(request: Omit<LeaveRequest, 'rollno' | 'password'>): Observable<LeaveResponse> {
    const session = this.auth.currentSession();
    if (!session) {
      return throwError(() => new Error('You must be signed in to apply for leave.'));
    }

    return this.http.post<LeaveResponse>(`${config.apiUrl}/leave/apply`, {
      ...request,
      rollno: session.rollno,
      password: session.password,
    });
  }
}
