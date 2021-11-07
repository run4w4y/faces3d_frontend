import * as mlMatrix from "ml-matrix";
import entryModelBase from '../model/base.json';
import config from '../config';

interface IndexT {
    [key: string]: any,
    silhouette: number[],
    lipsUpperOuter: number[],
    rightEyebrowUpper: number[],
    leftEyebrowUpper: number[],
    rightEyeLower0: number[],
    leftEyeLower0: number[],
    nose: number[],
}

export const circleSegments = (numberSegments: number) => {
    const boarders = new Map();
    const step = 2 * Math.PI / numberSegments;

    for (let i = 0; i < numberSegments; i++) {
        let start = i * step;
        let end = (i + 1) * step;
        boarders.set({ index: i, start: start, end: end }, false);
    }

    return boarders;
};

export const selectItems = (array: number[][], index: IndexT): number[][] => {
    const selected = Object.keys(index).reduce(
        // @ts-ignore
        (value, key) => {
            // @ts-ignore
            const pts = index[key].map(i => array[i]);
            return [...value, ...pts];
        }, []
    );
    
    // @ts-ignore
    return selected;
};

export const source = new mlMatrix.Matrix(selectItems(entryModelBase, config.index));

export const getRotationMatrix = (source: mlMatrix.Matrix, target: mlMatrix.Matrix, eps = 1e-7) => {
    let source_mean = source.mean("column");
    let target_mean = target.mean("column");
  
    source = source.subRowVector(source_mean);
    target = target.subRowVector(target_mean);
  
    let source_std = source.standardDeviation();
    let target_std = target.standardDeviation();
  
    source = source.div(source_std + eps).transpose();
    target = target.div(target_std + eps);
  
    let covariance = source.mmul(target);
    let svd = new mlMatrix.SingularValueDecomposition(covariance);
  
    let u = svd.leftSingularVectors;
    let v = svd.rightSingularVectors.transpose();
  
    let rotation = u.mmul(v);
  
    return rotation.transpose();
};

export const isClose = (x: number, y: number, rtol = 1e-5, atol = 1e-8) =>
    Math.abs(x - y) <= atol + rtol * Math.abs(y);

export const radiansToDegrees = (radians: number) => 
    radians * 180 / Math.PI;

export const rotationMatrixToEulerAngles = (rotation: mlMatrix.Matrix) => {
    let x = 0.0
    let y = 0.0
    let z = 0.0
    
    if (isClose(rotation.get(2, 0), 1.0)) {
        x = Math.PI / 2
        y = Math.atan2(-rotation.get(0, 1), -rotation.get(0, 2))
    } else if (isClose(rotation.get(2, 0), -1.0)) {
        x = -Math.PI / 2
        y = Math.atan2(rotation.get(0, 1), rotation.get(0, 2))
    } else {
        x = Math.asin(rotation.get(2, 0))
        y = Math.atan2(
        rotation.get(2, 1) / Math.cos(x), rotation.get(2, 2) / Math.cos(x)
        )
        z = Math.atan2(
        rotation.get(1, 0) / Math.cos(x), rotation.get(0, 0) / Math.cos(x)
        )
    }
    
    return {
        yaw: radiansToDegrees(x),
        pitch: radiansToDegrees(y),
        roll: radiansToDegrees(z)
    };
};

export const getAngles = (source: mlMatrix.Matrix, target: mlMatrix.Matrix) => {
    const rotation = getRotationMatrix(source, target);
    return rotationMatrixToEulerAngles(rotation);
};
