import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../auth/AuthContext';
import getBuyerWithItemsRequest from '../../requests/GetBuyerItems';
import getItemRequest from '../../requests/GetItemRequest';
import OrderPostModal from '../modal/OrderPostModal';
import Swal from 'sweetalert2';
import '../OrderPost/ProductSearch.css' ;

const ProductSearch = ({ onAddOrder }) => {
    const [searchParams, setSearchParams] = useState({
        buyerCd: '',
        buyerNm: '',
        tel: '',
        orderDate : ''
    });
    const [buyers, setBuyers] = useState({ data: {} });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItemCd, setSelectedItemCd] = useState('');
    const [findItem, setFindItem] = useState(null);
    const [buyerItemUnitPrice, setBuyerItemUnitPrice] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { state } = useAuth();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSearchParams(prevState => ({ ...prevState, [id]: value }));
    };

    const handleSelectChange = (event) => {
        const itemCd = event.target.value;
        setSelectedItemCd(itemCd);

        if (event.target.selectedIndex > 0) {
            const selectedItem = buyers.data.buyerItems[event.target.selectedIndex - 1];
            setBuyerItemUnitPrice(selectedItem.unitPrice);
            getItemRequest(state, itemCd, setFindItem, setIsLoading);
        } else {
            setBuyerItemUnitPrice('');
        }
    };

    const handleBuyerSearch = () => {
        getBuyerWithItemsRequest(state, searchParams.buyerCd, setBuyers, setIsLoading);
    };

    const handleOpenModal = () => {
        if (searchParams.buyerCd) {
            setIsModalOpen(true);
        } else {
            Swal.fire({text : '고객코드를 입력해주세요'})
        }
    };

    const handleItemsSelected = (items) => {
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
            registrationDate: searchParams.orderDate, // 변경된 부분
            items: items.map(item => ({
                itemCd: item.itemCd,
                itemNm: item.itemNm,
                color: item.color,
                size: item.size,
                unitPrice: item.unitPrice,
                qty: item.quantity,
                unit: item.unit,
                startDate: item.startDate,
                endDate: item.endDate,
                contractPeriod: `${item.startDate || ''} ~ ${item.endDate || ''}`,
            }))
        };

        onAddOrder(newOrder);
        setIsModalOpen(false);
    };

    return (
        <div className='product-search'>
            <div className="search-container">
                <SearchBox
                    label="고객코드"
                    id="buyerCd"
                    value={searchParams.buyerCd}
                    onChange={handleChange}
                    onSearch={handleBuyerSearch}
                />
                <ReadOnlyInput label="고객사" id="buyerNm" value={buyers.data.buyerNm} />
                <ReadOnlyInput label="고객사 연락처" id="tel" value={buyers.data.tel} />
                <DateInput
                    label="주문 날짜"
                    id="orderDate"
                    value={searchParams.orderDate}
                    onChange={handleChange}
                />
            </div>

            <div className='button-container'>
                <button onClick={handleOpenModal} className="add-items-button">
                    <Plus size={13} /> 아이템 추가
                </button>
            </div>

            {isModalOpen && (
                <OrderPostModal
                    state={state}
                    setOpened={setIsModalOpen}
                    buyerCd={searchParams.buyerCd}
                    onItemsSelected={handleItemsSelected}
                    orderDate = {searchParams.orderDate}
                />
            )}
        </div>
    );
};

const SearchBox = ({ label, id, value, onChange, onSearch }) => (
    <div className="search-box">
        <span className="search-label">{label}</span>
        <div className='divSearch'>
            <input
                type='text'
                id={id}
                className='orderPostInput'
                value={value}
                onChange={onChange}
            />
            <button className="search-button" onClick={onSearch}>
                <Search size={14} color="#ffffff"/>
            </button>
        </div>
    </div>
);

const ReadOnlyInput = ({ label, id, value }) => (
    <div className="search-box">
        <span className="search-label">{label}</span>
        <input type='text' id={id} className='orderPostInput' value={value} readOnly />
    </div>
);

const DateInput = ({ label, id, value, onChange }) => (
    <div className="search-box">
        <span className="search-label">{label}</span>
        <input
            type='date'
            id={id}
            className='orderPostInput'
            value={value}
            onChange={onChange}
            defaultValue={new Date()}
        />
    </div>
);

export default ProductSearch;