import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, View, RefreshControl } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {HomePageStackParamList, RootStackParamList} from "../../navigation/types.ts";
import { Amenity } from "../../types/models.ts";
import { useAmenities } from "../../context/AmenitiesContext.tsx";
import { Text, Card, Button, ActivityIndicator, FAB, useTheme, Avatar, IconButton, Surface } from "react-native-paper";
import {CompositeScreenProps} from "@react-navigation/native";

type Props = CompositeScreenProps<NativeStackScreenProps<HomePageStackParamList, 'Amenities'>,NativeStackScreenProps<RootStackParamList>>;

function AmenitiesScreen({ navigation }: Props) {
    const { amenities, loading, error, refreshAmenities, deleteAmenity } = useAmenities();
    const theme = useTheme();

    useEffect(() => {
        refreshAmenities();
    }, []);
    

    const handleDelete = (amenity: Amenity) => {
        Alert.alert(
            "Usuwanie zasobu",
            `Czy na pewno usunąć udogodnienie "${amenity.name}"?`,
            [
                { text: "Anuluj", style: 'cancel' },
                {
                    text: "Usuń",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAmenity(amenity.amenityId);
                        } catch (err) {
                            const errMessage = err instanceof Error ? err.message : "Nieznany błąd";
                            Alert.alert("Błąd", errMessage);
                        }
                    }
                },
            ]
        );
    };

    const handleEdit = (amenity: Amenity) => {
        navigation.navigate('UpdateAmenity', { amenity });
    };

    const renderAmenity = ({ item: amenity }: { item: Amenity }) => {
        return (
            <Card style={styles.card} mode="contained">
                <Card.Title
                    title={amenity.name}
                    titleVariant="titleMedium"
                    titleStyle={styles.titleStyle}
                    style={styles.cardTitle}
                    left={(props) => (
                        <Avatar.Icon {...props} icon="star-outline" size={40} color={theme.colors.onPrimary} style={{ backgroundColor: theme.colors.primary }} />
                    )}
                    right={(props) => (
                        <View style={styles.rightActions}>
                            <IconButton {...props} icon="pencil" size={20} containerColor={theme.colors.surfaceVariant}
                                        iconColor={theme.colors.primary} onPress={() => handleEdit(amenity)} />
                            <IconButton {...props} icon="trash-can" size={20} containerColor="rgba(207, 102, 121, 0.1)"
                                        iconColor={theme.colors.error} onPress={() => handleDelete(amenity)} />
                        </View>
                    )}
                />
                <Card.Content style={styles.cardContent}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        {amenity.description || "Brak opisu"}
                    </Text>
                </Card.Content>
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
                    <Text variant="headlineSmall" style={styles.headerTitle}>Udogodnienia pokoi</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                    <Text variant="labelSmall" style={styles.badgeText}>{amenities.length}</Text>
                </View>
            </Surface>

            <FlatList
                data={amenities}
                renderItem={renderAmenity}
                keyExtractor={(amenity) => amenity.amenityId.toString()}
                contentContainerStyle={styles.listContent} 
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Brak udogodnień</Text>
                    </View>
                }
            />

            <FAB icon="plus" style={[styles.fab, { backgroundColor: theme.colors.primary }]} color={theme.colors.onPrimary}
                 onPress={() => navigation.navigate('AddAmenity')} />
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
    },
    cardTitle: {
        minHeight: 0,
        paddingBottom: 4,
        paddingTop: 12,
    },
    titleStyle: {
        fontWeight: 'bold',
    },
    cardContent: {
        paddingTop: 0,
        paddingBottom: 16,
    },
    rightActions: {
        flexDirection: 'row',
        marginRight: 16,
        gap: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 16,
        borderRadius: 16,
    },
});

export default AmenitiesScreen;