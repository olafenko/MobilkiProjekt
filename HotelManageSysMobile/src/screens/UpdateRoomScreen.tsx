import {RootStackParamList} from "../navigation/types.ts";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useRooms} from "../context/RoomsContext.tsx";
import {useEffect, useState} from "react";
import {RoomStatus, RoomType} from "../types/models.ts";
import apiService from "../api/apiService.ts";
import {Alert, Text} from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, 'UpdateRoom'>;

function UpdateRoomScreen({navigation,route}: Props) {

    const { room } = route.params;
    const { updateRoom } = useRooms();
    
    const [number, setNumber] = useState(room.number || "");
    const [floor, setFloor] = useState(room.floor.toString() || "");
    const [description, setDescription] = useState(room.description || "");
    const [basePrice, setBasePrice] = useState(room.basePrice.toString() || "");
    const [status, setStatus] = useState<RoomStatus>(room.status);
    const [roomTypeId, setRoomTypeId] = useState(room.roomTypeId.toString() || '');

    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const types = await apiService.getRoomTypes();
                setRoomTypes(types);
            } catch (err) {
                Alert.alert("Błąd", "Nie udało się załadować typów pokoi.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    
    return (
      <Text>Siema</Text>  
    );
    
}

export default UpdateRoomScreen;