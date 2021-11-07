import React from 'react';
import { ClipboardCopyIcon } from '@heroicons/react/solid';
import { classNames } from './util';

interface CodeSnippetProps {
    text: string,
    className?: string,
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
    text, className
}) => {
    return (
        <span className={classNames(
            className ?? "",
            "font-mono bg-gray-200 p-1 text-gray-600 rounded"
        )}> 
            {text}
            <ClipboardCopyIcon 
                className="ml-1 w-4 h-4 inline cursor-pointer hover:text-gray-800"
                onClick={() => {
                    navigator.clipboard.writeText(text);
                }}
            />
        </span>
    );
}
