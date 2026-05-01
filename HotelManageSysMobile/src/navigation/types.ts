import type {Amenity, Room, RoomType} from '../types/models';


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
    Guests: undefined;
    AdditionalOffers: undefined;
    
}