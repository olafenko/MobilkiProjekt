import React, { useEffect } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {HomePageStackParamList, RootStackParamList} from "../../navigation/types.ts";
import { Payment } from "../../types/models.ts";
import { usePayments } from "../../context/PaymentsContext.tsx";
import { Text, Card, Button, ActivityIndicator, FAB, useTheme, Avatar, IconButton, Surface } from "react-native-paper";
import {CompositeScreenProps} from "@react-navigation/native";

type Props = CompositeScreenProps<NativeStackScreenProps<HomePageStackParamList, 'Payments'>,NativeStackScreenProps<RootStackParamList>>;

function PaymentsScreen({ navigation }: Props) {
    const { payments, loading, error, refreshPayments, deletePayment } = usePayments();
    const theme = useTheme();

    useEffect(() => {
        refreshPayments();
    }, []);

    const handleDelete = (payment: Payment) => {
        Alert.alert(
            "Usuwanie transakcji",
            `Czy na pewno chcesz usunąć płatność: ${payment.title}?`,
            [
                { text: "Anuluj", style: 'cancel' },
                {
                    text: "Usuń",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePayment(payment.paymentId);
                            Alert.alert("Status", "Płatność została usunięta.");
                        } catch (err) {
                            const errMessage = err instanceof Error ? err.message : "Nieznany błąd";
                            Alert.alert("Błąd", errMessage);
                        }
                    }
                },
            ]
        );
    };

    const renderPayment = ({ item: payment }: { item: Payment }) => {
        return (
            <Card style={styles.card} mode="contained">
                <View style={styles.cardInner}>
                    <View style={styles.cardHeaderRow}>
                        <Avatar.Icon icon="credit-card-outline" size={40} color={theme.colors.onPrimary} style={{ backgroundColor: theme.colors.primary, marginTop: 4 }} />

                        <View style={styles.titleContainer}>
                            <Text variant="titleMedium" style={styles.titleStyleWrapped}>{payment.title}</Text>
                            <Text variant="labelLarge" style={{ color: theme.colors.primary, marginTop: 2 }}>{payment.price.toFixed(2)} zł</Text>
                        </View>

                        <View style={styles.topRightActions}>
                            <IconButton icon="trash-can" size={20} containerColor="rgba(207, 102, 121, 0.1)" iconColor={theme.colors.error}
                                        onPress={() => handleDelete(payment)} style={styles.actionButton} />
                        </View>
                    </View>

                    <View style={styles.cardBody}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 2 }}>Status: {payment.paymentStatus || "Brak"}</Text>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 2 }}>Metoda: {payment.paymentMethod || "Brak"}</Text>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 2 }}>
                            Data: {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "Brak"}</Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, opacity: 0.7, marginTop: 4 }}>Rezerwacja ID: #{payment.reservationId}</Text>
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
                    <Text variant="headlineSmall" style={styles.headerTitle}>Płatności</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Historia wpłat i transakcji</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                    <Text variant="titleMedium" style={styles.badgeText}>{payments.length}</Text>
                </View>
            </Surface>

            <FlatList
                data={payments}
                renderItem={renderPayment}
                keyExtractor={(payment) => payment.paymentId.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Brak płatności</Text>
                    </View>
                }
            />

            <FAB icon="plus" style={[styles.fab, { backgroundColor: theme.colors.primary }]} color={theme.colors.onPrimary}
                 onPress={() => navigation.navigate('AddPayment')} />
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
        paddingTop: 8,
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
        paddingBottom: 4,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 16,
        borderRadius: 16,
    },
});

export default PaymentsScreen;