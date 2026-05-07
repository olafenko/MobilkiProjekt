import React, {useEffect, useMemo, useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {useReservations} from "../../context/ReservationsContext.tsx";

import {AdditionalOffer, CreateReservationRequest, Guest, ReservationStatus, Room} from "../../types/models.ts";
import apiService from "../../api/apiService.ts";

import {
    ActivityIndicator,
    Button,
    Card,
    Divider,
    IconButton,
    SegmentedButtons,
    Surface,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {PickerField} from "../../components/PickerField.tsx";
import {LargePickerField} from "../../components/LargePickerField.tsx";

type Props = NativeStackScreenProps<RootStackParamList, "AddReservation">;

interface OfferReservationTemp {
    id: string;
    additionalOfferId: number | null;
    quantity: string;
    notes: string;
}

function AddReservationScreen({ navigation }: Props) {
    const theme = useTheme();
    const { addReservation } = useReservations();

    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [rooms, setRooms] = useState<Room[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [additionalOffers, setAdditionalOffers] = useState<AdditionalOffer[]>([]);
    const [statuses,setStatuses] = useState<ReservationStatus[]>([]);
    
    const [checkIn, setCheckIn] = useState(new Date());
    const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000));
    const [showPicker, setShowPicker] = useState<'in' | 'out' | null>(null);

    const [status, setStatus] = useState<ReservationStatus>(ReservationStatus.PENDING);
    const [guestType, setGuestType] = useState('existing');
    const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);
    const [newGuest, setNewGuest] = useState({ firstName: '', lastName: '', identityCardNumber: '', phoneNumber: '', email: '' });

    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [reservationNotes, setReservationNotes] = useState('');
    const [selectedOffers, setSelectedOffers] = useState<OfferReservationTemp[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingData(true);
                const [roomsData, guestsData, offersData] = await Promise.all([
                    apiService.getRooms(),
                    apiService.getGuests(),
                    apiService.getAdditionalOffers(),
                ]);
                const statuses = Object.values(ReservationStatus)
                setRooms(roomsData);
                setGuests(guestsData);
                setAdditionalOffers(offersData);
                setStatuses(statuses);
            } catch (error) {
                Alert.alert("Błąd", "Nie udało się załadować danych.");
            } finally {
                setLoadingData(false);
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

        const offersTotal = selectedOffers.reduce((sum, item) => {
            const offerObj = additionalOffers.find(o => o.additionalOfferId === item.additionalOfferId);
            const qty = parseFloat(item.quantity) || 0;
            return sum + (offerObj ? offerObj.price * qty : 0);
        }, 0);

        return {
            nights,
            roomPricePerNight,
            roomTotal,
            offersTotal,
            grandTotal: roomTotal + offersTotal
        };
    }, [checkIn, checkOut, selectedRoomId, selectedOffers, rooms, additionalOffers]);

    const onDateChange = (event: any, date?: Date) => {
        setShowPicker(null);
        if (date) {
            if (showPicker === 'in') {
                setCheckIn(date);
                if (date >= checkOut) setCheckOut(new Date(date.getTime() + 86400000));
            } else setCheckOut(date);
        }
    };

    const addOfferReservation = () => {
        setSelectedOffers([...selectedOffers, { id: Date.now().toString(), additionalOfferId: null, quantity: '1', notes: '' }]);
    };

    const removeOfferItem = (id: string) => setSelectedOffers(selectedOffers.filter(item => item.id !== id));

    const updateOfferItem = (id: string, field: keyof OfferReservationTemp, value: any) => {
        setSelectedOffers(selectedOffers.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleSubmit = async () => {
        
        if (!selectedRoomId) return Alert.alert("Błąd", "Wybierz pokój.");

        if (guestType === 'existing' && !selectedGuestId) {
            return Alert.alert("Błąd", "Wybierz gościa.");
        }
        
        if (guestType === 'new') {
            
            if (!newGuest.firstName.trim() || !newGuest.lastName.trim()) {
                return Alert.alert("Błąd", "Uzupełnij imię i nazwisko nowego gościa.");
            }
            if (!newGuest.identityCardNumber.trim()) {
                return Alert.alert("Błąd", "Numer dowodu tożsamości jest obowiązkowy dla nowych gości.");
            }
            if (!newGuest.phoneNumber.trim()) {
                return Alert.alert("Błąd", "Numer telefonu jest obowiązkowy dla nowych gości.");
            }
        }

        const validOffers = selectedOffers
            .filter(o => o.additionalOfferId !== null)
            .map(o => ({
                additionalOfferId: o.additionalOfferId!,
                quantity: parseFloat(o.quantity) || 0,
                notes: o.notes.trim() || null
            }));

        const reservationData: CreateReservationRequest = {
            checkInDate: checkIn.toISOString(),
            checkOutDate: checkOut.toISOString(),
            roomId: selectedRoomId,
            reservationStatus: status,
            workerId: 1,
            notes: reservationNotes.trim() || null,
            additionalOffers: validOffers,
            ...(guestType === 'existing'
                    ? { guestId: selectedGuestId, newGuest: null }
                    : { guestId: null, newGuest: { ...newGuest } }
            )
        };

        try {
            setSubmitting(true);
            await addReservation(reservationData);
            Alert.alert("Sukces", "Rezerwacja utworzona.");
            navigation.goBack();
        } catch (err) {
            Alert.alert("Błąd", (err as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingData) return <View style={styles.centerContainer}><ActivityIndicator size="large" /></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Card mode="elevated" style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Termin i Pokój</Text>
                    <View style={styles.row}>
                        <Button mode="outlined" onPress={() => setShowPicker('in')} style={styles.flex1}>Od: {checkIn.toLocaleDateString()}</Button>
                        <View style={{ width: 8 }} />
                        <Button mode="outlined" onPress={() => setShowPicker('out')} style={styles.flex1}>Do: {checkOut.toLocaleDateString()}</Button>
                    </View>

                    {showPicker && <DateTimePicker value={showPicker === 'in' ? checkIn : checkOut} mode="date" onChange={onDateChange} minimumDate={showPicker === 'out' ? checkIn : new Date()} />}

                    <LargePickerField
                        label="Pokój"
                        value={selectedRoomId}
                        items={rooms}
                        getValue={r => r.roomId}
                        getLabel={r => `Pokój ${r.number} (${r.roomTypeName}) - ${r.basePrice} zł/doba`}
                        onChange={val => setSelectedRoomId(val as number | null)}
                        required
                    />

                    <Divider style={styles.divider} />
                    
                    <View style={styles.row}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Usługi dodatkowe</Text>
                        <Button icon="plus" onPress={addOfferReservation}>Dodaj</Button>
                    </View>

                    {selectedOffers.map((item, index) => (
                        <Surface key={item.id} style={styles.offerItemSurface} elevation={1}>
                            <View style={styles.offerHeader}>
                                <Text variant="labelLarge">Usługa #{index + 1}</Text>
                                <IconButton icon="delete-outline" iconColor={theme.colors.error} size={20} onPress={() => removeOfferItem(item.id)} />
                            </View>
                            <PickerField
                                label="Wybierz usługę"
                                selectedValue={item.additionalOfferId}
                                items={additionalOffers}
                                getValue={o => o.additionalOfferId}
                                getLabel={o => `${o.name} (${o.price} zł)`}
                                onChange={val => updateOfferItem(item.id, 'additionalOfferId', val)}
                            />
                            <View style={[styles.row, { marginTop: 4, gap: 8 }]}>
                                <TextInput
                                    label="Ilość"
                                    mode="outlined"
                                    keyboardType="numeric"
                                    value={item.quantity}
                                    onChangeText={t => updateOfferItem(item.id, 'quantity', t)}
                                    style={{ flex: 1 }}
                                />
                                <TextInput
                                    label="Uwagi (np. godzina)"
                                    mode="outlined"
                                    value={item.notes}
                                    onChangeText={t => updateOfferItem(item.id, 'notes', t)}
                                    style={{ flex: 2 }}
                                />
                            </View>
                        </Surface>
                    ))}

                    <Divider style={styles.divider} />
                    
                    <Text variant="titleMedium" style={styles.sectionTitle}>Dane gościa</Text>
                    <SegmentedButtons
                        value={guestType}
                        onValueChange={setGuestType}
                        buttons={[{ value: 'existing', label: 'Z bazy gości' }, { value: 'new', label: 'Nowy gość' }]}
                        style={{ marginBottom: 16 }}
                    />

                    {guestType === 'existing' ? (
                        <LargePickerField
                            label="Wybierz gościa"
                            value={selectedGuestId}
                            items={guests}
                            getValue={g => g.guestId}
                            getLabel={g => `${g.firstName} ${g.lastName} (${g.identityCardNumber || 'Brak dowodu'})`}
                            onChange={val => setSelectedGuestId(val as number | null)}
                        />
                    ) : (
                        <View style={styles.gap}>
                            <TextInput label="Imię *" mode="outlined" value={newGuest.firstName} onChangeText={t => setNewGuest({...newGuest, firstName: t})} />
                            <TextInput label="Nazwisko *" mode="outlined" value={newGuest.lastName} onChangeText={t => setNewGuest({...newGuest, lastName: t})} />
                            <TextInput label="Numer dowodu *" mode="outlined" value={newGuest.identityCardNumber} onChangeText={t => setNewGuest({...newGuest, identityCardNumber: t})} />
                            <TextInput label="Numer telefonu *" mode="outlined" keyboardType="phone-pad" value={newGuest.phoneNumber} onChangeText={t => setNewGuest({...newGuest, phoneNumber: t})} />
                            <TextInput label="Email (opcjonalnie)" mode="outlined" keyboardType="email-address" value={newGuest.email} onChangeText={t => setNewGuest({...newGuest, email: t})} />
                        </View>
                    )}

                    <PickerField
                        label="Status"
                        selectedValue={status}
                        items={statuses}
                        getValue={s => s}
                        getLabel={s=> s}
                        onChange={val => setStatus(val as ReservationStatus)}
                        required
                    />

                    <Divider style={styles.divider} />
                    
                    <Text variant="titleMedium" style={styles.sectionTitle}>Notatki do rezerwacji</Text>
                    <TextInput
                        label="Uwagi ogólne (opcjonalnie)"
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        value={reservationNotes}
                        onChangeText={setReservationNotes}
                    />
                    
                    <Surface style={styles.summarySurface} elevation={2}>
                        <Text variant="titleMedium" style={styles.summaryTitle}>Podsumowanie kosztów</Text>

                        <View style={styles.summaryRow}>
                            <Text variant="bodyMedium">Noclegi ({summary.nights} x {summary.roomPricePerNight} zł):</Text>
                            <Text variant="bodyLarge" style={styles.bold}>{summary.roomTotal.toFixed(2)} zł</Text>
                        </View>

                        {summary.offersTotal > 0 && (
                            <View style={styles.summaryRow}>
                                <Text variant="bodyMedium">Usługi dodatkowe:</Text>
                                <Text variant="bodyLarge" style={styles.bold}>{summary.offersTotal.toFixed(2)} zł</Text>
                            </View>
                        )}

                        <Divider style={{ marginVertical: 8 }} />

                        <View style={styles.summaryRow}>
                            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>RAZEM:</Text>
                            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                {summary.grandTotal.toFixed(2)} zł
                            </Text>
                        </View>
                    </Surface>
                </Card.Content>

                <Card.Actions style={styles.actions}>
                    <Button mode="text" onPress={() => navigation.goBack()} disabled={submitting}>Anuluj</Button>
                    <Button mode="contained" onPress={handleSubmit} loading={submitting} disabled={submitting}>Utwórz rezerwację</Button>
                </Card.Actions>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 16, paddingBottom: 40 },
    card: { backgroundColor: '#fff' },
    sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    flex1: { flex: 1 },
    divider: { marginVertical: 20 },
    gap: { gap: 12 },
    actions: { padding: 16, justifyContent: 'flex-end' },
    offerItemSurface: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
    offerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

    summarySurface: {
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef'
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
        marginVertical: 4
    },
    bold: { fontWeight: 'bold' }
});

export default AddReservationScreen;