import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import RoomsScreen from "../screens/rooms/RoomsScreen.tsx";
import AddRoomScreen from "../screens/rooms/AddRoomScreen.tsx";
import {RootStackParamList} from "./types.ts";
import UpdateRoomScreen from "../screens/rooms/UpdateRoomScreen.tsx";
import HomeScreen from "../screens/HomeScreen.tsx";
import RoomTypesScreen from "../screens/roomTypes/RoomTypesScreen.tsx";
import AddRoomTypeScreen from "../screens/roomTypes/AddRoomTypeScreen.tsx";
import UpdateRoomTypeScreen from "../screens/roomTypes/UpdateRoomTypeScreen.tsx";
import AmenitiesScreen from "../screens/amenities/AmenitiesScreen.tsx";
import AddAmenityScreen from "../screens/amenities/AddAmenityScreen.tsx";
import UpdateAmenityScreen from "../screens/amenities/UpdateAmenityScreen.tsx";
import GuestsScreen from "../screens/guests/GuestsScreen.tsx";
import AddGuestScreen from "../screens/guests/AddGuestScreen.tsx";
import UpdateGuestScreen from "../screens/guests/UpdateGuestScreen.tsx";
import WorkersScreen from "../screens/workers/WorkersScreen.tsx";
import AddWorkerScreen from "../screens/workers/AddWorkerScreen.tsx";
import UpdateWorkerScreen from "../screens/workers/UpdateWorkerScreen.tsx";
import PaymentsScreen from "../screens/payments/PaymentsScreen.tsx";
import CreatePaymentScreen from "../screens/payments/CreatePaymentScreen.tsx";
import AddAdditionalOfferScreen from "../screens/additionalOffers/AddAdditionalOfferScreen.tsx";
import AdditionalOffersScreen from "../screens/additionalOffers/AdditionalOffersScreen.tsx";
import UpdateAdditionalOfferScreen from "../screens/additionalOffers/UpdateAdditionalOfferScreen.tsx";
import ReservationsScreen from "../screens/reservations/ReservationsScreen.tsx";


const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator(): React.JSX.Element {
    
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                headerStyle: { backgroundColor: '#007AFF'},
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{title: "Panel główny"}}
                />
                <Stack.Screen
                name="Rooms"
                component={RoomsScreen}
                options={{title: "Pokoje"}}
                />
                <Stack.Screen
                    name="AddRoom"
                    component={AddRoomScreen}
                    options={{title: "Nowy pokój"}}
                />
                <Stack.Screen
                    name="UpdateRoom"
                    component={UpdateRoomScreen}
                    options={{title: "Edytuj pokój"}}
                />
                <Stack.Screen
                    name="RoomTypes"
                    component={RoomTypesScreen}
                    options={{title: "Typy pokoju"}}
                />
                <Stack.Screen
                    name="AddRoomType"
                    component={AddRoomTypeScreen}
                    options={{title: "Nowy typ pokoju"}}
                />
                <Stack.Screen
                    name="UpdateRoomType"
                    component={UpdateRoomTypeScreen}
                    options={{title: "Edytuj typ pokoju"}}
                />
                <Stack.Screen
                    name="Amenities"
                    component={AmenitiesScreen}
                    options={{title: "Udogodnienia"}}
                />
                <Stack.Screen
                    name="AddAmenity"
                    component={AddAmenityScreen}
                    options={{title: "Nowe udogodnienie"}}
                />
                <Stack.Screen
                    name="UpdateAmenity"
                    component={UpdateAmenityScreen}
                    options={{title: "Edytuj udogodnienie"}}
                />
                <Stack.Screen
                    name="Guests"
                    component={GuestsScreen}
                    options={{title: "Baza gości"}}
                />
                <Stack.Screen
                    name="AddGuest"
                    component={AddGuestScreen}
                    options={{title: "Nowy gość"}}
                />
                <Stack.Screen
                    name="UpdateGuest"
                    component={UpdateGuestScreen}
                    options={{title: "Edytuj gościa"}}
                />
                <Stack.Screen
                    name="Workers"
                    component={WorkersScreen}
                    options={{title: "Baza pracowników"}}
                />
                <Stack.Screen
                    name="AddWorker"
                    component={AddWorkerScreen}
                    options={{title: "Nowy pracownik"}}
                />
                <Stack.Screen
                    name="UpdateWorker"
                    component={UpdateWorkerScreen}
                    options={{title: "Edytuj pracownika"}}
                />
                <Stack.Screen
                    name="Payments"
                    component={PaymentsScreen}
                    options={{title: "Płatności"}}
                />
                <Stack.Screen
                    name="AddPayment"
                    component={CreatePaymentScreen}
                    options={{title: "Nowa płatność"}}
                />
                <Stack.Screen
                    name="AdditionalOffers"
                    component={AdditionalOffersScreen}
                    options={{title: "Oferty dodatkowe"}}
                />
                <Stack.Screen
                    name="AddAdditionalOffer"
                    component={AddAdditionalOfferScreen}
                    options={{title: "Dodaj oferte dodatkową"}}
                />
                <Stack.Screen
                    name="UpdateAdditionalOffer"
                    component={UpdateAdditionalOfferScreen}
                    options={{title: "Edytuj oferte dodatkową"}}
                />
                <Stack.Screen
                    name="Reservations"
                    component={ReservationsScreen}
                    options={{title: "Rezerwacje"}}
                />
                
            </Stack.Navigator>
        </NavigationContainer>
        
    );
    
}
export default  RootNavigator;