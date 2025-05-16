import React from "react";
import "../styles/InteractionScreen.css";
import $, { event } from "jquery";
import axios from "axios";

function InteractionScreen(props) {
    let clickedOutside = true;
    let buttonClicked = false;
    const [otp, setOTP] = React.useState("");
    const [purpose, setPurpose] = React.useState("");

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

    function handleClear() {
        setOTP("");
    }

    const getPurpose = async (lockerid, otp) => {
        try {
            const response = await axios.get('http://localhost:4002/Locker/Compartment/Purpose', {
                params: {
                    lockerid: lockerid,
                    otp: otp
                }
            });
            setPurpose(response.data);
            return response.data; // return or process data as needed
        } catch (error) {
            console.error("Error fetching purpose:", error);
            throw error;
        }
    };

    function handleDone() {
        const values = {
            otp: otp,
            lockerid: props.lockerid,
        }
        let api = "";
        //console.log(props)
        getPurpose(otp,props.lockerid);
        if (purpose === "sending") {
            api = "SenderlockerWithOTP";
        }
        else {
            api = "lockerWithOTP";
        }
        axios.get(`http://localhost:4002/${api}`, { params: values })
            .then(async res => {
                //console.log(res.data.rows);

                if (res.status == 200) {
                    await props.setData(res.data.rows);
                    //props.hideScreen();
                }
            })
            .catch(err => {
                //console.log("Error: " + err);
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
                    <div className="placeholder">Enter OTP</div>
                    <div>{otp}</div>
                </div>
                <div id="buttonContainer">
                    <div className="buttonRow">
                        <div className="button" onClick={() => { handleClick(event, 1) }}>1</div>
                        <div className="button" onClick={() => { handleClick(event, 2) }}>2</div>
                        <div className="button" onClick={() => { handleClick(event, 3) }}>3</div>
                    </div>
                    <div className="buttonRow">
                        <div className="button" onClick={() => { handleClick(event, 4) }}>4</div>
                        <div className="button" onClick={() => { handleClick(event, 5) }}>5</div>
                        <div className="button" onClick={() => { handleClick(event, 6) }}>6</div>
                    </div>
                    <div className="buttonRow">
                        <div className="button" onClick={() => { handleClick(event, 7) }}>7</div>
                        <div className="button" onClick={() => { handleClick(event, 8) }}>8</div>
                        <div className="button" onClick={() => { handleClick(event, 9) }}>9</div>
                    </div>
                    <div className="buttonRow">
                        <div className="button clearBtn" onClick={() => { handleClear() }}>clear</div>
                        <div className="button" onClick={() => { handleClick(event, 0) }}>0</div>
                        <div className="button doneBtn" onClick={handleDone}>done</div>
                    </div>
                    {/* <div className="buttonRow">
                        <div id="otp">Get OTP</div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default InteractionScreen;