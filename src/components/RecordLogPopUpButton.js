import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from 'react-icons/ai';
import RecordLog from './RecordLog'
import './style/RecordLogPopUpButton.css'

function RecordLogPopUpButton(props) {

    const [isShowing, setIsShowing] = useState("none")
    const [modalTop, setModalTop] = useState()
    const [modalLeft, setModalLeft] = useState()

    function inversePopup() {
        if(isShowing == "none") {
            setIsShowing("block")
        } else {
            setIsShowing("none")
        }
    }

    function closePopup() {
        setIsShowing("none")
    }

    function openPopup() {
        setIsShowing("block")
    }


    return(
        <div className="popup-button">
            <button className="icon-button" 

            ref={el => {
            if (!el) return;
            setModalTop(el.getBoundingClientRect().top + el.getBoundingClientRect().height)
            setModalLeft(el.getBoundingClientRect().left)
            }}

            onClick={inversePopup}><span className="icon"><AiOutlinePlus /></span> Log a lift</button>

            <div className="popup-modal" style={{display: isShowing, top: modalTop, left: modalLeft}}>
                <RecordLog  close={closePopup} options={props.options} isShowing={isShowing} updateData={props.updateData} />
            </div>
 
        </div>

    );

}

export default RecordLogPopUpButton;