import { useState, useRef, useEffect } from "react"; 
import Webcam from "react-webcam";
import { useVideoStreams } from "./useVideoStreams"; 

export const useWebcam = (mirrored: boolean, activeDeviceId?: string) => {
    const { videoInputs, gotStreams } = useVideoStreams();
    const [ streamLoaded, setStreamLoaded ] = useState(false);
    const [ webcamElement, setWebcamElement ] = useState<JSX.Element | null>(null);
    const webcamRef = useRef<Webcam>(null);

    const updateWebcamElement = () => {
        setWebcamElement(<Webcam 
            ref={webcamRef}
            forceScreenshotSourceSize
            screenshotFormat='image/jpeg'
            videoConstraints={{ deviceId: { exact: activeDeviceId ?? undefined } }}
            onUserMedia={() => setStreamLoaded(true)}
            mirrored={mirrored}
            className="w-full z-0"
        />);
    };

    useEffect(() => {
        if (!gotStreams)
            return;
        
        updateWebcamElement();
    }, [gotStreams]);

    useEffect(() => {
        updateWebcamElement();
    }, [mirrored, activeDeviceId])

    return {
        videoInputs,
        streamLoaded,
        webcamElement,
        webcamRef
    };
}
