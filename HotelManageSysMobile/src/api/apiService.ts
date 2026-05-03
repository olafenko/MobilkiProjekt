import {API_BASE_URL} from "./config.ts";

import type {
    Amenity, CreateAmenityRequest, CreateGuestRequest,
    CreateRoomRequest,
    CreateRoomTypeRequest, CreateWorkerRequest, Guest,
    Room,
    RoomType, UpdateAmenityRequest, UpdateGuestRequest,
    UpdateRoomRequest, UpdateRoomTypeRequest, UpdateWorkerRequest, Worker
} from "../types/models.ts";

class ApiService {
    
    private baseUrl: string;
    
    constructor() {
        this.baseUrl = API_BASE_URL;
    }
    
    private async request<T>(endpoint: string, options: RequestInit = {}):Promise<T> {
        
        const url = `${this.baseUrl}${endpoint}`;

        const HeadersCtor = (globalThis as any).Headers;
        let headers: any;
        if (HeadersCtor) {
            headers = new HeadersCtor(options.headers as any);
            if (!headers.has('Content-Type')) {
                headers.set('Content-Type', 'application/json');
            }
        } else {
            headers = {
                'Content-Type': 'application/json',
                ...(options.headers as any),
            };
        }
        
        try {
            console.log(`API Request: ${options.method || 'GET'} ${url}`);
            
            const response = await fetch(url, {
                ...options,
                headers,
            });
            
            if(!response.ok){
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
            }
            
            if(response.status === 204){
                return {} as T;
            }
            
            const data = await response.json();
            console.log("API Response: ",data);
            return data;
        } catch(error) {
            console.error("API Error: ", error);
            throw error;
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
        return this.request<{id: number}>('/Guest', {
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

}

export default new ApiService();