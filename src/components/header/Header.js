import { useNavigate } from "react-router-dom";
import './Header.css';
import { useAuth } from "../../auth/AuthContext";
import { useEffect, useState } from "react";
import sendGetMyInfoRequest from "../../requests/GetMyInfoRequest";
import sendLogoutRequest from '../../requests/LogoutRequest';
import { Search, User, LogOut } from 'lucide-react';  // Lucide 아이콘 import

const Header = () => {
    const { state, logout } = useAuth();
    const navigate = useNavigate();
    const [myData, setMyData] = useState({ data: {} });
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const searchSuggestions = ['제조사', '고객사','제품','고객사 단가','제조사 단가','주문', '주문 관리','판매 기록' ];

    useEffect(() => {
        sendGetMyInfoRequest(state, setMyData);
    }, [state]);

    // 검색창 입력 처리 및 자동완성 필터링
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        const filtered = searchSuggestions.filter(suggestion =>
            suggestion.includes(value)
        );
        setFilteredSuggestions(filtered);
        setActiveSuggestion(-1);  // 검색어 변경 시 선택 초기화
        setShowSuggestions(true);  // 자동완성 리스트 표시
    };

    // 방향키 및 엔터 처리
    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();  // 기본 동작 방지
            // 아래로 이동: 추천 항목의 범위 안에서만 이동 가능
            if (activeSuggestion < filteredSuggestions.length - 1) {
                const newIndex = activeSuggestion + 1;
                setActiveSuggestion(newIndex);
                setSearchTerm(filteredSuggestions[newIndex]); // 선택된 항목을 검색창에 입력
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();  // 기본 동작 방지
            // 위로 이동: 추천 항목의 범위 안에서만 이동 가능
            if (activeSuggestion > 0) {
                const newIndex = activeSuggestion - 1;
                setActiveSuggestion(newIndex);
                setSearchTerm(filteredSuggestions[newIndex]); // 선택된 항목을 검색창에 입력
            }
        } else if (e.key === "Enter") {
            e.preventDefault();  // 기본 form 제출 방지
            // 선택된 항목이 있을 경우
            if (activeSuggestion >= 0 && filteredSuggestions.length > 0) {
                setSearchTerm(filteredSuggestions[activeSuggestion]);  // 선택된 항목을 검색창에 입력
                setShowSuggestions(false);  // 자동완성 리스트 숨기기
                handleSearchSubmit(e);  // 선택된 항목으로 검색 실행
            } else {
                handleSearchSubmit(e);  // 검색어가 입력된 경우 바로 검색 실행
            }
        }
    };

    // 검색 실행
    const handleSearchSubmit = (e) => {
        e.preventDefault();

        // 검색어에 따라 해당 페이지로 이동
        if (searchTerm === '제조사') {
            navigate('/manufacturers');
        } else if (searchTerm === '고객사') {
            navigate('/buyers');
        } else if (searchTerm === '주문') {
            navigate('/order-approval');
        }else if (searchTerm === '주문 승인') {
            navigate('/order-approval');
            
        }else if (searchTerm === '제품') {
            navigate('/items');
        } else if (searchTerm === '고객사 단가') {
            navigate('/buyer-items');
        } else if (searchTerm === '제조사 단가') {
            navigate('/manufacturer-items');
        }  else if (searchTerm === '판매 기록') {
            navigate('/sales-history');
        }  else {
            alert('검색 결과가 없습니다.');
        }
    };

    // 추천 항목 클릭 시 검색창에 입력만 처리
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);  // 클릭한 항목을 검색어로 설정
        setShowSuggestions(false);  // 자동완성 리스트 숨기기 (검색 실행은 하지 않음)
    };

    return (
        <div className="header-container">
            <img className="header-logo" src="logo/text-logo.png" onClick={() => navigate((state.isAuthenticated ? "/dashboard" : '/'))}></img>
            
            {/* 검색창과 자동완성 추천 */}
            <form onSubmit={handleSearchSubmit} className="header-search-form">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}  // 키보드 이벤트 추가
                    className="header-search-input"
                    autoComplete="off"  // 기본 자동완성 비활성화
                />
                <button type="submit" className="header-search-button">
                    <Search size={15} />
                </button>

                {/* 자동완성 리스트 */}
                {showSuggestions && searchTerm && filteredSuggestions.length > 0 && (
                    <ul className="header-suggestions">
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className={index === activeSuggestion ? 'active' : ''}  // 선택된 항목 강조
                                onClick={() => handleSuggestionClick(suggestion)}  // 클릭 시 입력만 처리
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </form>

            <div className="header-userinfo-container">
                {state.isAuthenticated ? <div className="header-welcome-text">{myData.data.name} 님</div> : 
                <button className="header-login-button" onClick={() => navigate('/login')}>로그인</button>}
                {state.isAuthenticated ? 
                    <User 
                        size={20} 
                        className="header-profile-icon"
                        onClick={() => navigate('/mypage')}
                    /> : <div></div>}
                {state.isAuthenticated ? 
                    <LogOut 
                        size={20} 
                        className="header-logout-icon"
                        onClick={() => sendLogoutRequest(state, logout, navigate)}
                    /> : <div></div>}
            </div>
        </div>
    );
}

export default Header;
