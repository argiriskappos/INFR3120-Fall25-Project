import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
// Assuming you have a User model defined at this path:
import { User } from '../models/user.models'; 

// --- Interface Definitions for clean typing (highly recommended) ---

// Define the shape of the data for registration
interface RegistrationPayload {
  fullName: string;
  email: string;
  password: string;
  role: 'Driver' | 'Dispatcher' | 'Admin';
}

// Define the shape of the data for password reset
interface PasswordResetPayload {
  newPassword: string;
  confirmPassword: string;
}

// Define a common response structure for API calls
interface MessageResponse {
  message?: string;
  error?: string;
  user?: User; // Returned on successful login/signup
}

// -----------------------------------------------------------------

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api'; // Base API URL for your backend routes
  private userSource = new BehaviorSubject<User | null>(null);
  
  // Public observable for components to subscribe to
  currentUser = this.userSource.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromSession();
  }

  // Load user from local storage on service initialization
  private loadUserFromSession(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        this.userSource.next(JSON.parse(userJson));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  // Getter for convenience (reads the current value from the BehaviorSubject)
  get User(): User | null {
    return this.userSource.value;
  }

  /**
   * Sends login credentials to the API and stores the user on success.
   */
  login(formData: any): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/login`, formData).pipe(
      tap((response: MessageResponse) => {
        if (response.user) {
          this.userSource.next(response.user);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      }),
      catchError(error => {
        return of({ error: error.error?.error || 'Login failed.' });
      })
    );
  }

  /**
   * Sends registration data to the API and stores the user on success.
   */
  signUp(formData: RegistrationPayload): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/signup`, formData).pipe(
      tap((response: MessageResponse) => {
        // After successful registration, the backend usually logs the user in.
        if (response.user) {
            this.userSource.next(response.user);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      }),
      catchError(error => {
        return of({ error: error.error?.error || 'Registration failed.' });
      })
    );
  }

  /**
   * Logs out the user on the backend and clears the client-side session.
   */
  logout(): void {
    // Invalidate the session on the backend
    this.http.get(`${this.apiUrl}/logout`).subscribe({
      next: () => {
        this.userSource.next(null);
        localStorage.removeItem('currentUser');
      },
      error: () => {
        // Even if logout API fails, clear client side session
        this.userSource.next(null);
        localStorage.removeItem('currentUser');
      }
    });
  }

  /**
   * Initiates the forgot password process by sending an email address.
   */
  forgotPassword(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(error => {
        return of({ error: error.error?.error || 'Failed to process request.' });
      })
    );
  }

  /**
   * **FIXED METHOD**
   * Resets the user's password using the provided token and new password data.
   * This is the correct signature to accept two arguments as expected by your component.
   */
  resetPassword(token: string | null, formData: PasswordResetPayload): Observable<MessageResponse> {
    if (!token) {
        return of({ error: 'Missing password reset token.' });
    }

    // Combine the token and form data into a single payload for the API
    const payload = {
        token: token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
    };

    // Assuming the backend handles the reset via a single POST endpoint with the token in the body
    return this.http.post<MessageResponse>(`${this.apiUrl}/reset-password`, payload).pipe(
      catchError(error => {
        return of({ error: error.error?.error || 'Password reset failed.' });
      })
    );
  }
}