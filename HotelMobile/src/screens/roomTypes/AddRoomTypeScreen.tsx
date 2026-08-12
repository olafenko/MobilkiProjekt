import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {Alert, ScrollView, StyleSheet, View} from "react-native";
import {useRoomTypes} from "../../context/RoomTypesContext.tsx";
import {useState} from "react";
import {ActivityIndicator, Button, Card, TextInput, useTheme} from "react-native-paper";
import {useFormErrors} from "../../hooks/useFormErrors.ts";
import {ApiError} from "../../types/errors.ts";
import {ErrorBanner} from "../../components/ErrorBanner.tsx";
import {FormField} from "../../components/FormField.tsx";

type Props = NativeStackScreenProps<RootStackParamList, "AddRoomType">;

function AddRoomTypeScreen({navigation} : Props) {
    const theme = useTheme();
    const { addRoomType } = useRoomTypes();

    const [name, setName] = useState("");
    const [basePrice, setBasePrice] = useState('');
    const [description, setDescription] = useState('');

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        errors,
        generalError,
        clearFieldError,
        clearAllErrors,
        handleApiError
    } = useFormErrors();

    const handleSubmit = async () => {
        if (!name.trim()){
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    name: ['Nazwa jest wymagana'],
                },
            });
            return;
        }
        if (!basePrice) {
            handleApiError({
                type: 'ValidationError',
                title: 'Błędy walidacji',
                status: 400,
                errors: {
                    name: ['Cena bazowa jest wymagana'],
                },
            });
            return;
        }

        try {
            setSubmitting(true);
            await addRoomType({
                name: name,
                basePrice: parseFloat(basePrice),
                description: description
            });

            Alert.alert("Sukces", "Typ pokoju został dodany pomyślnie", [
                { text: "OK", onPress: () => navigation.goBack() },
            ])
        } catch (err) {
            handleApiError(err as ApiError);
        } finally {
            setSubmitting(false);
        }
    }

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
                        label="Nazwa"
                        required
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            clearFieldError('name');
                        }}
                        editable={!submitting}
                        error={errors.name}
                    />

                    <FormField
                        label="Cena bazowa"
                        required
                        value={basePrice}
                        onChangeText={(text) => {
                            setBasePrice(text);
                            clearFieldError('basePrice');
                        }}
                        keyboardType='numeric'
                        editable={!submitting}
                        error={errors.basePrice}
                    />

                    <FormField
                        label="Opis"
                        value={description}
                        onChangeText={(text) => {
                            setDescription(text);
                            clearFieldError('description');
                        }}
                        multiline
                        numberOfLines={3}
                        editable={!submitting}
                        error={errors.description}
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

export default AddRoomTypeScreen;