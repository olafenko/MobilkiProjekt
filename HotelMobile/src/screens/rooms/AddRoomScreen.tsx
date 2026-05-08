import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {useRooms} from "../../context/RoomsContext.tsx";
import {useEffect, useState} from "react";
import {Amenity, RoomStatus, RoomType} from "../../types/models.ts";
import apiService from "../../api/apiService.ts";
import {Alert, ScrollView, StyleSheet, View} from "react-native";
import {PickerField} from "../../components/PickerField.tsx";
import {MultiPickerField} from "../../components/MultiPickerField.tsx";
import {ActivityIndicator, Button, Card, TextInput, useTheme} from "react-native-paper";

type Props = NativeStackScreenProps<RootStackParamList, "AddRoom">;

function AddRoomScreen({ navigation }: Props) {
    const theme = useTheme();
    const { addRoom } = useRooms();

    const [number, setNumber] = useState("");
    const [floor, setFloor] = useState("");
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [status, setStatus] = useState<RoomStatus | null>(null);
    const [roomTypeId, setRoomTypeId] = useState<number | null>(null);
    const [selectedAmenities, setSelectedAmenities] = useState<(number | string)[]>([]);

    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [statuses,setStatuses] = useState<RoomStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (roomTypeId) {
            const selectedType = roomTypes.find(rt => rt.roomTypeId === roomTypeId);
            if (selectedType) {
                setBasePrice(selectedType.basePrice.toString());
            }
        }
    }, [roomTypeId, roomTypes]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [types, allAmenities] =  await Promise.all(
                    [
                        apiService.getRoomTypes(),
                        apiService.getAmenities(),
                    ]);
                const statuses = Object.values(RoomStatus);
                setRoomTypes(types);
                setAmenities(allAmenities)
                setStatuses(statuses);
            } catch (err) {
                Alert.alert("Błąd", "Nie udało się załadować danych.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async () => {
        if (!number.trim()){
            Alert.alert("Błąd", "Podaj numer pokoju");
            return;
        }
        if (!floor) {
            Alert.alert("Błąd", "Podaj piętro");
            return;
        }
        if (!status) {
            Alert.alert("Błąd", "Wybierz status");
            return;
        }
        if (!roomTypeId) {
            Alert.alert("Błąd", "Wybierz typ pokoju");
            return;
        }

        try {
            setSubmitting(true);
            await addRoom({
                number: number.trim(),
                description: description.trim(),
                floor: parseInt(floor) || 0,
                status: status,
                roomTypeId: roomTypeId,
                amenitiesIds: selectedAmenities

            });

            Alert.alert("Sukces", "Pokój został dodany pomyślnie", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (err) {
            Alert.alert("Błąd", (err as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

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
                        label="Numer pokoju *"
                        mode="outlined"
                        value={number}
                        onChangeText={setNumber}
                        editable={!submitting}
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                    />

                    <TextInput
                        label="Piętro *"
                        mode="outlined"
                        value={floor}
                        onChangeText={setFloor}
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

                    <TextInput
                        label="Cena"
                        mode="outlined"
                        value={basePrice}
                        editable={false}
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                    />

                    <PickerField
                        label="Typ pokoju"
                        selectedValue={roomTypeId}
                        items={roomTypes}
                        getValue={r => r.roomTypeId}
                        getLabel={r=> r.name}
                        onChange={val => setRoomTypeId(val as number | null)}
                        required
                    />

                    <MultiPickerField
                        label="Udogodnienia"
                        selectedValues={selectedAmenities}
                        items={amenities}
                        getValue={a => a.amenityId}
                        getLabel={a => a.name}
                        onChange={values => setSelectedAmenities(values) }
                        required={false}
                    />

                    <PickerField
                        label="Status"
                        selectedValue={status}
                        items={statuses}
                        getValue={s => s}
                        getLabel={s=> s}
                        onChange={val => setStatus(val as RoomStatus)}
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

export default AddRoomScreen;