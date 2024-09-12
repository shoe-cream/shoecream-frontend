import { useState } from 'react';
import './Dropdown.css';
import { useNavigate } from 'react-router-dom';

const Dropdown = ({ title, buttons, expandedDropdown, setExpandedDropdown }) => {
    const navigate = useNavigate();
    return (
        <div className="dropdown">
            <div className = 'dropdown-title' onClick={() => {
                if(expandedDropdown === title){
                    setExpandedDropdown('');
                }else{
                    setExpandedDropdown(title);
                }
            }}>
                <div className='dropdown-title-text'>{title}</div>
                <img src={expandedDropdown === title ? 'icons/uparrow.png' : 'icons/downarrow.png'} className='dropdown-arrow'></img>
            </div>
            {title === expandedDropdown ? buttons.map((value) => (
    <button key={value.id} className='dropdown-content' onClick={() => navigate(value.urlTo)}>{value.name}</button>
)) : <div></div>}

        </div>
    );
}
export default Dropdown;