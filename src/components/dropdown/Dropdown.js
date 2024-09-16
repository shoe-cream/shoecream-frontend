import { useState } from 'react';
import './Dropdown.css';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Dropdown = ({ title, buttons, expandedDropdown, setExpandedDropdown }) => {
    const navigate = useNavigate();

    const isExpanded = expandedDropdown === title;

    return (
        <div className="dropdown">
            <div 
                className="dropdown-title" 
                onClick={() => {
                    if (isExpanded) {
                        setExpandedDropdown('');
                    } else {
                        setExpandedDropdown(title);
                    }
                }}>
                <div className="dropdown-title-text">{title}</div>
                {isExpanded ? 
                    <ChevronUp className="dropdown-arrow" size={18} /> : 
                    <ChevronDown className="dropdown-arrow" size={18} />
                }
            </div>
            <div className={`dropdown-content-wrapper ${isExpanded ? 'active' : ''}`}>
                {buttons.map((value) => (
                    <button 
                        key={value.id} 
                        className="dropdown-content" 
                        onClick={() => navigate(value.urlTo)}
                    >
                        {value.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Dropdown;