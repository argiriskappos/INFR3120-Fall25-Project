// src/app/trucks/trucks.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Required for *ngIf, *ngFor
import { Router, RouterLink } from '@angular/router'; // <-- Required for routerLink
import { AuthService } from '../services/auth.services';
import { TrucksService } from '../services/truck.services';
import { User } from '../models/user.models';
import { Trip } from '../models/trip.models'; // Essential import for Trip type

@Component({
  selector: 'app-trucks',
  standalone: true, 
  imports: [CommonModule, RouterLink], // Required imports for standalone component
  templateUrl: './trucks.component.html',
  styleUrls: ['/src/css/style.css','/src/css/form_style.css'], 
})
export class TrucksComponent implements OnInit {
  title = 'Active Trips';
  User: User | null = null;
  activePage = 'trucks';
  trips: Trip[] = [];
  error: string | null = null;
  loading: boolean = true; 

  constructor(
    private authService: AuthService,
    private trucksService: TrucksService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
      if (!this.User) {
        this.router.navigate(['/login']);
      } else {
        this.getTrips();
      }
    });
  }

  getTrips(): void {
    this.error = null;
    this.loading = true;

    // FIX 1: Use the correct service method: getTrips()
    // FIX 2: Explicitly type the response parameter to resolve the 'implicit any' error.
    this.trucksService.getTrips().subscribe((response: Trip[] | { error: string }) => { 
      this.loading = false;
      
      // Check if the response is an error object
      if (response && 'error' in response) {
        this.error = response.error;
        this.trips = []; // Clear trips on error
      } 
      // Check if the response is a successful array of trips
      else if (Array.isArray(response)) {
        this.trips = response;
      } 
      // Handle any other unexpected response
      else {
        this.error = 'Received an unexpected response format.';
        this.trips = []; 
      }
    });
  }
}