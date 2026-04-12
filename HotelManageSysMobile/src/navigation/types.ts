import type { Room } from '../types/models';


export type RootStackParamList = {
    
    Home: undefined;
    
    Rooms: undefined;
    CreateRoom: undefined;
    EditRoom: { room: Room};
    
    RoomTypes: undefined;
    Reservations: undefined;
    Workers: undefined;
    Guests: undefined;
    Amenities: undefined;
    AdditionalOffers: undefined;
    
}