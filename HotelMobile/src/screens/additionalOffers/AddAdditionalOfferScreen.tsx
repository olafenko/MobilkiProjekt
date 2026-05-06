import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {useState} from "react";
import {useAdditionalOffers} from "../../context/AdditionalOffersContext.tsx";

type Props = NativeStackScreenProps<RootStackParamList, "AddAdditionalOffer">;

function AddAdditionalOfferScreen({navigation} : Props) {

    const { addAdditionalOffer } = useAdditionalOffers();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {

        if (!name.trim()){
            Alert.alert("Błąd", "Podaj nazwę oferty");
            return;
        }
        
        if (!price.trim() || parseFloat(price) < 0) {
            Alert.alert("Błąd", "Podaj poprawną cenę)");
            return;
        }
        
        try {
            setSubmitting(true);
            await addAdditionalOffer({
                name: name.trim(),
                price: parseFloat(price)
            });

            Alert.alert("Sukces", "Oferta dodatkowa została dodana pomyślnie", [
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
                <Text style={styles.label}>Nazwa *</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} editable={!submitting} placeholder="np. Śniadanie do łóżka"/>

                <Text style={styles.label}>Cena (PLN) *</Text>
                <TextInput style={styles.input} value={price} onChangeText={setPrice} editable={!submitting} keyboardType="numeric" placeholder="0.00"
                />
                
                <View style={styles.buttons}>
                    <Button title="Anuluj" onPress={() => navigation.goBack()} color="#999" disabled={submitting} />
                    <Button title={submitting ? 'Zapisywanie...' : 'Utwórz'} onPress={handleSubmit} disabled={submitting} />
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
    multiline: { height: 80, textAlignVertical: 'top' },
    buttons: { flexDirection: 'row', columnGap: 10, marginTop: 20, marginBottom: 30 },
});

export default AddAdditionalOfferScreen;