import React from 'react';
import { View, StatusBar, useColorScheme, StyleSheet } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoomsProvider } from './src/context/RoomsContext.tsx';
import RootNavigator from "./src/navigation/RootNavigator.tsx";
import {RoomTypesProvider} from "./src/context/RoomTypesContext.tsx";
import {AmenitiesProvider} from "./src/context/AmenitiesContext.tsx";
import {GuestsProvider} from "./src/context/GuestsContext.tsx";
import {WorkersProvider} from "./src/context/WorkersContext.tsx";
import {PaymentsProvider} from "./src/context/PaymentsContext.tsx";
import {AdditionalOffersProvider} from "./src/context/AdditionalOffersContext.tsx";
import {PaperProvider} from "react-native-paper";
import {ReservationsProvider} from "./src/context/ReservationsContext.tsx";
import {theme} from "./src/theme/theme.ts";


function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        
            <SafeAreaProvider>
                <PaperProvider theme={theme}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                    <ReservationsProvider>
                        <AdditionalOffersProvider>
                            <PaymentsProvider>
                                <WorkersProvider>
                                    <RoomTypesProvider>
                                        <RoomsProvider>
                                            <AmenitiesProvider>
                                                <GuestsProvider>
                                                    <AppContent />
                                                </GuestsProvider>
                                            </AmenitiesProvider>
                                        </RoomsProvider>
                                    </RoomTypesProvider>
                                </WorkersProvider>
                            </PaymentsProvider>
                        </AdditionalOffersProvider>
                    </ReservationsProvider>
                </PaperProvider>
            </SafeAreaProvider>
        
    );
}

function AppContent(): React.JSX.Element {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <RootNavigator />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;