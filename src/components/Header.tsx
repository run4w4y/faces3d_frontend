import React from 'react';

interface HeaderProps {
    size: string,
    className?: string
}

export const Header: React.FC<HeaderProps> = ({
    size, children, className
}) => (
    <span className={`Header font-semibold tracking-tight text-${size} ` + (className || "")}>
        { children }
    </span>
)