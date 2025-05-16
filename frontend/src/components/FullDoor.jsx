import React from 'react';
import "../styles/door.css";

function FullDoor() {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleLockerClick = (e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    const handleButtonClick = (e) => {
        e.stopPropagation();
        alert("Button clicked!");
    };

    return (
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
                    <img src="/images/parcel.jpg" alt="" className="floating" />
                    <button className="door-button" onClick={handleButtonClick}>
                        Proceed
                    </button>
                </div>
            )}
        </div>
    );
}

export default FullDoor;
