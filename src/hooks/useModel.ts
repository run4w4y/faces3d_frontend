import { useState, useEffect } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { MediaPipeFaceMesh } from '@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh';
import { useTensorflow } from './useTensorflow'; 
import config from '../config';
import state from './state';

export const useModel = () => {
    const tfReady = useTensorflow();
    const [ model, setModel ] = useState<MediaPipeFaceMesh | null>(null);

    useEffect(() => {
        if (!tfReady)
            return;
        
        faceLandmarksDetection.load(
            faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
            {
                maxFaces: state.maxFaces,
                detectionConfidence: config.CONFIDENCE_RATE
            }
        ).then((x) => {
            setModel(x);
        });
    }, [tfReady]);

    return model;
}