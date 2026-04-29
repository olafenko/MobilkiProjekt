
export enum RoomStatus {
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED'
}

export enum ReservationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

export enum PaymentStatus {
    PAID = 'PAID',
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED',
}

export enum PaymentMethod {
    MONEY = 'MONEY',
    CARD = 'CARD',
    TRANSFER = 'TRANSFER',
}

export interface Room {
    
    roomId: number;
    number: string;
    floor: number;
    description: string;
    status: RoomStatus;
    roomTypeId: number;
    roomTypeName: string;
    basePrice: number;
    amenitiesNames: string[];
    isActive: boolean;
}

export interface CreateRoomRequest {
    
    number: string;
    floor: number;
    description?: string;
    status: RoomStatus;
    roomTypeId: number;
    amenitiesIds: (number | string)[];
}

export interface UpdateRoomRequest extends CreateRoomRequest{
    roomId: number;
}

export interface RoomType {
    roomTypeId: number;
    name: string;
    basePrice: number;
    description?: string;
    isActive?: boolean;
}

export interface Amenity {
    amenityId: number;
    name: string;
    description?: string;
    isActive?: boolean;
}

export interface Guest {
    guestId: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    identityCardNumber: string;
    isActive: boolean;
}

export interface CreateGuestRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    identityCardNumber: string;
}

export interface UpdateGuestRequest extends CreateGuestRequest {
    guestId: number;
}

export interface Worker {
    workerId: number;
    firstName: string;
    lastName: string;
    login: string;
    isActive: boolean;
}

export interface CreateWorkerRequest {
    firstName: string;
    lastName: string;
    login: string;
    password: string;
}

export interface UpdateWorkerRequest extends CreateWorkerRequest {
    workerId: number;
}

export interface AdditionalOffer {
    additionalOfferId: number;
    name: string;
    price: number;
    isActive: boolean;
}

export interface CreateAdditionalOfferRequest {
    name: string;
    price: number;
}

export interface UpdateAdditionalOfferRequest extends CreateAdditionalOfferRequest {
    additionalOfferId: number;
}

export interface Reservation {
    reservationId: number;
    totalPrice: number;
    reservationDate: string;
    checkInDate: string;
    checkOutDate: string;
    reservationStatus: ReservationStatus | null;
    guestId: number;
    guestFullName: string | null;
    roomId: number;
    roomNumber: string | null;
    workerId: number;
    workerFullName: string | null;
    additionalOffersNames: string[];
    isActive: boolean;
}

export interface CreateReservationRequest {
    totalPrice: number;
    reservationDate?: string;
    checkInDate: string;
    checkOutDate: string;
    reservationStatus: ReservationStatus;
    guestId: number;
    roomId: number;
    workerId: number;
}

export interface UpdateReservationRequest extends Omit<CreateReservationRequest, 'reservationDate'> {
    reservationId: number;
    reservationDate: string;
}

export interface Payment {
    paymentId: number;
    title: string;
    paymentStatus: PaymentStatus | null;
    paymentMethod: PaymentMethod | null;
    price: number;
    paymentDate: string;
    reservationId: number;
    isActive: boolean;
}

export interface CreatePaymentRequest {
    title: string;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    price: number;
    paymentDate?: string;
    reservationId: number;
}

export interface UpdatePaymentRequest extends Omit<CreatePaymentRequest, 'paymentDate'> {
    paymentId: number;
    paymentDate: string;
}
