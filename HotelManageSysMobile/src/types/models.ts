
export enum RoomStatus {
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED'
}

export interface Room {
    
    roomId: number;
    number: string;
    floor: number;
    description?: string;
    status: RoomStatus;
    roomTypeId: number;
    roomTypeName: string;
    basePrice: number;
    amenitiesNames: string [];
    isActive: boolean;
}

export interface CreateRoomRequest {
    
    number: string;
    floor: number;
    description?: string;
    status: RoomStatus;
    roomTypeId: number;
}

export interface UpdateRoomRequest extends CreateRoomRequest{
    roomId: number;
}