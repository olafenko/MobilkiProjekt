import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {CreateGuestRequest, Guest, UpdateGuestRequest} from "../types/models.ts";
import apiService from "../api/apiService.ts";

interface GuestsContextType {

    guests: Guest[];
    loading: boolean;
    error: string | null;

    refreshGuests: () => Promise<void>;
    addGuest: (data: CreateGuestRequest) => Promise<void>;
    updateGuest: (id:number, data: UpdateGuestRequest) => Promise<void>;
    deleteGuest: (id: number) => Promise<void>;

}

const GuestsContext = createContext<GuestsContextType | undefined>(undefined);

export function GuestsProvider({children} : {children: ReactNode}) {

    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshGuests = async () => {

        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getGuests();
            setGuests(data);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            console.error("Nie udało się załadować gości: ", e);
        } finally {
            setLoading(false);
        }
    };

    const addGuest = async (data: CreateGuestRequest) => {

        try {
            setError(null);
            await apiService.createGuest(data);
            await refreshGuests();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }

    }

    const updateGuest = async (id: number, data: UpdateGuestRequest) => {

        try {
            setError(null);
            await apiService.updateGuest(id, data);
            await refreshGuests();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }

    }

    const deleteGuest = async (id: number) => {

        try {
            setError(null);
            await apiService.deleteGuest(id);

            setGuests(prevState => prevState.filter(guest => guest.guestId !== id));
        } catch (e){
            throw e;
        }

    }

    useEffect(() => {
        refreshGuests();
    }, []);

    return (
        <GuestsContext.Provider value={{
            guests,
            loading,
            error,
            refreshGuests,
            addGuest,
            updateGuest,
            deleteGuest
        }}
        >
            { children }
        </GuestsContext.Provider>

    );

}

export function useGuests() {
    const context = useContext(GuestsContext);
    if (!context){
        throw new Error('useGuests must be used within GuestsProvider')
    }
    return context;
}