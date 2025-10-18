export interface ItineraryData {
  // Basic Info
  travelerName: string;
  destination: string;
  duration: string;
  departureFrom: string;
  departureTo: string;
  adults: number;
  children: number;
  infants: number;
  totalTravelers: number;
  
  // Days
  days: DayData[];
  
  // Flights
  flights: FlightData[];
  
  // Hotels
  hotels: HotelData[];
  
  // Payment Plan
  totalAmount: number;
  currency: string;
  tds: string;
  installments: InstallmentData[];
  
  // Visa Details
  visaType: string;
  visaProcessingDays: string;
  
  // Important Notes
  importantNotes: NoteData[];
  
  // Scope of Service
  scopeOfService: ServiceData[];
  
  // Inclusions
  inclusions: InclusionData[];
  
  // Activities
  activities: ActivityData[];
}

export interface DayData {
  id: string;
  dayNumber: number;
  date: string;
  imageUrl?: string;
  morning: ActivityData;
  afternoon: ActivityData;
  evening: ActivityData;
}

export interface ActivityData {
  id: string;
  title: string;
  description: string;
  city?: string;
  type?: string;
  timeRequired?: string;
}

export interface FlightData {
  id: string;
  date: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
}

export interface HotelData {
  id: string;
  city: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  hotelName: string;
}

export interface InstallmentData {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending';
}

export interface NoteData {
  id: string;
  point: string;
  details: string;
}

export interface ServiceData {
  id: string;
  service: string;
  details: string;
}

export interface InclusionData {
  id: string;
  category: string;
  count: string;
  details: string;
  status: string;
}
