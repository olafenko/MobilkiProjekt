import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";


interface PickerFieldProps<T>{
    label: string;
    selectedValue: string | number | null;
    items: T[];
    getValue: (item: T) => string | number;
    getLabel: (item: T) => string;
    onChange: (value: string | number) => void;
    required?: boolean;
}

export function PickerField<T>({label, items, selectedValue,getValue,getLabel,onChange,required = true}: PickerFieldProps<T>) {
    
    return (<View>
        <Text style={styles.label}>{label}{required && <Text style={styles.required}> *</Text>}</Text>
        <View style={styles.pickerContainer}>
            {items.map((item) => {
                const val = getValue(item);
                const isSelected = selectedValue === val;
                return (
                <TouchableOpacity
                    key={val}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => onChange(val)}
                >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{getLabel(item)}</Text>
                </TouchableOpacity>
            );
            })
            }
        </View>
    </View>);
    
}

const styles = StyleSheet.create({
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
    pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#e0e0e0', borderWidth: 2, borderColor: '#e0e0e0' },
    chipSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
    chipText: { fontSize: 14, fontWeight: '600', color: '#333' },
    chipTextSelected: { color: '#fff' },
    required: { color: '#F44336' },
});

