import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types.ts';
import { useReservations } from '../../context/ReservationsContext';
import { Reservation } from '../../types/models.ts';
import { Text, Card, Button, ActivityIndicator, FAB, Chip, useTheme } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'Reservations'>;

function ReservationsScreen({ navigation }: Props) {
    const { reservations, loading, error, deleteReservation, refreshReservations } = useReservations();
    const theme = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    // Obsługa przeciągnięcia w dół (Pull-to-refresh)
    const onRefresh = async () => {
        setRefreshing(true);
        await refreshReservations();
        setRefreshing(false);
    };

    const handleDelete = (reservation: Reservation) => {
        Alert.alert(
            "Usuwanie rezerwacji",
            `Czy na pewno usunąć rezerwację dla gościa: ${reservation.guestFullName}?`,
            [
                { text: "Anuluj", style: 'cancel' },
                {
                    text: "Usuń",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteReservation(reservation.reservationId);
                        } catch (err) {
                            Alert.alert("Błąd", (err as Error).message);
                        }
                    }
                },
            ]
        );
    };

    const handleEdit = (reservation: Reservation) => {
        // Zakładam, że w typach nawigacji masz zdefiniowany ten ekran
        navigation.navigate('UpdateReservation', { reservation });
    };

    // Formatter daty do czytelnego formatu na froncie (np. 10.05.2026)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Dynamiczny kolor dla "Pigułki" statusu
    const getStatusIcon = (status: string | null) => {
        if (!status) return 'help-circle-outline';
        const s = status.toLowerCase();
        if (s.includes('confirm') || s.includes('paid')) return 'check-circle-outline';
        if (s.includes('pending')) return 'clock-outline';
        if (s.includes('cancel')) return 'close-circle-outline';
        return 'information-outline';
    };

    const renderReservation = ({ item }: { item: Reservation }) => {
        return (
            <Card style={styles.card} mode="elevated">
                <Card.Title
                    title={item.guestFullName || "Nieznany gość"}
                    titleVariant="titleMedium"
                    subtitle={`Pokój: ${item.roomNumber || "Brak"} | Noce: ${item.nightCount}`}
                    right={(props) => (
                        <Chip
                            icon={getStatusIcon(item.reservationStatus)}
                            style={[styles.statusChip, { marginRight: 16 }]}
                            textStyle={{ fontSize: 12 }}
                        >
                            {item.reservationStatus || "Nowa"}
                        </Chip>
                    )}
                />

                <Card.Content>
                    <View style={styles.dateRow}>
                        <View>
                            <Text variant="labelMedium" style={{ color: theme.colors.outline }}>Od (Check-in)</Text>
                            <Text variant="bodyMedium">{formatDate(item.checkInDate)}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text variant="labelMedium" style={{ color: theme.colors.outline }}>Do (Check-out)</Text>
                            <Text variant="bodyMedium">{formatDate(item.checkOutDate)}</Text>
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                            Suma: {item.totalPrice.toFixed(2)} PLN
                        </Text>
                        {item.amountRemaining > 0 && (
                            <Text variant="labelMedium" style={{ color: theme.colors.error }}>
                                Do zapłaty: {item.amountRemaining.toFixed(2)} PLN
                            </Text>
                        )}
                    </View>
                </Card.Content>

                <Card.Actions style={styles.actions}>
                    <Button
                        icon="delete-outline"
                        textColor={theme.colors.error}
                        onPress={() => handleDelete(item)}
                    >
                        Usuń
                    </Button>
                    <Button
                        mode="contained"
                        icon="pencil-outline"
                        onPress={() => handleEdit(item)}
                    >
                        Edytuj
                    </Button>
                </Card.Actions>
            </Card>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator animating={true} size="large" />
                <Text style={{ marginTop: 16 }} variant="bodyMedium">Ładowanie rezerwacji...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text variant="titleMedium" style={{ color: theme.colors.error }}>❌ Błąd połączenia</Text>
                <Text variant="bodyMedium">{error}</Text>
                <Button mode="outlined" style={{ marginTop: 16 }} onPress={refreshReservations}>
                    Spróbuj ponownie
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={reservations}
                renderItem={renderReservation}
                keyExtractor={(item) => item.reservationId.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <Text variant="bodyLarge" style={styles.emptyText}>Brak rezerwacji w systemie.</Text>
                }
            />

            {/* Pływający przycisk dodawania (FAB) z Material Design */}
            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
                onPress={() => navigation.navigate('AddReservation')}
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
        padding: 16,
    },
    listContent: {
        padding: 16,
        paddingBottom: 80, // Miejsce na FAB, żeby nie zasłaniał ostatniego elementu
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    priceContainer: {
        marginTop: 12,
        alignItems: 'flex-end',
    },
    statusChip: {
        height: 28,
    },
    actions: {
        justifyContent: 'flex-end',
        paddingTop: 8,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 40,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default ReservationsScreen;