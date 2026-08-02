import {RootStackParamList} from "../../navigation/types.ts";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useRooms} from "../../context/RoomsContext.tsx";
import {useEffect, useState} from "react";
import {Amenity, RoomStatus, RoomType} from "../../types/models.ts";
import apiService from "../../api/apiService.ts";
import {Alert, ScrollView, StyleSheet, View} from "react-native";
import {PickerField} from "../../components/PickerField.tsx";
import {MultiPickerField} from "../../components/MultiPickerField.tsx";
import {ActivityIndicator, Button, Card, HelperText, useTheme} from "react-native-paper";
import {useFormErrors} from "../../hooks/useFormErrors.ts";
import {ApiError} from "../../types/errors.ts";
import {ErrorBanner} from "../../components/ErrorBanner.tsx";
import {FormField} from "../../components/FormField.tsx";

type Props = NativeStackScreenProps<RootStackParamList, 'UpdateRoom'>;

function UpdateRoomScreen({navigation, route}: Props) {
    const theme = useTheme();
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
    const [statuses, setStatuses] = useState<RoomStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const {
        errors,
        generalError,
        clearFieldError,
        clearAllErrors,
        handleApiError
    } = useFormErrors();

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
                const [types, allAmenities] = await Promise.all([
                    apiService.getRoomTypes(),
                    apiService.getAmenities(),
                ]);
                const statuses = Object.values(RoomStatus);
                setRoomTypes(types);
                setAmenities(allAmenities);
                setStatuses(statuses);

                if (room.amenitiesNames.length > 0) {
                    const matchedAmenities = allAmenities
                        .filter(a => room.amenitiesNames.includes(a.name))
                        .map(a => a.amenityId);
                    setSelectedAmenities(matchedAmenities);
                }

            } catch (err) {
                Alert.alert('Błąd', 'Nie udało się załadować danych');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async () => {
        clearAllErrors();

        const parsedFloor = parseInt(floor, 10);
        
        if (!number.trim()) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    name: ['Numer pokoju jest wymagany'],
                },
            });
            return;
        }

        if (!floor.trim() || Number.isNaN(parsedFloor)) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    name: ['Podaj poprawne piętro'],
                },
            });
            return;
        }

        if (!roomTypeId) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    name: ['Wybierz typ pokoju'],
                },
            });
            return;
        }

        if (!status) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    name: ['Wybierz status'],
                },
            });
            return;
        }

        try {
            setSubmitting(true);
            await updateRoom(room.roomId, {
                roomId: room.roomId,
                number: number.trim(),
                description: description || "",
                floor: parsedFloor,
                status: status,
                roomTypeId: roomTypeId,
                amenitiesIds: selectedAmenities
            });

            Alert.alert("Sukces", "Pokój został zaaktualizowany!", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (err) {
            handleApiError(err as ApiError);
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
                    {generalError && (
                        <ErrorBanner
                            message={generalError}
                            onDismiss={clearAllErrors}
                        />
                    )}

                    <FormField
                        label="Numer pokoju"
                        required
                        value={number}
                        onChangeText={(text) => {
                            setNumber(text);
                            clearFieldError('number');
                        }}
                        editable={!submitting}
                        error={errors.number}
                    />

                    <FormField
                        label="Piętro"
                        required
                        value={floor}
                        onChangeText={(text) => {
                            setFloor(text);
                            clearFieldError('floor');
                        }}
                        keyboardType="numeric"
                        editable={!submitting}
                        error={errors.floor}
                    />

                    <FormField
                        label="Opis"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                        editable={!submitting}
                    />

                    <FormField
                        label="Cena"
                        value={basePrice}
                        editable={false}
                    />

                    <PickerField
                        label="Typ pokoju"
                        selectedValue={roomTypeId}
                        items={roomTypes}
                        getValue={r => r.roomTypeId}
                        getLabel={r => r.name}
                        onChange={val => {
                            setRoomTypeId(val as number);
                            clearFieldError('roomTypeId');
                        }}
                        required
                    />
                    <HelperText type="error" visible={!!errors.roomTypeId}>
                        {errors.roomTypeId}
                    </HelperText>

                    <MultiPickerField
                        label="Udogodnienia"
                        selectedValues={selectedAmenities}
                        items={amenities}
                        getValue={a => a.amenityId}
                        getLabel={a => a.name}
                        onChange={values => setSelectedAmenities(values)}
                        required={false}
                    />

                    <PickerField
                        label="Status"
                        selectedValue={status}
                        items={statuses}
                        getValue={s => s}
                        getLabel={s => s}
                        onChange={val => {
                            setStatus(val as RoomStatus);
                            clearFieldError('status');
                        }}
                        required
                    />
                    <HelperText type="error" visible={!!errors.status}>
                        {errors.status}
                    </HelperText>

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

export default UpdateRoomScreen;
