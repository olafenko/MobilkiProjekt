import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { useAdditionalOffers } from "../../context/AdditionalOffersContext.tsx";
import { AdditionalOffer } from "../../types/models.ts";

import {
    Text,
    ActivityIndicator,
    Card,
    IconButton,
    FAB,
    useTheme,
    Surface,
    Button,
} from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'AdditionalOffers'>;

function AdditionalOffersScreen({ navigation }: Props) {
    const theme = useTheme();
    const {
        additionalOffers,
        loading,
        error,
        refreshAdditionalOffers,
        deleteAdditionalOffer
    } = useAdditionalOffers();

    useEffect(() => {
        refreshAdditionalOffers();
    }, []);

    const handleDelete = (offer: AdditionalOffer) => {
        Alert.alert(
            "Usuwanie zasobu",
            `Czy na pewno chcesz trwale usunąć ofertę: ${offer.name}?`,
            [
                { text: "Anuluj", style: 'cancel' },
                {
                    text: "Usuń",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAdditionalOffer(offer.additionalOfferId);
                            Alert.alert("Status", "Oferta została usunięta.");
                        } catch (err) {
                            const errMessage = err instanceof Error ? err.message : "Nieznany błąd";
                            Alert.alert("Błąd", errMessage);
                        }
                    }
                },
            ]
        );
    };

    const renderOffer = ({ item }: { item: AdditionalOffer }) => (
        <Card style={styles.card} mode="contained">
            <Card.Content style={styles.cardContent}>
                <View style={styles.infoSection}>
                    <Text variant="titleMedium" style={styles.offerName}>{item.name}</Text>
                    <Text variant="labelLarge" style={{ color: theme.colors.primary, marginTop: 4 }}>
                        {item.price.toFixed(2)} zł
                    </Text>
                </View>

                <View style={styles.actionSection}>
                    <IconButton
                        icon="pencil"
                        mode="contained"
                        containerColor={theme.colors.surfaceVariant}
                        iconColor={theme.colors.primary}
                        size={20}
                        onPress={() => navigation.navigate('UpdateAdditionalOffer', { additionalOffer: item })}
                    />
                    <IconButton
                        icon="trash-can"
                        mode="contained"
                        containerColor="rgba(207, 102, 121, 0.1)"
                        iconColor={theme.colors.error}
                        size={20}
                        onPress={() => handleDelete(item)}
                    />
                </View>
            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text variant="bodySmall" style={styles.loadingText}>Ładowanie...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <IconButton icon="wifi-off" iconColor={theme.colors.error} size={48} />
                <Text variant="titleMedium" style={{ color: theme.colors.error, marginTop: 8 }}>Błąd połączenia</Text>
                <Button
                    mode="text"
                    textColor={theme.colors.primary}
                    onPress={refreshAdditionalOffers}
                    style={styles.retryButton}
                >
                    Ponów próbę
                </Button>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Surface style={styles.header} elevation={2}>
                <View>
                    <Text variant="headlineSmall" style={styles.headerTitle}>Katalog Usług</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Zarządzanie ofertami dodatkowymi</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                    <Text variant="labelSmall" style={styles.badgeText}>{additionalOffers.length}</Text>
                </View>
            </Surface>

            <FlatList
                data={additionalOffers}
                renderItem={renderOffer}
                keyExtractor={(item) => item.additionalOfferId.toString()}
                contentContainerStyle={styles.listContent}
                onRefresh={refreshAdditionalOffers}
                refreshing={loading}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Brak ofert w systemie</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
                onPress={() => navigation.navigate('AddAdditionalOffer')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
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
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 8,
    },
    badgeText: {
        color: '#000',
        fontWeight: 'bold',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        marginBottom: 16,
        borderRadius: 16,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoSection: {
        flex: 1,
    },
    offerName: {
        fontWeight: 'bold',
    },
    actionSection: {
        flexDirection: 'row',
        gap: 4,
    },
    loadingText: {
        marginTop: 16,
        opacity: 0.6,
    },
    retryButton: {
        marginTop: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 16,
        borderRadius: 16,
    },
});

export default AdditionalOffersScreen;