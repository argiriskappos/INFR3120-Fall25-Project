import { User } from './user.models';

export type TripStatus = 'Scheduled' | 'In-Transit' | 'Completed' | 'Delayed';

export interface Trip {
  _id: string;
  tripName: string;
  truckId: string;
  driverName: string;
  routeStart: string;
  routeEnd: string;
  scheduledDeparture?: string; // ISO Date string
  estimatedArrival?: string; // ISO Date string
  cargoType: string;
  weightKg: number;
  manifestSummary: string;
  status: TripStatus; // Use the defined union type
  user?: User; // Optional user object if populated
}

// Define the structure for creating a new trip (doesn't include _id or user)
export type TripCreationPayload = Omit<Trip, '_id' | 'user'>;