import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {Amenity} from "../../types/models.ts";
import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect} from "react";
import {useAmenities} from "../../context/AmenitiesContext.tsx";

type Props = NativeStackScreenProps<RootStackParamList, 'Amenities'>;

function AmenitiesScreen({ navigation }: Props) {

    const { amenities, loading, error, refreshAmenities, deleteAmenity} = useAmenities();

    useEffect(() => {
        refreshAmenities();
    }, []);

    const handleDelete = (amenity: Amenity)=> {

        Alert.alert("Usuwanie typu pokoju",`Czy napewno usunąć typ pokoju ${amenity.name}?`,
            [
                { text: "Anuluj", style: 'cancel'},
                {
                    text: "Usuń", style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAmenity(amenity.amenityId);
                            Alert.alert("Operacja powiodła się.","Usunięto udogodnienie.");
                        } catch (err){
                            const errMessage = err instanceof Error ? err.message : "Unknown error";
                            Alert.alert("Błąd",errMessage);
                        }
                    }
                },
            ]);

    }

    const handleEdit = (amenity: Amenity) => {
        navigation.navigate('UpdateAmenity',{ amenity });
    }

    const renderAmenity = ({item:amenity } : { item:Amenity }) => {
        return (<View style={styles.roomCard}>
            <View style={styles.roomContent}>
                <Text style={styles.roomNumber}>Nazwa: {amenity.name}</Text>
                <Text>Opis: {amenity.description || "Brak"}</Text>
            </View>
            <View style={styles.roomActions}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(amenity)}
                >
                    <Text style={styles.buttonText}>Edytuj ✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(amenity)}
                >
                    <Text style={styles.buttonText}>Usuń 🗑️</Text>
                </TouchableOpacity>
            </View>

        </View>);
    }

    if(loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Ładowanie udogodnień...</Text>
            </View>

        );
    }

    if(error){
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>❌ Błąd: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Udogodnienia ({amenities.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddAmenity')}
                >
                    <Text style={styles.addButtonText}>+ Dodaj</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={amenities}
                renderItem={renderAmenity}
                keyExtractor={(amenity) => amenity.amenityId.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Brak udogodnień</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    roomCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    roomContent: {
        flex: 1,
    },
    roomNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    roomPrice: {
        fontSize: 14,
        color: '#007AFF',
        marginTop: 4,
        fontWeight: '500',
    },
    roomType: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    itemUnit: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    roomActions: {
        flexDirection: 'row',
        columnGap: 8,  // gap wspierany od RN 0.71+
    },
    editButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 6,
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 6,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
        marginTop: 40,
    },
});

export default AmenitiesScreen;