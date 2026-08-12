import {StyleSheet, View} from "react-native";
import React from "react";
import {HelperText, TextInput, TextInputProps, useTheme} from "react-native-paper";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";


interface FormFieldProps extends Omit<TextInputProps,'error'> {
    label: string;
    error?: string;
    required?: boolean;
}


export const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    required,
    style,
    ...inputProps
}) => {
    
    const theme = useTheme();
    return(

        <View style={styles.container}>

            <HelperText type="error" visible={!!error} style={styles.errorText}>
                <MaterialDesignIcons name="alert-circle-outline" color="#E53935" /> {error}
            </HelperText>
            <TextInput
            
                label={required ? `${label} *` : label}
                mode="outlined"
                style={[styles.input, style]}
                error={!!error}
                theme={theme}
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                
                {...inputProps}
            />

            
        </View>
        
    );
};

const styles = StyleSheet.create({
    
    container: {
        marginBottom: 0,
    },
    input: {
        backgroundColor: 'transparent'
    },
    
    errorText: {
        color: '#E53935',
        fontSize: 12,
        fontWeight: '500',
    },
});
