import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Dropdown from '../dropdown/Dropdown';
import { Home, Star, Briefcase, ShoppingCart, BarChart2 } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const [expandedDropdown, setExpandedDropdown] = useState('');
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname;
        const category = currentPath.split('/')[1];
        setExpandedDropdown(category);
    }, [location]);

    const renderIcon = (title) => {
        switch (title) {
            case '즐겨찾기': return <Star size={18} />;
            case '마스터': return <Briefcase size={18} />;
            case '영업': return <ShoppingCart size={18} />;
            case '리포트': return <BarChart2 size={18} />;
            default: return <Home size={18} />;
        }
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar">
                {/* <div className="sidebar-logo">
                <img src='/logo/logo-shoeCream.png' alt='Logo' className='login-logo' />                    
                </div> */}
                <Dropdown 
                    title={'즐겨찾기'} 
                    icon={renderIcon('즐겨찾기')}
                    buttons={[
                        {name: '즐겨찾기1', urlTo: '/'}, 
                        {name: '즐겨찾기2', urlTo: '/'}, 
                        {name: '즐겨찾기3', urlTo: '/'}
                    ]} 
                    expandedDropdown={expandedDropdown} 
                    setExpandedDropdown={setExpandedDropdown} 
                />
                
                <Dropdown 
                    title={'마스터'} 
                    icon={renderIcon('마스터')}
                    buttons={[
                        {name: '고객사', urlTo: '/buyers'},   
                        {name: '제품', urlTo:'/items'},  
                        {name: '제조사', urlTo: '/manufacturers'}, 
                        {name: '고객사 단가', urlTo: '/buyer-items'}, 
                        {name: '제조사 단가', urlTo: '/manufacturer-items'}  
                    ]} expandedDropdown={expandedDropdown} setExpandedDropdown={setExpandedDropdown} />
                
                <Dropdown 
                    title={'영업'} 
                    icon={renderIcon('영업')}
                    buttons={[
                        {name: '주문 등록', urlTo: '/order'},
                        {name: '주문 관리', urlTo: '/order-approval'}    
                    ]} 
                    expandedDropdown={expandedDropdown} 
                    setExpandedDropdown={setExpandedDropdown} 
                />

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