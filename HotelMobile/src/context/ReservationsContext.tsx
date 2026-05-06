import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiService from '../api/apiService.ts';
import type { Reservation, CreateReservationRequest, UpdateReservationRequest } from "../types/models.ts";

interface ReservationsContextType {
    reservations: Reservation[];
    loading: boolean;
    error: string | null;

    refreshReservations: () => Promise<void>;
    addReservation: (data: CreateReservationRequest) => Promise<void>;
    updateReservation: (id: number, data: UpdateReservationRequest) => Promise<void>;
    deleteReservation: (id: number) => Promise<void>;
}

const ReservationsContext = createContext<ReservationsContextType | undefined>(undefined);

export function ReservationsProvider({ children }: { children: ReactNode }) {

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshReservations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getReservations();
            setReservations(data);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            console.error("Failed to load reservations: ", e);
        } finally {
            setLoading(false);
        }
    };

    const addReservation = async (data: CreateReservationRequest) => {
        try {
            setError(null);
            await apiService.createReservation(data);
            await refreshReservations();
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }
    };

    const updateReservation = async (id: number, data: UpdateReservationRequest) => {
        try {
            setError(null);
            await apiService.updateReservation(id, data);
            await refreshReservations();
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }
    };

    const deleteReservation = async (id: number) => {
        try {
            setError(null);
            await apiService.deleteReservation(id);

            // Optymistyczna aktualizacja UI, identycznie jak w pokojach
            setReservations(prevState => prevState.filter(res => res.reservationId !== id));
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }
    };

    useEffect(() => {
        refreshReservations();
    }, []);

    return (
        <ReservationsContext.Provider value={{
            reservations,
            loading,
            error,
            refreshReservations,
            addReservation,
            updateReservation,
            deleteReservation
        }}>
            {children}
        </ReservationsContext.Provider>
    );
}

export function useReservations() {
    const context = useContext(ReservationsContext);
    if (!context) {
        throw new Error('useReservations must be used within ReservationsProvider');
    }
    return context;
}