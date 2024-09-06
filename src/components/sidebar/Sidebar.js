import { useState } from 'react';
import Dropdown from '../dropdown/Dropdown';
import './Sidebar.css';
const Sidebar = () => {
    const [expandedDropdown, setExpandedDropdown] = useState('');
    return (
        <div className="sidebar">
            <textarea className="sidebar-search" placeholder="필터메뉴검색"></textarea>
            <Dropdown title={'즐겨찾기'} buttons={[
                {name: '즐겨찾기1', urlTo: '/'}, {name: '즐겨찾기2', urlTo: '/'}, {name: '즐겨찾기3', urlTo: '/'}]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown}></Dropdown>
            <Dropdown title={'최근 보고서'} buttons={[
                {name: '보고서1', urlTo: '/'}, {name: '보고서2', urlTo: '/'}, {name: '보고서3', urlTo: '/'}]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown}></Dropdown>
            <Dropdown title={'주문관리'} buttons={[
                {name: '주문 등록', urlTo: '/order'}, {name: '주문 승인', urlTo: '/order-approval'}, {name: '반품 내역', urlTo: '/cancelled-order'}]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown}></Dropdown>
            <Dropdown title={'제품관리'} buttons={[
                {name: '제품 등록', urlTo: '/item'}]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown}></Dropdown>
            <Dropdown title={'고객사 관리'} buttons={[
                {name: '고객사 등록', urlTo:'/buyer'}, {name: '고객사 단가 관리', urlTo: '/buyer-item'}]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown}></Dropdown>
            <Dropdown title={'제조사 관리'} buttons={[
                {name: '제조사 등록', urlTo: '/manufacturer'}, {name: '제조사 단가 관리', urlTo: '/manufacturer-item'}]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown}></Dropdown>
            <Dropdown title={'납품 내역'} buttons={[
                {name: '납품 내역 조회', urlTo: '/manufacture-history'}, {name: '납품 통계', urlTo: '/manufacture-history'}]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown}></Dropdown>
            <Dropdown title={'매출 내역'} buttons={[
                {name: '매출 내역 조회', urlTo: '/sales-history'}, {name: '매출 통계', urlTo: '/sales-history'}]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown}></Dropdown>
        </div>
    );
}
export default Sidebar