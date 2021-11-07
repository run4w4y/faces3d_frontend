import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import state from './state';

export const useTensorflow = () => {
    const [ tfReady, setTfReady ] = useState(false); 

    useEffect(() => {
        tfjsWasm.setWasmPaths(
            `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
        );

        tf.setBackend(state.backend)
            .then(() => {
                setTfReady(true);
            });
    }, []);

    return tfReady;
}
