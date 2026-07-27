import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {useAmenities} from "../../context/AmenitiesContext.tsx";
import {Button, Card, Text, useTheme} from 'react-native-paper';
import {useFormErrors} from "../../hooks/useFormErrors.ts";
import {ApiError} from "../../types/errors.ts";
import {ErrorBanner} from "../../components/ErrorBanner.tsx";
import {FormField} from "../../components/FormField.tsx";

type Props = NativeStackScreenProps<RootStackParamList, "AddAmenity">;

function AddAmenityScreen({ navigation }: Props) {
    
    const theme = useTheme();
    const { addAmenity } = useAmenities();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const {
        errors,
        generalError,
        clearFieldError,
        clearAllErrors,
        handleApiError
    } = useFormErrors();
    
    const handleSubmit = async () => {
        
        clearAllErrors();
        
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
            await addAmenity({
                name: name.trim(),
                description: description.trim()
            });
            Alert.alert("Sukces", "Udogodnienie zostało dodane pomyślnie", [{ text: "OK", onPress: () => navigation.goBack() }]);
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
                    
                    <Text variant="headlineSmall" style={styles.title}>Nowe udogodnienie</Text>
                    
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
                                buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary}>Utwórz</Button>
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
        textAlign: 'center',
        marginBottom: 8
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

export default AddAmenityScreen;