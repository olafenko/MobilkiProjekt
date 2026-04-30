import {RootStackParamList} from "../navigation/types.ts";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useRooms} from "../context/RoomsContext.tsx";
import {useEffect, useState} from "react";
import {Amenity, RoomStatus, RoomType} from "../types/models.ts";
import apiService from "../api/apiService.ts";
import {ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {PickerField} from "../components/PickerField.tsx";
import {MultiPickerField} from "../components/MultiPickerField.tsx";

type Props = NativeStackScreenProps<RootStackParamList, 'UpdateRoom'>;

function UpdateRoomScreen({navigation,route}: Props) {

    const { room } = route.params;
    const { updateRoom } = useRooms();

    const [number, setNumber] = useState(room.number);
    const [floor, setFloor] = useState(room.floor.toString());
    const [description, setDescription] = useState(room.description);
    const [basePrice, setBasePrice] = useState(room.basePrice.toString());
    const [status, setStatus] = useState<RoomStatus>(room.status);
    const [roomTypeId, setRoomTypeId] = useState<number>(room.roomTypeId);
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
                
                if(room.amenitiesNames.length > 0){
                    const matchedAmenities =allAmenities.filter(a => room.amenitiesNames.includes(a.name))
                        .map(a => a.amenityId);
                    setSelectedAmenities(matchedAmenities);
                }
                
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
            await updateRoom(room.roomId, {
                roomId: room.roomId,
                number: number.trim(),
                description: description.trim(),
                floor: parseInt(floor) || 0,
                status: status,
                roomTypeId: roomTypeId,
                amenitiesIds: selectedAmenities
            });

            Alert.alert("Sukces", "Pokój został zaaktualizowany!", [
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
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Numer pokoju *</Text>
                <TextInput style={styles.input} value={number} onChangeText={setNumber} editable={!submitting} />

                <Text style={styles.label}>Piętro *</Text>
                <TextInput style={styles.input} value={floor} onChangeText={setFloor} keyboardType="numeric" editable={!submitting} />

                <Text style={styles.label}>Opis</Text>
                <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} multiline numberOfLines={3} editable={!submitting} />

                <Text style={styles.label}>Cena</Text>
                <TextInput style={styles.input} value={basePrice} editable={false} />
                
                <PickerField
                    label="Typ pokoju"
                    selectedValue={roomTypeId}
                    items={roomTypes}
                    getValue={r => r.roomTypeId}
                    getLabel={r=> r.name}
                    onChange={val => setRoomTypeId(val as number)}
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
                    <Button title="Anuluj" onPress={() => navigation.goBack()} color="#999" disabled={submitting} />
                    <Button title={submitting ? 'Wysyłanie...' : 'Zapisz'} onPress={handleSubmit} disabled={submitting} />
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
    pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#e0e0e0', borderWidth: 2, borderColor: '#e0e0e0' },
    chipSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
    chipText: { fontSize: 14, fontWeight: '600', color: '#333' },
    chipTextSelected: { color: '#fff' },
    buttons: { flexDirection: 'row', columnGap: 10, marginTop: 20, marginBottom: 30 },
});
    


export default UpdateRoomScreen;