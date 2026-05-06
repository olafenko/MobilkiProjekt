import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {Payment} from "../../types/models.ts";
import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect} from "react";
import {usePayments} from "../../context/PaymentsContext.tsx";

type Props = NativeStackScreenProps<RootStackParamList, 'Payments'>;

function PaymentsScreen({ navigation }: Props) {

    const { payments, loading, error, refreshPayments, deletePayment} = usePayments();

    useEffect(() => {
        refreshPayments();
    }, []);

    const handleDelete = (payment: Payment)=> {

        Alert.alert("Usuwanie płatności",`Czy na pewno usunąć płatność: ${payment.title}?`,
            [
                { text: "Anuluj", style: 'cancel'},
                {
                    text: "Usuń", style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePayment(payment.paymentId);
                            Alert.alert("Operacja powiodła się.","Usunięto płatność.");
                        } catch (err){
                            const errMessage = err instanceof Error ? err.message : "Unknown error";
                            Alert.alert("Błąd",errMessage);
                        }
                    }
                },
            ]);

    }
    
    const renderPayment = ({item: payment } : { item: Payment }) => {
        return (<View style={styles.roomCard}>
            <View style={styles.roomContent}>
                <Text style={styles.roomNumber}>{payment.title}</Text>
                <Text style={styles.roomPrice}>Kwota: {payment.price.toFixed(2)} zł</Text>
                <Text>Status: {payment.paymentStatus || "Brak"}</Text>
                <Text>Metoda: {payment.paymentMethod || "Brak"}</Text>
                <Text>Data: {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "Brak"}</Text>
                <Text>Rezerwacja ID: {payment.reservationId}</Text>
            </View>
            <View style={styles.roomActions}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(payment)}
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
                <Text style={styles.loadingText}>Ładowanie płatności...</Text>
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
                <Text style={styles.title}>Płatności ({payments.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddPayment')}
                >
                    <Text style={styles.addButtonText}>+ Dodaj</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={payments}
                renderItem={renderPayment}
                keyExtractor={(payment) => payment.paymentId.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Brak płatności</Text>
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
        columnGap: 4,
    },
    roomNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    roomPrice: {
        fontSize: 14,
        color: '#007AFF',
        marginBottom: 4,
        fontWeight: '500',
    },
    roomActions: {
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

export default PaymentsScreen;