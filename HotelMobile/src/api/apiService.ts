import {API_BASE_URL} from "./config.ts";

import {
    AdditionalOffer,
    Amenity, CreateAdditionalOfferRequest,
    CreateAmenityRequest,
    CreateGuestRequest,
    CreatePaymentRequest, CreateReservationRequest,
    CreateRoomRequest,
    CreateRoomTypeRequest,
    CreateWorkerRequest,
    Guest,
    Payment, PaymentStatus, Reservation,
    Room,
    RoomType, UpdateAdditionalOfferRequest,
    UpdateAmenityRequest,
    UpdateGuestRequest, UpdateReservationRequest,
    UpdateRoomRequest,
    UpdateRoomTypeRequest,
    UpdateWorkerRequest,
    Worker
} from "../types/models.ts";
import {ApiError} from "../types/errors.ts";

class ApiService {
    
    private baseUrl: string;
    
    constructor() {
        this.baseUrl = API_BASE_URL;
    }
    
    private async request<T>(endpoint: string, options: RequestInit = {}):Promise<T> {
        
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };
        
        try {
            
            //DO OGARNIECIA RZUCANIE TYCH WYJATKOW
            const response = await fetch(url,config);
            
            const data = await response.json().catch(() => null);
            
            if(!response.ok){
                if(data && data.type && data.title){
                    throw data as ApiError;
                }
                
                throw {
                    type: 'Error',
                    title: data?.message || `HTTP ERROR ${response.status}`,
                    status: response.status,
                } as ApiError;
                
            }

            return data as T;
        } catch(error) {
            
            if(error instanceof TypeError && error.message === "Network request failed"){
                throw {
                    type: 'NetworkError',
                    title: 'Brak połączenia z serwerem',
                    status: 0,
                    detail: 'Sprawdz połączenie internetowe i spróbuj ponownie'
                } as ApiError
            }
            
            if(typeof error === 'object' && error !== null && 'type' in error){
                throw error;
            }
            
            throw {
                type: 'UnknownError',
                title: error instanceof Error ? error.message : "Nieznany błąd",
                status: 500,
            } as ApiError
            
        }
    }
    
    // <--------- ROOMS --------->
    
    async getRooms(): Promise<Room[]> {
        return this.request<Room[]>('/Rooms');
    }

    async getRoom(id: number): Promise<Room> {
        return this.request<Room>(`/Rooms/${id}`);
    }
    
    async createRoom(data: CreateRoomRequest) : Promise<{ id: number }>{
        return this.request<{id: number}>('/Rooms', {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateRoom(id: number, data: UpdateRoomRequest) : Promise<void>{
        return this.request<void>(`/Rooms/${id}`, {
            method: "PUT",
            body: JSON.stringify({...data, roomId: id})
        });
    }
    
    async deleteRoom(id: number) : Promise<void>{
        return this.request<void>(`/Rooms/${id}`, {
            method: "DELETE"
        });
    }
    
    async getAmenities(): Promise<Amenity[]> {
       
        return this.request<Amenity[]>('/Amenities');
    }

    async createAmenity(data: CreateAmenityRequest) : Promise<{ id: number }>{
        return this.request<{id: number}>('/Amenities', {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateAmenity(id: number, data: UpdateAmenityRequest) : Promise<void>{
        return this.request<void>(`/Amenities/${id}`, {
            method: "PUT",
            body: JSON.stringify({...data, amenityId: id})
        });
    }

    async deleteAmenity(id: number) : Promise<void>{
        return this.request<void>(`/Amenities/${id}`, {
            method: "DELETE"
        });
    }

    async getRoomTypes(): Promise<RoomType[]> {

        return this.request<RoomType[]>('/RoomTypes');
    }

    async createRoomType(data: CreateRoomTypeRequest) : Promise<{ id: number }>{
        return this.request<{id: number}>('/RoomTypes', {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateRoomType(id: number, data: UpdateRoomTypeRequest) : Promise<void>{
        return this.request<void>(`/RoomTypes/${id}`, {
            method: "PUT",
            body: JSON.stringify({...data, roomTypeId: id})
        });
    }

    async deleteRoomType(id: number) : Promise<void>{
        return this.request<void>(`/RoomTypes/${id}`, {
            method: "DELETE"
        });
    }

    async getWorkers(): Promise<Worker[]> {

        return this.request<Worker[]>('/Workers');
    }

    async createWorker(data: CreateWorkerRequest) : Promise<{ id: number }>{
        return this.request<{id: number}>('/Workers', {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateWorker(id: number, data: UpdateWorkerRequest) : Promise<void>{
        return this.request<void>(`/Workers/${id}`, {
            method: "PUT",
            body: JSON.stringify({...data, workerId: id})
        });
    }

    async deleteWorker(id: number) : Promise<void>{
        return this.request<void>(`/Workers/${id}`, {
            method: "DELETE"
        });
    }

    async getGuests(): Promise<Guest[]> {

        return this.request<Guest []>('/Guests');
    }

    async createGuest(data: CreateGuestRequest) : Promise<{ id: number }>{
        return this.request<{id: number}>('/Guests', {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateGuest(id: number, data: UpdateGuestRequest) : Promise<void>{
        return this.request<void>(`/Guests/${id}`, {
            method: "PUT",
            body: JSON.stringify({...data, guestId: id})
        });
    }

    async deleteGuest(id: number) : Promise<void>{
        return this.request<void>(`/Guests/${id}`, {
            method: "DELETE"
        });
    }

    async getAdditionalOffers(): Promise<AdditionalOffer[]> {

        return this.request<AdditionalOffer []>('/AdditionalOffers');
    }

    async createAdditionalOffer(data: CreateAdditionalOfferRequest) : Promise<{ id: number }>{
        return this.request<{id: number}>('/AdditionalOffers', {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateAdditionalOffer(id: number, data: UpdateAdditionalOfferRequest) : Promise<void>{
        return this.request<void>(`/AdditionalOffers/${id}`, {
            method: "PUT",
            body: JSON.stringify({...data, additionalOfferId: id})
        });
    }

    async deleteAdditionalOffer(id: number) : Promise<void>{
        return this.request<void>(`/AdditionalOffers/${id}`, {
            method: "DELETE"
        });
    }

    async getPayments(): Promise<Payment[]> {

        return this.request<Payment []>('/Payments');
    }

    async createPayment(data: CreatePaymentRequest) : Promise<{ id: number }>{
        return this.request<{id: number}>('/Payments', {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async deletePayment(id: number) : Promise<void>{
        return this.request<void>(`/Payments/${id}`, {
            method: "DELETE"
        });
    }

    async getReservations(paymentStatus?: PaymentStatus): Promise<Reservation[]> {

        if(paymentStatus){
            return this.request<Reservation []>(`/Reservations?paymentStatus=${paymentStatus}`); 
        }
        
        return this.request<Reservation []>('/Reservations');
    }

    async createReservation(data: CreateReservationRequest) : Promise<{ id: number }>{
        return this.request<{id: number}>('/Reservations', {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateReservation(id: number, data: UpdateReservationRequest) : Promise<void>{
        return this.request<void>(`/Reservations/${id}`, {
            method: "PUT",
            body: JSON.stringify({...data, reservationId: id})
        });
    }

    async deleteReservation(id: number) : Promise<void>{
        return this.request<void>(`/Reservations/${id}`, {
            method: "DELETE"
        });
    }

}

export default new ApiService();