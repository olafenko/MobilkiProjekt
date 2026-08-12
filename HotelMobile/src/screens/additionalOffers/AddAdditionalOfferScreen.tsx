import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { useAdditionalOffers } from "../../context/AdditionalOffersContext.tsx";
import { TextInput, Button, Card, Text, useTheme } from 'react-native-paper';
import { useFormErrors } from "../../hooks/useFormErrors.ts";
import { ApiError } from "../../types/errors.ts";
import { ErrorBanner } from "../../components/ErrorBanner.tsx";
import { FormField } from "../../components/FormField.tsx";

type Props = NativeStackScreenProps<RootStackParamList, "AddAdditionalOffer">;

function AddAdditionalOfferScreen({ navigation }: Props) {
    const theme = useTheme();
    const { addAdditionalOffer } = useAdditionalOffers();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
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
        
        const parsedPrice = parseFloat(price);

        if (!name.trim()) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    name: ['Nazwa oferty jest wymagana'],
                },
            });
            return;
        }

        if (!price.trim() || Number.isNaN(parsedPrice) || parsedPrice < 0) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    price: ['Podaj poprawną cenę'],
                },
            });
            return;
        }

        try {
            setSubmitting(true);
            await addAdditionalOffer(
                { 
                    name: name.trim(),
                    price: parsedPrice
                });
            Alert.alert("Sukces", "Oferta została dodana", [{ text: "OK", onPress: () => navigation.goBack() }]);
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

                    <Text variant="headlineSmall" style={styles.title}>Nowa oferta dodatkowa</Text>

                    <FormField
                        label="Nazwa usługi"
                        required
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            clearFieldError('name');
                        }}
                        editable={!submitting}
                        placeholder="np. Śniadanie VIP"
                        error={errors.name}
                    />

                    <FormField
                        label="Cena (PLN)"
                        required
                        value={price}
                        onChangeText={(text) => {
                            setPrice(text);
                            clearFieldError('price');
                        }}
                        editable={!submitting}
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        error={errors.price}
                        left={<TextInput.Affix text="zł" />}
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
    scrollContent: { padding: 16,marginTop: 50 , flexGrow: 1 },
    card: { borderRadius: 24, paddingVertical: 8 },
    form: { gap: 16 },
    title: { fontWeight: 'bold', textAlign: 'center' },
    buttonWrapper: { flexDirection: 'row', gap: 12, marginTop: 16 },
    button: { flex: 1, borderRadius: 12, paddingVertical: 4 },
});

export default AddAdditionalOfferScreen;
