import React, { useState } from "react";
import "../styles/door.css"
// <div className={props.className + " comp"}>
//     <h3>Compartment ID: {props.compID}</h3>
//     <h4>State: {props.compState}</h4>
//     <h4>Category: {props.compCategory}</h4>
//     <h4>Is Locked: {props.isLocked}</h4>
//     <h4>Parcel ID: {props.parcelID}</h4>
//     <h4>Purpose: {props.purpose}</h4>
//     <h4>OTP: {props.otp}</h4>
// </div>
function Compartment(props) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLockerClick = (e) => {
        e.stopPropagation();

        // Trigger animation
        setIsAnimating(true);

        // Remove animation class after animation ends (2s here)
        setTimeout(() => {
            setIsAnimating(false);
        }, 2000);
    };

    return (
        <div
            className={`${props.className} comp locker ${isAnimating ? "animate-open" : ""}`}
            style={{
                backgroundImage: `url(/images/locker4.png)`,
            }}
        >
            <div className="locker-label">{props.compID}</div>
            <div className="info-container">
                <h4 className="info">Parcel ID: {props.parcelID}</h4>
                <h4 className="info">Category: {props.compCategory}</h4>
                <h4 className="info">
                    Purpose: {props.purpose}
                </h4>
                <h4 className="info">OTP: {props.otp}</h4>
                
            </div>

            <div className="locker-lock-icon" onClick={handleLockerClick}>
                {props.isLocked ? "🔒" : "🔓"}
            </div>
            
        </div>
    );
}

export default Compartment;