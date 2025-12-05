// src/app/models/user.models.ts

// Defines the structure of a successful User object
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'Driver' | 'Dispatcher' | 'Admin';
}

// Defines the structure of the data sent to the signUp endpoint
export interface RegistrationPayload {
  fullName: string;
  email: string;
  password: string;
  role: 'Driver' | 'Dispatcher' | 'Admin';
}

// Defines the structure of the API response for sign-up and login
export interface AuthResponse {
  user?: User;         // Present on successful registration/login
  error?: string;      // Present on API failure (e.g., email already exists)
}