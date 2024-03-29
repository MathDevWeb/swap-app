import React from "react";
import './ViewBoxes.scss';

export default function NewsBox() {
    return(
        <div className="viewBox newsBox"> 
            <div className="newsDate">1.03.2024:</div>
            <ul>
                <li>Note field for each unique shift.</li>
                <li>Video Tutorial link available below.</li>
                <li>Minor Interface changes.</li>
            </ul>
            <div>Any feedback are welcome: <a href="SwapAppMB@hotmail.com" target="_blank" rel="noreferrer">SwapAppMB@hotmail.com</a></div>
            <div>Happy Swapping! 🎉</div> 
        </div>
    )
}