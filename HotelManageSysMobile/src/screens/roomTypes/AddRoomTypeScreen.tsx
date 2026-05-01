import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/types.ts";
import {ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {useRoomTypes} from "../../context/RoomTypesContext.tsx";
import {useState} from "react";


type Props = NativeStackScreenProps<RootStackParamList, "AddRoomType">;


function AddRoomTypeScreen({navigation} : Props) {
    
    const { addRoomType } = useRoomTypes();
    
    const [name, setName] = useState("");
    const [basePrice, setBasePrice] = useState('');
    const [description, setDescription] = useState('');

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const handleSubmit = async () => {

        if (!name.trim()){
            Alert.alert("Błąd", "Podaj nazwę");
            return;
        }
        if (!basePrice) {
            Alert.alert("Błąd", "Podaj cene bazową");
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

                <Text style={styles.label}>Cena bazowa *</Text>
                <TextInput style={styles.input} value={basePrice} onChangeText={setBasePrice} keyboardType="numeric" editable={!submitting} />

                <Text style={styles.label}>Opis</Text>
                <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} multiline numberOfLines={3} editable={!submitting} />

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

export default AddRoomTypeScreen;