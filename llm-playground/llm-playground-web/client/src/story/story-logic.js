import { useCallback, useEffect, useRef } from 'react';
import { useAppState, useSetAppState } from '../app-state/AppStateProvider';
import Timer from '../utils/timer';

export function useHandleStoryResponse() {
    const { inputMessage, currentTime } = useAppState();
    const setAppState = useSetAppState();
    const idleTimer = useRef();
    const ConcatenateTimes = (currentTime, actionTime) => {
        const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
        const [actionHours, actionMinutes] = actionTime.split(':').map(Number);
        let diffHours = actionHours + currentHours;
        let diffMinutes = actionMinutes + currentMinutes;

        if (diffMinutes > 59) {
          diffHours++;
          diffMinutes -= 60;
        }
        if(diffHours > 23) {
            diffHours -= 24;
        }
        return `${diffHours}:${String(diffMinutes).padStart(2, '0')}`;      
    };

    const checkForGameLose = (currentTime) => {
        const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
        console.log('currentHours', currentHours, 'currentMinutes', currentMinutes);
        if (  currentHours >= 2 && currentHours < 6) {
            return true;
        }
        return false;      
    };

    useEffect(() => {
        idleTimer.current?.cancel();
    }, [inputMessage]);

    function handleStoryResponse(messages, response) {
        if (!response) return;
        const newMessages = [...messages];
        if (response.storyText) {
            newMessages.push({ role: 'assistant', content: response.storyText });
        }
        const newTime = ConcatenateTimes(currentTime, response.actionTime);
        console.log('Chat Current Time: ', response.currentTime, 'Action Time: ', response.actionTime, 'New Time: ', newTime);
        if (checkForGameLose(newTime)) {
            newMessages.push({ role: 'end', content: 'You Lost!, It was too late, on 2:00 AM, the AI lunched over 9000+ atomic bombs all over the word\n destroyed itself and humanity creating a nuclear winter for the next thousand years.\n refresh to try again.'});
            setAppState({ messages: [...newMessages], isGameOver: true, currentTime: newTime });
            return;
        }

        console.log('goal progress: ', response.goalProgress);
        if ( response.goalProgress >= 1) {
            newMessages.push({ role: 'end', content: 'Congratulations! You have stopped the AI and saved humanity.' });
            setAppState({ messages: [...newMessages], isGameOver: true,  currentTime: newTime });
            return;
        }
        console.log('isGameOver: ', response.isGameOver);
        newMessages.push({ role: 'system', content: "current time is: " + newTime });
        setAppState({ messages: [...newMessages], currentTime: newTime, isGameOver : response.isGameOver});

        // If the player is idle for a long period, add some content or a hint to push the story forward.
        idleTimer.current = new Timer(15000, () => {
            if (response.storyEvent && Math.random() > 0.7) {
                // Trigger an independent story event:
                newMessages.push({ role: 'assistant', content: response.storyEvent });
                setAppState({ messages: [...newMessages] });
            }

            if (response.callToAction) {
                // Apply call to action hint:
                newMessages.push({ role: 'assistant', content: `(${response.callToAction})` });
                setAppState({ messages: [...newMessages] });
            }
        });
        idleTimer.current.start();
    }

    return handleStoryResponse;
}
