import React, { useEffect } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {BottomNavigationParamList, RootStackParamList} from "../../navigation/types.ts";
import { RoomType } from "../../types/models.ts";
import { useRoomTypes } from "../../context/RoomTypesContext.tsx";
import { ActivityIndicator, Card, FAB, IconButton, Surface, Text, useTheme } from 'react-native-paper';
import {CompositeScreenProps} from "@react-navigation/native";

type Props = CompositeScreenProps<NativeStackScreenProps<BottomNavigationParamList, 'RoomTypes'>,NativeStackScreenProps<RootStackParamList>>;

function RoomTypesScreen({ navigation }: Props) {
    const { roomTypes, loading, refreshRoomTypes, deleteRoomType } = useRoomTypes();
    const theme = useTheme();

    useEffect(() => {
        refreshRoomTypes();
    }, []);

    const handleDelete = (roomType: RoomType) => {
        Alert.alert(
            "Usuwanie typu pokoju",
            `Czy napewno usunąć typ pokoju ${roomType.name}?`,
            [
                { text: "Anuluj", style: 'cancel' },
                {
                    text: "Usuń",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteRoomType(roomType.roomTypeId);
                            Alert.alert("Operacja powiodła się.", "Usunięto typ pokoju.");
                        } catch (err) {
                            const errMessage = err instanceof Error ? err.message : "Unknown error";
                            Alert.alert("Błąd", errMessage);
                        }
                    }
                },
            ]
        );
    };

    const handleEdit = (roomType: RoomType) => {
        navigation.navigate('UpdateRoomType', { roomType });
    };

    const renderRoomType = ({ item: roomType }: { item: RoomType }) => {
        return (
            <Card style={styles.card} mode="contained">
                <View style={styles.cardInner}>
                    <View style={styles.cardHeaderRow}>
                        <View style={styles.titleContainer}>
                            <Text variant="titleMedium" style={styles.titleStyleWrapped}>
                                Nazwa: {roomType.name}
                            </Text>
                        </View>

                        <View style={styles.topRightActions}>
                            <IconButton
                                icon="pencil"
                                size={20}
                                containerColor={theme.colors.surfaceVariant}
                                iconColor={theme.colors.primary}
                                onPress={() => handleEdit(roomType)}
                                style={styles.actionButton}
                            />
                            <IconButton
                                icon="trash-can"
                                size={20}
                                containerColor="rgba(207, 102, 121, 0.1)"
                                iconColor={theme.colors.error}
                                onPress={() => handleDelete(roomType)}
                                style={styles.actionButton}
                            />
                        </View>
                    </View>

                    <View style={styles.cardBody}>
                        <View style={styles.descriptionWrapper}>
                            <Text variant="bodyMedium" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
                                Opis:
                            </Text>
                            <Text
                                variant="bodyMedium"
                                style={{ color: theme.colors.onSurfaceVariant, flex: 1, opacity: roomType.description ? 1 : 0.7 }}
                                numberOfLines={2}
                            >
                                {roomType.description || "Brak"}
                            </Text>
                        </View>

                        <View style={styles.priceContainer}>
                            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginRight: 8 }}>
                                Cena bazowa:
                            </Text>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                                {roomType.basePrice.toFixed(2) || "0.00"} zł
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
                    <Text variant="headlineSmall" style={styles.headerTitle}>Typy pokoi</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                    <Text variant="titleMedium" style={styles.badgeText}>{roomTypes.length}</Text>
                </View>
            </Surface>

            <FlatList
                data={roomTypes}
                renderItem={renderRoomType}
                keyExtractor={(roomType) => roomType.roomTypeId.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Brak typów pokoi</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
                onPress={() => navigation.navigate('AddRoomType')}
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
    titleStyleWrapped: {
        fontWeight: 'bold',
        flexWrap: 'wrap'
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
        marginBottom: 8
    },
    sectionLabel: {
        fontWeight: 'bold',
        marginRight: 4
    },
    priceContainer: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 16,
        borderRadius: 16
    }
});

export default RoomTypesScreen;