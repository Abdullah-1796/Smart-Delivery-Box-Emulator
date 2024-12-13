import React from "react";
import axios from "axios";
import Compartment from "./Compartment";
import "../styles/Locker.css";
import { useParams } from "react-router-dom";
function Locker()
{
    const {id} = useParams();
    const [data, setData] = React.useState([]);
    const [sData, setSData] = React.useState([]);
    const [mData, setMData] = React.useState([]);
    const [lData, setLData] = React.useState([]);
    // const [id, setID] = React.useState({
    //     "id": lockerid
    // });
    console.log(id);
    function loadData()
    {
        axios.get(`http://localhost:3001/Locker/${id}`)
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

    function separateData()
    {
        setSData([]);
        setMData([]);
        setLData([]);
        data.map(d => {
            //console.log(d);
            if(d.compcategoryid == "1")
            {
                //console.log("Small");
                setSData((prev) => {
                    return([...prev, d]);
                });
            }
            else if(d.compcategoryid == "2")
            {
                setMData((prev) => {
                    return([...prev, d]);
                });
            }
            else if(d.compcategoryid == "3")
            {
                setLData((prev) => {
                    return([...prev, d]);
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
    return (
        <div>
            <div id="locker">
                <h1>Locker ID: {data.length !== 0? data[0].lockerid: null}</h1>
                <h2>Address: {data.length !== 0? data[0].address: null}</h2>
                <div className="compartment">
                    {   sData.map(d => (
                        <Compartment
                            key = {d.compid}
                            className = "smallCompartment"
                            compID = {d.compid}
                            compState = {d.compstateid === 1 ? "Empty" : d.compstateid === 2 ? "Reserved" : d.compstateid === 3 ? "Acquired" : "Null"}
                            compCategory = "Small"
                            isLocked={d.islocked.toString()}
                            otp={d.otp}
                        />
                    ))}
                </div>
                <div className="compartment">
                    {   mData.map(d => (
                        <Compartment
                            key = {d.compid}
                            className = "mediumCompartment"
                            compID = {d.compid}
                            compState = {d.compstateid === 1 ? "Empty" : d.compstateid === 2 ? "Reserved" : d.compstateid === 3 ? "Acquired" : "Null"}
                            compCategory = "Medium"
                            isLocked={d.islocked.toString()}
                            otp={d.otp}
                        />
                    ))}
                </div>
                <div className="compartment">
                    {   lData.map(d => (
                        <Compartment
                            key = {d.compid}
                            className = "largeCompartment"
                            compID = {d.compid}
                            compState = {d.compstateid === 1 ? "Empty" : d.compstateid === 2 ? "Reserved" : d.compstateid === 3 ? "Acquired" : "Null"}
                            compCategory = "Large"
                            isLocked={d.islocked.toString()}
                            otp={d.otp}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Locker;