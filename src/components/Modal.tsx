import React from "react";

export const Modal = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="transition-300 ease-in-out fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white flex flex-col gap-1 items-center justify-center p-12 rounded-md shadow-lg">
                {children}
            </div>
        </div>
    );
};