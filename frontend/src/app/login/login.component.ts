// src/app/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- For *ngIf
import { FormsModule } from '@angular/forms'; // <-- For [(ngModel)]
import { Router, RouterLink } from '@angular/router'; // <-- For routing and routerLink
import { AuthService } from '../services/auth.services';
import { User } from '../models/user.models';

@Component({
  selector: 'app-login',
  standalone: true, // <-- NEW
  imports: [CommonModule, FormsModule, RouterLink], // <-- Required imports
  templateUrl: './login.component.html',
  styleUrls: ['/src/css/form_style.css'], 
})
export class LoginComponent implements OnInit {
  title = 'Login';
  User: User | null = null;
  activePage = 'login';
  error: string | null = null;
  success: string | null = null;

  formData = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
      // Optional: Redirect already logged-in users
      if (this.User) {
        this.router.navigate(['/']); 
      }
    });
  }

  // FIX APPLIED HERE: Passing the entire this.formData object
  login(): void {
    this.error = null;
    this.success = null;

    // The login method correctly receives the formData object { email, password }
    this.authService.login(this.formData).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = 'Login successful!';
        // Navigate to the home page or dashboard on success
        this.router.navigate(['/']); 
      }
    });
  }
}