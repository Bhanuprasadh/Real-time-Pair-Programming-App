import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JoinRoom: React.FC = () => {
    const navigate = useNavigate();

    const createRoom = async () => {
        try {
            const response = await axios.post('http://localhost:8000/rooms');
            const roomId = response.data.room_id;
            navigate(`/room/${roomId}`);
        } catch (error) {
            console.error('Failed to create room', error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#1e1e1e', color: 'white' }}>
            <h1>Pair Programming</h1>
            <button
                onClick={createRoom}
                style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007acc', color: 'white', border: 'none', borderRadius: '5px' }}
            >
                Create New Room
            </button>
        </div>
    );
};

export default JoinRoom;
