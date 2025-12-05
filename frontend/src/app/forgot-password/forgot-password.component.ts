// src/app/forgot-password/forgot-password.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- NEW: For *ngIf
import { FormsModule } from '@angular/forms'; // <-- NEW: For [(ngModel)]
import { Router, RouterLink } from '@angular/router'; // <-- NEW: For routerLink
import { AuthService } from '../services/auth.services';
import { User } from '../models/user.models';

@Component({
  selector: 'app-forgot-password',
  standalone: true, // <-- NEW
  imports: [CommonModule, FormsModule, RouterLink], // <-- NEW: Required imports
  templateUrl: './forgot-password.component.html',
  styleUrls: ['/src/css/form_style.css'], 
})
export class ForgotPasswordComponent implements OnInit {
  title = 'Forgot Password';
  User: User | null = null;
  activePage = 'forgot-password';
  email: string = '';
  error: string | null = null;
  success: string | null = null; 

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
    });
  }

  submitForgotPassword(): void {
    this.error = null;
    this.success = null;

    this.authService.forgotPassword(this.email).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = response.message || 'If an account was found, a reset link has been sent to your email.';
      }
    });
  }
}