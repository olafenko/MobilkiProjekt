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
            </Stack.Navigator>
        </NavigationContainer>
        
    );
    
}
export default  RootNavigator;