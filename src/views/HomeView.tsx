import React, { useState, useEffect, useRef } from 'react';
import { useModel, useWebcam, usePredictions, PredictionsRes } from '../hooks';
import { Header, StyledSwitch, SelectInputStream, CirclesSVG, CodeSnippet } from '../components';
import config from '../config';
import { circleSegments } from '../model/util';
import { useLocation } from 'react-router-dom';

interface HomeViewProps {
    startedHook?: () => void,
};

export const HomeView: React.FC<HomeViewProps> = ({ startedHook }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const [ userReady, setUserReady ] = useState(false);

    const [ mirrored, setMirrored ] = useState(false);
    const [ activeDeviceId, setActiveDeviceId ] = useState<string | null>(null);

    const { 
        videoInputs,
        streamLoaded,
        webcamElement,
        webcamRef
    } = useWebcam(mirrored, activeDeviceId ?? undefined);

    const model = useModel();
    const calcPrediction = usePredictions(webcamRef, model);

    const segmentsRef = useRef(circleSegments(config.NUM_SEGMENTS));
    const [ strokes, setStrokes ] = useState<string[]>([]);
    const [ frameCount, setFrameCount ] = useState(0);
    const [ ts, setTs ] = useState<number | null>(null);

    const [ startedRecording, setStartedRecording ] = useState(false);
    const [ stoppedRecording, setStoppedRecording ] = useState(false);
    const [ mediaRecorder, setMediaRecorder ] = useState<MediaRecorder | null>(null);
    const [ recordedBlobs, setRecordedBlobs ] = useState<Blob[]>([]);
    const [ blobsUploading, setBlobsUploading ] = useState(false);
    const [ blobsUploaded, setBlobsUploaded ] = useState(false);
    const [ blobsUploadError, setBlobsUploadError ] = useState<string | null>(null);

    const location = useLocation();
    const key = new URLSearchParams(location.search).get('key');
    const lang = new URLSearchParams(location.search).get('language') ?? 'en';

    const updateCircleProps = (prediction?: PredictionsRes | null) => {
        if (!prediction)
            return;
        
        const {
            predictions,
            confidence,
            boundingBox,
            keypointsReduced,
            target,
            angles
        } = prediction;

        const { yaw, pitch, roll } = angles;
        const segments = segmentsRef.current!;
        
        const norm = Math.sqrt(yaw * yaw + pitch * pitch);
        const xNorm = yaw / norm;
        const yNorm = pitch / norm;
        let poseAngle = Math.atan2(xNorm, yNorm);

        if (poseAngle < 0) {
            poseAngle += 2 * Math.PI;
        }

        if (norm > config.MIN_POSITION && norm < config.MAX_POSITION) {
            segments.forEach((value, key) => {
                if (key.start < poseAngle && poseAngle < key.end && segments.get(key) != true)
                    segments.set(key, true);
            });
        }

        let strokes: string[] = []; 
        segments.forEach((value, key) => {
            strokes[key.index] = 
                (key.start < poseAngle && poseAngle < key.end && norm > config.MIN_POSITION && norm < config.MAX_POSITION)
                    ? "blue"
                    : value === true ? "red" : "green";
        });
        setStrokes(strokes);
    };

    const updateLandmarks = (prediction?: PredictionsRes | null) => {
        const width = containerRef.current?.offsetWidth ?? 0;
        const height = containerRef.current?.offsetHeight ?? 0;

        if (canvasRef.current !== null) {
            const canvas = canvasRef.current;
            // console.log(canvas.width, canvas.height);
            if (canvas.height !== height || canvas.width !== width) {
                canvas.height = height;
                canvas.width = width;
            }
        }

        if (prediction === undefined)
            return;

        const ctx = canvasRef.current?.getContext('2d');
        const video = webcamRef.current?.getCanvas();
        if (!ctx || !video) {
            return;
        }

        if (mirrored) {
            ctx.scale(-1, 1);
        }

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#32EEDB";
        const scaleX = width / video.width;
        const scaleY = height / video.height;

        if (prediction === null || prediction.confidence <= config.CONFIDENCE_RATE) {
            return;
        }
        
        prediction.keypointsReduced.forEach((landmark) => {
            const x = mirrored ? width - landmark[0] * scaleX : landmark[0] * scaleX;
            const y = landmark[1] * scaleY;
            
            // console.log(x, y);
            ctx.beginPath();
            ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    const checkDone = () => {
        if (!segmentsRef.current)
            return false;
        
        return Array.from(segmentsRef.current.values()).every(x => x);
    };

    const downloadVideo = () => {
        const blob = new Blob(recordedBlobs, { type: 'video/webm' });

        setBlobsUploading(true);
        fetch(`${config.s3url}/${key}.webm`, {
            method: 'PUT',
            body: blob,
            headers: {
                'Content-Type': 'video/webm'
            }
        })
            .then(resp => {
                setBlobsUploaded(true);
            })
            .catch(err => setBlobsUploadError(err));
    };

    const updatePredictions = async () => {
        const res = await calcPrediction();
        if (res !== null) {
            setTs(prev => prev === null ? Date.now() : prev);
            updateCircleProps(res);
            // updateLandmarks(res);
            setFrameCount(prev => prev + 1);
            
            if (!checkDone())
                requestAnimationFrame(updatePredictions);
            else 
                setStoppedRecording(true);
        }
    };

    useEffect(() => {
        if (userReady && streamLoaded) {
            setTimeout(updatePredictions, 1500);
            startedHook && setTimeout(startedHook, 1500);
        }
    }, [streamLoaded, userReady]);

    useEffect(() => {
        if (ts !== null && !startedRecording)
            setStartedRecording(true);
    }, [ts]);

    useEffect(() => {
        if (startedRecording)
            setMediaRecorder(new MediaRecorder(webcamRef.current!.stream!, { mimeType: 'video/webm' }));
    }, [startedRecording]);

    useEffect(() => {
        if (stoppedRecording) {
            mediaRecorder?.stop();
            setTimeout(downloadVideo, 1000);
        }
    }, [stoppedRecording]);

    useEffect(() => {
        mediaRecorder?.addEventListener('dataavailable', (e) => {
            setRecordedBlobs(prev => [ ...prev, e.data ]);
        });

        mediaRecorder?.start(1000);
    }, [mediaRecorder]);

    if (!key)
        return <span> Not found </span>;

    if (!videoInputs || videoInputs.length === 0)
        return <span> No video input devices were found :( </span>;
        
    if (blobsUploaded)
        return <span> Congratulations! Here's your key: <CodeSnippet text={btoa(atob(key) + '|>*<|' + 'aaaaa')}/> </span>

    if (blobsUploading && !blobsUploaded)
        return <span> Please wait, we will give you your submission key shortly... </span>;
    
    const video = webcamRef.current?.getCanvas();
    const videoW = video?.width ?? 0;
    const videoH = video?.height ?? 0;
    const videoRatio = videoW / videoH;
    const containerW = containerRef.current?.offsetWidth ?? 0;
    const containerH = containerW / videoRatio;
    const webcamSize = 
        videoRatio > 1
            ? containerH
            : containerW;

    return (
        <div className="grid grid-cols-2 rounded overflow-hidden text-sm">
            <div className="lg:col-span-1 col-span-2 relative">
                {
                    userReady ?
                    <>
                        <div ref={containerRef} className="relative w-full flex items-center justify-center"> 
                            <div 
                                style={{
                                    width: webcamSize + 50,
                                    height: webcamSize + 50,
                                    marginLeft: (containerW - webcamSize) / 2 - 20,
                                    marginTop: (containerH - webcamSize) / 2 - 20,
                                }}
                                className="absolute left-0 top-0 z-10"
                            >
                                <CirclesSVG
                                    strokes={strokes}
                                    numberSegments={config.NUM_SEGMENTS}
                                    key={JSON.stringify(strokes)}
                                    size={webcamSize + 40}
                                /> 
                            </div>
                            <div style={{ width: webcamSize, height: webcamSize }} className="relative rounded-full overflow-hidden">
                                <div 
                                    style={{ 
                                        width: videoRatio > 1 ? containerW : 'auto',
                                        marginLeft: videoRatio > 1 ? (webcamSize - containerW) / 2 : 0,
                                        height: videoRatio <= 1 ? containerH : 'auto',
                                        marginTop: videoRatio <= 1 ? (webcamSize - containerH) / 2 : 0, 
                                    }} 
                                    className="absolute left-0 top-0"
                                >
                                    { webcamElement } 
                                </div>
                            </div>
                        </div>
                        <div className="w-full z-10 absolute top-0 left-0">
                            <canvas ref={canvasRef} />
                        </div>
                    </>
                    :
                    <div 
                        className="w-full h-full bg-gray-600 text-gray-100 flex items-center justify-center cursor-pointer"
                        onClick={() => setUserReady(true)}
                    >
                        <div>
                            <Header size="sm"> Click here when you're ready </Header>
                        </div>
                    </div>
                }
            </div>
            <div 
                className="lg:col-span-1 col-span-2 bg-gray-100 p-6 relative overflow-y-scroll"
                style={{
                    height: containerRef.current?.offsetHeight ?? 'auto'
                }}
            >
                <ul className="space-y-4">
                    <li key="selectInputStream">
                        <SelectInputStream 
                            inputs={videoInputs}
                            setSelectedInput={(item: MediaDeviceInfo) => setActiveDeviceId(item.deviceId)}
                            disabled={userReady}
                        />
                    </li>
                    <li key="mirroredSwitch">
                        <ul className="flex items-center">
                            <li>
                                <Header className="text-gray-700 dark:text-gray-100" size="sm"> Mirror image </Header>
                            </li>
                            <li className="pl-2">
                                <StyledSwitch 
                                    defaultEnabled 
                                    onChange={setMirrored}
                                    size={20} 
                                    disabled={userReady}
                                />
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Header size="sm"> FPS: </Header>
                        { ts ? Math.round(frameCount / (Date.now() - ts!) * 1000) : "None" }
                    </li>
                    <li className="flex justify-center">
                        {/* {
                            ts !== null ?
                            <CirclesSVG 
                                strokes={strokes}
                                numberSegments={config.NUM_SEGMENTS}
                                key={JSON.stringify(strokes)}
                                size={500}
                            /> : <></>
                        } */}
                    </li>
                </ul>
            </div>
        </div>
    );
}
