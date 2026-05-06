import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {useEffect, useState} from "react";
import {useWorkers} from "../../context/WorkersContext.tsx";
import {Role} from "../../types/models.ts";
import {PickerField} from "../../components/PickerField.tsx";

type Props = NativeStackScreenProps<RootStackParamList, "UpdateWorker">;

function UpdateWorkerScreen({route, navigation} : Props) {

    const { worker } = route.params;

    const { updateWorker } = useWorkers();

    const [firstName, setFirstName] = useState(worker.firstName);
    const [lastName, setLastName] = useState(worker.lastName);
    const [login, setLogin] = useState(worker.login || "");
    const [role, setRole] = useState<Role>(worker.role);

    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const availableRoles = Object.values(Role);
                setRoles(availableRoles);
            } catch (err) {
                Alert.alert("Błąd", "Nie udało się załadować ról.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async () => {

        if (!firstName.trim() || !lastName.trim() || !login.trim()){
            Alert.alert("Błąd", "Wypełnij wszystkie wymagane pola (Imię, Nazwisko, Login)");
            return;
        }

        if (!role) {
            Alert.alert("Błąd", "Wybierz role");
            return;
        }

        try {
            setSubmitting(true);
            await updateWorker(worker.workerId, {
                workerId: worker.workerId,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                login: login.trim(),
                role: role
            });

            Alert.alert("Sukces", "Dane pracownika zostały zaktualizowane", [
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

                <Text style={styles.label}>Imię *</Text>
                <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} editable={!submitting} />

                <Text style={styles.label}>Nazwisko *</Text>
                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} editable={!submitting} />

                <Text style={styles.label}>Login *</Text>
                <TextInput style={styles.input} value={login} onChangeText={setLogin} editable={!submitting} autoCapitalize="none"
                />

                <PickerField
                    label="Rola"
                    selectedValue={role}
                    items={roles}
                    getValue={r => r}
                    getLabel={r => r}
                    onChange={val => setRole(val as Role)}
                    required
                />

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

export default UpdateWorkerScreen;