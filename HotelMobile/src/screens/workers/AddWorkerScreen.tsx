import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {Alert, ScrollView, StyleSheet, View} from "react-native";
import {useEffect, useState} from "react";
import {useWorkers} from "../../context/WorkersContext.tsx";
import {Role} from "../../types/models.ts";
import {PickerField} from "../../components/PickerField.tsx";
import {ActivityIndicator, Button, Card, TextInput, useTheme} from "react-native-paper";

type Props = NativeStackScreenProps<RootStackParamList, "AddWorker">;

function AddWorkerScreen({navigation} : Props) {
    const theme = useTheme();
    const { addWorker } = useWorkers();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role | null>(null);

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

        if (!firstName.trim() || !lastName.trim() || !login.trim() || !password.trim()){
            Alert.alert("Błąd", "Wypełnij wszystkie wymagane pola");
            return;
        }

        if (!role) {
            Alert.alert("Błąd", "Wybierz role");
            return;
        }

        try {
            setSubmitting(true);
            await addWorker({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                login: login.trim(),
                password: password.trim(),
                role: role
            });

            Alert.alert("Sukces", "Pracownik został dodany pomyślnie", [
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
            <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.scrollContent}>
            <Card style={styles.card} mode="contained">
                <Card.Content style={styles.gap}>

                    <TextInput
                        label="Imię *"
                        mode="outlined"
                        value={firstName}
                        onChangeText={setFirstName}
                        editable={!submitting}
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                    />

                    <TextInput
                        label="Nazwisko *"
                        mode="outlined"
                        value={lastName}
                        onChangeText={setLastName}
                        editable={!submitting}
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                    />

                    <TextInput
                        label="Login *"
                        mode="outlined"
                        value={login}
                        onChangeText={setLogin}
                        editable={!submitting}
                        autoCapitalize="none"
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                    />

                    <TextInput
                        label="Hasło *"
                        mode="outlined"
                        value={password}
                        onChangeText={setPassword}
                        editable={!submitting}
                        secureTextEntry={true}
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
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
                        <Button
                            mode="outlined"
                            onPress={() => navigation.goBack()}
                            disabled={submitting}
                            style={styles.flex1}
                            textColor={theme.colors.onSurfaceVariant}
                        >
                            Anuluj
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            disabled={submitting}
                            loading={submitting}
                            style={styles.flex1}
                            buttonColor={theme.colors.primary}
                            textColor={theme.colors.onPrimary}
                        >
                            {submitting ? 'Wysyłanie...' : 'Utwórz'}
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollContent: {
        padding: 16,
        marginTop: 25,
        flexGrow: 1
    },
    card: {
        borderRadius: 24,
        paddingVertical: 8
    },
    gap: {
        gap: 16
    },
    input: {
        backgroundColor: 'transparent'
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16
    },
    flex1: {
        flex: 1
    }
});

export default AddWorkerScreen;