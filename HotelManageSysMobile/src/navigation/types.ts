import type {Amenity, Guest, Room, RoomType, Worker} from '../types/models';


export type RootStackParamList = {
    
    Home: undefined;
    
    Rooms: undefined;
    AddRoom: undefined;
    UpdateRoom: { room: Room};
    
    RoomTypes: undefined;
    AddRoomType: undefined;
    UpdateRoomType: { roomType: RoomType};
    
    Amenities: undefined;
    AddAmenity: undefined;
    UpdateAmenity: { amenity: Amenity};
    
    Reservations: undefined;
    
    Workers: undefined;
    AddWorker: undefined;
    UpdateWorker: { worker: Worker};
    
    Guests: undefined;
    AddGuest: undefined;
    UpdateGuest: { guest: Guest};
    
    AdditionalOffers: undefined;
    
}