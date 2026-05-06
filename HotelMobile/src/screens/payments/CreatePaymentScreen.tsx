import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {useEffect, useState} from "react";
import {usePayments} from "../../context/PaymentsContext.tsx";
import {PaymentMethod, PaymentStatus, Reservation} from "../../types/models.ts";
import {PickerField} from "../../components/PickerField.tsx";
import apiService from "../../api/apiService.ts";
import {LargePickerField} from "../../components/LargePickerField.tsx";

type Props = NativeStackScreenProps<RootStackParamList, "AddPayment">;

function AddPaymentScreen({navigation} : Props) {

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
                const availableMethods = Object.values(PaymentMethod);
                setReservations(unpaidReservations);
                setMethods(availableMethods);
            } catch (err) {
                Alert.alert("Błąd", "Nie udało się załadować danych słownikowych.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async () => {

        if (!title.trim()) {
            Alert.alert("Błąd", "Wypełnij wszystkie wymagane pola tekstowe");
            return;
        }

        if (!price || parseFloat(price) <= 0) {
            Alert.alert("Błąd", "Podaj poprawną kwotę");
            return;
        }
        
        if (!paymentMethod) {
            Alert.alert("Błąd", "Wybierz metodę płatności");
            return;
        }

        try {
            setSubmitting(true);
            await addPayment({
                title: title.trim(),
                price: parseFloat(price),
                reservationId: reservationId,
                paymentStatus: PaymentStatus.PAID,
                paymentMethod: paymentMethod
            });

            Alert.alert("Sukces", "Płatność została zarejestrowana pomyślnie", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (err) {
            Alert.alert("Błąd", (err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>

                <Text style={styles.label}>Tytuł płatności *</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    editable={!submitting}
                    placeholder="np. Opłata za rezerwację #123"
                />

                <Text style={styles.label}>Kwota (PLN) *</Text>
                <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={setPrice}
                    editable={!submitting}
                    keyboardType="numeric"
                    placeholder="0.00"
                />

                <LargePickerField
                    label="Rezerwacja"
                    value={reservationId}
                    items={reservations}
                    getValue={res => res.reservationId}
                    getLabel={res => res.reservationId.toString() || 'Brak nazwy'}
                    onChange={val => setReservationId(val as number)}
                    placeholder="Wybierz rezerwacje..."
                    required
                    disabled={submitting}
                />

                <PickerField
                    label="Metoda płatności"
                    selectedValue={paymentMethod}
                    items={methods}
                    getValue={m => m}
                    getLabel={m => m}
                    onChange={val => setPaymentMethod(val as PaymentMethod)}
                    required
                />

                <View style={styles.buttons}>
                    <Button title="Anuluj" onPress={() => navigation.goBack()} color="#999" disabled={submitting} />
                    <Button title={submitting ? 'Zapisywanie...' : 'Dodaj opłatę'} onPress={handleSubmit} disabled={submitting} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    form: { padding: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff' },
    buttons: { flexDirection: 'row', columnGap: 10, marginTop: 20, marginBottom: 30 },
});

export default AddPaymentScreen;