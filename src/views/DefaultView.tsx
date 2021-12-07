import React from 'react';
import { useVideoPermissions, PermissionsState } from '../hooks'; 


export const DefaultView: React.FC = ({ children }) => {
    const permissions = useVideoPermissions();

    return (
    <div className="w-full h-full dark:bg-gray-700">
        <div className="z-0 w-full max-w-screen-xl mx-auto px-6">
            <div className="pb-16 w-full pt-28"> 
                {
                    permissions === PermissionsState.NoResponse ?
                    "Please allow the usage of camera" : permissions === PermissionsState.Success ?
                    children : permissions === PermissionsState.Denied ?
                    "Couldn't get camera video stream, please check that you permitted usage of video camera" :
                    ""
                }
            </div>
        </div>
    </div>
    );
}
