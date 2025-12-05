// src/app/home/home.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- NEW: For *ngIf
import { RouterLink } from '@angular/router'; // <-- NEW: For routerLink
import { AuthService } from '../services/auth.services';
import { User } from '../models/user.models';

@Component({
  selector: 'app-home',
  standalone: true, // <-- NEW
  imports: [CommonModule, RouterLink], // <-- NEW: Required for template directives/router
  templateUrl: './home.component.html',
  styleUrls: ['/src/css/style.css'],
})
export class HomeComponent implements OnInit {
  title = 'Welcome';
  User: User | null = null;
  activePage = 'home';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
    });
  }
}