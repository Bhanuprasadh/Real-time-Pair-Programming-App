import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface RoomState {
    roomId: string | null;
    code: string;
}

const initialState: RoomState = {
    roomId: null,
    code: '# Start coding...',
};

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoomId: (state, action: PayloadAction<string>) => {
            state.roomId = action.payload;
        },
        setCode: (state, action: PayloadAction<string>) => {
            state.code = action.payload;
        },
    },
});

export const { setRoomId, setCode } = roomSlice.actions;
export default roomSlice.reducer;
