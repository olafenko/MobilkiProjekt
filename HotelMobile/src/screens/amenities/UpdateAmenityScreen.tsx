import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { useAmenities } from "../../context/AmenitiesContext.tsx";
import { TextInput, Button, Card, Text, useTheme } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, "UpdateAmenity">;

function UpdateAmenityScreen({ navigation, route }: Props) {
    const theme = useTheme();
    const { amenity } = route.params;
    const { updateAmenity } = useAmenities();

    const [name, setName] = useState(amenity.name || "");
    const [description, setDescription] = useState(amenity.description || "");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) return Alert.alert("Błąd", "Podaj nazwę udogodnienia");

        try {
            setSubmitting(true);
            await updateAmenity(amenity.amenityId, { amenityId: amenity.amenityId, name: name.trim(), description: description.trim() });
            Alert.alert("Sukces", "Udogodnienie zostało zaktualizowane", [{ text: "OK", onPress: () => navigation.goBack() }]);
        } catch (err) {
            Alert.alert("Błąd", (err as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.scrollContent}>
            <Card style={styles.card} mode="contained">
                <Card.Content style={styles.form}>
                    <Text variant="headlineSmall" style={styles.title}>Edytuj udogodnienie</Text>
                    <TextInput label="Nazwa *" mode="outlined" value={name} onChangeText={setName} editable={!submitting} style={styles.input}
                               outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

                    <TextInput label="Opis" mode="outlined" value={description} onChangeText={setDescription} editable={!submitting} multiline numberOfLines={3}
                               style={[styles.input, styles.multiline]} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

                    <View style={styles.buttonWrapper}>
                        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.button} disabled={submitting}
                                textColor={theme.colors.onSurfaceVariant}>Anuluj</Button>
                        <Button mode="contained" onPress={handleSubmit} style={styles.button} loading={submitting} disabled={submitting}
                                buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary}>Zapisz</Button>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 16,
        marginTop: 50,
        flexGrow: 1
    },
    card: {
        borderRadius: 24,
        paddingVertical: 8
    },
    form: {
        gap: 16
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    subtitle: {
        textAlign: 'center',
        opacity: 0.5,
        marginTop: -8,
        marginBottom: 8
    },
    input: {
        backgroundColor: 'transparent'
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    buttonWrapper: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16
    },
    button: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 4
    },
});

export default UpdateAmenityScreen;