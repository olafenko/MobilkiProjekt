import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { useReservations } from "../../context/ReservationsContext.tsx";
import { Guest, ReservationStatus, Room, UpdateReservationRequest } from "../../types/models.ts";
import apiService from "../../api/apiService.ts";
import {
    ActivityIndicator,
    Button,
    Card,
    Divider,
    Surface,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { PickerField } from "../../components/PickerField.tsx";
import { LargePickerField } from "../../components/LargePickerField.tsx";

type Props = NativeStackScreenProps<RootStackParamList, 'UpdateReservation'>;

function UpdateReservationScreen({ navigation, route }: Props) {
    const theme = useTheme();
    
    const { reservation } = route.params;
    const { updateReservation } = useReservations();
    
    const [checkIn, setCheckIn] = useState(new Date(reservation.checkInDate));
    const [checkOut, setCheckOut] = useState(new Date(reservation.checkOutDate));
    const [showPicker, setShowPicker] = useState<'in' | 'out' | null>(null);

    const [status, setStatus] = useState<ReservationStatus>(reservation.reservationStatus);
    const [selectedRoomId, setSelectedRoomId] = useState<number>(reservation.roomId);
    const [reservationNotes, setReservationNotes] = useState(reservation.notes || '');
    
    const [rooms, setRooms] = useState<Room[]>([]);
    const [statuses, setStatuses] = useState<ReservationStatus[]>([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        const loadData = async () => {
            try {
                const [roomsData] = await Promise.all([
                    apiService.getRooms(),
                ]);
                const statusList = Object.values(ReservationStatus);

                setRooms(roomsData);
                setStatuses(statusList);
            } catch (err) {
                Alert.alert("Błąd", "Nie udało się załadować danych pomocniczych.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    
    const summary = useMemo(() => {
        const diffTime = checkOut.getTime() - checkIn.getTime();
        const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        const room = rooms.find(r => r.roomId === selectedRoomId);
        const roomPricePerNight = room ? room.basePrice : 0;
        const roomTotal = nights * roomPricePerNight;

        return { nights, roomPricePerNight, roomTotal };
    }, [checkIn, checkOut, selectedRoomId, rooms]);

    const onDateChange = (event: any, date?: Date) => {
        setShowPicker(null);
        if (date) {
            if (showPicker === 'in') {
                setCheckIn(date);
                if (date >= checkOut) setCheckOut(new Date(date.getTime() + 86400000));
            } else setCheckOut(date);
        }
    };

    const handleSubmit = async () => {
        
        try {
            setSubmitting(true);
            await updateReservation(reservation.reservationId, {
                reservationId: reservation.reservationId,
                checkInDate: checkIn.toISOString(),
                checkOutDate: checkOut.toISOString(),
                roomId: selectedRoomId,
                reservationStatus: status,
                notes: reservationNotes.trim() || null
            });

            Alert.alert("Sukces", "Rezerwacja została zaktualizowana!", [
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
                <Text style={styles.label}>Termin pobytu *</Text>
                <View style={styles.row}>
                    <Button mode="outlined" onPress={() => setShowPicker('in')} style={styles.flex1}>
                        Od: {checkIn.toLocaleDateString()}
                    </Button>
                    <View style={{ width: 10 }} />
                    <Button mode="outlined" onPress={() => setShowPicker('out')} style={styles.flex1}>
                        Do: {checkOut.toLocaleDateString()}
                    </Button>
                </View>

                {showPicker && (
                    <DateTimePicker
                        value={showPicker === 'in' ? checkIn : checkOut}
                        mode="date"
                        onChange={onDateChange}
                        minimumDate={showPicker === 'out' ? checkIn : new Date()}
                    />
                )}

                <LargePickerField
                    label="Pokój *"
                    value={selectedRoomId}
                    items={rooms}
                    getValue={r => r.roomId}
                    getLabel={r => `Pokój ${r.number} (${r.roomTypeName}) - ${r.basePrice} zł`}
                    onChange={val => setSelectedRoomId(val as number)}
                />
                
                <PickerField
                    label="Status rezerwacji *"
                    selectedValue={status}
                    items={statuses}
                    getValue={s => s}
                    getLabel={s => s}
                    onChange={val => setStatus(val as ReservationStatus)}
                    required
                />

                <Text style={styles.label}>Notatki</Text>
                <TextInput
                    style={styles.input}
                    mode="outlined"
                    value={reservationNotes}
                    onChangeText={setReservationNotes}
                    multiline
                    numberOfLines={3}
                    editable={!submitting}
                />

                <Surface style={styles.summarySurface} elevation={1}>
                    <Text variant="titleMedium">Podsumowanie noclegów</Text>
                    <View style={styles.summaryRow}>
                        <Text>{summary.nights} x {summary.roomPricePerNight} zł</Text>
                        <Text style={styles.totalText}>{summary.roomTotal.toFixed(2)} zł</Text>
                    </View>
                </Surface>

                <View style={styles.buttons}>
                    <Button
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={styles.flex1}
                        disabled={submitting}
                    >
                        Anuluj
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.flex1}
                        loading={submitting}
                    >
                        Zapisz
                    </Button>
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
    input: { backgroundColor: '#fff' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    flex1: { flex: 1 },
    summarySurface: {
        marginTop: 20,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    totalText: { fontSize: 18, fontWeight: 'bold', color: '#6200ee' },
    buttons: { flexDirection: 'row', gap: 10, marginTop: 30, marginBottom: 30 },
});

export default UpdateReservationScreen;