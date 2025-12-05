// src/app/reset-password/reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { User } from '../models/user.models';

// Define the types used by this component
interface PasswordResetPayload {
  newPassword: string;
  confirmPassword: string;
}
interface MessageResponse {
  message?: string;
  error?: string;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['/src/css/form_style.css'],
})
export class ResetPasswordComponent implements OnInit {
  title = 'Reset Password';
  User: User | null = null;
  activePage = 'reset-password';
  error: string | null = null;
  success: string | null = null;
  token: string | null = null;

  // FIX 1: Explicitly type formData
  formData: PasswordResetPayload = {
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
    });

    this.token = this.route.snapshot.paramMap.get('token');
    if (!this.token) {
        this.error = 'Invalid or missing password reset token.';
    }
  }

  resetPassword(): void {
    this.error = null;
    this.success = null;

    if (!this.token || !this.formData.newPassword || !this.formData.confirmPassword) {
        this.error = 'All fields are required.';
        return;
    }

    if (this.formData.newPassword !== this.formData.confirmPassword) {
        this.error = 'Passwords do not match.';
        return;
    }

    if (this.formData.newPassword.length < 6) {
        this.error = 'Password must be at least 6 characters long.';
        return;
    }

    // FIX 2: The call is now correctly matched to the new service signature
    this.authService.resetPassword(this.token, this.formData).subscribe((response: MessageResponse) => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = response.message || 'Password updated successfully! Redirecting to login...';
        // Redirect to login on success
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    });
  }
}