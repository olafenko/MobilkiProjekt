import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { useGuests } from "../../context/GuestsContext.tsx";
import { TextInput, Button, Card, Text, useTheme } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, "UpdateGuest">;

function UpdateGuestScreen({ route, navigation }: Props) {
    const theme = useTheme();
    const { guest } = route.params;
    const { updateGuest } = useGuests();

    const [firstName, setFirstName] = useState(guest.firstName);
    const [lastName, setLastName] = useState(guest.lastName);
    const [email, setEmail] = useState(guest.email || "");
    const [phoneNumber, setPhoneNumber] = useState(guest.phoneNumber || "");
    const [identityCardNumber, setIdentityCardNumber] = useState(guest.identityCardNumber || "");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        
        if (!firstName.trim() || !lastName.trim()) return Alert.alert("Błąd", "Podaj imię i nazwisko");

        try {
            setSubmitting(true);
            await updateGuest(guest.guestId, {
                guestId: guest.guestId,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phoneNumber: phoneNumber.trim(),
                email: email.trim(),
                identityCardNumber: identityCardNumber.trim().toUpperCase()
            });
            Alert.alert("Sukces", "Dane gościa zostały zaktualizowane", [
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
                    <Text variant="headlineSmall" style={styles.title}>Edycja gościa</Text>
                    
                    <TextInput label="Imię *" mode="outlined" value={firstName} onChangeText={setFirstName} 
                               editable={!submitting} style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

                    <TextInput label="Nazwisko *" mode="outlined" value={lastName} onChangeText={setLastName}
                               editable={!submitting} style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

                    <TextInput label="Email" mode="outlined" value={email} onChangeText={setEmail} editable={!submitting}
                               keyboardType="email-address" style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

                    <TextInput label="Numer telefonu" mode="outlined" value={phoneNumber} onChangeText={setPhoneNumber}
                               editable={!submitting} keyboardType="phone-pad" style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

                    <TextInput label="Numer dowodu osobistego" mode="outlined" value={identityCardNumber} onChangeText={setIdentityCardNumber}
                               editable={!submitting} style={styles.input} outlineColor={theme.colors.outline} activeOutlineColor={theme.colors.primary} />

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

export default UpdateGuestScreen;