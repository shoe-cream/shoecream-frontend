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
                        {name: '고객사', urlTo: '#', isTitle: true}, 
                        {name: '고객사 등록', urlTo: '/buyers'},
                        {name: '고객사 조회', urlTo: '/buyers/search'},  
                        {name: '고객사 수정', urlTo: '/buyers/{buyer-id}'},  
                        {name: '고객사 삭제', urlTo: '/buyers/{buyer-id}'},  
                        {name: '제품', urlTo: '#', isTitle: true},  
                        {name: '제품 등록', urlTo: '/items'},  
                        {name: '단가', urlTo: '#', isTitle: true}, 
                        {name: '고객사 단가 관리', urlTo: '/buyer-items'}, 
                        {name: '제조사 단가 관리', urlTo: '/manufacturer-items'}  
                    ]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown} />
                </div>

                {/* 영업 카테고리 */}
                <div className='영업 카테고리'>
                    <Dropdown title={'영업'} buttons={[
                        {name: '주문', urlTo: '#', isTitle: true}, 
                        {name: '주문 등록', urlTo: '/order-detail'},
                        {name: '주문 승인', urlTo: '/orders/{order-id}/approve'},  
                        {name: '반품 내역', urlTo: '/cancelled-order'},  
                        {name: '주문 히스토리 조회', urlTo: '/orders/{order-id}/histories'}  
                    ]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown} />
                </div>

                {/* 리포트 카테고리 */}
                <div className='리포트 카테고리'>
                    <Dropdown title={'리포트'} buttons={[
                        {name: '판매 리포트 조회', urlTo: '/orders/report'},  
                        {name: '재고 조회', urlTo: '/orders/inventories'}  
                    ]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown} />
                </div>

                {/* 제조사 카테고리 */}
                <div className='제조사 카테고리'>
                    <Dropdown title={'제조사'} buttons={[
                        {name: '제조사 등록', urlTo: '/manufacturers'},  
                        {name: '제조사 조회', urlTo: '/manufacturers/{mfId}'}, 
                        {name: '제조사 목록 조회', urlTo: '/manufacturers'},  
                        {name: '제조사 정보 수정', urlTo: '/manufacturers'},  
                        {name: '제조사 삭제', urlTo: '/manufacturers/{mfId}'},  
                        {name: '납품 기록 조회', urlTo: '/{mfItem-id}/histories'},  
                        {name: '제조사별 납품 기록 조회', urlTo: '/manufacturer-history?mfId={mfId}'}, 
                        {name: '제조사 단가 등록', urlTo: '/manufacture-items'}, 
                        {name: '제조사 단가 조회', urlTo: '/manufacture-items/{mfId}'},  
                        {name: '제조사 단가 전체 조회', urlTo: '/manufacture-items'}
                    ]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown} />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
