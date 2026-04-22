import type { Room } from '../types/models';


export type RootStackParamList = {
    
    Home: undefined;
    
    Rooms: undefined;
    AddRoom: undefined;
    EditRoom: { room: Room};
    
    RoomTypes: undefined;
    Reservations: undefined;
    Workers: undefined;
    Guests: undefined;
    Amenities: undefined;
    AdditionalOffers: undefined;
    
}