import React, { useState } from 'react';
import { useTimer, useVideoPermissions, PermissionsState } from '../hooks'; 
import config from '../config';
import { HomeView } from './HomeView';
import './progress-bar.css';


export const DefaultView: React.FC = () => {
    const permissions = useVideoPermissions();
    const { 
        startTimer, timedOut, timeLeft, timerStarted 
    } = useTimer(config.timerLimit);
    const [ taskDone, setTaskDone ] = useState(false);

    return (
    <div className="w-full h-full dark:bg-gray-700">
        <div className="z-0 w-full max-w-screen-xl mx-auto px-6">
            <div className="pb-16 w-full pt-28"> 
                <div className="w-full h-2 bg-gray-200 rounded-full mb-4 relative overflow-hidden">
                    { timerStarted ?
                    <div 
                        className="absolute top-0 left-0 h-full w-0 bg-indigo-600" 
                        style={{
                            animation: `progress-bar-grow ${config.timerLimit}s linear`
                        }}
                    />
                    : null}
                </div>
                {
                    !timedOut || taskDone ?
                    (permissions === PermissionsState.NoResponse ?
                    "Please allow the usage of camera" : permissions === PermissionsState.Success ?
                    <HomeView startedHook={() => startTimer()} taskDoneHook={() => setTaskDone(true)}/> : permissions === PermissionsState.Denied ?
                    "Couldn't get camera video stream, please check that you permitted usage of video camera" :
                    "") : 
                    "You ran out of time, please try again"
                }
            </div>
        </div>
    </div>
    );
}
