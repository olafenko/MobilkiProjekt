import type {AdditionalOffer, Amenity, Guest, Payment, Reservation, Room, RoomType, Worker} from '../types/models';


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
    AddReservation: undefined;
    UpdateReservation: { reservation: Reservation};
    
    Workers: undefined;
    AddWorker: undefined;
    UpdateWorker: { worker: Worker};
    
    Guests: undefined;
    AddGuest: undefined;
    UpdateGuest: { guest: Guest};

    Payments: undefined;
    AddPayment: undefined;
    
    AdditionalOffers: undefined;
    AddAdditionalOffer: undefined;
    UpdateAdditionalOffer: { additionalOffer: AdditionalOffer};
    
}