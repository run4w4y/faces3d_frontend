import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

interface StyledSwtichProps {
    onChange?: (enabled: boolean) => void,
    defaultEnabled?: boolean,
    size?: number,
    padding?: number,
    disabled?: boolean
}

export const StyledSwitch: React.FC<StyledSwtichProps> = (
    { defaultEnabled, onChange, size, padding, children, disabled }
) => {
    const [ enabled, setEnabled ] = useState(defaultEnabled ?? false);

    useEffect(() => {
        onChange && onChange(enabled);
    }, [enabled]);

    return (
        <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`
            ${enabled ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-500'}
            relative inline-flex flex-shrink-0
            border-2 border-transparent rounded-full cursor-pointer 
            transition-colors ease-in-out duration-200 focus:outline-none 
            focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75
            Switch
        `}
        style={{
            height: `${(size ?? 34) + (padding ?? 2) * 2}px`,
            width: `${(size ?? 34) * 2 + (padding ?? 2) * 3}px`
        }}
        disabled={disabled ?? false}
        >
            <span
            aria-hidden="true"
            className={`
                pointer-events-none inline-block
                rounded-full bg-white shadow-lg transform ring-0 
                transition ease-in-out duration-200
            `}
            style={{
                height: `${size ?? 34}px`,
                width: `${size ?? 34}px`,
                // @ts-ignore
                '--tw-translate-x': `${enabled ? (size ?? 34) + (padding ?? 2) : 0}px`
            }}
            >
                {children}
            </span>
        </Switch>
    );
}