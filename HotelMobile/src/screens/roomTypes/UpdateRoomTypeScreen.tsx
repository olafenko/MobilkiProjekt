import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {Alert, ScrollView, StyleSheet, View} from "react-native";
import {useRoomTypes} from "../../context/RoomTypesContext.tsx";
import {useState} from "react";
import {ActivityIndicator, Button, Card, TextInput, useTheme} from "react-native-paper";

type Props = NativeStackScreenProps<RootStackParamList, "UpdateRoomType">;

function UpdateRoomTypeScreen({navigation, route} : Props) {
    const theme = useTheme();
    const { roomType } = route.params;
    const { updateRoomType } = useRoomTypes();

    const [name, setName] = useState(roomType.name);
    const [basePrice, setBasePrice] = useState(roomType.basePrice.toString());
    const [description, setDescription] = useState(roomType.description);

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()){
            Alert.alert("Błąd", "Podaj nazwę");
            return;
        }
        if (!basePrice) {
            Alert.alert("Błąd", "Podaj cene bazową");
            return;
        }

        try {
            setSubmitting(true);
            await updateRoomType(roomType.roomTypeId, {
                roomTypeId: roomType.roomTypeId,
                name: name,
                basePrice: parseFloat(basePrice),
                description: description
            });

            Alert.alert("Sukces", "Typ pokoju został zaaktualizowany", [
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
                        label="Nazwa *"
                        mode="outlined"
                        value={name}
                        onChangeText={setName}
                        editable={!submitting}
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                    />

                    <TextInput
                        label="Cena bazowa *"
                        mode="outlined"
                        value={basePrice}
                        onChangeText={setBasePrice}
                        keyboardType="numeric"
                        editable={!submitting}
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                    />

                    <TextInput
                        label="Opis"
                        mode="outlined"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                        editable={!submitting}
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
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
                            {submitting ? 'Wysyłanie...' : 'Zapisz'}
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

export default UpdateRoomTypeScreen;