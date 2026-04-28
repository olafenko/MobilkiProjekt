import {RootStackParamList} from "../navigation/types.ts";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useRooms} from "../context/RoomsContext.tsx";
import {useEffect, useState} from "react";
import {RoomStatus, RoomType} from "../types/models.ts";
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

type Props = NativeStackScreenProps<RootStackParamList, 'UpdateRoom'>;

function UpdateRoomScreen({navigation,route}: Props) {

    const { room } = route.params;
    const { updateRoom } = useRooms();
    
    const [number, setNumber] = useState(room.number || "");
    const [floor, setFloor] = useState(room.floor.toString() || "");
    const [description, setDescription] = useState(room.description || "");
    const [basePrice, setBasePrice] = useState(room.basePrice.toString() || "");
    const [status, setStatus] = useState<RoomStatus>(room.status);
    const [roomTypeId, setRoomTypeId] = useState(room.roomTypeId.toString() || '');

    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (roomTypeId) {
            const selectedType = roomTypes.find(rt => rt.roomTypeId.toString() === roomTypeId);
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
                Alert.alert("Błąd", "Nie udało się załadować typów pokoi.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async () => {
        if (!number.trim() || !floor || !roomTypeId) {
            Alert.alert("Błąd", "Wypełnij wszystkie pola wymagane");
            return;
        }

        try {
            setSubmitting(true);
            await updateRoom(room.roomId, {
                roomId: room.roomId,
                number: number.trim(),
                description: description.trim(),
                floor: parseInt(floor),
                status: status,
                roomTypeId: parseInt(roomTypeId)
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

                <Text style={styles.label}>Piętro</Text>
                <TextInput style={styles.input} value={floor} onChangeText={setFloor} keyboardType="numeric" editable={!submitting} />

                <Text style={styles.label}>Opis</Text>
                <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} multiline numberOfLines={3} editable={!submitting} />

                <Text style={styles.label}>Cena bazowa (z typu pokoju)</Text>
                <TextInput style={styles.input} value={basePrice} editable={false} />

                <Text style={styles.label}>Typ pokoju *</Text>
                <View style={styles.pickerContainer}>
                    {roomTypes.map(rt => {
                        const isSelected = roomTypeId === rt.roomTypeId.toString();
                        return (
                            <TouchableOpacity
                                key={rt.roomTypeId}
                                style={[styles.chip, isSelected && styles.chipSelected]}
                                onPress={() => setRoomTypeId(rt.roomTypeId.toString())}
                            >
                                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{rt.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

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
    


export default UpdateRoomScreen;