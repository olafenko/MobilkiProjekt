import type {AdditionalOffer, Amenity, Guest, Payment, Reservation, Room, RoomType, Worker} from '../types/models';


export type RootStackParamList = {
    
    BottomNavigator:  undefined;
    
    AddRoom: undefined;
    UpdateRoom: { room: Room};
    
    AddRoomType: undefined;
    UpdateRoomType: { roomType: RoomType};
    
    AddAmenity: undefined;
    UpdateAmenity: { amenity: Amenity};
    
    AddReservation: undefined;
    UpdateReservation: { reservation: Reservation};
    
    AddWorker: undefined;
    UpdateWorker: { worker: Worker};
    
    AddGuest: undefined;
    UpdateGuest: { guest: Guest};
    
    AddPayment: undefined;
    
    AddAdditionalOffer: undefined;
    UpdateAdditionalOffer: { additionalOffer: AdditionalOffer};
    
}

export type BottomNavigationParamList = {
    
        HomePage: undefined;
        Rooms: undefined;
        Reservations: undefined;
        RoomTypes: undefined;
        
}

export type HomePageStackParamList = {
    
    Home: undefined;
    Amenities: undefined;
    Workers: undefined;
    Guests: undefined;
    Payments: undefined;
    AdditionalOffers: undefined;

}