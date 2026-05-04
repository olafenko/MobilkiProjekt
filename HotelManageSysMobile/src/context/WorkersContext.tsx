import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {CreateWorkerRequest, Worker, UpdateWorkerRequest} from "../types/models.ts";
import apiService from "../api/apiService.ts";

interface WorkersContextType {

    workers: Worker[];
    loading: boolean;
    error: string | null;

    refreshWorkers: () => Promise<void>;
    addWorker: (data: CreateWorkerRequest) => Promise<void>;
    updateWorker: (id:number, data: UpdateWorkerRequest) => Promise<void>;
    deleteWorker: (id: number) => Promise<void>;

}

const WorkersContext = createContext<WorkersContextType | undefined>(undefined);

export function WorkersProvider({children} : {children: ReactNode}) {

    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshWorkers = async () => {

        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getWorkers();
            setWorkers(data);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            console.error("Nie udało się załadować pracowników: ", e);
        } finally {
            setLoading(false);
        }
    };

    const addWorker = async (data: CreateWorkerRequest) => {

        try {
            setError(null);
            await apiService.createWorker(data);
            await refreshWorkers();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }

    }

    const updateWorker = async (id: number, data: UpdateWorkerRequest) => {

        try {
            setError(null);
            await apiService.updateWorker(id, data);
            await refreshWorkers();
        } catch (e){
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }

    }

    const deleteWorker = async (id: number) => {

        try {
            setError(null);
            await apiService.deleteWorker(id);
            
            setWorkers(prevState => prevState.filter(worker => worker.workerId !== id));
        } catch (e){
            throw e;
        }

    }

    useEffect(() => {
        refreshWorkers();
    }, []);

    return (
        <WorkersContext.Provider value={{
            workers,
            loading,
            error,
            refreshWorkers,
            addWorker,
            updateWorker,
            deleteWorker
        }}
        >
            { children }
        </WorkersContext.Provider>

    );

}

export function useWorkers() {
    const context = useContext(WorkersContext);
    if (!context){
        throw new Error('useWorkers must be used within WorkersProvider')
    }
    return context;
}