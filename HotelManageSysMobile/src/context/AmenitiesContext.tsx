import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Amenity, CreateAmenityRequest, UpdateAmenityRequest} from "../types/models.ts";
import apiService from "../api/apiService.ts";


interface AmenitiesContextType {

    amenities: Amenity[];
    loading: boolean;
    error: string | null;

    refreshAmenities: () => Promise<void>;
    addAmenity: (data: CreateAmenityRequest) => Promise<void>;
    updateAmenity: (id:number, data: UpdateAmenityRequest) => Promise<void>;
    deleteAmenity: (id: number) => Promise<void>;
    
}

const AmenitiesContext = createContext<AmenitiesContextType | undefined>(undefined);

export function AmenitiesProvider({children} : {children: ReactNode}) {


    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshAmenities = async () => {

        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getAmenities();
            setAmenities(data);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            console.error("Nie udało się załadować udogodnień: ", e);
        } finally {
            setLoading(false);
        }
    };

    const addAmenity = async (data: CreateAmenityRequest) => {

        try {
            setError(null);
            await apiService.createAmenity(data);
            await refreshAmenities();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }

    }

    const updateAmenity = async (id: number, data: UpdateAmenityRequest) => {

        try {
            setError(null);
            await apiService.updateAmenity(id, data);
            await refreshAmenities();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }

    }

    const deleteAmenity = async (id: number) => {

        try {
            setError(null);
            await apiService.deleteAmenity(id);

            setAmenities(prevState => prevState.filter(amenity => amenity.amenityId !== id));
        } catch (e){
            throw e;
        }

    }



    useEffect(() => {
        refreshAmenities();
    }, []);

    return (
        <AmenitiesContext.Provider value={{
            amenities,
            loading,
            error,
            refreshAmenities,
            addAmenity,
            updateAmenity,
            deleteAmenity
        }}
        >
            { children }
        </AmenitiesContext.Provider>

    );
    
}


export function useAmenities() {
    const context = useContext(AmenitiesContext);
    if (!context){
        throw new Error('useAmenities must be used within AmenitiesProvider')
    }
    return context;
}
