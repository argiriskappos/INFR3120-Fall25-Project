// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app-routing.module'; // Imports the routes array

bootstrapApplication(AppComponent, {
  providers: [
    // Global Providers for the application
    provideRouter(routes), // Enables the Angular Router
    provideHttpClient(),   // Enables the HttpClient for API calls
    // You may also list your global services here (e.g., AuthService, TrucksService)
  ]
}).catch(err => console.error(err));