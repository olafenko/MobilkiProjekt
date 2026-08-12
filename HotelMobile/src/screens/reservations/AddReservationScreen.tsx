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
    HelperText,
    IconButton,
    SegmentedButtons,
    Surface,
    Text,
    useTheme
} from 'react-native-paper';
import {PickerField} from "../../components/PickerField.tsx";
import {LargePickerField} from "../../components/LargePickerField.tsx";
import {FormField} from "../../components/FormField.tsx";
import DatePicker from "react-native-date-picker";
import {ErrorBanner} from "../../components/ErrorBanner.tsx";
import {useFormErrors} from "../../hooks/useFormErrors.ts";
import {ApiError} from "../../types/errors.ts";

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

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [rooms, setRooms] = useState<Room[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [additionalOffers, setAdditionalOffers] = useState<AdditionalOffer[]>([]);
    const [statuses, setStatuses] = useState<ReservationStatus[]>([]);

    const [checkIn, setCheckIn] = useState(new Date());
    const [checkOut, setCheckOut] = useState(new Date(Date.now() + (1000 * 60 * 60 * 24)));
    const [openCheckIn, setOpenCheckIn] = useState(false);
    const [openCheckOut, setOpenCheckOut] = useState(false);

    const [showPicker, setShowPicker] = useState<'in' | 'out' | null>(null);

    const [status, setStatus] = useState<ReservationStatus>(ReservationStatus.PENDING);
    const [guestType, setGuestType] = useState('existing');
    const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);
    const [newGuest, setNewGuest] = useState({ firstName: '', lastName: '', identityCardNumber: '', phoneNumber: '', email: '' });

    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [reservationNotes, setReservationNotes] = useState('');
    const [selectedOffers, setSelectedOffers] = useState<OfferReservationTemp[]>([]);

    const {
        errors,
        generalError,
        clearFieldError,
        clearAllErrors,
        handleApiError
    } = useFormErrors();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [roomsData, guestsData, offersData] = await Promise.all([
                    apiService.getRooms(),
                    apiService.getGuests(),
                    apiService.getAdditionalOffers(),
                ]);
                setRooms(roomsData);
                setGuests(guestsData);
                setAdditionalOffers(offersData);
                setStatuses(Object.values(ReservationStatus));
            } catch (error) {
                Alert.alert("Błąd", "Nie udało się załadować danych.");
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

        const offersTotal = selectedOffers.reduce((sum, item) => {
            const offerObj = additionalOffers.find(o => o.additionalOfferId === item.additionalOfferId);
            const quantity = parseFloat(item.quantity) || 0;
            return sum + (offerObj ? offerObj.price * quantity : 0);
        }, 0);

        return { nights, roomPricePerNight, roomCostTotal, offersTotal, grandTotal: roomCostTotal + offersTotal };
    }, [checkIn, checkOut, selectedRoomId, selectedOffers, rooms, additionalOffers]);
    
    const addOfferReservation = () => setSelectedOffers([...selectedOffers, { id: Date.now().toString(), additionalOfferId: null, quantity: '1', notes: '' }]);
    
    const removeOfferItem = (id: string) => setSelectedOffers(selectedOffers.filter(item => item.id !== id));
    
    const updateOfferItem = (id: string, field: keyof OfferReservationTemp, value: any) =>
        setSelectedOffers(selectedOffers.map(item => item.id === id ? { ...item, [field]: value } : item));

    const handleSubmit = async () => {
        clearAllErrors();
        
        if (!selectedRoomId) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    roomId: ['Wybierz pokój'],
                },
            });
            return;
        }
        if (guestType === 'existing' && !selectedGuestId) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    guestId: ['Gość jest wymagany'],
                },
            });
            return;
        }

        if (guestType === 'new') {
            if (!newGuest.firstName.trim()) {
                handleApiError({
                    type: 'ValidationError',
                    title: 'Błędy walidacji',
                    status: 400,
                    errors: {
                        firstName: ['Imie gościa jest wymagane'],
                    },
                });
                return;
            }
            if(!newGuest.lastName.trim()) {
                handleApiError({
                    type: 'ValidationError',
                    title: 'Błędy walidacji',
                    status: 400,
                    errors: {
                        lastName: ['Nazwisko gościa jest wymagane'],
                    },
                });
                return;
            }
            if (!newGuest.identityCardNumber.trim()) {
                handleApiError({
                    type: 'ValidationError',
                    title: 'Błędy walidacji',
                    status: 400,
                    errors: {
                        identityCardNumber: ['Numer dowodu tożsamości jest wymagany'],
                    },
                });
                return;
            }
            if (!newGuest.phoneNumber.trim()) {
                handleApiError({
                    type: 'ValidationError',
                    title: 'Błędy walidacji',
                    status: 400,
                    errors: {
                        phoneNumber: ['Numer kontaktowy gościa jest wymagany'],
                    },
                });
                return;
            }
        }

        for (const offer of selectedOffers) {
            const quantity = parseFloat(offer.quantity);

            if (!offer.additionalOfferId) {
                handleApiError({
                    type: 'ValidationError',
                    title: 'Błędy walidacji',
                    status: 400,
                    errors: {
                        additionalOfferId: ['Wybierz usługę dodatkową'],
                    },
                });
                return;
            }

            if (!offer.quantity.trim() || Number.isNaN(quantity) || quantity <= 0) {
                handleApiError({
                    type: 'ValidationError',
                    title: 'Błędy walidacji',
                    status: 400,
                    errors: {
                        quantity: ['Podaj poprawną ilość'],
                    },
                });
                return;
            }
        }

        if (!status) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    reservationStatus: ['Wybierz status rezerwacji'],
                },
            });
            return;
        }

        const validOffers = selectedOffers
            .filter(o => o.additionalOfferId !== null)
            .map(o => ({ additionalOfferId: o.additionalOfferId!, quantity: parseFloat(o.quantity) || 0, notes: o.notes.trim() || null }));

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
                    : { guestId: null, newGuest: { ...newGuest, identityCardNumber: newGuest.identityCardNumber.trim().toUpperCase() } }
            )
        };

        try {
            setSubmitting(true);
            await addReservation(reservationData);
            Alert.alert("Sukces", "Rezerwacja została utworzona pomyślnie.", [{ text: "OK", onPress: () => navigation.goBack() }]);
        } catch (err) {
            handleApiError(err as ApiError)
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text variant="bodySmall" style={{ marginTop: 16, opacity: 0.6 }}>Ładowanie...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.scrollContent}>
            <Card style={styles.card} mode="contained">
                <Card.Content>

                    {generalError && (
                        <ErrorBanner
                            message={generalError}
                            onDismiss={clearAllErrors}
                        />
                    )}
                    
                    <Text variant="titleMedium" style={styles.sectionTitle}>Termin pobytu</Text>
                    <View style={styles.row}>
                        <Button mode="outlined" onPress={() => setOpenCheckIn(true)} style={styles.flex1} textColor={theme.colors.onSurface}>
                            Od: {checkIn.toLocaleDateString()}</Button>
                        <View style={{ width: 8 }} />
                        <Button mode="outlined" onPress={() => setOpenCheckOut(true)} style={styles.flex1} textColor={theme.colors.onSurface}>
                            Do: {checkOut.toLocaleDateString()}</Button>
                    </View>
                    <HelperText type="error" visible={!!errors.checkOutDate}>
                        {errors.checkOutDate}
                    </HelperText>
                    
                    <DatePicker 
                        modal
                        title="Wybierz datę zameldowania"
                        mode="date"
                        open={openCheckIn}
                        date={checkIn}
                        onConfirm={(date) => {
                            setOpenCheckIn(false);
                            
                            if(date >= checkOut) setCheckOut(new Date(date.getTime() + (1000 * 60 * 60 * 24)));
                            setCheckIn(date)
                            clearFieldError("checkInDate")
                            clearFieldError("checkOutDate")
                        }}
                        onCancel={() => {
                            setOpenCheckIn(false)
                        }}
                        minimumDate={checkIn}
                        theme="dark"
                        dividerColor={theme.colors.outline}
                        buttonColor={theme.colors.primary}
                    />
                    
                    <DatePicker
                        modal
                        title="Wybierz datę wymeldowania"
                        mode="date"
                        open={openCheckOut}
                        date={checkOut}
                        onConfirm={(date) => {
                            setOpenCheckOut(false);
                            setCheckOut(date);
                            clearFieldError("checkOutDate");
                        }}
                        onCancel={() => {
                            setOpenCheckOut(false)
                        }}
                        minimumDate={checkIn}
                        maximumDate={new Date(checkIn.getTime() + (1000 * 60 * 60 * 24 * 30))}
                        theme="dark"
                        dividerColor={theme.colors.outline}
                        buttonColor={theme.colors.primary}
                    />
                    
                    <LargePickerField
                        label="Pokój"
                        value={selectedRoomId}
                        items={rooms} getValue={r => r.roomId} 
                        getLabel={r => `Pokój ${r.number} (${r.roomTypeName}) - ${r.basePrice} zł/doba`}
                        onChange={(val) => {
                            setSelectedRoomId(val as number | null)
                            clearFieldError("roomId")
                        }}
                        error={errors.roomId}
                        required
                    />

                    <Divider style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />


                    <View style={styles.row}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Usługi dodatkowe</Text>
                        <Button icon="plus" mode="text" onPress={addOfferReservation} textColor={theme.colors.primary}>Dodaj usługę</Button>
                    </View>

                    {selectedOffers.map((item, index) => (
                        <Surface key={item.id} style={[styles.offerItemSurface, { backgroundColor: theme.colors.surfaceVariant }]} elevation={1}>
                            <View style={styles.offerHeader}>
                                <Text variant="labelLarge" style={{ color: theme.colors.primary }}>Usługa #{index + 1}</Text>
                                <IconButton icon="close" iconColor={theme.colors.error} size={20} onPress={() => removeOfferItem(item.id)} style={{ margin: 0 }} />
                            </View>
                            <PickerField
                                label="Wybierz usługę"
                                selectedValue={item.additionalOfferId}
                                items={additionalOffers}
                                getValue={o => o.additionalOfferId}
                                getLabel={o => `${o.name} (${o.price} zł)`}
                                onChange={(val) => {
                                    updateOfferItem(item.id, 'additionalOfferId', val)
                                    clearFieldError("additionalOfferId")
                                }}
                                error={errors.additionalOfferId}
                            />
                            <View style={[styles.row, { marginTop: 8, gap: 8 }]}>
                                
                                <FormField label="Ilość" required keyboardType="numeric" value={item.quantity}
                                           onChangeText={(t) => {
                                               updateOfferItem(item.id, 'quantity', t)
                                               clearFieldError("quantity")
                                           }}
                                           style={styles.input}
                                           error={errors.quantity} />
                                
                                <FormField label="Uwagi (np. godzina dostawy)" value={item.notes}
                                           onChangeText={(t) => {
                                               updateOfferItem(item.id, 'notes', t)
                                               clearFieldError("notes")
                                           }}
                                           style={styles.input}
                                           error={errors.notes} />
                            </View>
                        </Surface>
                    ))}

                    <Divider style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
                    
                    <Text variant="titleMedium" style={styles.sectionTitle}>Dane gościa</Text>
                    <SegmentedButtons value={guestType} onValueChange={setGuestType} buttons={[{ value: 'existing', label: 'Z bazy gości' }, { value: 'new', label: 'Nowy gość' }]}
                                      style={{ marginBottom: 16 }} theme={{ colors: { secondaryContainer: theme.colors.primary, onSecondaryContainer: theme.colors.onPrimary } }} />

                    {guestType === 'existing' ? (
                        <LargePickerField
                            label="Wybierz gościa z systemu"
                            value={selectedGuestId} items={guests}
                            getValue={g => g.guestId}
                            getLabel={g => `${g.firstName} ${g.lastName} (${g.identityCardNumber || 'Brak dowodu'})`}
                            onChange={(val) => {
                                setSelectedGuestId(val as number | null)
                                clearFieldError("guestId")
                            }}
                            error={errors.guestId}
                            required
                        />
                    ) : (
                        
                        //TODO 2 DODAC LOGIKE AUTOMATYCZNEGO USTAWIANIA GODZINY REZERWACJI NA BACKENDZIE
                        <View style={styles.gap}>
                            <FormField label="Imię" required value={newGuest.firstName} 
                                       onChangeText={(t) => {
                                           setNewGuest({...newGuest, firstName: t})
                                           clearFieldError("firstName")
                                       }}
                                       style={styles.input} error={errors.firstName} />
                            
                            <FormField label="Nazwisko" required value={newGuest.lastName} 
                                       onChangeText={(t) => {
                                           setNewGuest({...newGuest, lastName: t})
                                           clearFieldError("lastName")
                                       }}
                                       style={styles.input} error={errors.lastName} />
                            
                            <FormField label="Numer dowodu (np. ABC123456)" required value={newGuest.identityCardNumber}
                                       onChangeText={(t) => {
                                           setNewGuest({...newGuest, identityCardNumber: t.toUpperCase()})
                                           clearFieldError("identityCardNumber")
                                       }}
                                       autoCapitalize="characters"
                                       style={styles.input}
                                       error={errors.identityCardNumber} />
                            
                            <FormField label="Numer telefonu" required keyboardType="phone-pad" value={newGuest.phoneNumber}
                                       onChangeText={(t) => {
                                           setNewGuest({...newGuest, phoneNumber: t})
                                           clearFieldError("phoneNumber")
                                       }}
                                       style={styles.input}
                                       error={errors.phoneNumber} />
                            
                            <FormField label="Email komunikacyjny" keyboardType="email-address" autoCapitalize="none" value={newGuest.email}
                                       onChangeText={(t) => {
                                           setNewGuest({...newGuest, email: t})
                                           clearFieldError("email")
                                       }}
                                       style={styles.input}
                                       error={errors.email} />
                        </View>
                    )}

                    <Divider style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

                    <PickerField
                        label="Status rezerwacji"
                        selectedValue={status}
                        items={statuses}
                        getValue={s => s}
                        getLabel={s=> s}
                        onChange={(val) => {
                            setStatus(val as ReservationStatus);
                            clearFieldError("reservationStatus")
                        }}
                        error={errors.reservationStatus}
                        required
                    />

                    <FormField
                        label="Informacje dodatkowe"
                        multiline
                        numberOfLines={3}
                        value={reservationNotes}
                        onChangeText={setReservationNotes}
                        style={[styles.input, { marginTop: 12 }]}
                    />

                    <Surface style={[styles.summarySurface, { backgroundColor: 'rgba(0, 0, 0, 0.2)', borderColor: theme.colors.outlineVariant }]} elevation={0}>
                        <Text variant="titleSmall" style={[styles.summaryTitle, { color: theme.colors.onSurfaceVariant }]}>Podsumowanie kosztów</Text>
                        <View style={styles.summaryRow}><Text variant="bodyMedium">Noclegi ({summary.nights} x {summary.roomPricePerNight} zł)</Text>
                            <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{summary.roomCostTotal.toFixed(2)} zł</Text>
                        </View>
                            {summary.offersTotal > 0 && <View style={styles.summaryRow}>
                            <Text variant="bodyMedium">Pakiety i usługi dodatkowe</Text>
                            <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{summary.offersTotal.toFixed(2)} zł</Text>
                            </View>
                            }
                        <Divider style={{ marginVertical: 8, backgroundColor: theme.colors.outlineVariant }} />
                        <View style={styles.summaryRow}>
                            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>RAZEM</Text>
                            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{summary.grandTotal.toFixed(2)} zł</Text>
                        </View>
                    </Surface>

                    <View style={styles.actions}>
                        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.flex1} disabled={submitting}
                                textColor={theme.colors.onSurfaceVariant}>Odrzuć</Button>
                        <Button mode="contained" onPress={handleSubmit} style={styles.flex1} loading={submitting} disabled={submitting} buttonColor={theme.colors.primary}
                                textColor={theme.colors.onPrimary}>Utwórz</Button>
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
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    flex1: {
        flex: 1
    },
    flex2: {
        flex: 2
    },
    divider: {
        marginVertical: 24,
        height: 1
    },
    gap: {
        gap: 16
    },
    input: {
        backgroundColor: 'transparent'
    },
    offerItemSurface: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16
    },
    offerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    summarySurface: {
        marginTop: 24,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1
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
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24
    }
});

export default AddReservationScreen;
