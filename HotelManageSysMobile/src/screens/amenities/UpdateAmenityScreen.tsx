import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {useState} from "react";
import {useAmenities} from "../../context/AmenitiesContext.tsx";


type Props = NativeStackScreenProps<RootStackParamList, "UpdateAmenity">;


function UpdateAmenityScreen({navigation, route} : Props) {

    const { amenity } = route.params;
    
    const { updateAmenity } = useAmenities();

    const [name, setName] = useState(amenity.name);
    const [description, setDescription] = useState(amenity.description);

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {

        if (!name.trim()){
            Alert.alert("Błąd", "Podaj nazwę");
            return;
        }

        try {
            setSubmitting(true);
            await updateAmenity(amenity.amenityId, {
                amenityId: amenity.amenityId,
                name: name,
                description: description
            });

            Alert.alert("Sukces", "Udogodnienie zostało zaaktualizowane", [
                { text: "OK", onPress: () => navigation.goBack() },
            ])
        } catch (err) {
            Alert.alert("Błąd", (err as Error).message);
        } finally {
            setSubmitting(false);
        }
    }

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
                <Text style={styles.label}>Nazwa *</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} editable={!submitting} />

                <Text style={styles.label}>Opis</Text>
                <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} multiline numberOfLines={3} editable={!submitting} />

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
    buttons: { flexDirection: 'row', columnGap: 10, marginTop: 20, marginBottom: 30 },
});

export default UpdateAmenityScreen;