import React, { useState, useEffect } from 'react';
import { useAppState } from "../app-state/AppStateProvider"


const TimeDisplay = () => {
const { currentTime } = useAppState();

  return (
    <div style={{ position: 'absolute', top: '20%', left: '33%', transform: 'translate(-50%, -50%)', margin: '10px',fontSize: "1.5rem"}}>
        {currentTime}
    </div>
  );
};

const ConcatenateTimes = ({ currentTime, actionTime }) => {
    // Ensure currentTime and actionTime are in the correct format
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };
  
    // Concatenate currentTime and actionTime
    return `${formatTime(currentTime)} - ${formatTime(actionTime)}`;
};

export { ConcatenateTimes };
export default TimeDisplay;