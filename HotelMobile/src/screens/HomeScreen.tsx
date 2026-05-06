import {StyleSheet, View} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../navigation/types.ts";
import { Button, Text } from "react-native-paper";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({navigation} : Props ) {
   
    
    return (
        <View style={styles.container}>
            
            <Text variant="headlineMedium" style={styles.title}>Menu główne</Text>
            
            <View style={styles.buttonContainer}>
                <Button icon="calendar-month-outline" mode="outlined" style={styles.menuButton}   onPress={() => navigation.navigate('Reservations')}>
                    Rezerwacje
                </Button>
                <Button icon="door" mode="outlined" style={styles.menuButton}  onPress={() => navigation.navigate('Rooms')}>
                    Pokoje
                </Button>
                <Button icon="format-list-bulleted-type" mode="outlined" style={styles.menuButton}   onPress={() => navigation.navigate('RoomTypes')}>
                    Typy pokoi
                </Button>
                <Button icon="star-outline" mode="outlined" style={styles.menuButton}   onPress={() => navigation.navigate('Amenities')}>
                    Udogodnienia
                </Button>
                <Button icon="account-group" mode="outlined" style={styles.menuButton}   onPress={() => navigation.navigate('Guests')}>
                    Baza gości
                </Button>
                <Button icon="account-tie" mode="outlined" style={styles.menuButton}   onPress={() => navigation.navigate('Workers')}>
                    Baza pracowników
                </Button>
                <Button icon="credit-card-outline" mode="outlined" style={styles.menuButton}   onPress={() => navigation.navigate('Payments')}>
                    Płatności
                </Button>
                <Button icon="room-service-outline" mode="outlined" style={styles.menuButton}   onPress={() => navigation.navigate('AdditionalOffers')}>
                    Oferty dodatkowe
                </Button>
            </View>
        </View>
        
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: 'bold',
    },
    buttonContainer: {
        gap: 12,
    },
    menuButton: {
        paddingVertical: 6,
    }
    
});


export default HomeScreen;