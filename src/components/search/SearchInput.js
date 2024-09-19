import { useState, useCallback } from "react";

const SearchInput = ({ placeholder, suggestions, onChange, onBlur, value: externalValue }) => {
    const [searchTerm, setSearchTerm] = useState(externalValue || '');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // 검색창 입력 처리 및 자동완성 필터링
    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;
        setSearchTerm(value);

        const filtered = suggestions.filter(suggestion =>
            suggestion.key.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
        setActiveSuggestion(-1);
        setShowSuggestions(true);

        // 부모 컴포넌트의 onChange 호출
        onChange(e);
    }, [suggestions, onChange]);

    // 방향키 및 엔터 처리
    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (activeSuggestion < filteredSuggestions.length - 1) {
                const newIndex = activeSuggestion + 1;
                setActiveSuggestion(newIndex);
                setSearchTerm(filteredSuggestions[newIndex].key);
                onChange({ target: { value: filteredSuggestions[newIndex].key } });
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (activeSuggestion > 0) {
                const newIndex = activeSuggestion - 1;
                setActiveSuggestion(newIndex);
                setSearchTerm(filteredSuggestions[newIndex].key);
                onChange({ target: { value: filteredSuggestions[newIndex].key } });
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
                    console.log('검색 결과가 없습니다.');
                }
            }
        }
    };

    // 검색 실행
    const handleSearchSubmit = (suggestion) => {
        setShowSuggestions(false);
        if (suggestion && suggestion.onSearch) {
            suggestion.onSearch();
        }
    };

    // 추천 항목 클릭 시 검색 실행
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.key);
        setShowSuggestions(false);
        handleSearchSubmit(suggestion);
        onChange({ target: { value: suggestion.key } });
    };

    // onBlur 핸들러
    const handleBlur = useCallback(() => {
        setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
      
    }, []);

    return (
        <div className="header-search-form">
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="header-search-input"
                autoComplete="off"
            />

            {showSuggestions && searchTerm && filteredSuggestions.length > 0 && (
                <ul className="header-suggestions">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={index === activeSuggestion ? 'active' : ''}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion.key}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchInput;