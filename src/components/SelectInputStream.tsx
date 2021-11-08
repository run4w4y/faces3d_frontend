import React, { useState, useEffect } from 'react';
import { classNames } from './util';
import { StyledSelect } from './StyledSelect';
import { Header } from './Header';

interface SelectInputStreamProps {
    inputs: MediaDeviceInfo[],
    setSelectedInput: (input: MediaDeviceInfo) => void,
    disabled?: boolean
}

export const SelectInputStream: React.FC<SelectInputStreamProps> = ({
    inputs, setSelectedInput, disabled
}) => {
    const [ selected, setSelected ] = useState(inputs[0]);

    useEffect(() => {
        setSelectedInput(selected);
    }, [selected]);

    return (
        <StyledSelect
            items={inputs}
            renderF={(item: MediaDeviceInfo, selected: boolean) => (
                <span
                    className={classNames(
                        selected ? 'font-semibold' : 'font-normal', 
                        'ml-3 block truncate'
                    )}
                >
                    { item.label || `Camera ${item.deviceId}` } 
                </span>
            )}
            keyF={(item: MediaDeviceInfo) => item.deviceId}
            onChange={setSelected}
            label={<Header size="sm"> Select input device </Header>}
            disabled={disabled}
        />
    );
}
