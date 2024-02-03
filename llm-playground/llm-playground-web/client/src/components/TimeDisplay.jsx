import React, { useState, useEffect } from 'react';
import { useAppState } from "../app-state/AppStateProvider"


const TimeDisplay = () => {
const { currentTime } = useAppState();

  return (
    <div className='time'>
        {currentTime}
    </div>
  );
};

export default TimeDisplay;