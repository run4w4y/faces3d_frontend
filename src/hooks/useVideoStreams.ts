import { useState, useEffect } from 'react';

export const useVideoStreams = () => {
    const [ videoInputs, setVideoInputs ] = useState<MediaDeviceInfo[]>([]);
    const [ gotStreams, setGotStreams ] = useState(false);

    const getVideoInputs = async () => {
        const allDevives = 
            await navigator
                .mediaDevices
                .enumerateDevices();
        
        setVideoInputs(allDevives.filter(x => x.kind === 'videoinput'));
    };

    useEffect(() => {
        getVideoInputs()
            .then(() => {
                setGotStreams(true);
            });
    }, []);

    return { videoInputs, gotStreams };
}
