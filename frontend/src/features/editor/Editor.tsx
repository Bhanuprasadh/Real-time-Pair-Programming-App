import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { RootState } from '../../app/store';
import { setCode } from '../room/roomSlice';
import axios from 'axios';

interface EditorComponentProps {
    roomId: string;
}

const CodeEditor: React.FC<EditorComponentProps> = ({ roomId }) => {
    const dispatch = useAppDispatch();
    const code = useAppSelector((state: RootState) => state.room.code);
    const ws = useRef<WebSocket | null>(null);
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<any>(null);

    const isRemoteUpdate = useRef(false);

    useEffect(() => {
        ws.current = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

        ws.current.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.current.onmessage = (event) => {
            const newCode = event.data;
            isRemoteUpdate.current = true;
            dispatch(setCode(newCode));
            // Reset flag after a short delay to allow React to render
            setTimeout(() => {
                isRemoteUpdate.current = false;
            }, 50);
        };

        ws.current.onclose = () => {
            console.log('Disconnected from WebSocket');
        };

        return () => {
            ws.current?.close();
        };
    }, [roomId, dispatch]);

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            dispatch(setCode(value));

            if (!isRemoteUpdate.current && ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(value);
            }

            // Autocomplete logic
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            setSuggestion(null);

            typingTimeoutRef.current = setTimeout(async () => {
                if (editorRef.current) {
                    const position = editorRef.current.getPosition();
                    const model = editorRef.current.getModel();
                    const offset = model.getOffsetAt(position);

                    try {
                        const response = await axios.post('http://localhost:8000/autocomplete', {
                            code: value,
                            cursorPosition: offset,
                            language: 'python' // Hardcoded for now
                        });
                        if (response.data.suggestion) {
                            setSuggestion(response.data.suggestion);
                        }
                    } catch (error) {
                        console.error('Autocomplete error', error);
                    }
                }
            }, 600);
        }
    };

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    };

    const acceptSuggestion = () => {
        if (suggestion && editorRef.current) {
            const position = editorRef.current.getPosition();
            // Insert the suggestion at the current cursor position
            editorRef.current.executeEdits('', [{
                range: new monacoRef.current.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                text: suggestion,
                forceMoveMarkers: true
            }]);
            setSuggestion(null);
            // Trigger change to sync
            handleEditorChange(editorRef.current.getValue());
        }
    }

    return (
        <div style={{ height: '90vh', width: '100%', position: 'relative' }}>
            <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                }}
            />
            {suggestion && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: '#252526',
                        color: '#d4d4d4',
                        padding: '10px',
                        border: '1px solid #3e3e42',
                        borderRadius: '5px',
                        zIndex: 1000,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}
                >
                    <strong>AI Suggestion:</strong> {suggestion}
                    <br />
                    <button
                        onClick={acceptSuggestion}
                        style={{ marginTop: '5px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#0e639c', color: 'white', border: 'none' }}
                    >
                        Accept (Tab)
                    </button>
                </div>
            )}
        </div>
    );
};

export default CodeEditor;
