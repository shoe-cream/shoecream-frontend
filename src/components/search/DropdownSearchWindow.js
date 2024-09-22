import SearchWindow from "./SearchWindow";
import { useState } from "react";
import './DropdownSearchWindow.css';

const DropdownSearchWindow = ({ types, setSearchTypeParent, setSearchCondition }) => {
    const [searchType, setSearchType] = useState(types[0].value);
    console.log('types: ', types);
    return (
        <div className="dropdown-search-window-container">
            <select value={searchType} onChange={(e) => {
                setSearchType(e.target.value);
                setSearchTypeParent(e.target.value);
                }}>
                <option disabled>검색 기준 선택</option>
                {types.map((type) => (
                    <option key = {type.value} value={type.value}>{type.display}</option>
                ))};
            </select>
            {types.map((type) => (
                (searchType === type.value ? 
                <SearchWindow 
                    placeholder={type.placeholder} 
                    suggestions={type.suggestions} 
                    defaultSearch={type.defaultSearch}
                    setSearchCondition={setSearchCondition}
                ></SearchWindow> : <div/>)
            ))}
        </div>
    );
}
export default DropdownSearchWindow;