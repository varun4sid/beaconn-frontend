import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { LeaveService } from '../../core/leave/leave.service';
import { ThemeService } from '../../core/theme/theme.service';
import { TokenService } from '../../core/token/token.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.component.css',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly tokenService = inject(TokenService);
  readonly themeService = inject(ThemeService);
  private readonly leaveService = inject(LeaveService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly isLoadingToken = signal(false);
  readonly tokenError = signal('');
  readonly isQrModalOpen = signal(false);
  readonly leaveMode = signal<'quick' | 'custom'>('quick');
  readonly leaveDays = signal(1);
  readonly isCustomDays = signal(false);
  readonly leaveStart = signal<'yesterday' | 'today' | 'tomorrow'>('today');
  readonly isSubmittingLeave = signal(false);
  readonly leaveMessage = signal('');
  readonly leaveError = signal('');

  readonly leaveForm = this.formBuilder.nonNullable.group({
    numDays: [1, [Validators.required, Validators.min(1), Validators.max(30)]],
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required],
    reason: [''],
  });

  ngOnInit(): void {
    this.setLeaveStart('today');
    this.loadToken();
  }

  loadToken(): void {
    this.isLoadingToken.set(true);
    this.tokenError.set('');
    this.tokenService.fetch().subscribe({
      next: () => this.isLoadingToken.set(false),
      error: () => {
        this.isLoadingToken.set(false);
        this.tokenError.set('Token could not be loaded. Try again.');
      },
    });
  }

  openQrModal(): void {
    this.isQrModalOpen.set(true);
  }

  closeQrModal(): void {
    this.isQrModalOpen.set(false);
  }

  setLeaveMode(mode: 'quick' | 'custom'): void {
    this.leaveMode.set(mode);
    this.leaveMessage.set('');
    this.leaveError.set('');
  }

  setLeaveDays(days: number): void {
    this.leaveDays.set(days);
    this.isCustomDays.set(false);
    this.leaveMode.set('quick');
    this.leaveForm.controls.numDays.setValue(days);
    this.setLeaveStart(this.leaveStart());
  }

  setCustomDays(): void {
    this.isCustomDays.set(true);
    this.leaveMode.set('quick');
    this.leaveForm.controls.numDays.setValue(3);
    this.setLeaveStart(this.leaveStart());
  }

  setLeaveStart(start: 'yesterday' | 'today' | 'tomorrow'): void {
    this.leaveStart.set(start);
    const offset = start === 'yesterday' ? -1 : start === 'tomorrow' ? 1 : 0;
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const fromDate = this.toInputDate(date);
    const toDate = new Date(date);
    toDate.setDate(toDate.getDate() + this.leaveForm.controls.numDays.value - 1);
    this.leaveForm.patchValue({
      fromDate,
      toDate: this.toInputDate(toDate),
    });
  }

  applyLeave(): void {
    if (this.isSubmittingLeave()) {
      return;
    }

    const values = this.leaveForm.getRawValue();
    if (this.leaveMode() === 'quick') {
      if (this.leaveForm.controls.numDays.invalid) {
        this.leaveForm.controls.numDays.markAsTouched();
        return;
      }
    } else if (this.leaveForm.controls.fromDate.invalid || this.leaveForm.controls.toDate.invalid) {
      this.leaveForm.controls.fromDate.markAsTouched();
      this.leaveForm.controls.toDate.markAsTouched();
      return;
    }

    if (this.leaveMode() === 'custom' && values.toDate < values.fromDate) {
      this.leaveError.set('The end date cannot be before the start date.');
      return;
    }

    this.isSubmittingLeave.set(true);
    this.leaveMessage.set('');
    this.leaveError.set('');
    const request = {
      fromDate: this.toBackendDate(values.fromDate),
      toDate: this.toBackendDate(values.toDate),
      reason: values.reason || undefined,
    };

    this.leaveService.apply(request).subscribe({
      next: (response) => {
        this.isSubmittingLeave.set(false);
        this.leaveMessage.set(response.message || 'Leave applied successfully.');
      },
      error: (error: { error?: string }) => {
        this.isSubmittingLeave.set(false);
        this.leaveError.set(error.error || 'Leave could not be applied. Try again.');
      },
    });
  }

  logout(): void {
    this.tokenService.clear();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private toBackendDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  private toInputDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
