import {CreateRoomTypeRequest, RoomType, UpdateRoomTypeRequest} from "../types/models.ts";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import apiService from "../api/apiService.ts";

interface RoomTypesContextType {
    
    roomTypes: RoomType[];
    loading: boolean;
    error: string | null;
    
    refreshRoomTypes: () => Promise<void>;
    addRoomType: (data: CreateRoomTypeRequest) => Promise<void>;
    updateRoomType: (id:number, data: UpdateRoomTypeRequest) => Promise<void>;
    deleteRoomType: (id: number) => Promise<void>;
    
}

const RoomTypesContext = createContext<RoomTypesContextType | undefined>(undefined);

export function RoomTypesProvider({children} : {children: ReactNode}) {
    
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshRoomTypes = async () => {

        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getRoomTypes();
            setRoomTypes(data);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            console.error("Nie udało się załadować typów pokoi: ", e);
        } finally {
            setLoading(false);
        }
    };

    const addRoomType = async (data: CreateRoomTypeRequest) => {

        try {
            setError(null);
            await apiService.createRoomType(data);
            await refreshRoomTypes();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }

    }

    const updateRoomType = async (id: number, data: UpdateRoomTypeRequest) => {

        try {
            setError(null);
            await apiService.updateRoomType(id, data);
            await refreshRoomTypes();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }

    }

    const deleteRoomType = async (id: number) => {

        try {
            setError(null);
            await apiService.deleteRoomType(id);

            setRoomTypes(prevState => prevState.filter(roomType => roomType.roomTypeId !== id));
        } catch (e){
            throw e;
        }

    }



    useEffect(() => {
        refreshRoomTypes();
    }, []);

    return (
        <RoomTypesContext.Provider value={{
            roomTypes,
            loading,
            error,
            refreshRoomTypes,
            addRoomType,
            updateRoomType,
            deleteRoomType
        }}
        >
            { children }
        </RoomTypesContext.Provider>

    );
    
    
}

export function useRoomTypes() {
    const context = useContext(RoomTypesContext);
    if (!context){
        throw new Error('useRoomTypes must be used within RoomTypesProvider')
    }
    return context;
}