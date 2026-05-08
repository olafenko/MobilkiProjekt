import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { useAdditionalOffers } from "../../context/AdditionalOffersContext.tsx";
import { TextInput, Button, Card, Text, useTheme } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, "UpdateAdditionalOffer">;

function UpdateAdditionalOfferScreen({ navigation, route }: Props) {
    const theme = useTheme();
    const { additionalOffer } = route.params;
    const { updateAdditionalOffer } = useAdditionalOffers();
    const [name, setName] = useState(additionalOffer.name);
    const [price, setPrice] = useState(additionalOffer.price.toString());
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) return Alert.alert("Błąd", "Podaj nazwę oferty");
        const parsedPrice = parseFloat(price);
        if (!price.trim() || parsedPrice < 0) return Alert.alert("Błąd", "Podaj poprawną cenę");

        try {
            setSubmitting(true);
            await updateAdditionalOffer(additionalOffer.additionalOfferId, { additionalOfferId: additionalOffer.additionalOfferId, name: name.trim(), price: parsedPrice });
            Alert.alert("Sukces", "Oferta została zaktualizowana", [{ text: "OK", onPress: () => navigation.goBack() }]);
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
                    <Text variant="headlineSmall" style={styles.title}>Edycja oferty</Text>
                    <TextInput label="Nazwa usługi *" mode="outlined" value={name} onChangeText={setName} editable={!submitting} style={styles.input}
                               outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

                    <TextInput label="Cena (PLN) *" mode="outlined" value={price} onChangeText={setPrice} editable={!submitting} keyboardType="decimal-pad"
                               style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} left={<TextInput.Affix text="zł" />} />

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
    scrollContent: { padding: 16, marginTop: 50, flexGrow: 1 },
    card: { borderRadius: 24, paddingVertical: 8 },
    form: { gap: 16 },
    title: { fontWeight: 'bold', textAlign: 'center' },
    subtitle: { textAlign: 'center', opacity: 0.5, marginTop: -8, marginBottom: 8 },
    input: { backgroundColor: 'transparent' },
    buttonWrapper: { flexDirection: 'row', gap: 12, marginTop: 16 },
    button: { flex: 1, borderRadius: 12, paddingVertical: 4 },
});

export default UpdateAdditionalOfferScreen;