import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {Guest} from "../../types/models.ts";
import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect} from "react";
import {useGuests} from "../../context/GuestsContext.tsx";

type Props = NativeStackScreenProps<RootStackParamList, 'Guests'>;

function GuestsScreen({ navigation }: Props) {

    const { guests, loading, error, refreshGuests, deleteGuest} = useGuests();

    useEffect(() => {
        refreshGuests();
    }, []);

    const handleDelete = (guest: Guest)=> {

        Alert.alert("Usuwanie gościa",`Czy na pewno usunąć gościa ${guest.firstName} ${guest.lastName}?`,
            [
                { text: "Anuluj", style: 'cancel'},
                {
                    text: "Usuń", style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteGuest(guest.guestId);
                            Alert.alert("Operacja powiodła się.","Usunięto gościa.");
                        } catch (err: any){
                            const errMessage = err instanceof Error ? err.message : "Unknown error";
                            Alert.alert("Błąd",errMessage);
                        }
                    }
                },
            ]);

    }

    const handleEdit = (guest: Guest) => {
        navigation.navigate('UpdateGuest',{ guest });
    }

    const renderGuest = ({item: guest } : { item: Guest }) => {
        return (<View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.mainText}>{guest.firstName} {guest.lastName}</Text>
                <Text style={styles.subText}>Email: {guest.email || "Brak"}</Text>
                <Text style={styles.subText}>Nr tel.: {guest.phoneNumber || "Brak"}</Text>
                <Text style={styles.subText}>Nr dowodu osobistego: {guest.identityCardNumber || "Brak"}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(guest)}
                >
                    <Text style={styles.buttonText}>Edytuj ✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(guest)}
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
                <Text style={styles.loadingText}>Ładowanie gości...</Text>
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
                <Text style={styles.title}>Goście ({guests.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddGuest')}
                >
                    <Text style={styles.addButtonText}>+ Dodaj</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={guests}
                renderItem={renderGuest}
                keyExtractor={(guest) => guest.guestId.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Brak gości</Text>
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
    card: {
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
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    mainText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    subText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
        columnGap: 8,
        alignItems: 'center',
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

export default GuestsScreen;