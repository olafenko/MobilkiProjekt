import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {AdditionalOffer, CreateAdditionalOfferRequest, UpdateAdditionalOfferRequest} from "../types/models.ts";
import apiService from "../api/apiService.ts";

interface AdditionalOffersContextType {
    additionalOffers: AdditionalOffer[];
    loading: boolean;
    error: string | null;

    refreshAdditionalOffers: () => Promise<void>;
    addAdditionalOffer: (data: CreateAdditionalOfferRequest) => Promise<void>;
    updateAdditionalOffer: (id: number, data: UpdateAdditionalOfferRequest) => Promise<void>;
    deleteAdditionalOffer: (id: number) => Promise<void>;
}

const AdditionalOffersContext = createContext<AdditionalOffersContextType | undefined>(undefined);

export function AdditionalOffersProvider({children} : {children: ReactNode}) {

    const [additionalOffers, setAdditionalOffers] = useState<AdditionalOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshAdditionalOffers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getAdditionalOffers();
            setAdditionalOffers(data);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            console.error("Nie udało się załadować ofert dodatkowych: ", e);
        } finally {
            setLoading(false);
        }
    };

    const addAdditionalOffer = async (data: CreateAdditionalOfferRequest) => {
        try {
            setError(null);
            await apiService.createAdditionalOffer(data);
            await refreshAdditionalOffers();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }
    }

    const updateAdditionalOffer = async (id: number, data: UpdateAdditionalOfferRequest) => {
        try {
            setError(null);
            await apiService.updateAdditionalOffer(id, data);
            await refreshAdditionalOffers();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }
    }

    const deleteAdditionalOffer = async (id: number) => {
        try {
            setError(null);
            await apiService.deleteAdditionalOffer(id);
            setAdditionalOffers(prevState => prevState.filter(offer => offer.additionalOfferId !== id));
        } catch (e){
            throw e;
        }
    }

    useEffect(() => {
        refreshAdditionalOffers();
    }, []);

    return (
        <AdditionalOffersContext.Provider value={{
            additionalOffers,
            loading,
            error,
            refreshAdditionalOffers,
            addAdditionalOffer,
            updateAdditionalOffer,
            deleteAdditionalOffer
        }}>
            { children }
        </AdditionalOffersContext.Provider>
    );
}

export function useAdditionalOffers() {
    const context = useContext(AdditionalOffersContext);
    if (!context){
        throw new Error('useAdditionalOffers must be used within AdditionalOffersProvider')
    }
    return context;
}