import { AnnotatedPrediction, MediaPipeFaceMesh } from '@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh';
import { Coord2D, Coords3D } from '@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util';
import config from '../config';
import { selectItems, source, getAngles } from '../model/util';
import * as mlMatrix from "ml-matrix";
import React from 'react';
import Webcam from 'react-webcam';

export interface PredictionsRes {
    predictions: AnnotatedPrediction[],
    confidence: number,
    boundingBox: {
        topLeft: Coord2D;
        bottomRight: Coord2D;
    },
    keypointsReduced: number[][],
    target: mlMatrix.Matrix,
    angles: {
        yaw: number,
        pitch: number,
        roll: number
    }
}

export const usePredictions = (
    input: React.RefObject<Webcam>, 
    model: MediaPipeFaceMesh | null
) => {

    return async (): Promise<PredictionsRes | null | undefined> => {
        if (!input.current || !input.current.video)
            return null;
        
        const predictions = await model?.estimateFaces({
            input: input.current.video,
            returnTensors: false,
            flipHorizontal: false, 
            predictIrises: false
        });

        if (!predictions || predictions.length === 0)
            return undefined;

        const confidence = predictions[0].faceInViewConfidence;
        const keypoints = predictions[0].scaledMesh;
        const boundingBox = predictions[0].boundingBox as { topLeft: Coord2D; bottomRight: Coord2D; };
        const keypointsReduced = selectItems(keypoints as Coords3D, config.index);
        const target = new mlMatrix.Matrix(keypointsReduced);
        const angles = getAngles(source, target);

        return {
            predictions,
            confidence,
            boundingBox,
            keypointsReduced,
            target,
            angles
        };
    };
}
