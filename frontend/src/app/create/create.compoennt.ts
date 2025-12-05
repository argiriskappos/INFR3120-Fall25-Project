import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { TrucksService } from '../services/truck.services';
import { User } from '../models/user.models';
import { TripCreationPayload } from '../models/trip.models'; // Import the new type

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['/src/css/form_style.css'], // Adjust path if needed
})
export class CreateComponent implements OnInit {
  title = 'Log New Trip';
  User: User | null = null;
  activePage = 'create';
  error: string | null = null;
  success: string | null = null;

  // Explicitly type tripData using the payload interface
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
    status: 'Scheduled' // This is now correctly typed as 'Scheduled' | 'In-Transit' | 'Completed' | 'Delayed'
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

    // The payload now correctly inherits the required types from TripCreationPayload
    const payload: TripCreationPayload = {
        ...this.tripData,
        weightKg: Number(this.tripData.weightKg) // Ensure weight is a number
    };

    this.trucksService.createTrip(payload).subscribe(response => {
      if (response.error) {
        this.error = response.error;
      } else {
        this.success = 'Trip logged successfully!';
        
        // Reset form for new entry, ensuring `status` remains correctly typed.
        this.tripData = {
            tripName: '',
            truckId: '',
            // Keep the driverName pre-filled if a user is logged in
            driverName: this.User ? this.User.fullName : '', 
            routeStart: '',
            routeEnd: '',
            scheduledDeparture: '',
            estimatedArrival: '',
            cargoType: '',
            weightKg: 0,
            manifestSummary: '',
            status: 'Scheduled' 
        };
        
        // Redirect after a short delay
        setTimeout(() => this.router.navigate(['/trucks']), 1500);
      }
    });
  }
}