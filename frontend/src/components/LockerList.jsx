import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import "../styles/LockerList.css";

function LockerList()
{
    const [data, setData] = React.useState([]);

    function loadData()
    {
        axios.get("http://localhost:3001/")
        .then(res => {
            setData(res.data.rows);
            //console.log(res.data.rows);
        })
        .catch(error => {
            console.log(`Error while fecthing lockers ${error}`);
        });
    }

    React.useEffect(()=> {
        loadData();
    }, []);
    return(
        <div id="lockerListContainer">
            <h1>List of Smart Lockers</h1>
            {
                data.map(d => {
                return (
                    <Link to={`/Locker/${d.lockerid}`} className="lockerItem" key={d.lockerid}>
                        <p>{d.lockerid} {d.address}</p>
                    </Link>
                );
            })}
        </div>
    );
}

export default LockerList;