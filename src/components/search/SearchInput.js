import { useState, useCallback, useEffect } from "react";

const SearchInput = ({ placeholder, suggestions, onBlur, value, onChange, searchInputs, setSearchInputs }) => {
    const [searchTerm, setSearchTerm] = useState(searchInputs);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // searchInput prop이 변경될 때 로컬 상태 업데이트
    useEffect(() => {
        console.log('searchInputs in SearchInput: ', searchInputs);
        setSearchTerm(searchInputs);
    }, [searchInputs]);

    // 인풋에 값을 타이핑할 때
    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;

        console.log('newValue: ', value);
        setSearchTerm(value);
        setSearchInputs(value); // 즉시 부모 컴포넌트 상태 업데이트

        const filtered = suggestions.filter(suggestion =>
            suggestion.key.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
        setActiveSuggestion(-1);
        setShowSuggestions(true);

        onChange(e);
    }, [suggestions, onChange, setSearchInputs]);

    // 제안 사항을 클릭할 때
    const handleSuggestionClick = useCallback((suggestion) => {
        console.log('newVaasdasdlue: ', suggestion.key);
        
        setSearchTerm(suggestion.key);  // 검색창에 고객사명 반영
        setSearchInputs(suggestion.key); // 부모 컴포넌트 상태 업데이트
        // setShowSuggestions(false);  // 추천 리스트 숨기기
        
        // 바로 검색창에 값 반영
        onChange({ target: { value: suggestion.key } });
    
        // 필요할 경우 검색 처리 실행 (제안 사항 클릭 시 검색을 실행하고 싶으면 사용)
        // handleSearchSubmit(suggestion);
    
        // onBlur({ target: { value: suggestion.key } });
    }, [onChange, onBlur, setSearchInputs]);

    
    // 검색 실행
    const handleSearchSubmit = (suggestion) => {
        setShowSuggestions(false);
        if (suggestion && suggestion.onSearch) {
            suggestion.onSearch();
        }
    };
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

    return (
        <div className="header-search-form">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onBlur={onBlur}
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
                            onMouseDown={() => handleSuggestionClick(suggestion)}
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