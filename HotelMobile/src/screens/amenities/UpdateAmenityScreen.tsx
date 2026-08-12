import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { useAmenities } from "../../context/AmenitiesContext.tsx";
import { TextInput, Button, Card, Text, useTheme } from 'react-native-paper';
import {FormField} from "../../components/FormField.tsx";
import {ErrorBanner} from "../../components/ErrorBanner.tsx";
import {useFormErrors} from "../../hooks/useFormErrors.ts";
import {ApiError} from "../../types/errors.ts";

type Props = NativeStackScreenProps<RootStackParamList, "UpdateAmenity">;

function UpdateAmenityScreen({ navigation, route }: Props) {
    const theme = useTheme();
    const { amenity } = route.params;
    const { updateAmenity } = useAmenities();

    const [name, setName] = useState(amenity.name || "");
    const [description, setDescription] = useState(amenity.description || "");
    const [submitting, setSubmitting] = useState(false);

    const {
        errors,
        generalError,
        clearFieldError,
        clearAllErrors,
        handleApiError
    } = useFormErrors();
    

    const handleSubmit = async () => {
        if (!name.trim()) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {name: ['Nazwa udogodnienia jest wymagana']},
            })
            return;
        }

        try {
            setSubmitting(true);
            await updateAmenity(amenity.amenityId, { amenityId: amenity.amenityId, name: name.trim(), description: description.trim() });
            Alert.alert("Sukces", "Udogodnienie zostało zaktualizowane", [{ text: "OK", onPress: () => navigation.goBack() }]);
        } catch (err) {
            handleApiError(err as ApiError);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.scrollContent}>
            <Card style={styles.card} mode="contained">
                <Card.Content style={styles.form}>
                    
                    {generalError && (
                        <ErrorBanner
                            message={generalError}
                            onDismiss={clearAllErrors}
                        />
                    )}
                    
                    <Text variant="headlineSmall" style={styles.title}>Edytuj udogodnienie</Text>
                    <FormField
                        label="Nazwa"
                        required
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            clearFieldError('name');
                        }}
                        placeholder="np. Klimatyzacja"
                        error={errors.name}
                        editable={!submitting}
                    />

                    <FormField
                        label="Opis"
                        value={description}
                        onChangeText={(text) => {
                            setDescription(text);
                            clearFieldError('description');
                        }}
                        placeholder="Opcjonalny opis..."
                        error={errors.description}
                        editable={!submitting}
                        style={[styles.multiline]}
                        multiline
                        numberOfLines={3}
                    />

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