import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Text, useTheme } from "react-native-paper";

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
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={[
                styles.pickerContainer,
                { borderColor: theme.colors.outline },
                disabled && styles.disabled,
                error && styles.errorBorder,
            ]}>
                <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={[
                        styles.picker,
                        {
                            color: theme.colors.onSurface,
                        }
                    ]}
                    dropdownIconColor={theme.colors.onSurface}
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
    container: {
        marginVertical: 20
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 8
    },
    required: {
        color: '#CF6679'
    },
    pickerContainer: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden'
    },
    picker: {
        height: 50
    },
    disabled: {
        opacity: 0.5
    },
    errorBorder: {
        borderColor: '#CF6679'
    },
    errorText: {
        color: '#CF6679',
        fontSize: 12,
        marginTop: 4
    },
});