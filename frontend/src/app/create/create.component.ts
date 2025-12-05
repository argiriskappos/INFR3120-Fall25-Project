// src/app/create/create.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- NEW: For *ngIf
import { FormsModule } from '@angular/forms'; // <-- NEW: For [(ngModel)]
import { Router, RouterLink } from '@angular/router'; // <-- NEW: For routerLink
import { AuthService } from '../services/auth.services';
import { TrucksService } from '../services/truck.services';
import { User } from '../models/user.models';
import { TripCreationPayload } from '../models/trip.models'; // Placeholder import

@Component({
  selector: 'app-create',
  standalone: true, // <-- NEW
  imports: [CommonModule, FormsModule, RouterLink], // <-- NEW: Required imports
  templateUrl: './create.component.html',
  styleUrls: ['/src/css/form_style.css'], 
})
export class CreateComponent implements OnInit {
  title = 'Log New Trip';
  User: User | null = null;
  activePage = 'create';
  error: string | null = null;
  success: string | null = null;
  
  tripData: TripCreationPayload = {
    tripName: '',
    truckId: '',
    driverName: '',
    routeStart: '',
    routeEnd: '',
    scheduledDeparture: '',
    estimatedArrival: '',
    cargoType: '',
    weightKg: 0,
    manifestSummary: '',
    status: 'Scheduled' 
  };

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
      }
      // Pre-fill driverName if user is logged in
      if (this.User && !this.tripData.driverName) {
        this.tripData.driverName = this.User.fullName;
      }
    });
  }

  logTrip(): void {
    this.error = null;
    this.success = null;

    const payload: TripCreationPayload = {
        ...this.tripData,
        weightKg: Number(this.tripData.weightKg) 
    };

    this.trucksService.createTrip(payload).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = 'Trip logged successfully!';
        setTimeout(() => this.router.navigate(['/trucks']), 1500);
      }
    });
  }
}