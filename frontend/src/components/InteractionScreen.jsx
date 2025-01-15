import React from "react";
import "../styles/InteractionScreen.css";
import $, { event } from "jquery";
import axios from "axios";

function InteractionScreen(props) {
    let clickedOutside = true;
    let buttonClicked = false;
    const [otp, setOTP] = React.useState("");

    function handleClick(e, value) {
        if (otp.length < 4) {
            setOTP(otp + value);
        }
        props.beep.play();
        $(e.target).css('background-color', 'rgb(113,142,163)');
        setTimeout(() => {
            $(e.target).css('background-color', 'rgb(162,187,207)');
        }, 200);
    }

    function handleClear()
    {
        setOTP("");
    }

    function handleDone()
    {
        const values = {
            otp: otp,
            lockerid: props.lockerid,
        }
        axios.get("http://localhost:4002/lockerWithOTP", {params: values})
        .then(res => {
            console.log(res.data.rows);
        })
        .catch(err => {
            console.log("Error: " + err);
        })
    }

    return (
        <div id="interactionScreenBody" onClick={() => {
            if (clickedOutside)
                props.hideScreen();
            else
                clickedOutside = true;
        }
        }>
            <div id="screenContainer" onClick={() => { clickedOutside = false }}>
                <div id="display">
                    <div>Enter OTP</div>
                    <div>{otp}</div>
                </div>
                <div id="buttonContainer">
                    <div class="buttonRow">
                        <div class="button" onClick={() => {handleClick(event, 1)}}>1</div>
                        <div class="button" onClick={() => {handleClick(event, 2)}}>2</div>
                        <div class="button" onClick={() => {handleClick(event, 3)}}>3</div>
                    </div>
                    <div class="buttonRow">
                        <div class="button" onClick={() => {handleClick(event, 4)}}>4</div>
                        <div class="button" onClick={() => {handleClick(event, 5)}}>5</div>
                        <div class="button" onClick={() => {handleClick(event, 6)}}>6</div>
                    </div>
                    <div class="buttonRow">
                        <div class="button" onClick={() => {handleClick(event, 7)}}>7</div>
                        <div class="button" onClick={() => {handleClick(event, 8)}}>8</div>
                        <div class="button" onClick={() => {handleClick(event, 9)}}>9</div>
                    </div>
                    <div class="buttonRow">
                        <div class="button clearBtn" onClick={() => {handleClear()}}>clear</div>
                        <div class="button" onClick={() => {handleClick(event, 0)}}>0</div>
                        <div class="button doneBtn" onClick={handleDone}>done</div>
                    </div>
                    <div class="buttonRow">
                        <div id="otp">Get OTP</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InteractionScreen;