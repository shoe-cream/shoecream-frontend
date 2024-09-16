import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTable from '../../components/Table/ReactTable';
import './HistoryPage.css';
import DateRangePicker from '../../components/datepicker/DateRangePicker.js';
import getOrderAllRequest from '../../requests/GetOrders.js';
import { useAuth } from '../../auth/AuthContext.js';
import sendGetAllBuyersRequest from '../../requests/GetAllBuyersRequest.js';
import sendGetAllItemsRequest from '../../requests/GetAllItemsRequest.js';

const SalesHistoryPage = () => {
  const { state } = useAuth();
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState({ data: [] });
  const [buyers, setBuyers] = useState({ data: [] });
  const [items, setItems] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [buyerCdInput, setBuyerCdInput] = useState('B001');
  const [itemCdInput, setItemCdInput] = useState('AD002')

  useEffect(() => {
    console.log("state: ", state);
    sendGetAllBuyersRequest(state, setBuyers);
    sendGetAllItemsRequest(state, setItems);
    getOrderAllRequest(state, buyerCdInput, itemCdInput, undefined, undefined, undefined, undefined, page, 10, setOrders, setIsLoading);
  }, []);

  const search = () => {
    alert('검색 기능 공사중~')
  }

  const columns = [
    {
      accessor: 'itemNm',
      Header: '상품명',
      type: 'text',
    },
  ]
  return (
    <div>
      <Header></Header>
      <div className='app-container'>
        <Sidebar></Sidebar>
        <div className='app-content-container'>
          <div className='app-background'>
            <h2 className="app-label">판매 기록</h2>
            <div className='condition-container'>
              <DateRangePicker></DateRangePicker>
              <div className='condition-search-box'>
                <div className='condition-search-label'>주문 번호</div>
                <input className='condition-input'></input>
                <div className='condition-search-button'>
                  <img src='icons/zoom.png' onClick={() => search()}></img>
                </div>
              </div>
            </div>
            {isLoading ? <div /> :
              <ReactTable>
                columns = {columns}
              </ReactTable>}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SalesHistoryPage;