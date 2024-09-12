import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import getBuyerRequest from '../../requests/GetBuyerRequest';
import { useAuth } from '../../auth/AuthContext';
import getBuyerWithItemsRequest from '../../requests/GetBuyerItems';
import getItemRequest from '../../requests/GetItemRequest';
import OrderPostModal from '../modal/OrderPostModal';

const ProductSearch = ({ onAddOrder, registrationDate }) => {
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
    const [dateRange, setDateRange] = useState([null, null]);
    const [buyers, setBuyers] = useState({ data: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const { state } = useAuth();
    const [startDate, endDate] = dateRange;
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
        if (selectedIndex > 0) { // 첫 번째 옵션은 빈 값이므로 0보다 큰 인덱스에서 데이터 가져오기
            const selectedItem = buyers.data.buyerItems[selectedIndex - 1];
            setBuyerItemUnitPrice(selectedItem.unitPrice);

            getItemRequest(state, itemCd, setFindItem, setIsLoading);
        } else {
            setBuyerItemUnitPrice('');
        }
    };


    const handleFetch = () => {
        const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : '';
        const contractPeriod = formattedStartDate && formattedEndDate
            ? `${formattedStartDate} ~ ${formattedEndDate}`
            : '';

        console.log('Fetching with contractPeriod:', contractPeriod);

        onAddOrder({
            ...searchParams,
            buyerNm: buyers.data.buyerNm || '',
            tel: buyers.data.tel || '',
            registrationDate,
            deliveryDate: '',
            contractPeriod,
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

        // 날짜 범위 초기화
        setDateRange([null, null]);
    };

    const handleBuyerSearch = () => {
        getBuyerWithItemsRequest(state, searchParams.buyerCd, setBuyers, setIsLoading);
    };

    // 컴포넌트들
    const DateRangePicker = () => (
        <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable
            dateFormat="yyyy/MM/dd"
            placeholderText="기간 선택"
        />
    );

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleItemsSelected = (items) => {
        setSelectedItems(items);
        handleFetch(items);
    };
    


    return (
        <div className='product-search'>
            <table>
                <tbody>
                    <tr>
                        <td className='title special-cell'>고객코드</td>
                        <td>
                            <div className='divSearch'>
                                <input
                                    type='text'
                                    id='buyerCd'
                                    className='orderPostInput'
                                    value={searchParams.buyerCd}
                                    onChange={handleChange}
                                />
                                <button
                                    id='searchBuyer'
                                    className='search-button'
                                    onClick={handleBuyerSearch}
                                >
                                    <img src='/icons/zoom.png' alt='Search' className='search-icon' />
                                </button>
                            </div>
                        </td>
                        <td className='title special-cell'>제품코드</td>
                        <td>
                            <div className='divSearch'>
                                {
                                    isLoading ? <input className='orderPostInput' value={''}></input> :
                                        <select
                                            className='buyerItemDropDown'
                                            value={selectedItemCd}
                                            onChange={handleSelectChange}
                                        >
                                            <option value="">Select an item</option>
                                            {buyers.data.buyerItems.map((value, index) => (
                                                <option key={index} value={value.itemCd}>{value.itemCd}</option>
                                            ))}
                                        </select>
                                }
                            </div>
                        </td>
                        <td className='title special-cell'>사이즈</td>
                        <td><input type='text' id='size' className='orderPostInput' value={findItem ? findItem.data.size : ''} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className='title special-cell'>계약 기간</td>
                        <td className='order-date'><DateRangePicker /></td>
                        <td className='title special-cell'>제품명</td>
                        <td><input type='text' id='itemNm' className='orderPostInput' value={findItem ? findItem.data.itemNm : ''} onChange={handleChange} /></td>
                        <td className='title special-cell'>재고량</td>
                        <td><input type='text' id='qty' className='orderPostInput' value={searchParams.qty} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className='title special-cell'>고객사</td>
                        <td><input type='text' id='buyerNm' className='orderPostInput' value={buyers.data.buyerNm} onChange={handleChange} /></td>
                        <td className='title special-cell'>품목</td>
                        <td><input type='text' id='category' className='orderPostInput' value={findItem ? findItem.data.category : ''} onChange={handleChange} /></td>
                        <td className='title special-cell'>제품 단가</td>
                        <td><input type='text' id='unitPrice' className='orderPostInput' value={buyerItemUnitPrice ? buyerItemUnitPrice : ''} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <td className='title special-cell'>고객사 연락처</td>
                        <td><input type='text' id='tel' className='orderPostInput' value={buyers.data.tel} onChange={handleChange} /></td>
                        <td className='title special-cell'>색상</td>
                        <td><input type='text' id='color' className='orderPostInput' value={findItem ? findItem.data.color : ''} onChange={handleChange} /></td>
                        <td className='title special-cell'>수량 단위</td>
                        <td><input type='text' id='unit' className='orderPostInput' value={findItem ? findItem.data.unit : ''} onChange={handleChange} /></td>
                    </tr>
                </tbody>
            </table>

            <div className='button-container'>
                <button onClick={handleOpenModal} className="add-items-button">주문 아이템 추가</button>
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
