import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { usePayments } from "../../context/PaymentsContext.tsx";
import { PaymentMethod, PaymentStatus, Reservation } from "../../types/models.ts";
import { PickerField } from "../../components/PickerField.tsx";
import apiService from "../../api/apiService.ts";
import { LargePickerField } from "../../components/LargePickerField.tsx";
import { TextInput, Button, Card, Text, useTheme, ActivityIndicator } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, "AddPayment">;

function AddPaymentScreen({ navigation }: Props) {
    const theme = useTheme();
    const { addPayment } = usePayments();

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [reservationId, setReservationId] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [methods, setMethods] = useState<PaymentMethod[]>([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const unpaidReservations = await apiService.getReservations(PaymentStatus.UNPAID);
                setReservations(unpaidReservations);
                setMethods(Object.values(PaymentMethod));
            } catch (err) {
                Alert.alert("Błąd", "Nie udało się załadować danych.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async () => {
        if (!title.trim()) return Alert.alert("Błąd", "Podaj tytuł płatności");

        const parsedPrice = parseFloat(price);
        if (!price.trim() || parsedPrice <= 0) return Alert.alert("Błąd", "Podaj poprawną kwotę (większą od zera)");

        if (!paymentMethod) return Alert.alert("Błąd", "Wybierz metodę płatności");
        if (!reservationId) return Alert.alert("Błąd", "Przypisz płatność do rezerwacji");

        try {
            setSubmitting(true);
            await addPayment({ title: title.trim(), price: parsedPrice, reservationId: reservationId, paymentStatus: PaymentStatus.PAID, paymentMethod: paymentMethod });
            Alert.alert("Sukces", "Płatność została zarejestrowana pomyślnie", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (err) {
            Alert.alert("Błąd", (err as Error).message);
        } finally {
            setSubmitting(false);
        }
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
        <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.scrollContent}>
            <Card style={styles.card} mode="contained">
                <Card.Content style={styles.form}>
                    <Text variant="headlineSmall" style={styles.title}>Nowa płatność</Text>

                    <TextInput label="Tytuł płatności *" mode="outlined" value={title} onChangeText={setTitle} editable={!submitting}
                               placeholder="np. Opłata za rezerwację #123" style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

                    <TextInput label="Kwota (PLN) *" mode="outlined" value={price} onChangeText={setPrice} editable={!submitting} keyboardType="decimal-pad" placeholder="0.00"
                               style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} left={<TextInput.Affix text="zł" />} />

                    <LargePickerField 
                        label="Rezerwacja *"
                        value={reservationId}
                        items={reservations}
                        getValue={res => res.reservationId}
                        getLabel={res => `Rezerwacja #${res.reservationId}`}
                        onChange={val => setReservationId(val as number)}
                        placeholder="Wybierz rezerwację..." required disabled={submitting}
                    />

                    <PickerField 
                        label="Metoda płatności *"
                        selectedValue={paymentMethod}
                        items={methods}
                        getValue={m => m}
                        getLabel={m => m}
                        onChange={val => setPaymentMethod(val as PaymentMethod)}
                        required
                    />

                    <View style={styles.buttonWrapper}>
                        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.button} disabled={submitting} textColor={theme.colors.onSurfaceVariant}>Anuluj</Button>
                        <Button mode="contained" onPress={handleSubmit} style={styles.button} loading={submitting} disabled={submitting} buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary}>Zarejestruj wpłatę</Button>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 16, opacity: 0.6 },
    scrollContent: { padding: 16, marginTop: 50, flexGrow: 1 },
    card: { borderRadius: 24, paddingVertical: 8 },
    form: { gap: 16 },
    title: { fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    input: { backgroundColor: 'transparent' },
    buttonWrapper: { flexDirection: 'row', gap: 12, marginTop: 16 },
    button: { flex: 1, borderRadius: 12, paddingVertical: 4 },
});

export default AddPaymentScreen;