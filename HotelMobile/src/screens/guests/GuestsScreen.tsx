import React, {useEffect} from "react";
import {Alert, FlatList, StyleSheet, View} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {HomePageStackParamList, RootStackParamList} from "../../navigation/types.ts";
import {Guest} from "../../types/models.ts";
import {useGuests} from "../../context/GuestsContext.tsx";
import {ActivityIndicator, Avatar, Card, FAB, IconButton, Surface, Text, useTheme} from "react-native-paper";
import {CompositeScreenProps} from "@react-navigation/native";

type Props = CompositeScreenProps<NativeStackScreenProps<HomePageStackParamList, 'Guests'>,NativeStackScreenProps<RootStackParamList>>;

function GuestsScreen({ navigation }: Props) {
    const { guests, loading, error, refreshGuests, deleteGuest } = useGuests();
    const theme = useTheme();


    useEffect(() => {
        refreshGuests();
    }, []);

    const handleDelete = (guest: Guest) => {
        Alert.alert(
            "Usuwanie profilu",
            `Czy na pewno usunąć gościa ${guest.firstName} ${guest.lastName}?`,
            [
                { text: "Anuluj", style: 'cancel' },
                {
                    text: "Usuń",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteGuest(guest.guestId);
                        } catch (err) {
                            const errMessage = err instanceof Error ? err.message : "Nieznany błąd";
                            Alert.alert("Błąd", errMessage);
                        }
                    }
                },
            ]
        );
    };

    const handleEdit = (guest: Guest) => {
        navigation.navigate('UpdateGuest', { guest });
    };

    const renderGuest = ({ item: guest }: { item: Guest }) => {
        return (
            <Card style={styles.card} mode="contained">
                <View style={styles.cardInner}>
                    <View style={styles.cardHeaderRow}>
                        <Avatar.Icon icon="account-circle" size={40} color={theme.colors.onPrimary} style={{ backgroundColor: theme.colors.primary, marginTop: 4 }}
                        />

                        <View style={styles.titleContainer}>
                            <Text variant="titleMedium" style={styles.titleStyleWrapped}>
                                {`${guest.firstName} ${guest.lastName}`}
                            </Text>
                        </View>

                        <View style={styles.topRightActions}>
                            <IconButton icon="pencil" size={20} containerColor={theme.colors.surfaceVariant} iconColor={theme.colors.primary}
                                        onPress={() => handleEdit(guest)} style={styles.actionButton}
                            />
                            <IconButton icon="trash-can" size={20} containerColor="rgba(207, 102, 121, 0.1)" iconColor={theme.colors.error}
                                onPress={() => handleDelete(guest)} style={styles.actionButton}
                            />
                        </View>
                    </View>

                    <View style={styles.cardBody}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 2 }}>
                            Email: {guest.email || "Brak"}
                        </Text>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 2 }}>
                            Tel: {guest.phoneNumber || "Brak"}
                        </Text>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                            ID: {guest.identityCardNumber || "Brak"}
                        </Text>
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
                    <Text variant="headlineSmall" style={styles.headerTitle}>Baza Gości</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                    <Text variant="titleMedium" style={styles.badgeText}>{guests.length}</Text>
                </View>
            </Surface>

            <FlatList
                data={guests}
                renderItem={renderGuest}
                keyExtractor={(guest) => guest.guestId.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Brak gości w bazie</Text>
                    </View>
                }
            />

            <FAB icon="plus" style={[styles.fab, { backgroundColor: theme.colors.primary }]} color={theme.colors.onPrimary}
                 onPress={() => navigation.navigate('AddGuest')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    header: {
        paddingTop: 16,
        paddingHorizontal: 24,
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    badge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
        minWidth: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    loadingText: {
        marginTop: 16,
        opacity: 0.6,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardInner: {
        padding: 12,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    titleContainer: {
        flex: 1,
        marginHorizontal: 12,
        justifyContent: 'center',
        paddingTop: 12,
    },
    titleStyleWrapped: {
        fontWeight: 'bold',
        flexWrap: 'wrap',
    },
    topRightActions: {
        flexDirection: 'row',
        gap: 4,
    },
    actionButton: {
        margin: 0,
    },
    cardBody: {
        paddingTop: 8,
        paddingLeft: 52,
        paddingBottom: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 16,
        borderRadius: 16,
    },
});

export default GuestsScreen;