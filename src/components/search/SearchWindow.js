import { useState } from "react";
import { Search } from 'lucide-react';
import './SearchWindow.css';
import Swal from "sweetalert2";

const SearchWindow = ({ placeholder, suggestions, defaultSearch, setSearchCondition, className }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // 검색창 입력 처리 및 자동완성 필터링
    const handleSearchChange = (e) => {

        console.log('suggestions: ', suggestions);
        console.log('filtered Suggestions: ', filteredSuggestions);
        console.log('showSuggestions: ', showSuggestions);
        
        const value = e.target.value;
        setSearchTerm(value);
        if(setSearchCondition !== undefined){
            setSearchCondition(value);
        }

        const filtered = suggestions.filter(suggestion =>
            suggestion.key.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
        setActiveSuggestion(-1);
        setShowSuggestions(true);
    };

    // 방향키 및 엔터 처리
    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (activeSuggestion < filteredSuggestions.length - 1) {
                const newIndex = activeSuggestion + 1;
                setActiveSuggestion(newIndex);
                setSearchTerm(filteredSuggestions[newIndex].key);
                if(setSearchCondition !== undefined){
                    setSearchCondition(filteredSuggestions[newIndex].key);
                }
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (activeSuggestion > 0) {
                const newIndex = activeSuggestion - 1;
                setActiveSuggestion(newIndex);
                setSearchTerm(filteredSuggestions[newIndex].key);
                if(setSearchCondition !== undefined){
                    setSearchCondition(filteredSuggestions[newIndex].key);
                }
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeSuggestion >= 0 && filteredSuggestions.length > 0) {
                handleSearchSubmit(filteredSuggestions[activeSuggestion]);
            } else {
                const matchedSuggestion = suggestions.find(s => s.key.toLowerCase() === searchTerm.toLowerCase());
                if (matchedSuggestion) {
                    handleSearchSubmit(matchedSuggestion);
                } else {
                    alert('검색 결과가 없습니다.');
                }
            }
        }
    };

    // 검색 실행
    const handleSearchSubmit = (suggestion) => {
        if (searchTerm === '') {
            if (defaultSearch !== undefined) {
                Swal.fire({text: '검색어가 없어 전체 데이터를 조회합니다.'});
                defaultSearch();
            }
        } else if (suggestion) {
            setShowSuggestions(false);
            if (suggestion.onSearch) {
                suggestion.onSearch();
            }
        } else {
            Swal.fire({text: '올바른 항목을 입력해주세요.'});
        }
    };

    // 추천 항목 클릭 시 검색 실행
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.key);
        if(setSearchCondition !== undefined){
            setSearchCondition(suggestion.key);
        }
        setShowSuggestions(false); // 추천 리스트만 닫음
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(suggestions.find(s => s.key.toLowerCase() === searchTerm.toLowerCase())); }} className={`header-search-form ${className}`}>
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onFocus={() => {
                    if(searchTerm === ''){
                        setFilteredSuggestions(suggestions);
                        setShowSuggestions(true);
                    }
                }}
                onBlur={() => setShowSuggestions(false)}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="header-search-input"
                autoComplete="off"
            />
            <button type="submit" className="header-search-button">
                <Search size={15} />
            </button>

            {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="header-suggestions">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={index === activeSuggestion ? 'active' : ''}
                            onMouseDown={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion.key}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
};

export default SearchWindow;