import React from "react";
// import "../styles/door.css"

const sizeStyles = {
  small: {
    width: "110px",
    height: "200px",
  },
  medium: {
    width: "150px",
    height: "260px",
  },
  large: {
    width: "200px",
    height: "300px",
  },
};

export default function Lock({ id, locked, open, size, toggleLock, toggleOpen }) {
  return (
    <div
      className="locker"
      onClick={() => toggleOpen(id)}
      style={{
        backgroundImage: `url(/images/locker2.jpg)`,
        ...sizeStyles[size],  // apply size styles dynamically
      }}
    >
      <div className="locker-label">{id}</div>
      <div
        className="locker-lock-icon"
        onClick={(e) => {
          e.stopPropagation();
          toggleLock(id);
        }}
      >
        {locked ? "🔒" : "🔓"}
      </div>
      <div className="locker-status">
        {locked ? "Locked" : open ? "Open" : "Closed"}
      </div>
    </div>
  );
}
