import { useState, useEffect } from 'react';

export const useTimer = (seconds: number) => {
    const [ timerStarted, setTimerStarted ] = useState(false);
    const [ timedOut, setTimedOut ] = useState(false);
    const [ timer, setTimer ] = useState<number | null>(null);
    const [ timeStarted, setTimeStarted ] = useState(0);

    useEffect(() => {
        return () => {
            timer && clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (!timerStarted)
            return;
        
        setTimeStarted(Date.now());
        setTimer(
            window.setTimeout(() => {
                setTimedOut(true);
            }, seconds * 1000)
        );
    }, [timerStarted])

    const startTimer = () => {
        setTimerStarted(true);
    };

    const timeLeft = () => 
        timeStarted / 1000 + seconds - Date.now() / 1000;

    return { startTimer, timedOut, timeLeft, timerStarted };
};
