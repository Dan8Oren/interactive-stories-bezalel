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
        console.log('currentHours', currentHours, 'currentMinutes', currentMinutes);
        console.log('actionHours', actionHours, 'actionMinutes', actionMinutes);
        // Calculate the difference
        let diffHours = actionHours + currentHours;
        let diffMinutes = actionMinutes + currentMinutes;
      
        // Adjust if necessary for negative minutes
        if (diffMinutes > 60) {
          diffHours++;
          diffMinutes -= 60;
        }
        console.log('diffHours', diffHours, 'diffMinutes', diffMinutes);
        return `${diffHours}:${String(diffMinutes).padStart(2, '0')}`;      
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
        console.log('response.isGameOver', response.isGameOver);
        const newTime = ConcatenateTimes(currentTime, response.actionTime);
        console.log('Chat Current Time: ', response.currentTime, 'Action Time: ', response.actionTime, 'New Time: ', newTime);
        setAppState({ messages: [...newMessages], currentTime: newTime, isGameOver : response.isGameOver});

        // TODO: end story with a long closing paragraph, and 'THE END' message.
        console.log('goal progress: ', response.goalProgress);

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
