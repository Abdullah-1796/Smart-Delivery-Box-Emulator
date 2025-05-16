// LockerSimulator.jsx
import React, { useState } from "react";
import Lock from "./Lock";
import "../styles/LS.css";

const sizes = ["small", "medium", "large"];

const generateLockers = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `L${i + 1}`,
        size: sizes[i % sizes.length],
        locked: Math.random() < 0.5,
        open: false,
        contents: Math.random() < 0.5 ? ["Item"] : [],
    }));
};

const initialLockers = generateLockers(15);

export default function LockerSimulator() {
    const [lockers, setLockers] = useState(initialLockers);

    const toggleLock = (id) => {
        setLockers(lockers.map(locker =>
            locker.id === id ? { ...locker, locked: !locker.locked } : locker
        ));
    };

    const toggleOpen = (id) => {
        setLockers(lockers.map(locker =>
            locker.id === id && !locker.locked
                ? { ...locker, open: !locker.open }
                : locker
        ));
    };

    const smallLockers = lockers.filter(locker => locker.size === "small");
    const mediumLockers = lockers.filter(locker => locker.size === "medium");
    const largeLockers = lockers.filter(locker => locker.size === "large");

    return (
        <div className="simulator-container">
            <h1 className="simulator-title">Locker Simulator</h1>

            <div className="locker-row">
                {smallLockers.map(locker => (
                    <Lock
                        key={locker.id}
                        {...locker}
                        toggleLock={toggleLock}
                        toggleOpen={toggleOpen}
                    />
                ))}
            </div>

            <div className="locker-row">
                {mediumLockers.map(locker => (
                    <Lock
                        key={locker.id}
                        {...locker}
                        toggleLock={toggleLock}
                        toggleOpen={toggleOpen}
                    />
                ))}
            </div>

            <div className="locker-row">
                {largeLockers.map(locker => (
                    <Lock
                        key={locker.id}
                        {...locker}
                        toggleLock={toggleLock}
                        toggleOpen={toggleOpen}
                        size={locker.size}  // pass size prop explicitly
                    />

                ))}
            </div>
        </div>
    );
}
