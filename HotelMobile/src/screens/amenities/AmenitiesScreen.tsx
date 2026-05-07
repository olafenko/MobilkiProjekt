import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, View, RefreshControl } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { Amenity } from "../../types/models.ts";
import { useAmenities } from "../../context/AmenitiesContext.tsx";
import {Text, Card, Button, ActivityIndicator, FAB, useTheme, Avatar, IconButton} from "react-native-paper";

type Props = NativeStackScreenProps<RootStackParamList, 'Amenities'>;

function AmenitiesScreen({ navigation }: Props) {
    const { amenities, loading, error, refreshAmenities, deleteAmenity } = useAmenities();
    const theme = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        refreshAmenities();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshAmenities();
        setRefreshing(false);
    };

    const handleDelete = (amenity: Amenity) => {
        Alert.alert(
            "Usuwanie udogodnienia",
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
            <Card
                style={styles.card}
                mode="outlined"
                
            >
                {/* 1. Tytuł, awatar i przyciski akcji w jednej linii */}
                <Card.Title
                    title={amenity.name}
                    titleVariant="titleMedium"
                    titleStyle={{ fontWeight: 'bold' }}
                    // USUNIĘTO subtitle stąd!
                    left={(props) => (
                        <Avatar.Icon
                            {...props}
                            icon="star"
                            size={40}
                            color="white"
                            style={{ backgroundColor: theme.colors.primary }}
                        />
                    )}
                    right={(props) => (
                        <View style={styles.rightActions}>
                            <IconButton
                                {...props}
                                icon="pencil-outline"
                                size={24}
                                containerColor={theme.colors.secondaryContainer}
                                iconColor={theme.colors.onSecondaryContainer}
                                onPress={() => handleEdit(amenity)}
                            />
                            <IconButton
                                {...props}
                                icon="delete-outline"
                                size={24}
                                containerColor={theme.colors.errorContainer}
                                iconColor={theme.colors.error}
                                onPress={() => handleDelete(amenity)}
                            />
                        </View>
                    )}
                />

                {/* 2. Opis wyrzucony do osobnego bloku, który może mieć dowolną długość */}
                <Card.Content style={styles.cardContent}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        {amenity.description || "Brak opisu"}
                    </Text>
                </Card.Content>
            </Card>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator animating={true} size="large" />
                <Text variant="bodyMedium" style={styles.loadingText}>Ładowanie udogodnień...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text variant="titleMedium" style={{ color: theme.colors.error }}>❌ Błąd</Text>
                <Text variant="bodyMedium">{error}</Text>
                <Button mode="outlined" style={{ marginTop: 16 }} onPress={refreshAmenities}>
                    Spróbuj ponownie
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={amenities}
                renderItem={renderAmenity}
                keyExtractor={(amenity) => amenity.amenityId.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <Text variant="bodyLarge" style={styles.emptyText}>Brak udogodnień w systemie.</Text>
                }
            />

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('AddAmenity')}
                color="white"
                theme={{ colors: { primaryContainer: theme.colors.primary } }}
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
    loadingText: {
        marginTop: 16,
        color: '#666',
    },
    listContent: {
        padding: 16,
        paddingBottom: 80, // Zapas na FAB
    },
    card: {
        marginBottom: 8,
        backgroundColor: '#fff',
        // mode="outlined" i elevation są w propsach komponentu
    },
    cardContent: {
        paddingTop: 0, // Usuwa domyślny górny margines, by tekst był bliżej tytułu
        paddingBottom: 16, // Dodaje oddech na dole karty
    },
    rightActions: {
        flexDirection: 'row',
        marginRight: 8,
        gap: 4 // Odstęp między przyciskami (wymaga RN 0.71+)
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 40,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default AmenitiesScreen;