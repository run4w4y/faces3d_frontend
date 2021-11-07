import React from 'react';


interface CirclesSVGProps {
    numberSegments: number,
    strokes: string[]
}

export const CirclesSVG: React.FC<CirclesSVGProps> = ({
    numberSegments, strokes
}) => {
    const circleRadius = 120;
    const circleX = 150;
    const circleY = 150;
    const initialRotation = 360 / numberSegments;

    const dashArray = 2 * Math.PI * circleRadius;
    const dashOffset = dashArray * (1 - 1 / numberSegments);

    let circles = [];
    for (let i = 0; i < numberSegments; i++) {
        const finalRotation = i * initialRotation + 90;
    
        // console.log(strokes[i]);
        circles.push(
            <circle 
                cx={circleX}
                cy={circleY}
                r={circleRadius}
                strokeWidth="20"
                strokeDashoffset={dashOffset}
                strokeDasharray={dashArray}
                stroke={strokes[i] ?? "none"}
                fill="transparent"
                transform={`rotate(${finalRotation} ${circleX} ${circleY})`}
            />
        );
    }

    return (
        <svg height="300" width="300" version="1.1" xmlns="http://www.w3.org/2000/svg">
            {/* <circle cx="150" cy="150" r="120" stroke="green" stroke-width="20" fill="transparent" /> */}
            {circles}
        </svg>
    );
}
