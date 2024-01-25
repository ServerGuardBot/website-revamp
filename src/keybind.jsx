import React, { useEffect } from 'react';

export default function Keybind({ name, ctrl=false, shift=false, alt=false, allowRepeat=false, callback }) {
    const handleKeyDown = (e) => {
        if (!allowRepeat && e.repeat) return;
        if (e.key === name && e.ctrlKey === ctrl && e.shiftKey === shift && e.altKey === alt) {
            e.preventDefault();
            callback();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return <></>
}