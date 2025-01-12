import { useCallback, useEffect, useRef, useState } from "react";
import { useAppState, useSetAppState } from "../../app-state/AppStateProvider";
import "./interactor-input-styles.css";
import { SETTINGS } from "../../../settings";
import { useHandleStoryResponse } from "../../story/story-logic";

export default function InteractorInputView() {

    const { messages, status, inputMessage } = useAppState();
    const setAppState = useSetAppState();


    const handleResponse = useHandleStoryResponse();

    const send = useCallback(() => {

        const newMessages = [...messages, { role: 'user', content: inputMessage }];
        setAppState({ messages: newMessages, status: 'loading', inputMessage: '' });
        
        fetch(
            `${SETTINGS.SERVER_URL}/story-completions`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(newMessages)
            }
            ).then(response => response.json()
            ).then(data => {
                try {
                    let storytellerResponse = data.choices[0].message.content;
                    storytellerResponse = JSON.parse(storytellerResponse);
                    console.log("storytellerResponse: ",storytellerResponse);
                setAppState({ status: 'idle' });
                handleResponse(newMessages, storytellerResponse);
                
            } catch { err => { throw err } }
        }).catch(err => {
            console.error('Api error. Details: ', err);
            setAppState({ status: 'error' });
        })
        
    }, [messages, inputMessage]);
    
    const {isGameOver} = useAppState();
    const isBadToSend = (isGameOver === 'true' || inputMessage === '');
    return (
        <div
            className="inputContent"
            id="interactor-box"
            style={{
                opacity: status === 'loading' ? 0.3 : 1,
                pointerEvents: status === 'loading' ? 'none' : 'auto',
                color: status === 'error' ? 'red' : 'auto'
            }}
        >
            <input
                id="interactor-text-input"
                value={inputMessage}
                onKeyDown={e => { if (e.key === 'Enter' && !isBadToSend) send() }}
                onChange={e => setAppState({ inputMessage: e.target.value })}
            />
            <button disabled={isBadToSend} onClick={send}>Send</button>
            {
                status === 'error' && 'Something is broken 😵‍💫'
            }
        </div>
    )
}