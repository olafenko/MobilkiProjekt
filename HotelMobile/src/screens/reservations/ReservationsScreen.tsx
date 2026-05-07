import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types.ts';
import { useReservations } from '../../context/ReservationsContext.tsx';
import { Reservation } from '../../types/models.ts';
import { Text, Card, Button, ActivityIndicator, FAB, Chip, useTheme, Avatar, IconButton, Surface } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'Reservations'>;

function ReservationsScreen({ navigation }: Props) {
    const { reservations, loading, deleteReservation, refreshReservations } = useReservations();
    const theme = useTheme();

    useEffect(() => {
        refreshReservations();
    }, []);

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
                            Alert.alert("Status", "Rezerwacja została usunięta.");
                        } catch (err) {
                            Alert.alert("Błąd", (err as Error).message);
                        }
                    }
                },
            ]
        );
    };

    const handleEdit = (reservation: Reservation) => {
        navigation.navigate('UpdateReservation', { reservation });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

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
            <Card style={styles.card} mode="contained">
                <View style={styles.cardInner}>
                    <View style={styles.cardHeaderRow}>
                        <Avatar.Icon icon="calendar-check" size={40} color={theme.colors.onPrimary} style={{ backgroundColor: theme.colors.primary, marginTop: 4 }} />

                        <View style={styles.titleContainer}>
                            <Text variant="titleMedium" style={styles.titleStyleWrapped}>{item.guestFullName || "Nieznany gość"}</Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 6 }}>
                                Pokój: {item.roomNumber || "Brak"} | Noce: {item.nightCount}</Text>
                            <Chip icon={getStatusIcon(item.reservationStatus)} style={styles.statusChip}
                                  textStyle={styles.statusChipText}>{item.reservationStatus || "Nowa"}</Chip>
                        </View>

                        <View style={styles.topRightActions}>
                            <IconButton icon="pencil" size={20} containerColor={theme.colors.surfaceVariant} iconColor={theme.colors.primary}
                                        onPress={() => handleEdit(item)} style={styles.actionButton} />
                            <IconButton icon="trash-can" size={20} containerColor="rgba(207, 102, 121, 0.1)" iconColor={theme.colors.error}
                                        onPress={() => handleDelete(item)} style={styles.actionButton} />
                        </View>
                    </View>
                    
                    <View style={styles.cardBody}>
                        <View style={styles.dateRow}>
                            <View>
                                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Od (Check-in)</Text>
                                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>{formatDate(item.checkInDate)}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Do (Check-out)</Text>
                                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>{formatDate(item.checkOutDate)}</Text>
                            </View>
                        </View>

                        {item.additionalOffers && item.additionalOffers.length > 0 && (
                            <View style={styles.offersWrapper}>
                                <Text variant="labelSmall" style={[styles.offersLabel, { color: theme.colors.onSurfaceVariant }]}>Usługi dodatkowe:</Text>
                                <View style={styles.offersContainer}>
                                    {item.additionalOffers.map((offer: any, index: number) => (
                                        <Chip key={index} compact style={styles.offerChip} textStyle={[styles.offerChipText, { color: theme.colors.onSurface }]}>
                                            {offer.additionalOfferName}
                                        </Chip>
                                    ))}
                                </View>
                            </View>
                        )}

                        <View style={styles.priceContainer}>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                                Suma: {item.totalPrice.toFixed(2)} zł
                            </Text>
                            {item.amountRemaining > 0 && (
                                <Text variant="labelMedium" style={{ color: theme.colors.error }}>
                                    Do zapłaty: {item.amountRemaining.toFixed(2)} zł
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </Card>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text variant="bodySmall" style={styles.loadingText}>Ładowanie...</Text>
            </View>
        );
    }
    
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Surface style={styles.header} elevation={2}>
                <View>
                    <Text variant="headlineSmall" style={styles.headerTitle}>Rezerwacje</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Zarządzanie pobytami gości</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                    <Text variant="titleMedium" style={styles.badgeText}>{reservations.length}</Text>
                </View>
            </Surface>

            <FlatList
                data={reservations}
                renderItem={renderReservation}
                keyExtractor={(item) => item.reservationId.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Brak rezerwacji</Text>
                    </View>
                }
            />

            <FAB icon="plus" style={[styles.fab, { backgroundColor: theme.colors.primary }]} color={theme.colors.onPrimary} onPress={() => navigation.navigate('AddReservation')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    header: {
        paddingTop: 16,
        paddingHorizontal: 24,
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24
    },
    headerTitle: {
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    badge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
        minWidth: 48,
        alignItems: 'center',
        justifyContent: 'center'
    },
    badgeText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14
    },
    loadingText: {
        marginTop: 16,
        opacity: 0.6
    },
    listContent: {
        padding: 20,
        paddingBottom: 100
    },
    card: {
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden'
    },
    cardInner: {
        padding: 12
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    titleContainer: {
        flex: 1,
        marginHorizontal: 12,
        justifyContent: 'center',
        paddingTop: 4
    },
    titleStyleWrapped: {
        fontWeight: 'bold',
        flexWrap: 'wrap'
    },
    statusChip: {
        alignSelf: 'flex-start',
        height: 24
    },
    statusChipText: {
        fontSize: 10,
        marginVertical: 0,
        paddingVertical: 0
    },
    topRightActions: {
        flexDirection: 'row',
        gap: 4
    },
    actionButton: {
        margin: 0
    },
    cardBody: {
        paddingTop: 12,
        paddingBottom: 4
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)'
    },
    offersWrapper: {
        marginTop: 12
    },
    offersLabel: {
        marginBottom: 6,
        textTransform: 'uppercase',
        fontSize: 10,
        letterSpacing: 0.5,
        fontWeight: 'bold'
    },
    offersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6
    },
    offerChip: {
        height: 26,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 8
    },
    offerChipText: {
        fontSize: 11,
        marginVertical: 0,
        paddingVertical: 0
    },
    priceContainer: {
        marginTop: 16,
        alignItems: 'flex-end'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 16,
        borderRadius: 16
    },
});

export default ReservationsScreen;