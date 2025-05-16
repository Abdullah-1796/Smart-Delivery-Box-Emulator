import React, { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/door.css";
import "../styles/loader.css";
import BeepSound from "../Audio/ButtonClick.mp3";
import { OrbitProgress } from 'react-loading-indicators';

// import {ClipLoader} from "react-spinners";

function OpenCompartment(props) {
    const [otp, setOTP] = React.useState();
    const [compstateid, setCompStateID] = React.useState();
    const [parcelid, setParcelID] = React.useState();
    const [purpose, setPurpose] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [seconds, setSeconds] = React.useState(0);
    const intervalRef = React.useRef(null);
    const beepIntervalRef = React.useRef(null);
    const beep = new Audio(BeepSound);


    const startTimer = () => {
        if (intervalRef.current !== null) return;

        intervalRef.current = setInterval(() => {
            setSeconds(prev => {
                const newTime = prev + 1;

                if (newTime === 15) {
                    // Start beeping every second
                    beepIntervalRef.current = setInterval(() => {
                        beep.play();
                    }, 1000);
                }

                return newTime;
            });
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;

        setSeconds(0); // Optional: reset timer
    };

    const handleLockerClick = (e) => {
        if (e) e.stopPropagation();

        // Reset the animation by temporarily setting isOpen to false
        setIsOpen(false);

        setTimeout(() => {
            setIsOpen(true);
        }, 10); // 10ms is enough to trigger reflow and restart animation
    };


    useEffect(() => {
        handleLockerClick();
    }, [])

    React.useEffect(() => {
        setOTP(props.otp);
        setCompStateID(props.compstateid);
        setParcelID(props.parcelid)
        setPurpose(props.purpose);
    }, []);

    function handleClosure() {
        stopTimer();
        setIsOpen(false);
        props.setData([]);
    }

    async function handlePlaceParcelByRider() {
        //updating status of compartment in locker to Reserved
        setLoading(true);
        // console.log("handlePlaceParcelByRider")
        setCompStateID(3);
        const values = {
            lockerid: props.lockerid,
            compid: props.compid,
            compstateid: 3
        }
        await axios.put('http://localhost:4002/Locker/Compartment/compstateid', values)
            .then(response => {
                //console.log(response.data);
            })
            .catch(err => {
                console.error("Error while placing parcel: " + err);
            });

        //updating otp of compartment in locker
        const num = Math.floor(Math.random() * 9000);
        setOTP(num);
        const values1 = {
            lockerid: props.lockerid,
            compid: props.compid,
            otp: num
        }
        await axios.put('http://localhost:4002/Locker/Compartment/otp', values1)
            .then(response => {
                //console.log(response.data);
            })
            .catch(err => {
                console.error("Error while placing parcel: " + err);
            });

        const values2 = {
            parcelID: parcelid,
            status: "parcelPlaced"
        }
        await axios.put('http://localhost:4001/updateStatus', values2)
            .then(response => {
                //console.log(response.data.message);
            })
            .catch(err => {
                console.error("Error while updating status of parcel: " + err);
            });

        const values3 = {
            column: "placement",
            stampid: props.stampid
        }
        await axios.put('http://localhost:4001/updateTimestamp', values3)
            .then(response => {
                //console.log(response.data.message);
            })
            .catch(err => {
                console.error("Error while updating status of parcel: " + err);
            });
        setLoading(false);

        //sending SMS to receiver for new OTP to take parcel
        Swal.fire({
            text: "Parcel has been placed successfully",
            icon: "success",
            timer: 2000,
            title: "Success",
            showConfirmButton: false,
        })

        startTimer();
        // alert("Parcel has been placed successfully");
    }

    async function handleTakeParcelByRider() {
        //updating compartment state to Empty
        //console.log("handleTakeParcelByRider")
        setLoading(true);
        setCompStateID(1);
        const values = {
            lockerid: props.lockerid,
            compid: props.compid,
            compstateid: 1
        }
        await axios.put('http://localhost:4002/Locker/Compartment/compstateid', values)
            .then(response => {
                //console.log(response.data);
                //res.status(200).send({message: "Locker reserved"});
            })
            .catch(err => {
                console.error("Error while placing parcel: " + err);
            });

        //updating otp of compartment to 0
        setOTP(0);
        const values1 = {
            lockerid: props.lockerid,
            compid: props.compid,
            otp: 0
        }
        await axios.put('http://localhost:4002/Locker/Compartment/otp', values1)
            .then(response => {
                //console.log(response.data);
                //res.status(200).send({message: "Locker reserved"});
            })
            .catch(err => {
                console.error("Error while placing parcel: " + err);
            });

        //updating parcelid of compartment to 0
        setParcelID(0);
        const values2 = {
            lockerid: props.lockerid,
            compid: props.compid,
            parcelid: 0
        }
        await axios.put('http://localhost:4002/Locker/Compartment/parcelid', values2)
            .then(response => {
                //console.log(response.data);
                //res.status(200).send({message: "Locker reserved"});
            })
            .catch(err => {
                console.error("Error while placing parcel: " + err);
            });

        //updating purpose of compartment to 0
        setPurpose("none");
        const values3 = {
            lockerid: props.lockerid,
            compid: props.compid,
            purpose: "none"
        }
        await axios.put('http://localhost:4002/Locker/Compartment/purpose', values3)
            .then(response => {
                //console.log(response.data);
                //res.status(200).send({message: "Locker reserved"});
            })
            .catch(err => {
                console.error("Error while placing parcel: " + err);
            });

        //updating status of parcel
        if (props.status != "failed") {
            const values4 = {
                parcelID: parcelid,
                status: "parcelTaken"
            }
            await axios.put('http://localhost:4001/updateStatusOfSending', values4)
                .then(response => {
                    //console.log(response.data.message);
                })
                .catch(err => {
                    throw (err);
                });

            //adding timestamp
            const values3 = {
                column: "takeaway",
                stampid: props.stampid
            }
            await axios.put('http://localhost:4001/updateTimestamp', values3)
                .then(response => {
                    //console.log(response.data.message);
                })
                .catch(err => {
                    console.error("Error while updating status of parcel: " + err);
                });


            //sending SMS to receiver that parcel has been picked up

            // alert("Parcel has been picked up successfully");
        }
        else {
            const values = {
                parcelID: props.parcelid
            }
            await axios.put('http://localhost:4001/parcelForDelivery/updateLockerID', values)
                .then(response => {
                    //console.log(response.data.message);
                })
                .catch(err => {
                    console.error("Error while updating lockerid of parcel to 0: " + err);
                });


            // alert("Failed Parcel has been picked up successfully");

        }
        Swal.fire({
            text: "Parcel has been picked up successfully",
            icon: "success",
            timer: 2000,
            title: "Success",
            showConfirmButton: false,
        });
        startTimer();
    }

    async function handlePlaceParcelBySender() {
        //updating status of compartment in locker to Reserved
        // console.log("handlePlaceParcelBySender", props.stampid)
        setCompStateID(3);
        setLoading(true);
        const values = {
            lockerid: props.lockerid,
            compid: props.compid,
            compstateid: 3
        }
        await axios.put('http://localhost:4002/Locker/Compartment/compstateid', values)
            .then(response => {
                //console.log(response.data);
            })
            .catch(err => {
                console.error("Error while placing parcel: " + err);
            });

        //updating otp of compartment in locker
        const num = Math.floor(Math.random() * 9000);
        setOTP(num);
        const values1 = {
            lockerid: props.lockerid,
            compid: props.compid,
            otp: num
        }
        await axios.put('http://localhost:4002/Locker/Compartment/otp', values1)
            .then(response => {
                //console.log(response.data);
            })
            .catch(err => {
                console.error("Error while placing parcel: " + err);
            });

        const values2 = {
            parcelID: parcelid,
            status: "parcelPlaced"
        }
        await axios.put('http://localhost:4001/updateStatusOfSending', values2)
            .then(response => {
                //console.log(response.data.message);
            })
            .catch(err => {
                console.error("Error while updating status of parcel: " + err);
            });

        const values3 = {
            column: "placement",
            stampid: props.stampid
        }
        await axios.put('http://localhost:4001/updateTimestamp', values3)
            .then(response => {
                //console.log(response.data.message);
            })
            .catch(err => {
                console.error("Error while updating status of parcel: " + err);
            });

        //sending SMS to receiver for new OTP to take parcel
        startTimer();
        // alert("Parcel has been placed successfully");
        Swal.fire({
            text: "Parcel has been placed successfully",
            icon: "success",
            timer: 2000,
            title: "Success",
            showConfirmButton: false,
        })
    }

    async function handleTakeParcelByReceiver() {
        //updating compartment state to Empty
        setLoading(true);
        //console.log("handleTakeParcelByReceiver")
        setCompStateID(1);
        const values = {
            lockerid: props.lockerid,
            compid: props.compid,
            compstateid: 1
        }
        await axios.put('http://localhost:4002/Locker/Compartment/compstateid', values)
            .then(response => {
                //console.log(response.data);
                //res.status(200).send({message: "Locker reserved"});
            })
            .catch(err => {
                console.error("Error while placing parcel: " + err);
            });

        //updating otp of compartment to 0
        setOTP(0);
        const values1 = {
            lockerid: props.lockerid,
            compid: props.compid,
            otp: 0
        }
        await axios.put('http://localhost:4002/Locker/Compartment/otp', values1)
            .then(response => {
                //console.log(response.data);
                //res.status(200).send({message: "Locker reserved"});
            })
            .catch(err => {
                console.error("Error while placing parcel: " + err);
            });

        //updating parcelid of compartment to 0
        setParcelID(0);
        const values2 = {
            lockerid: props.lockerid,
            compid: props.compid,
            parcelid: 0
        }
        await axios.put('http://localhost:4002/Locker/Compartment/parcelid', values2)
            .then(response => {
                //console.log(response.data);
                //res.status(200).send({message: "Locker reserved"});
            })
            .catch(err => {
                console.error("Error while placing parcel: " + err);
            });

        //updating purpose of compartment to 0
        setPurpose("none");
        const values3 = {
            lockerid: props.lockerid,
            compid: props.compid,
            purpose: "none"
        }
        await axios.put('http://localhost:4002/Locker/Compartment/purpose', values3)
            .then(response => {
                //console.log(response.data);
                //res.status(200).send({message: "Locker reserved"});
            })
            .catch(err => {
                console.error("Error while placing parcel: " + err);
            });

        //updating status of parcel
        if (props.status != "failed") {
            const values4 = {
                parcelID: parcelid,
                status: "parcelDelivered"
            }
            await axios.put('http://localhost:4001/updateStatus', values4)
                .then(response => {
                    //console.log(response.data.message);
                })
                .catch(err => {
                    throw (err);
                });

            //adding timestamp
            const values3 = {
                column: "takeaway",
                stampid: props.stampid
            }
            await axios.put('http://localhost:4001/updateTimestamp', values3)
                .then(response => {
                    //console.log(response.data.message);
                })
                .catch(err => {
                    console.error("Error while updating status of parcel: " + err);
                });


            //sending SMS to receiver that parcel has been picked up

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Parcel has been picked up successfully",
                timer: 2000,
                showConfirmButton: false,
            })
            // alert("Parcel has been picked up successfully");
        }
        else {
            const values = {
                parcelID: props.parcelid
            }
            await axios.put('http://localhost:4001/parcelForDelivery/updateLockerID', values)
                .then(response => {
                    //console.log(response.data.message);
                })
                .catch(err => {
                    console.error("Error while updating lockerid of parcel to 0: " + err);
                });
            alert("Failed Parcel has been picked up successfully");
        }
        setLoading(false);
        startTimer();
    }
    return (
        // <div>
        //     {/* {loading && (
        //         <div className="cliploader">
        //             <ClipLoader color="#007bff" size={50} />
        //         </div>
        //     )} */}
        //     <h2>Locker ID: {props.lockerid}</h2>
        //     <h2>Compartment ID: {props.compid}</h2>
        //     <h2>Compartment State: {compstateid}</h2>
        //     <h2>Compartment Category: {props.compcategoryid}</h2>
        //     <h2>Is Locked: {props.islocked}</h2>
        //     <h2>Parcel ID: {parcelid}</h2>
        //     <h2>OTP: {otp}</h2>
        //     <h2>Purpose: {purpose}</h2>
        //     <button onClick={handleClosure}>Close Compartment</button>
        //     {props.purpose === "receiving" ?
        //         <div>
        //             {props.compstateid == 2 ?
        //                 <button onClick={handlePlaceParcelByRider}>Place Parcel</button> :
        //                 <button onClick={handleTakeParcelByReceiver}>Take Parcel</button>
        //             }
        //         </div> :
        //         <div>
        //             {props.compstateid == 2 ?
        //                 <button onClick={handlePlaceParcelBySender}>Place Parcel</button> :
        //                 <button onClick={handleTakeParcelByRider}>Take Parcel</button>
        //             }
        //         </div>
        //     }
        // </div>
        <>
            {loading &&
                <div className="overlay">
                    <OrbitProgress color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
                </div>
            }
            <div className="scene">
                <div
                    className={`door ${isOpen ? "open" : "closed"}`}
                    onClick={handleLockerClick}
                    style={{
                        backgroundImage: "url('/images/locker4.png')",

                    }}

                ></div>

                {isOpen && (
                    <div className="room">
                        {props.compstateid !== 3 ?
                            (<img src="/images/pad.jpg" alt="" className="floating" />)
                            :
                            (<img src="/images/parcel.jpg" alt="" className="floating" />)}

                        <button className="door-button" onClick={handleClosure}>Close Compartment</button>
                        {props.purpose === "receiving" ?
                            <div>
                                {props.compstateid == 2 ?
                                    <button className="door-button" onClick={handlePlaceParcelByRider}>Place Parcel</button> :
                                    <button className="door-button" onClick={handleTakeParcelByReceiver}>Take Parcel</button>
                                }
                            </div> :
                            <div>
                                {props.compstateid == 2 ?
                                    <button className="door-button" onClick={handlePlaceParcelBySender}>Place Parcel</button> :
                                    <button className="door-button" onClick={handleTakeParcelByRider}>Take Parcel</button>
                                }
                            </div>
                        }
                    </div>
                )}
            </div>
        </>
        // <>
        //    

        // </>
    );
}

export default OpenCompartment;