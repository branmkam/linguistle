import React from "react";

export const Modal = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white p-6 rounded-md shadow-lg">
                {children}
            </div>
        </div>
    );
};