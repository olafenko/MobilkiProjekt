import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";


interface ErrorBannerProps {
    message: string;
    onDismiss?: () => void;
    type?: 'error' | 'warning' | 'info';
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
    message,
    onDismiss,
    type = 'error'
}) => {


    const colors = {
        error: { bg: '#FFEBEE', border: '#E53935', text: '#C62828' },
        warning: { bg: '#FFF3E0', border: '#FF9800', text: '#E65100' },
        info: { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0', },
    };

    const color = colors[type];

    return (
        <View style={[styles.container, { backgroundColor: color.bg, borderColor: color.border }]}>
            <Text style={[styles.message, { color: color.text }]}>{message}</Text>
            {onDismiss && (
                <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
                    <Text style={styles.dismissText}>✕</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
    },
    icon: {
        fontSize: 18,
        marginRight: 10,
    },
    message: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    dismissButton: {
        padding: 4,
        marginLeft: 8,
    },
    dismissText: {
        fontSize: 18,
        color: '#666',
    },
});