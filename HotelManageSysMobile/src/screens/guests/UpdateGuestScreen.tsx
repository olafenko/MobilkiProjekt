import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {useState} from "react";
import {useGuests} from "../../context/GuestsContext.tsx";


type Props = NativeStackScreenProps<RootStackParamList, "UpdateGuest">;


function UpdateGuestScreen({route, navigation} : Props) {
    const { guest } = route.params;
    const { updateGuest } = useGuests();
    
    const [firstName, setFirstName] = useState(guest.firstName);
    const [lastName, setLastName] = useState(guest.lastName);
    const [email, setEmail] = useState(guest.email || "");
    const [phoneNumber, setPhoneNumber] = useState(guest.phoneNumber || "");
    const [identityCardNumber, setIdentityCardNumber] = useState(guest.identityCardNumber || "");

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {

        if (!firstName.trim() || !lastName.trim()){
            Alert.alert("Błąd", "Podaj imię i nazwisko");
            return;
        }

        try {
            setSubmitting(true);
            await updateGuest(guest.guestId, {
                guestId: guest.guestId,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                identityCardNumber: identityCardNumber
            });

            Alert.alert("Sukces", "Dane gościa zostały zaktualizowane", [
                { text: "OK", onPress: () => navigation.goBack() },
            ])
        } catch (err) {
            Alert.alert("Błąd", (err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>

                <Text style={styles.label}>Imię *</Text>
                <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} editable={!submitting} />

                <Text style={styles.label}>Nazwisko *</Text>
                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} editable={!submitting} />

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} editable={!submitting} />

                <Text style={styles.label}>Numer telefonu</Text>
                <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} editable={!submitting} />

                <Text style={styles.label}>Numer dowodu osobistego</Text>
                <TextInput style={styles.input} value={identityCardNumber} onChangeText={setIdentityCardNumber} editable={!submitting} />

                <View style={styles.buttons}>
                    <Button title="Anuluj" onPress={() => navigation.goBack()} color="#999" disabled={submitting} />
                    <Button title={submitting ? 'Zapisywanie...' : 'Zapisz'} onPress={handleSubmit} disabled={submitting} />
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

export default UpdateGuestScreen;