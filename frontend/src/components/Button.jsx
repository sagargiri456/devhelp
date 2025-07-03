import React from "react";

const Button = ({ children, onClick, className }) => {
    return(
        <div>
            <button
            onClick={onClick}
            className={`px-4 py-2 rounded bg-blue-500 text-white ${className}`}
            >{children}</button>
        </div>
    )
}

export default Button;