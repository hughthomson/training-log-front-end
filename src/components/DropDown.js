import React, { useEffect, useState } from "react";
import Select from 'react-select';
import './style/DropDown.css';

function DropDown(props) {
    const [selectedOption, setSelectedOption] = useState(null);
    let options = []

    useEffect(() => {
        if(selectedOption !== null) {
            props.update(selectedOption.value)
        } 
        
        else {
            props.update("")
        }
    }, [selectedOption]);

    useEffect(() => {
        setSelectedOption("")
        props.update("")
    }, [props.isShowing]);


    for(let i = 0; i < props.options.length; i++) {
        options.push({value: props.options[i], label: props.options[i]})
    }

    return(
        <div className="dropdown">
            <Select
                className="select"
                value={selectedOption}
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
                onBlur= { event => event.preventDefault()}
                placeholder={"Movement"}
            />
        </div>
    )
}

export default DropDown;