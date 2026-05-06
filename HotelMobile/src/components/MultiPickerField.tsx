import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";

interface MultiPickerFieldProps<T>{
    label: string;
    selectedValues: (string | number)[];
    items: T[];
    getValue: (item: T) => string | number;
    getLabel: (item: T) => string;
    onChange: (values: (string | number)[]) => void;
    required?: boolean;
    
}

export function MultiPickerField<T>({label, items, selectedValues,getValue,getLabel,onChange,required = true}: MultiPickerFieldProps<T>) {
    
    const toggleSelect = (item: T) => {
        const value = getValue(item);
        if( selectedValues.includes(value)){
            onChange(selectedValues.filter((v) => v !== value))
        } else {
            onChange([...selectedValues,value])
        }
    };
    
    return (
        <View>
            <Text style={styles.label}>{label}{required && <Text style={styles.required}> *</Text>}</Text>
            <View style={styles.pickerContainer}>
                {items.map((item) => {
                    const val = getValue(item);
                    const isSelected = selectedValues.includes(val);
                    return (
                        <TouchableOpacity
                            key={val}
                            style={[styles.chip, isSelected && styles.chipSelected]}
                            onPress={() => toggleSelect(item)}
                            activeOpacity={0.5}
                        >
                            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{getLabel(item)}</Text>
                        </TouchableOpacity>
                    );
                })
                }
                
            </View>
    </View>
    );
    
}

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
    required: { color: 'red' },
    pickerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    chipSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    chipTextSelected: {
        color: '#fff',
    },
});