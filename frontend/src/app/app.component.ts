// src/app/app.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet // Required to render nested components
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Fleet Operations Tracker';
}