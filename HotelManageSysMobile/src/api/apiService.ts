import {API_BASE_URL} from "./config.ts";

import type {
    Room,
    CreateRoomRequest,
    UpdateRoomRequest
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
    
    async createRoom(data: Omit<Room, "roomId">) : Promise<{id: number}>{
        return this.request<{id: number}>('/Rooms', {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateRoom(id: number, data: Partial<Room>) : Promise<void>{
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

}
