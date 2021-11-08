import React, { useState, useEffect, PropsWithChildren, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { classNames } from './util';

interface StyledSelectProps<T> {
    items: T[],
    renderF: (item: T, selected: boolean) => JSX.Element,
    keyF: (item: T) => string,
    onChange?: (item: T) => void,
    label?: JSX.Element,
    disabled?: boolean
};

export const StyledSelect = <T,>({
    items, renderF, keyF, onChange, label, disabled
}: PropsWithChildren<StyledSelectProps<T>>) => {
    const [ selected, setSelected ] = useState<T>(items[0]);

    useEffect(() => {
        onChange && onChange(selected);
    }, [selected]);

    const options = items.map(x => (
        <Listbox.Option 
            key={keyF(x)}
            value={x}
            className={({ active }) => 
                classNames(
                    active ? 'text-white bg-indigo-600' : 'text-gray-900 dark:text-gray-200',
                    'cursor-default select-none relative py-2 pl-3 pr-9'
                )
            }
        >
            { ({ selected, active }) => <>
                <div className="flex items-center">
                    {renderF(x, selected)}
                </div>

                { selected
                    ? 
                        <span
                            className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                        >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                    : <> </>
                }
            </>}
        </Listbox.Option>
    ));

    return (
        <Listbox value={selected} onChange={setSelected} disabled={disabled ?? false}>
            { label  
                ? <Listbox.Label className="block text-sm font-medium text-gray-700 dark:text-gray-100"> {label} </Listbox.Label>
                : <></>
            }

            <div className="mt-1 relative">
                <Listbox.Button className="
                    relative w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                    rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default 
                    focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 
                    sm:text-sm
                ">
                    <span className="flex items-center">
                        {renderF(selected, false)}
                    </span>
                    <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </Listbox.Button>

                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="
                        absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-56 rounded-md 
                        py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto
                        focus:outline-none sm:text-sm
                    ">
                        { options }
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};