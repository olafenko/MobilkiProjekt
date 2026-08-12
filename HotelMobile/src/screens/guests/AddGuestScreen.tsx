import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { useGuests } from "../../context/GuestsContext.tsx";
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useFormErrors } from "../../hooks/useFormErrors.ts";
import { ApiError } from "../../types/errors.ts";
import { ErrorBanner } from "../../components/ErrorBanner.tsx";
import { FormField } from "../../components/FormField.tsx";

type Props = NativeStackScreenProps<RootStackParamList, "AddGuest">;

function AddGuestScreen({ navigation }: Props) {
    const theme = useTheme();
    const { addGuest } = useGuests();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [identityCardNumber, setIdentityCardNumber] = useState("");
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

        if (!firstName.trim()) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    firstName: ['Imię jest wymagane'],
                },
            });
            return;
        }

        if (!lastName.trim()) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    lastName: ['Nazwisko jest wymagane'],
                },
            });
            return;
        }

        try {
            setSubmitting(true);
            await addGuest(
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    phoneNumber: phoneNumber.trim(),
                    email: email.trim(),
                    identityCardNumber: identityCardNumber.trim().toUpperCase()
                });
            Alert.alert("Sukces", "Gość został dodany pomyślnie", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
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

                    <Text variant="headlineSmall" style={styles.title}>Nowy gość</Text>

                    <FormField
                        label="Imię"
                        required
                        value={firstName}
                        onChangeText={(text) => {
                            setFirstName(text);
                            clearFieldError('firstName');
                        }}
                        editable={!submitting}
                        error={errors.firstName}
                    />

                    <FormField
                        label="Nazwisko"
                        required
                        value={lastName}
                        onChangeText={(text) => {
                            setLastName(text);
                            clearFieldError('lastName');
                        }}
                        editable={!submitting}
                        error={errors.lastName}
                    />

                    <FormField
                        label="Numer telefonu"
                        required
                        value={phoneNumber}
                        onChangeText={(text) => {
                            setPhoneNumber(text);
                            clearFieldError('phoneNumber');
                        }}
                        editable={!submitting}
                        keyboardType="phone-pad"
                        error={errors.phoneNumber}
                    />

                    <FormField
                        label="Email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            clearFieldError('email');
                        }}
                        editable={!submitting}
                        keyboardType="email-address"
                        error={errors.email}
                    />
                    
                    <FormField
                        label="Numer dowodu osobistego"
                        required
                        value={identityCardNumber}
                        onChangeText={(text) => {
                            setIdentityCardNumber(text);
                            clearFieldError('identityCardNumber');
                        }}
                        editable={!submitting}
                        error={errors.identityCardNumber}
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
    scrollContent: { padding: 16, marginTop: 50, flexGrow: 1 },
    card: { borderRadius: 24, paddingVertical: 8 },
    form: { gap: 16 },
    title: { fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    buttonWrapper: { flexDirection: 'row', gap: 12, marginTop: 16 },
    button: { flex: 1, borderRadius: 12, paddingVertical: 4 },
});

export default AddGuestScreen;
