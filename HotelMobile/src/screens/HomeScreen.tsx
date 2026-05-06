import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../navigation/types.ts";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({navigation} : Props ) {
   
    
    return (
        <View>
            <Text>Menu główne</Text>
            <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Rooms')}
            >
                <Text>Pokoje 🛏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('RoomTypes')}
            >
                <Text>Typy pokoju ⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Amenities')}
            >
                <Text>Udogodnienia 👨‍🦽</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Guests')}
            >
                <Text>Baza gości 👨</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Workers')}
            >
                <Text>Baza pracowników 👷</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Payments')}
            >
                <Text>Płatności 💰</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('AdditionalOffers')}
            >
                <Text>Dodatkowe oferty ➕</Text>
            </TouchableOpacity>
        </View>
        
    );
    
}

const styles = StyleSheet.create({
   menuButton: {
       
   } 
    
});


export default HomeScreen;