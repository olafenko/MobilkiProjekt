import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import AddRoomScreen from "../screens/rooms/AddRoomScreen.tsx";
import {RootStackParamList} from "./types.ts";
import UpdateRoomScreen from "../screens/rooms/UpdateRoomScreen.tsx";
import AddRoomTypeScreen from "../screens/roomTypes/AddRoomTypeScreen.tsx";
import UpdateRoomTypeScreen from "../screens/roomTypes/UpdateRoomTypeScreen.tsx";
import AddAmenityScreen from "../screens/amenities/AddAmenityScreen.tsx";
import UpdateAmenityScreen from "../screens/amenities/UpdateAmenityScreen.tsx";
import AddGuestScreen from "../screens/guests/AddGuestScreen.tsx";
import UpdateGuestScreen from "../screens/guests/UpdateGuestScreen.tsx";
import AddWorkerScreen from "../screens/workers/AddWorkerScreen.tsx";
import UpdateWorkerScreen from "../screens/workers/UpdateWorkerScreen.tsx";
import AddAdditionalOfferScreen from "../screens/additionalOffers/AddAdditionalOfferScreen.tsx";
import UpdateAdditionalOfferScreen from "../screens/additionalOffers/UpdateAdditionalOfferScreen.tsx";
import AddReservationScreen from "../screens/reservations/AddReservationScreen.tsx";
import UpdateReservationScreen from "../screens/reservations/UpdateReservationScreen.tsx";
import AddPaymentScreen from "../screens/payments/AddPaymentScreen.tsx";
import {BottomNavigator} from "./BottomNavigator.tsx";


const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator(): React.JSX.Element {
    
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="BottomNavigator"
                screenOptions={{
                headerStyle: { backgroundColor: '#1e1e26',},
                headerTintColor: '#C5A059',
                headerShadowVisible: false,
                headerTitleStyle: { fontWeight: 'bold' },
            }}>
                <Stack.Screen
                    name="BottomNavigator"
                    component={BottomNavigator}
                    options={{headerShown: false}}
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
                    name="AddPayment"
                    component={AddPaymentScreen}
                    options={{title: "Nowa płatność"}}
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
                    name="AddReservation"
                    component={AddReservationScreen}
                    options={{title: "Dodaj rezerwacje"}}
                />
                <Stack.Screen
                    name="UpdateReservation"
                    component={UpdateReservationScreen}
                    options={{title: "Edytuj rezerwacje"}}
                />
            </Stack.Navigator>
        </NavigationContainer>
        
    );
    
}
export default  RootNavigator;