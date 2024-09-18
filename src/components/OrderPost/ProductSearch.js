import React, { useState } from 'react';
import axios from 'axios';
import getBuyerRequest from '../../requests/GetBuyerRequest';
import { useAuth } from '../../auth/AuthContext';
import getBuyerWithItemsRequest from '../../requests/GetBuyerItems';
import getItemRequest from '../../requests/GetItemRequest';
import OrderPostModal from '../modal/OrderPostModal';
import { format } from 'date-fns';
import { Search , Edit, Plus} from 'lucide-react';


const ProductSearch = ({ onAddOrder }) => {
    // State 변수들
    const [searchParams, setSearchParams] = useState({
        buyerNm: '',
        buyerCd: '',
        requestDate: '',
        itemNm: '',
        size: '',
        itemCd: '',
        contractPeriod: '',
        unit: '',
        unitPrice: '',
        quantity: '',
        qty: '',
        tel: '',
        category: ''
    });
    const [buyers, setBuyers] = useState({ data: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const { state } = useAuth();
    const [selectedItemCd, setSelectedItemCd] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [findItem, setFindItem] = useState(null);
    const [buyerItemUnitPrice, setBuyerItemUnitPrice] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 이벤트 핸들러들
    const handleChange = (e) => {
        const { id, value } = e.target;
        setSearchParams(prevState => ({ ...prevState, [id]: value }));
    };

    const handleSelectChange = (event) => {
        const itemCd = event.target.value;
        setSelectedItemCd(itemCd);

        const selectedIndex = event.target.selectedIndex;
        if (selectedIndex > 0) {
            const selectedItem = buyers.data.buyerItems[selectedIndex - 1];
            setBuyerItemUnitPrice(selectedItem.unitPrice);

            getItemRequest(state, itemCd, setFindItem, setIsLoading);
        } else {
            setBuyerItemUnitPrice('');
        }
    };

    const handleFetch = () => {
        // 계약 기간은 이제 handleItemsSelected에서 처리됩니다.
        console.log('Fetching data');

        onAddOrder({
            ...searchParams,
            buyerNm: buyers.data.buyerNm || '',
            tel: buyers.data.tel || '',
            registrationDate : new Date().toISOString().slice(0, 10),
            deliveryDate: '',
            itemNm: findItem ? findItem.data.itemNm : '',
            itemCd: findItem ? findItem.data.itemCd : '',
            color: findItem ? findItem.data.color : '',
            size: findItem ? findItem.data.size : '',
            unit: findItem ? findItem.data.unit : '',
            unitPrice: buyerItemUnitPrice || '',
            category: findItem ? findItem.data.category : ''
        });

        // 폼 필드 초기화
        setSearchParams({
            buyerNm: '',
            buyerCd: '',
            requestDate: '',
            itemNm: '',
            size: '',
            itemCd: '',
            contractPeriod: '',
            unit: '',
            unitPrice: '',
            quantity: '',
            qty: '',
            tel: '',
            category: ''
        });
    };

    const handleBuyerSearch = () => {
        getBuyerWithItemsRequest(state, searchParams.buyerCd, setBuyers, setIsLoading);
    };

    const handleOpenModal = () => {
        if(searchParams.buyerCd){
            setIsModalOpen(true);
        }else {
            alert("고객 코드를 넣어주세요")
        }
    };

    const handleItemsSelected = (items) => {
        // 선택된 아이템들의 시작일과 종료일 중 가장 빠른 시작일과 가장 늦은 종료일을 찾습니다.
        const startDates = items.map(item => new Date(item.startDate)).filter(date => !isNaN(date));
        const endDates = items.map(item => new Date(item.endDate)).filter(date => !isNaN(date));

        const earliestStartDate = startDates.length > 0 ? Math.min(...startDates) : null;
        const latestEndDate = endDates.length > 0 ? Math.max(...endDates) : null;

        const contractPeriod = earliestStartDate && latestEndDate
            ? `${format(earliestStartDate, 'yyyy/MM/dd')} ~ ${format(latestEndDate, 'yyyy/MM/dd')}`
            : '';

        const newOrder = {
            buyerCd: searchParams.buyerCd,
            buyerNm: buyers.data.buyerNm,
            tel: buyers.data.tel,
            registrationDate: new Date().toISOString().slice(0, 10),
            requestDate: '', // You may want to add a field for this in the modal
            contractPeriod,
            items: items.map(item => ({
                itemCd: item.itemCd,
                itemNm: item.itemNm,
                color: item.color,
                size: item.size,
                unitPrice: item.unitPrice,
                qty: item.quantity,
                unit: item.unit,
                startDate : item.startDate,
                endDate : item.endDate,
                contractPeriod: `${item.startDate || ''} ~ ${item.endDate || ''}`,
            }))
        };
        console.log("new Order",newOrder);
    
        onAddOrder(newOrder);
        setIsModalOpen(false);
    };

    return (
        <div className='product-search'>
            <div className="search-container">
                <div className="search-box">
                    <span className="search-label">고객코드</span>
                    <div className='divSearch'>
                        <input
                            type='text'
                            id='buyerCd'
                            className='orderPostInput'
                            value={searchParams.buyerCd}
                            onChange={handleChange}
                        />
                        <button id="searchBuyer" className="search-button" onClick={handleBuyerSearch}>
                        <Search size={16} color="#ffffff" />
                        </button>
                    </div>
                </div>  
                <div className="search-box">
                    <span className="search-label">고객사</span>
                    <input type='text' id='buyerNm' className='orderPostInput' value={buyers.data.buyerNm} onChange={handleChange} readOnly />
                </div>
                <div className="search-box">
                    <span className="search-label">고객사 연락처</span>
                    <input type='text' id='tel' className='orderPostInput' value={buyers.data.tel} onChange={handleChange} readOnly />
                </div>
            </div>

            <div className='button-container'>
                <button onClick={handleOpenModal} className="add-items-button"><Plus size={13} /> 추가</button>
                <button className='load-btn' onClick={handleFetch}>불러오기</button>
            </div>
            {isModalOpen && (
                <OrderPostModal
                    state={state}
                    setOpened={setIsModalOpen}
                    buyerCd={searchParams.buyerCd}
                    onItemsSelected={handleItemsSelected}
                />
            )}
        </div>
    );
}

export default ProductSearch;