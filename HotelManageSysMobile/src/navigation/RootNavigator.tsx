import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React from "react";
import {NavigationContainer} from "@react-navigation/native";


const Stack = createNativeStackNavigator();

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
                    options={{title: "Pokoje"}}
                />
                <Stack.Screen
                    name="EditRoom"
                    component={EditRoomScreen}
                    options={{title: "Pokoje"}}
                />
                
                
                
            </Stack.Navigator>
            
            
            
        </NavigationContainer>
        
    );
    
}
export default  RootNavigator;