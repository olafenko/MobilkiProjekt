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

type Props = NativeStackScreenProps<RootStackParamList, "AddRoom">;

function AddRoomScreen({ navigation }: Props) {
    const { addRoom } = useRooms();

    const [number, setNumber] = useState("");
    const [floor, setFloor] = useState("");
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [status, setStatus] = useState<RoomStatus>(RoomStatus.AVAILABLE);
    const [roomTypeId, setRoomTypeId] = useState<number | null>(null);

    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors,setErrors] = useState<{roomType?: string}>({});
    
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
                setRoomTypes(types);
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
        if (!roomTypeId) {
            setErrors(e => ({...e,roomType: "Wybierz typ pokoju"}));
            return;
        }
        
        try {
            setSubmitting(true);
            await addRoom({
                number: number.trim(),
                description: description.trim(),
                floor: parseInt(floor),
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

                
                <PickerField 
                    label="Typ pokoju"
                    value={roomTypeId}
                    items={roomTypes}
                    getValue={t => t.roomTypeId}
                    getLabel={t => t.name}
                    onChange={val => setRoomTypeId(val as number | null)}
                    placeholder={"Wybierz typ pokoju..."}
                    required
                    disabled={submitting}
                    error={errors.roomType}
                />
                
                <Text style={styles.label}>Status</Text>
                <View style={styles.pickerContainer}>
                    {Object.values(RoomStatus).map((s) => (
                        <TouchableOpacity
                            key={s}
                            style={[styles.chip, status === s && styles.chipSelected]}
                            onPress={() => setStatus(s)}
                        >
                            <Text style={[styles.chipText, status === s && styles.chipTextSelected]}>{s}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

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
    pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#e0e0e0', borderWidth: 2, borderColor: '#e0e0e0' },
    chipSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
    chipText: { fontSize: 14, fontWeight: '600', color: '#333' },
    chipTextSelected: { color: '#fff' },
    buttons: { flexDirection: 'row', columnGap: 10, marginTop: 20, marginBottom: 30 },
});

export default AddRoomScreen;