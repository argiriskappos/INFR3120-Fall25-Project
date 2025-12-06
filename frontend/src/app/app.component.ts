import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, // Required to render nested components
    HttpClientModule
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Fleet Operations Tracker';
}