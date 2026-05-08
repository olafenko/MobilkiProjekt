import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { useAdditionalOffers } from "../../context/AdditionalOffersContext.tsx";
import { TextInput, Button, Card, Text, useTheme } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, "AddAdditionalOffer">;

function AddAdditionalOfferScreen({ navigation }: Props) {
    const theme = useTheme();
    const { addAdditionalOffer } = useAdditionalOffers();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        
        if (!name.trim()) return Alert.alert("Błąd", "Podaj nazwę oferty");
        
        const parsedPrice = parseFloat(price);
        
        if (!price.trim() || parsedPrice < 0) return Alert.alert("Błąd", "Podaj poprawną cenę");

        try {
            setSubmitting(true);
            await addAdditionalOffer(
                { 
                    name: name.trim(),
                    price: parsedPrice
                });
            Alert.alert("Sukces", "Oferta została dodana", [{ text: "OK", onPress: () => navigation.goBack() }]);
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
                    <Text variant="headlineSmall" style={styles.title}>Nowa oferta dodatkowa</Text>

                    <TextInput label="Nazwa usługi *" mode="outlined" value={name} onChangeText={setName} editable={!submitting} placeholder="np. Śniadanie VIP"
                               style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

                    <TextInput label="Cena (PLN) *" mode="outlined" value={price} onChangeText={setPrice} editable={!submitting} keyboardType="decimal-pad"
                               placeholder="0.00" style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary}
                               left={<TextInput.Affix text="zł" />} />

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
    input: { backgroundColor: 'transparent' },
    buttonWrapper: { flexDirection: 'row', gap: 12, marginTop: 16 },
    button: { flex: 1, borderRadius: 12, paddingVertical: 4 },
});

export default AddAdditionalOfferScreen;