import React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { Room } from "../../types/models.ts";
import { useRooms } from "../../context/RoomsContext.tsx";
import { ActivityIndicator, Card, Chip, FAB, IconButton, Surface, Text, useTheme } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'Rooms'>;

function RoomsScreen({ navigation }: Props) {
    const { rooms, loading, deleteRoom } = useRooms();
    const theme = useTheme();

    const handleDelete = (room: Room) => {
        Alert.alert(
            "Usuwanie pokoju",
            `Czy na pewno usunąć pokój nr ${room.number}?`,
            [
                { text: "Anuluj", style: 'cancel' },
                {
                    text: "Usuń",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteRoom(room.roomId);
                            Alert.alert("Status", "Pokój został usunięty pomyślnie.");
                        } catch (err) {
                            Alert.alert("Błąd", (err as Error).message);
                        }
                    }
                },
            ]
        );
    };

    const handleEdit = (room: Room) => {
        navigation.navigate('UpdateRoom', { room });
    };

    const getStatusIcon = (status: string | null) => {
        if (!status) return 'help-circle-outline';
        const s = status.toLowerCase();
        if (s.includes('dostępny') || s.includes('available')) return 'check-circle-outline';
        if (s.includes('zajęty') || s.includes('occupied')) return 'account-lock-outline';
        if (s.includes('sprząt') || s.includes('clean')) return 'broom';
        if (s.includes('napraw') || s.includes('mainten')) return 'wrench-outline';
        return 'information-outline';
    };

    const renderRoom = ({ item: room }: { item: Room }) => {
        return (
            <Card style={styles.card} mode="contained">
                <View style={styles.cardInner}>
                    <View style={styles.cardHeaderRow}>

                        <View style={styles.titleContainer}>
                            <View style={styles.titleRow}>
                                <Text variant="titleMedium" style={styles.titleStyleWrapped}>Pokój {room.number}</Text>
                                <Chip icon={getStatusIcon(room.status)} compact style={styles.statusChip} textStyle={styles.statusChipText}>
                                    {room.status || "Nieznany"}
                                </Chip>
                            </View>

                            <View style={styles.subtitleColumn}>
                                <View style={styles.infoRow}>
                                    <Text variant="bodyMedium" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
                                        Piętro:
                                    </Text>
                                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                                        {room.floor}
                                    </Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text variant="bodyMedium" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
                                        Typ pokoju:
                                    </Text>
                                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                                        {room.roomTypeName}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.topRightActions}>
                            <IconButton icon="pencil" size={20} containerColor={theme.colors.surfaceVariant} iconColor={theme.colors.primary}
                                        onPress={() => handleEdit(room)} style={styles.actionButton}/>

                            <IconButton icon="trash-can" size={20} containerColor="rgba(207, 102, 121, 0.1)" iconColor={theme.colors.error}
                                        onPress={() => handleDelete(room)} style={styles.actionButton}/>
                        </View>
                    </View>

                    <View style={styles.cardBody}>

                        <View style={styles.descriptionWrapper}>
                            <Text variant="bodyMedium" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
                                Opis:
                            </Text>
                            <Text
                                variant="bodyMedium"
                                style={{ color: theme.colors.onSurfaceVariant, flex: 1, opacity: room.description ? 1 : 0.7 }}
                                numberOfLines={2}
                            >
                                {room.description || "brak opisu"}
                            </Text>
                        </View>

                        <View style={styles.amenitiesWrapper}>
                            <Text variant="bodyMedium" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
                                Udogodnienia:
                            </Text>
                            {room.amenitiesNames && room.amenitiesNames.length > 0 ? (
                                room.amenitiesNames.map((amenity, index) => (
                                    <Chip key={index} compact style={styles.amenityChip} textStyle={[styles.amenityChipText, { color: theme.colors.onSurface }]} mode="flat">
                                        {amenity}
                                    </Chip>
                                ))
                            ) : (
                                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, opacity: 0.7 }}>Brak</Text>
                            )}
                        </View>

                        <View style={styles.priceContainer}>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                                {room.basePrice?.toFixed(2) || "0.00"} zł <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: 'normal' }}>
                                / doba</Text>
                            </Text>
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
                    <Text variant="headlineSmall" style={styles.headerTitle}>Pokoje</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                    <Text variant="titleMedium" style={styles.badgeText}>{rooms.length}</Text>
                </View>
            </Surface>

            <FlatList
                data={rooms}
                renderItem={renderRoom}
                keyExtractor={(room) => room.roomId.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Brak pokoi</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
                onPress={() => navigation.navigate('AddRoom')}
            />
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
        marginRight: 12,
        justifyContent: 'center',
        paddingTop: 4
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 6
    },
    titleStyleWrapped: {
        fontWeight: 'bold'
    },
    subtitleColumn: {
        flexDirection: 'column',
        gap: 4
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusChip: {
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
    descriptionWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    amenitiesWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 6
    },
    sectionLabel: {
        fontWeight: 'bold',
        marginRight: 4
    },
    amenityChip: {
        height: 26,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 8
    },
    amenityChipText: {
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

export default RoomsScreen;