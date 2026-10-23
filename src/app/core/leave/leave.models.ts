export interface LeaveRequest {
  rollno: string;
  password: string;
  numDays?: number;
  fromDate?: string;
  toDate?: string;
  reason?: string;
}

export interface LeaveResponse {
  status: string;
  message: string;
}
