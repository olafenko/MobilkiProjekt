import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {BottomNavigationParamList, HomePageStackParamList} from "./types.ts";
import HomeScreen from "../screens/HomeScreen.tsx";
import RoomsScreen from "../screens/rooms/RoomsScreen.tsx";
import ReservationsScreen from "../screens/reservations/ReservationsScreen.tsx";
import RoomTypesScreen from "../screens/roomTypes/RoomTypesScreen.tsx";
import {BottomNavigation} from "react-native-paper";
import AmenitiesScreen from "../screens/amenities/AmenitiesScreen.tsx";
import WorkersScreen from "../screens/workers/WorkersScreen.tsx";
import GuestsScreen from "../screens/guests/GuestsScreen.tsx";
import PaymentsScreen from "../screens/payments/PaymentsScreen.tsx";
import AdditionalOffersScreen from "../screens/additionalOffers/AdditionalOffersScreen.tsx";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Stack = createNativeStackNavigator<HomePageStackParamList>()


function HomePageStackNavigator() {
    
    return (
        <Stack.Navigator screenOptions={
            {headerStyle: { backgroundColor: '#1e1e26' },
            headerTintColor: '#C5A059',
            headerShadowVisible: false,
            headerTitleStyle: { fontWeight: 'bold'}}}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Amenities"
                component={AmenitiesScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Workers"
                component={WorkersScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Guests"
                component={GuestsScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Payments"
                component={PaymentsScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="AdditionalOffers"
                component={AdditionalOffersScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
        
    );
    
    
}

const Tab = createBottomTabNavigator<BottomNavigationParamList>()

export function BottomNavigator() {
    
    return (
      <Tab.Navigator
          screenOptions={{
              headerStyle: { backgroundColor: '#1e1e26' },
              headerTintColor: '#C5A059',
              headerShadowVisible: false,
              headerTitleStyle: { fontWeight: 'bold' },
          }}
          tabBar={({ navigation, state, descriptors }) => (
              <BottomNavigation.Bar
                  navigationState={state}
                  style={{ backgroundColor: '#1e1e26' }}
                  activeColor="#C5A059"
                  inactiveColor="#888"
                  onTabPress={({ route, preventDefault }) => {
                      const event = navigation.emit({
                          type: 'tabPress',
                          target: route.key,
                          canPreventDefault: true,
                      });

                      if (event.defaultPrevented) {
                          preventDefault();
                      } else {
                          navigation.navigate(route.name, route.params);
                      }
                  }}
                  renderIcon={({ route, focused, color }) => {
                      const { options } = descriptors[route.key];
                      if (options.tabBarIcon) {
                          return options.tabBarIcon({ focused, color, size: 24 });
                      }
                      return null;
                  }}
                  getLabelText={({ route }) => {
                      const { options } = descriptors[route.key];
                      return options.tabBarLabel as string ?? options.title ?? route.name;
                  }}
              />
          )}
      >
          <Tab.Screen
              name="HomePage"
              component={HomePageStackNavigator}
              options={{
                  headerShown: false,
                  tabBarIcon: ({ color }) => <Icon name="view-dashboard" size={24} color={color} />,
                  tabBarLabel: "Panel główny"
              }}
          />
          <Tab.Screen
              name="Reservations"
              component={ReservationsScreen}
              options={{
                  headerShown: false,
                  tabBarIcon: ({ color }) => <Icon name="calendar-check" size={24} color={color} />,
                  tabBarLabel: "Rezerwacje"
              }}
          />
          <Tab.Screen
              name="Rooms"
              component={RoomsScreen}
              options={{
                  headerShown: false,
                  tabBarIcon: ({ color }) => <Icon name="bed-king-outline" size={24} color={color} />,
                  tabBarLabel: "Pokoje"
              }}
          />
          <Tab.Screen
              name="RoomTypes"
              component={RoomTypesScreen}
              options={{
                  headerShown: false,
                  tabBarIcon: ({ color }) => <Icon name="format-list-bulleted" size={24} color={color} />,
                  tabBarLabel: "Typy pokoi"
              }}
          />
      </Tab.Navigator>
    );
}