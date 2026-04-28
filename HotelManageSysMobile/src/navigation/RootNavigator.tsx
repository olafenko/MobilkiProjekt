import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import RoomsScreen from "../screens/RoomsScreen.tsx";
import AddRoomScreen from "../screens/AddRoomScreen.tsx";
import {RootStackParamList} from "./types.ts";
import UpdateRoomScreen from "../screens/UpdateRoomScreen.tsx";


const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator(): React.JSX.Element {
    
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={ {headerStyle: { backgroundColor: '#007AFF' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}>
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
                
                
                
            </Stack.Navigator>
            
            
            
        </NavigationContainer>
        
    );
    
}
export default  RootNavigator;