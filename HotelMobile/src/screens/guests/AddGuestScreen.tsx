import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { useGuests } from "../../context/GuestsContext.tsx";
import { TextInput, Button, Card, Text, useTheme } from 'react-native-paper';

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

    const handleSubmit = async () => {
        
        if (!firstName.trim() || !lastName.trim()) return Alert.alert("Błąd", "Podaj imię i nazwisko");

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
            Alert.alert("Błąd", (err as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.scrollContent}>
            <Card style={styles.card} mode="contained">
                <Card.Content style={styles.form}>
                    <Text variant="headlineSmall" style={styles.title}>Nowy gość</Text>

                    <TextInput label="Imię *" mode="outlined" value={firstName} onChangeText={setFirstName} editable={!submitting}
                               style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

                    <TextInput label="Nazwisko *" mode="outlined" value={lastName} onChangeText={setLastName} editable={!submitting}
                               style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

                    <TextInput label="Numer telefonu *" mode="outlined" value={phoneNumber} onChangeText={setPhoneNumber} editable={!submitting}
                               keyboardType="phone-pad" style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

                    <TextInput label="Email" mode="outlined" value={email} onChangeText={setEmail} editable={!submitting} keyboardType="email-address"
                               style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />
                    
                    <TextInput label="Numer dowodu osobistego *" mode="outlined" value={identityCardNumber} onChangeText={setIdentityCardNumber}
                               editable={!submitting} style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

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
    input: { backgroundColor: 'transparent' },
    buttonWrapper: { flexDirection: 'row', gap: 12, marginTop: 16 },
    button: { flex: 1, borderRadius: 12, paddingVertical: 4 },
});

export default AddGuestScreen;