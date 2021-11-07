import React from 'react';

export const DefaultView: React.FC = ({ children }) => {
    return (
    <div className="w-full h-full dark:bg-gray-700">
        <div className="z-0 w-full max-w-screen-xl mx-auto px-6">
            <div className="pb-16 w-full pt-28"> 
                { children }
            </div>
        </div>
    </div>
    );
}
