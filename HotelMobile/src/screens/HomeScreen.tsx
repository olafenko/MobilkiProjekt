import {StyleSheet, View} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {HomePageStackParamList} from "../navigation/types.ts";
import {Button, Text} from "react-native-paper";

type Props = NativeStackScreenProps<HomePageStackParamList, 'Home'>;

function HomeScreen({navigation} : Props ) {

    return (
        <View style={styles.container}>

            <Text variant="headlineMedium" style={styles.title}>Menu główne</Text>

            <View style={styles.buttonContainer}>
                <Button icon="star-outline" mode="outlined" style={styles.menuButton} textColor="#C5A059" onPress={() => navigation.navigate('Amenities')}>
                    Udogodnienia
                </Button>

                <Button icon="account-group" mode="outlined" style={styles.menuButton} textColor="#C5A059" onPress={() => navigation.navigate('Guests')}>
                    Baza gości
                </Button>

                <Button icon="account-tie" mode="outlined" style={styles.menuButton} textColor="#C5A059" onPress={() => navigation.navigate('Workers')}>
                    Baza pracowników
                </Button>

                <Button icon="credit-card-outline" mode="outlined" style={styles.menuButton} textColor="#C5A059" onPress={() => navigation.navigate('Payments')}>
                    Płatności
                </Button>

                <Button icon="room-service-outline" mode="outlined" style={styles.menuButton} textColor="#C5A059" onPress={() => navigation.navigate('AdditionalOffers')}>
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
        backgroundColor: '#1e1e26',
    },
    title: {
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: 'bold',
        color: '#C5A059',
    },
    buttonContainer: {
        gap: 16,
    },
    menuButton: {
        paddingVertical: 8,
        borderColor: 'rgba(197, 160, 89, 0.4)',
        borderWidth: 1,
        borderRadius: 12,
    }
});

export default HomeScreen;