// src/app/edit/edit.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- NEW: For *ngIf
import { FormsModule } from '@angular/forms'; // <-- NEW: For [(ngModel)]
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // <-- NEW: For routerLink
import { AuthService } from '../services/auth.services';
import { TrucksService } from '../services/truck.services';
import { User } from '../models/user.models';
import { Trip, TripCreationPayload } from '../models/trip.models'; // Placeholder import

@Component({
  selector: 'app-edit',
  standalone: true, // <-- NEW
  imports: [CommonModule, FormsModule, RouterLink], // <-- NEW: Required imports
  templateUrl: './edit.component.html',
  styleUrls: ['/src/css/form_style.css'], 
})
export class EditComponent implements OnInit {
  title = 'Edit Trip';
  User: User | null = null;
  activePage = 'trucks'; 
  error: string | null = null;
  success: string | null = null;
  trip: Trip | null = null;
  tripId: string | null = null;
  isModalOpen: boolean = false; 

  constructor(
    private authService: AuthService,
    private trucksService: TrucksService,
    private router: Router,
    private route: ActivatedRoute 
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
      if (!this.User) {
        this.router.navigate(['/login']);
      } else {
        this.tripId = this.route.snapshot.paramMap.get('id');
        if (this.tripId) {
          this.getTripDetails(this.tripId);
        } else {
          this.error = 'No trip ID provided.';
        }
      }
    });
  }

  getTripDetails(id: string): void {
    this.trucksService.getTripById(id).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.trip = response.trip;
        this.title = `Edit Trip: ${this.trip?.tripName || id}`;
      }
    });
  }

  saveTrip(): void {
    this.error = null;
    this.success = null;
    
    if (!this.trip || !this.tripId) {
        this.error = 'Trip data is missing.';
        return;
    }

    const payload: TripCreationPayload = { 
        ...this.trip, 
        weightKg: Number(this.trip.weightKg) 
    };

    this.trucksService.updateTrip(this.tripId, payload).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = 'Trip updated successfully!';
        setTimeout(() => this.router.navigate(['/trucks']), 1500);
      }
    });
  }

  deleteTrip(): void {
    this.error = null;
    this.success = null;
    this.isModalOpen = false; 

    if (!this.tripId) {
        this.error = 'Trip ID is missing for deletion.';
        return;
    }

    this.trucksService.deleteTrip(this.tripId).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = 'Trip deleted successfully!';
        setTimeout(() => this.router.navigate(['/trucks']), 1500);
      }
    });
  }
}