import React from 'react';
import { useTimer, useVideoPermissions, PermissionsState } from '../hooks'; 
import config from '../config';
import { HomeView } from './HomeView';


export const DefaultView: React.FC = () => {
    const permissions = useVideoPermissions();
    const { 
        startTimer, timedOut, timeLeft, timerStarted 
    } = useTimer(config.timerLimit);

    return (
    <div className="w-full h-full dark:bg-gray-700">
        <div className="z-0 w-full max-w-screen-xl mx-auto px-6">
            <div className="pb-16 w-full pt-28"> 
                {
                    !timedOut ?
                    (permissions === PermissionsState.NoResponse ?
                    "Please allow the usage of camera" : permissions === PermissionsState.Success ?
                    <HomeView startedHook={() => startTimer()} /> : permissions === PermissionsState.Denied ?
                    "Couldn't get camera video stream, please check that you permitted usage of video camera" :
                    "") : 
                    "You ran out of time, please try again"
                }
            </div>
        </div>
    </div>
    );
}
