import { useState, useEffect } from 'react';

export enum PermissionsState {
    Loading,
    NoResponse,
    Success,
    Denied
};

export const useVideoPermissions = () => {
    const [ permissions, setPermissions ] = useState(PermissionsState.Loading);
    
    useEffect(() => {
        setPermissions(PermissionsState.NoResponse);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(res => {
                setPermissions(PermissionsState.Success);
            })
            .catch(err => {
                console.log(err);
                setPermissions(PermissionsState.Denied);
            });
    }, []);

    return permissions;
};
