import { useState } from 'react';
import Dropdown from '../dropdown/Dropdown';
import './Sidebar.css';

const Sidebar = () => {
    const [expandedDropdown, setExpandedDropdown] = useState('');

    return (
        <div className="sidebar-container">
            <div className="sidebar">
                {/* 즐겨찾기 드롭다운 */}
                <Dropdown title={'즐겨찾기'} buttons={[
                    {name: '즐겨찾기1', urlTo: '/'}, 
                    {name: '즐겨찾기2', urlTo: '/'}, 
                    {name: '즐겨찾기3', urlTo: '/'}
                ]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown} />
                
                {/* 마스터 카테고리 */}
                <div className='마스터 카테고리'>
                    <Dropdown title={'마스터'} buttons={[
                        {name: '고객사', urlTo: '/buyers'},   
                        {name: '제품', urlTo:'/items'},  
                        {name: '제조사', urlTo: '/manufacturers'}, 
                        {name: '고객사 단가', urlTo: '/buyer-items'}, 
                        {name: '제조사 단가', urlTo: '/manufacturer-items'}  
                    ]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown} />
                </div>

                {/* 영업 카테고리 */}
                <div className='영업 카테고리'>
                    <Dropdown title={'영업'} buttons={[
                        {name: '주문', urlTo: '/order'},
                        {name: '주문 관리', urlTo: '/order-approval'}    
                    ]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown} />
                </div>

                {/* 리포트 카테고리 */}
                <div className='리포트 카테고리'>
                    <Dropdown title={'리포트'} buttons={[
                        {name: '판매 기록', urlTo: '/sales-history'},  
                        /* {name: '재고 조회', urlTo: '/orders/inventories'}  */ 
                    ]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown} />
                </div>
                
            </div>
        </div>
    );
}

export default Sidebar;