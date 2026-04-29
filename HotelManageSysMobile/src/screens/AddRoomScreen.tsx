import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types.ts";
import { useRooms } from "../context/RoomsContext.tsx";
import { useEffect, useState } from "react";
import { RoomStatus, RoomType } from "../types/models.ts";
import apiService from "../api/apiService.ts";
import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {PickerField} from "../components/PickerField.tsx";
import {SmPickerField} from "../components/SmPickerField.tsx";

type Props = NativeStackScreenProps<RootStackParamList, "AddRoom">;

function AddRoomScreen({ navigation }: Props) {
    const { addRoom } = useRooms();

    const [number, setNumber] = useState("");
    const [floor, setFloor] = useState("");
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [status, setStatus] = useState<RoomStatus | null>(null);
    const [roomTypeId, setRoomTypeId] = useState<number | null>(null);

    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [statuses,setStatuses] = useState<RoomStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    // const [errors,setErrors] = useState<{roomType?: string}>({});
    
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
                const types = await apiService.getRoomTypes();
                const statuses = Object.values(RoomStatus);
                setRoomTypes(types);
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
                roomTypeId: roomTypeId
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

                <SmPickerField
                    label="Typ pokoju"
                    selectedValue={roomTypeId}
                    items={roomTypes}
                    getValue={r => r.roomTypeId}
                    getLabel={r=> r.name}
                    onChange={val => setRoomTypeId(val as number | null)}
                    required
                />
                
                <SmPickerField
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
                    <Button title={submitting ? 'Wysyłanie...' : 'Utwórz'} onPress={handleSubmit} disabled={submitting} />
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

export default AddRoomScreen;