import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types.ts";
import { useReservations } from "../../context/ReservationsContext.tsx";
import { ReservationStatus, Room } from "../../types/models.ts";
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
import DateTimePicker from '@react-native-community/datetimepicker';
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
                setRooms(roomsData);
                setStatuses(Object.values(ReservationStatus));
            } catch (err) {
                Alert.alert("Błąd", "Nie udało się załadować danychh.");
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
        const roomCostTotal = nights * roomPricePerNight;

        return { nights, roomPricePerNight, roomCostTotal };
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

            Alert.alert("Sukces", "Rezerwacja została zaktualizowana", [
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
                <Card.Content>
                    <Text variant="headlineSmall" style={styles.mainTitle}>Edycja rezerwacji</Text>

                    <Divider style={styles.divider} />

                    <Text variant="titleMedium" style={styles.sectionTitle}>Termin pobytu</Text>
                    <View style={styles.row}>
                        <Button mode="outlined" onPress={() => setShowPicker('in')} style={styles.flex1} textColor={theme.colors.onSurface}>
                            Od: {checkIn.toLocaleDateString()}
                        </Button>
                        <View style={{ width: 10 }} />
                        <Button mode="outlined" onPress={() => setShowPicker('out')} style={styles.flex1} textColor={theme.colors.onSurface}>
                            Do: {checkOut.toLocaleDateString()}
                        </Button>
                    </View>

                    {showPicker && (
                        <DateTimePicker value={showPicker === 'in' ? checkIn : checkOut} mode="date" onChange={onDateChange} minimumDate={showPicker === 'out' ? checkIn : new Date()}/>
                    )}

                    <LargePickerField
                        label="Pokój *"
                        value={selectedRoomId}
                        items={rooms}
                        getValue={r => r.roomId}
                        getLabel={r => `Pokój ${r.number} (${r.roomTypeName})`}
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

                    <TextInput
                        label="Informacje dodatkowe"
                        mode="outlined"
                        value={reservationNotes}
                        onChangeText={setReservationNotes}
                        multiline
                        numberOfLines={3}
                        editable={!submitting}
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                    />

                    <Surface style={[styles.summarySurface, { backgroundColor: 'rgba(0, 0, 0, 0.2)', borderColor: theme.colors.outlineVariant }]} elevation={0}>
                        <Text variant="titleSmall" style={[styles.summaryTitle, { color: theme.colors.onSurfaceVariant }]}>Podsumowanie kosztów</Text>
                        <View style={styles.summaryRow}>
                            <Text variant="bodyMedium">{summary.nights} x {summary.roomPricePerNight} zł</Text>
                            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                {summary.roomCostTotal.toFixed(2)} zł
                            </Text>
                        </View>
                    </Surface>

                    <View style={styles.buttons}>
                        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.flex1} disabled={submitting} textColor={theme.colors.onSurfaceVariant}>
                            Anuluj
                        </Button>
                        <Button mode="contained" onPress={handleSubmit} style={styles.flex1} loading={submitting} buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary}>
                            Zapisz
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
    mainTitle: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    guestSubtitle: {
        textAlign: 'center',
        opacity: 0.6,
        marginBottom: 4
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8
    },
    divider: {
        marginVertical: 20,
        height: 1
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    flex1: {
        flex: 1
    },
    input: {
        backgroundColor: 'transparent',
        marginTop: 12
    },
    summarySurface: {
        marginTop: 24,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    summaryTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 30,
        marginBottom: 15
    },
});

export default UpdateReservationScreen;