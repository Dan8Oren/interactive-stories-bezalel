import React, { useState, useEffect } from 'react';
import { useAppState } from "../app-state/AppStateProvider"


const TimeDisplay = () => {
const { currentTime } = useAppState();

  return (
    <div style={{ position: 'absolute', top: '10%', left: '33%', transform: 'translate(-50%, -50%)', margin: '10px',fontSize: "1.5rem"}}>
        {currentTime}
    </div>
  );
};

export default TimeDisplay;