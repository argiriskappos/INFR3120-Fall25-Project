import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { TrucksService } from '../services/truck.services';
import { User } from '../models/user.models';
import { Trip } from '../models/trip.models';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['/src/css/form_style.css'], // Adjust path if needed
})
export class EditComponent implements OnInit {
  title = 'Edit Trip';
  User: User | null = null;
  activePage = 'trucks';
  trip: Trip | any = {}; // Holds the trip data
  tripId: string | null = null;
  error: string | null = null;
  success: string | null = null;
  isModalOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private trucksService: TrucksService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.User = user;
      if (!this.User) {
        this.router.navigate(['/login']);
      }
    });

    this.tripId = this.route.snapshot.paramMap.get('id');
    if (this.tripId) {
      this.loadTripData(this.tripId);
    } else {
      this.error = 'No Trip ID provided.';
    }
  }

  loadTripData(id: string): void {
    this.trucksService.getTripById(id).subscribe(response => {
      if (response.error) {
        this.error = response.error;
        this.trip = {};
      } else {
        this.trip = response as Trip;
        this.formatDatesForInput(); // Re-format ISO dates for <input type="date">
      }
    });
  }

  // Helper to format ISO date strings for HTML input[type=date] (YYYY-MM-DD)
  formatDatesForInput(): void {
    if (this.trip.scheduledDeparture) {
      this.trip.scheduledDeparture = new Date(this.trip.scheduledDeparture).toISOString().substring(0, 10);
    }
    if (this.trip.estimatedArrival) {
      this.trip.estimatedArrival = new Date(this.trip.estimatedArrival).toISOString().substring(0, 10);
    }
  }

  saveChanges(): void {
    this.error = null;
    this.success = null;
    if (!this.tripId) return;

    this.trucksService.updateTrip(this.tripId, this.trip).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = 'Trip updated successfully!';
        setTimeout(() => this.router.navigate(['/trucks']), 1500);
      }
    });
  }

  deleteTrip(): void {
    this.isModalOpen = false;
    this.error = null;
    this.success = null;
    if (!this.tripId) return;

    this.trucksService.deleteTrip(this.tripId).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = 'Trip deleted successfully.';
        setTimeout(() => this.router.navigate(['/trucks']), 1500);
      }
    });
  }
}