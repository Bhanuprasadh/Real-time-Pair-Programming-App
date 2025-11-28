import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../editor/Editor';
import { useAppDispatch } from '../../app/hooks';
import { setRoomId } from './roomSlice';

const Room: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (id) {
            dispatch(setRoomId(id));
        }
    }, [id, dispatch]);

    if (!id) {
        return <div>Invalid Room ID</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1e1e1e' }}>
            <div style={{ padding: '10px', color: 'white', borderBottom: '1px solid #333' }}>
                Room ID: {id}
            </div>
            <CodeEditor roomId={id} />
        </div>
    );
};

export default Room;
