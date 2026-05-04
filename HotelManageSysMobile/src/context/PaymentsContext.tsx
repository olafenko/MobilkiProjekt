import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {CreatePaymentRequest, Payment, UpdatePaymentRequest} from "../types/models.ts";
import apiService from "../api/apiService.ts";

interface PaymentsContextType {

    payments: Payment[];
    loading: boolean;
    error: string | null;

    refreshPayments: () => Promise<void>;
    addPayment: (data: CreatePaymentRequest) => Promise<void>;
    updatePayment: (id:number, data: UpdatePaymentRequest) => Promise<void>;
    deletePayment: (id: number) => Promise<void>;

}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined);

export function PaymentsProvider({children} : {children: ReactNode}) {

    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshPayments = async () => {

        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getPayments();
            setPayments(data);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            console.error("Nie udało się załadować płatności: ", e);
        } finally {
            setLoading(false);
        }
    };

    const addPayment = async (data: CreatePaymentRequest) => {

        try {
            setError(null);
            await apiService.createPayment(data);
            await refreshPayments();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }

    }

    const updatePayment = async (id: number, data: UpdatePaymentRequest) => {

        try {
            setError(null);
            await apiService.updatePayment(id, data);
            await refreshPayments();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }

    }

    const deletePayment = async (id: number) => {

        try {
            setError(null);
            await apiService.deletePayment(id);

            setPayments(prevState => prevState.filter(payment => payment.paymentId !== id));
        } catch (e){
            throw e;
        }

    }

    useEffect(() => {
        refreshPayments();
    }, []);

    return (
        <PaymentsContext.Provider value={{
            payments,
            loading,
            error,
            refreshPayments,
            addPayment,
            updatePayment,
            deletePayment
        }}
        >
            { children }
        </PaymentsContext.Provider>

    );

}

export function usePayments() {
    const context = useContext(PaymentsContext);
    if (!context){
        throw new Error('usePayments must be used within PaymentsProvider')
    }
    return context;
}