import React from "react";
function Compartment(props)
{
    return (
        <div className={props.className + " comp"}>
            <h3>Compartment ID: {props.compID}</h3>
            <h4>State: {props.compState}</h4>
            <h4>Category: {props.compCategory}</h4>
            <h4>Is Locked: {props.isLocked}</h4>
            <h4>OTP: {props.otp}</h4>
        </div>
    );
}

export default Compartment;