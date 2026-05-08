import React from 'react';
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface PickerFieldProps<T>{
    label: string;
    selectedValue: string | number | null;
    items: T[];
    getValue: (item: T) => string | number;
    getLabel: (item: T) => string;
    onChange: (value: string | number) => void;
    required?: boolean;
}

export function PickerField<T>({label, items, selectedValue, getValue, getLabel, onChange, required = true}: PickerFieldProps<T>) {

    const theme = useTheme();

    return (
        <View style={styles.container}>
            <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                {label}{required && <Text style={styles.required}> *</Text>}
            </Text>

            <View style={styles.pickerContainer}>
                {items.map((item) => {
                    const val = getValue(item);
                    const isSelected = selectedValue === val;

                    return (
                        <TouchableOpacity
                            key={val}
                            style={[
                                styles.chip,
                                { borderColor: theme.colors.outlineVariant },
                                isSelected && styles.chipSelected
                            ]}
                            onPress={() => onChange(val)}
                            activeOpacity={0.7}
                        >
                            <Text
                                variant="labelLarge"
                                style={[
                                    styles.chipText,
                                    { color: theme.colors.onSurfaceVariant },
                                    isSelected && styles.chipTextSelected
                                ]}
                            >
                                {getLabel(item)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
        marginTop: 8
    },
    label: {
        marginBottom: 8,
        fontWeight: 'bold'
    },
    pickerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'transparent',
        borderWidth: 1,
    },
    chipSelected: {
        backgroundColor: 'rgba(197, 160, 89, 0.1)',
        borderColor: '#C5A059',
        borderWidth: 1
    },
    chipText: {
        fontWeight: '500',
    },
    chipTextSelected: {
        color: '#C5A059',
        fontWeight: 'bold'
    },
    required: {
        color: '#CF6679'
    },
});