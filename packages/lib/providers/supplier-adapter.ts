// packages/lib/providers/supplier-adapter.ts

export type TravelVertical = 'hospedagem' | 'carros' | 'transfers' | 'aereo' | 'seguros' | 'tours';

export interface SupplierHealthStatus {
  supplierId: string;
  supplierName: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'disabled';
  color: 'green' | 'yellow' | 'red' | 'gray';
  latencyMs: number;
  message: string;
  lastCheckedAt: string;
}

export interface BaseSupplierCredentials {
  keyId: string;
  token: string;
  baseUrl: string;
  isSandbox?: boolean;
}

// ------------------------------------
// 1. Hospedagem (Hotels) Interfaces
// ------------------------------------
export interface HotelSearchGuest {
  adults: number;
  children?: number[]; // Child ages, e.g. [5, 12]
}

export interface HotelSearchRequest {
  hid?: number;
  hotelIds?: string[];
  checkin: string; // YYYY-MM-DD
  checkout: string; // YYYY-MM-DD
  residency: string; // ISO 2-letter code, e.g. "uz", "br"
  language?: string;
  currency?: string;
  guests: HotelSearchGuest[];
}

export interface HotelRate {
  bookHash: string;
  matchHash: string;
  roomName: string;
  mealName: string;
  hasBreakfast: boolean;
  netPriceAmount: number;
  currency: string;
  cancellationDeadline?: string | null;
}

export interface HotelSearchResponse {
  hotelId: string;
  hid: number;
  rates: HotelRate[];
}

export interface PrebookRequest {
  matchHash: string;
  priceIncreasePercent?: number;
}

export interface PrebookResponse {
  bookHash: string;
  isValid: boolean;
  priceChanged: boolean;
  newNetPriceAmount?: number;
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  isChild?: boolean;
  age?: number;
}

export interface RoomBookingGuestDetails {
  guests: GuestInfo[];
}

export interface CreateBookingRequest {
  partnerOrderId: string;
  bookHash: string;
  userEmail: string;
  userPhone: string;
  rooms: RoomBookingGuestDetails[];
  paymentType?: 'deposit' | 'hotel' | 'now';
}

export interface BookingResponse {
  partnerOrderId: string;
  supplierOrderId: string;
  status: 'completed' | 'processing' | 'cancelled' | 'failed';
  totalNetPrice: number;
  currency: string;
}

// ------------------------------------
// 2. Aluguel de Carros (Car Rental) Interfaces
// ------------------------------------
export interface CarSearchRequest {
  pickupLocationId: string;
  dropoffLocationId: string;
  pickupDatetime: string; // ISO string
  dropoffDatetime: string; // ISO string
  driverAge: number;
  residency: string;
  currency?: string;
}

export interface CarRate {
  matchHash: string;
  vehicleCategory: string;
  modelName: string;
  vendorName: string;
  passengersCapacity: number;
  luggageCapacity: number;
  transmission: 'manual' | 'automatic';
  hasAirConditioning: boolean;
  netPriceAmount: number;
  currency: string;
}

export interface CarSearchResponse {
  cars: CarRate[];
}

// ------------------------------------
// 3. Traslados (Transfers) Interfaces
// ------------------------------------
export interface LocationPoint {
  type: 'airport' | 'hotel' | 'address' | 'coordinates';
  code?: string;
  id?: string;
  name?: string;
  coordinates?: { lat: number; lng: number };
}

export interface TransferSearchRequest {
  pickupPoint: LocationPoint;
  dropoffPoint: LocationPoint;
  pickupDatetime: string;
  passengers: {
    adults: number;
    childrenAges?: number[];
  };
  roundTrip?: boolean;
  currency?: string;
}

export interface TransferOption {
  matchHash: string;
  vehicleType: 'sedan' | 'suv' | 'minivan' | 'van' | 'bus';
  maxPassengers: number;
  maxLuggage: number;
  netPriceAmount: number;
  currency: string;
  flightTrackingIncluded: boolean;
}

export interface TransferSearchResponse {
  transfers: TransferOption[];
}

// ------------------------------------
// Core Supplier Adapter Interfaces
// ------------------------------------
export interface IHotelSupplierAdapter {
  checkHealth?(): Promise<SupplierHealthStatus>;
  searchHotel(req: HotelSearchRequest): Promise<HotelSearchResponse>;
  prebookRate(req: PrebookRequest): Promise<PrebookResponse>;
  createBooking(req: CreateBookingRequest): Promise<BookingResponse>;
  getBookingInfo(partnerOrderId: string): Promise<BookingResponse>;
}

export interface ICarSupplierAdapter {
  searchCars(req: CarSearchRequest): Promise<CarSearchResponse>;
  prebookCar(matchHash: string): Promise<PrebookResponse>;
  createCarBooking(req: { partnerOrderId: string; matchHash: string; driver: GuestInfo }): Promise<BookingResponse>;
}

export interface ITransferSupplierAdapter {
  searchTransfers(req: TransferSearchRequest): Promise<TransferSearchResponse>;
  prebookTransfer(matchHash: string): Promise<PrebookResponse>;
  createTransferBooking(req: { partnerOrderId: string; matchHash: string; leadPassenger: GuestInfo; flightNumber?: string }): Promise<BookingResponse>;
}
