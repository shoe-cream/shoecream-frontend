import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../auth/AuthContext';
import getBuyerRequest from '../../requests/GetBuyerRequest';
import getItemRequest from '../../requests/GetItemRequest';
import OrderPostModal from '../modal/OrderPostModal';
import Swal from 'sweetalert2';
import '../OrderPost/ProductSearch.css';
import SearchWindow from '../search/SearchWindow';
import sendGetAllBuyersRequest from '../../requests/GetAllBuyersRequest';
import sendGetBuyersRequest from '../../requests/GetBuyersRequest';

const ProductSearch = ({ onAddOrder }) => {
    const [searchParams, setSearchParams] = useState({
        buyerCd: '',
        buyerNm: '',
        tel: '',
        orderDate: ''
    });
    const [buyers, setBuyers] = useState({ data: {} });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItemCd, setSelectedItemCd] = useState('');
    const [findItem, setFindItem] = useState(null);
    const [buyerItemUnitPrice, setBuyerItemUnitPrice] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allBuyers, setAllBuyers] = useState({ data: [] });
    const [searchCondition, setSearchCondition] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('buyerCd');

    const { state } = useAuth();

    useEffect(() => {
        // sendGetBuyersRequest({ state: state, page: page, setPage: setPage, size: 10, sortBy: sortBy, buyerCd:searchCondition, setData: resetData, setIsLoading: setIsLoading });
        sendGetAllBuyersRequest(state, setAllBuyers, setIsLoading);
      }, [page, sortBy]);

      const resetData = (value) => {
        console.log('reset data: ', value);
        setAllBuyers(value);
      }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSearchParams(prevState => ({ ...prevState, [id]: value }));
        console.log("buyersdfsd",buyers);
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
        if (!searchCondition) {
            Swal.fire({ text: '고객코드를 입력해주세요' });
            return;
        }
        console.log("asdasdasdasd", searchCondition);
        getBuyerRequest(state, searchCondition, setBuyers, setIsLoading);
    };

    const handleOpenModal = () => {
        if (buyers.data.buyerCd && searchParams.orderDate) {
            console.log(buyers.data.buyerCd);
            setIsModalOpen(true);
        } else {
            let errorMessage = '';
            if (!buyers.data.buyerCd && !searchParams.orderDate) {
                errorMessage = '고객코드와 주문날짜를 입력해주세요.';
            } else if (!buyers.data.buyerCd) {
                errorMessage = '고객코드를 입력해주세요.';
            } else if (!searchParams.orderDate) {
                errorMessage = '주문날짜를 입력해주세요.';
            }
            Swal.fire({ text: errorMessage });
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
            buyerCd: buyers.data.buyerCd,
            buyerNm: buyers.data.buyerNm,
            tel: buyers.data.tel,
            registrationDate: searchParams.orderDate,
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
                margin: item.margin,
                contractPeriod: `${item.startDate || ''} ~ ${item.endDate || ''}`,
            }))
        };
        console.log("new Order", newOrder);
        onAddOrder(newOrder);
        setIsModalOpen(false);
    };

    return (
        <div className='product-search'>
            <div className="search-container">
                <div className="search-box">
                    <span className="search-label">고객코드</span>
                    <SearchWindow
                        placeholder="고객코드를 입력하세요"
                        suggestions={
                            allBuyers.data.map(data => ({
                                key: data.buyerCd,
                                onSearch: () => {
                                    handleBuyerSearch();
                                }
                            }))
                        }
                        defaultSearch={handleBuyerSearch}
                        setSearchCondition={setSearchCondition}
                    />
                    {/* <button className="search-button" onClick={handleBuyerSearch}>
                    </button> */}
                </div>
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
                    <Plus size={13} /> 제품 추가
                </button>
            </div>

            {isModalOpen && (
                <OrderPostModal
                    state={state}
                    setOpened={setIsModalOpen}
                    buyerCd={buyers.data.buyerCd}
                    onItemsSelected={handleItemsSelected}
                    orderDate={searchParams.orderDate}
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
                <Search size={14} color="#ffffff" />
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

const DateInput = ({ label, id, value, onChange }) => {
    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 'YYYY-MM-DD' 형식으로 가져옵니다.

    return (
        <div className="search-box">
            <span className="search-label">{label}</span>
            <input
                type='date'
                id={id}
                className='orderPostInput'
                value={value}
                onChange={onChange}
                min={today}
            />
        </div>
    );
};

export default ProductSearch;