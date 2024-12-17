import React from "react";
import "../styles/InteractionScreen.css";
import BeepSound from "../Audio/ButtonClick.mp3";
import $ from "jquery";

function InteractionScreen(props) {
    let clickedOutside = true;

    function handleClick(e)
    {
        props.beep.play();
        $(e.target).css('background-color', 'rgb(113,142,163)');
        setTimeout(() => {
            $(e.target).css('background-color', 'rgb(162,187,207)');
        }, 200);
    }
    return (
        <div id="interactionScreenBody" onClick={() => {
            if(clickedOutside)
                props.hideScreen();
            else
                clickedOutside = true;
            }
            }>
            <div id="screenContainer" onClick={() => {clickedOutside = false}}>
                <div id="display">
                    <div>Enter OTP</div>
                    <div>6786</div>
                </div>
                <div id="buttonContainer">
                    <div class="buttonRow">
                        <div class="button" onClick={handleClick}>1</div>
                        <div class="button" onClick={handleClick}>2</div>
                        <div class="button" onClick={handleClick}>3</div>
                    </div>
                    <div class="buttonRow">
                        <div class="button" onClick={handleClick}>4</div>
                        <div class="button" onClick={handleClick}>5</div>
                        <div class="button" onClick={handleClick}>6</div>
                    </div>
                    <div class="buttonRow">
                        <div class="button" onClick={handleClick}>7</div>
                        <div class="button" onClick={handleClick}>8</div>
                        <div class="button" onClick={handleClick}>9</div>
                    </div>
                    <div class="buttonRow">
                        <div class="button clearBtn">clear</div>
                        <div class="button" onClick={handleClick}>0</div>
                        <div class="button doneBtn">done</div>
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