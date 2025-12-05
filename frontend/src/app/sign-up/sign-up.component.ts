// src/app/sign-up/sign-up.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.services';
// FIX: Import the necessary types: User, RegistrationPayload, and AuthResponse
import { User, RegistrationPayload, AuthResponse } from '../models/user.models'; 

@Component({
  selector: 'app-sign-up',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './sign-up.component.html',
  styleUrls: ['/src/css/form_style.css'],
})
export class SignUpComponent implements OnInit {
  title = 'Register';
  User: User | null = null;
  activePage = 'signup';
  error: string | null = null;
  success: string | null = null;

  // FIX 3: Explicitly type formData using the RegistrationPayload interface
  formData: RegistrationPayload = {
    fullName: '',
    email: '',
    password: '',
    role: 'Driver', // Default role
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Redirect logged-in users away from the sign-up page
    this.authService.currentUser.subscribe(user => {
      this.User = user;
      if (this.User) {
        this.router.navigate(['/']); 
      }
    });
  }

  register(): void {
    this.error = null;
    this.success = null;

    if (this.formData.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    // FIX 2: Use AuthResponse as the explicit type for the 'response' parameter
    this.authService.signUp(this.formData).subscribe((response: AuthResponse) => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = 'Registration successful! Redirecting...';
        // After success, wait a moment then redirect to the trucks page
        setTimeout(() => {
          this.router.navigate(['/trucks']);
        }, 1500);
      }
    });
  }
}