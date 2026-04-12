import { createContext, useContext, useState, useEffect, ReactNode} from "react";
import apiService from '../api/apiService.ts';
import type {Room, CreateRoomRequest, UpdateRoomRequest} from "../types/models.ts";

interface RoomsContextType {
    
    rooms: Room[];
    loading: boolean;
    error: string | null;
    
    refreshRooms: () => Promise<void>;
    createRoom: (data: CreateRoomRequest) => Promise<void>;
    updateRoom: (id:number, data: UpdateRoomRequest) => Promise<void>;
    deleteRoom: (id: number) => Promise<void>;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export function RoomsProvider({children} : { children: ReactNode}) {
    
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const refreshRooms = async () => {
        
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getRooms();
            setRooms(data);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            console.error("Failed to load rooms: ", e);
        } finally {
            setLoading(false);
        }
    };
    
    const createRoom = async (data: CreateRoomRequest) => {
        
        try {
            setError(null);
            await apiService.createRoom(data);
            await refreshRooms();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }
        
    }

    const updateRoom = async (id: number, data: UpdateRoomRequest) => {

        try {
            setError(null);
            await apiService.updateRoom(id, data);
            await refreshRooms();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }

    }

    const deleteRoom = async (id: number) => {

        try {
            setError(null);
            await apiService.deleteRoom(id);
            
            setRooms(prevState => prevState.filter(room => room.roomId !== id));
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }

    }

    
    
    useEffect(() => {
        refreshRooms();
    }, []);
    
    return (
      <RoomsContext.Provider value={{
          rooms,
          loading,
          error,
          refreshRooms,
          createRoom,
          updateRoom,
          deleteRoom
      }}
      >
          { children }
      </RoomsContext.Provider>

    );
}

export function useRooms() {
    const context = useContext(RoomsContext);
    if (!context){
        throw new Error('useRooms must be used within RoomsProvider')
    }
    return context;
}