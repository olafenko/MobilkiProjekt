import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {RoomType} from "../../types/models.ts";
import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useRoomTypes} from "../../context/RoomTypesContext.tsx";
import {useEffect} from "react";

type Props = NativeStackScreenProps<RootStackParamList, 'RoomTypes'>;

function RoomTypes({ navigation }: Props) {

    const { roomTypes, loading, error, refreshRoomTypes, deleteRoomType} = useRoomTypes();

    useEffect(() => {
        refreshRoomTypes();
    }, []);
    
    const handleDelete = (roomType: RoomType)=> {

        Alert.alert("Usuwanie typu pokoju",`Czy napewno usunąć typ pokoju ${roomType.name}?`,
            [
                { text: "Anuluj", style: 'cancel'},
                {
                    text: "Usuń", style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteRoomType(roomType.roomTypeId);
                            Alert.alert("Operacja powiodła się.","Usunięto typ pokoju.");
                        } catch (err){
                            const errMessage = err instanceof Error ? err.message : "Unknown error";
                            Alert.alert("Błąd",errMessage);
                        }
                    }
                },
            ]);

    }

    const handleEdit = (roomType: RoomType) => {
        navigation.navigate('UpdateRoomType',{ roomType });
    }

    const renderRoomType = ({item:roomType } : { item:RoomType }) => {
        return (<View style={styles.roomCard}>
            <View style={styles.roomContent}>
                <Text style={styles.roomNumber}>Nazwa: {roomType.name}</Text>
                <Text style={styles.roomPrice}>Cena bazowa: {roomType.basePrice.toFixed(2) || "0.00"} zł</Text>
                <Text>Opis: {roomType.description || "Brak"}</Text>
            </View>
            <View style={styles.roomActions}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(roomType)}
                >
                    <Text style={styles.buttonText}>Edytuj ✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(roomType)}
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
                <Text style={styles.loadingText}>Ładowanie typów pokoi...</Text>
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
                <Text style={styles.title}>Typy pokoi ({roomTypes.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddRoomType')}
                >
                    <Text style={styles.addButtonText}>+ Dodaj</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={roomTypes}
                renderItem={renderRoomType}
                keyExtractor={(roomType) => roomType.roomTypeId.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Brak typów pokoi</Text>
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

export default RoomTypes;