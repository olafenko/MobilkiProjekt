import {StyleSheet, Text, View} from "react-native";
import {Picker} from "@react-native-picker/picker";

interface PickerFieldProps<T> {
    label: string;
    value: string | number | null;
    items: T[];
    getValue: (item: T) => string | number;
    getLabel: (item: T) => string;
    onChange: (value: string | number | null) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
}

export function LargePickerField<T>({
                                   label,
                                   value,
                                   items,
                                   getValue,
                                   getLabel,
                                   onChange,
                                   placeholder = 'Wybierz...',
                                   required = false,
                                   disabled = false,
                                   error,
                               }: PickerFieldProps<T>) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={[
                styles.pickerContainer,
                disabled && styles.disabled,
                error && styles.errorBorder,
            ]}>
                <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                    enabled={!disabled}
                >
                    <Picker.Item label={placeholder} value={null} />
                    {items.map((item) => (
                        <Picker.Item
                            key={getValue(item).toString()}
                            label={getLabel(item)}
                            value={getValue(item)}
                        />
                    ))}
                </Picker>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontWeight: '600', marginBottom: 8, color: '#333' },
    required: { color: '#F44336' },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    picker: { height: 50 },
    disabled: { backgroundColor: '#f5f5f5', opacity: 0.7 },
    errorBorder: { borderColor: '#F44336' },
    errorText: { color: '#F44336', fontSize: 12, marginTop: 4 },
});