import React from "react";
import axios from "axios";
import $ from 'jquery';
import "../styles/Locker.css";
import Compartment from "./Compartment";
import { useParams } from "react-router-dom";
import InteractionScreen from "./InteractionScreen";
import BeepSound from "../Audio/ButtonClick.mp3";
import OpenCompartment from "./OpenCompartment";
function Locker() {
    const { id } = useParams();
    const [data, setData] = React.useState([]);
    const [sData, setSData] = React.useState([]);
    const [mData, setMData] = React.useState([]);
    const [lData, setLData] = React.useState([]);
    const [cData, setCData] = React.useState([]);
    const beep = new Audio(BeepSound);
    // const [id, setID] = React.useState({
    //     "id": lockerid
    // });
    console.log(id);
    async function loadData() {
        await axios.get(`http://localhost:4002/Locker/${id}`)
            .then(res => {
                console.log(res.data.rows);
                setData(res.data.rows);
                console.log(data);
                //separateData();
            })
            .catch(error => {
                console.log("Error on fetching data" + error);
            });
    }

    function separateData() {
        setSData([]);
        setMData([]);
        setLData([]);
        data.map(d => {
            //console.log(d);
            if (d.compcategoryid === 1) {
                //console.log("Small");
                setSData((prev) => {
                    return ([...prev, d]);
                });
            }
            else if (d.compcategoryid === 2) {
                setMData((prev) => {
                    return ([...prev, d]);
                });
            }
            else if (d.compcategoryid === 3) {
                setLData((prev) => {
                    return ([...prev, d]);
                });
            }
        });
        //console.log(sData.length);
    }
    React.useEffect(() => {
        loadData();
    }, [id]);

    React.useEffect(() => {
        separateData();
    }, [data]);

    const time = 300;

    function unhideScreen() {
        //fading in an image
        $('#interactionScreenBody').fadeIn(time, () => {
            //changing image
            document.getElementById("interactionScreenBody").style.display = "flex";
            document.getElementById("locker").style.filter = "blur(5px)";
        });
    }

    function hideScreen() {
        //fading out an image
        $('#interactionScreenBody').fadeOut(time, () => {
            //changing image
            document.getElementById("interactionScreenBody").style.display = "none";
            document.getElementById("locker").style.filter = "none";
        });
    }

    return (
        <div>
            {
                cData.length !== 0 ? <OpenCompartment
                    lockerid={cData[0].lockerid}
                    compid={cData[0].compid}
                    compstateid={cData[0].compstateid}
                    compcategoryid={cData[0].compcategoryid}
                    otp={cData[0].otp}
                    parcelid={cData[0].parcelid}
                    purpose={cData[0].purpose}
                    islocked={"false"}
                    status={cData[0].status}
                    setData={setCData}
                /> : <div>
                    <InteractionScreen
                        hideScreen={hideScreen}
                        beep={beep}
                        lockerid={data.length !== 0 ? data[0].lockerid : null}
                        setData={setCData}
                    />
                    <div id="locker">
                        <div id="addressBar">
                            <h2>Locker ID: {data.length !== 0 ? data[0].lockerid : null}</h2>
                            <h2>Address: {data.length !== 0 ? data[0].address : null}</h2>
                            <div id="screenButton" onClick={unhideScreen}>
                                Open Screen
                            </div>
                        </div>
                        <div className="compartment">
                            {sData.map(d => (
                                <Compartment
                                    key={d.compid}
                                    className="smallCompartment"
                                    compID={d.compid}
                                    compState={d.compstateid === 1 ? "Empty" : d.compstateid === 2 ? "Reserved" : d.compstateid === 3 ? "Acquired" : "Null"}
                                    compCategory="Small"
                                    isLocked={d.islocked.toString()}
                                    otp={d.otp}
                                    parcelID={d.parcelid}
                                    purpose={d.purpose}
                                />
                            ))}
                        </div>
                        <div className="compartment">
                            {mData.map(d => (
                                <Compartment
                                    key={d.compid}
                                    className="mediumCompartment"
                                    compID={d.compid}
                                    compState={d.compstateid === 1 ? "Empty" : d.compstateid === 2 ? "Reserved" : d.compstateid === 3 ? "Acquired" : "Null"}
                                    compCategory="Medium"
                                    isLocked={d.islocked.toString()}
                                    otp={d.otp}
                                    parcelID={d.parcelid}
                                    purpose={d.purpose}
                                />
                            ))}
                        </div>
                        <div className="compartment">
                            {lData.map(d => (
                                <Compartment
                                    key={d.compid}
                                    className="largeCompartment"
                                    compID={d.compid}
                                    compState={d.compstateid === 1 ? "Empty" : d.compstateid === 2 ? "Reserved" : d.compstateid === 3 ? "Acquired" : "Null"}
                                    compCategory="Large"
                                    isLocked={d.islocked.toString()}
                                    otp={d.otp}
                                    parcelID={d.parcelid}
                                    purpose={d.purpose}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Locker;