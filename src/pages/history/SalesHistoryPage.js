import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import './HistoryPage.css';
import DateRangePicker from '../../components/datepicker/DateRangePicker.js';
import getOrderAllRequest from '../../requests/GetOrders.js';
import { useAuth } from '../../auth/AuthContext.js';
import sendGetAllBuyersRequest from '../../requests/GetAllBuyersRequest.js';
import sendGetAllItemsRequest from '../../requests/GetAllItemsRequest.js';
import ClickableTable from '../../components/Table/ClickableTable.js';

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
    getOrderAllRequest(state, [buyerCdInput, itemCdInput], page, 10, setOrders, setIsLoading);
  }, []);

  const search = () => {
    alert('검색 기능 공사중~')
  }

  const columns = [
    {
      accessor: 'orderCd',
      Header: '주문코드',
    },
    {
      accessor: 'buyerCd',
      Header: '고객사 코드',
    },
    {
      accessor: 'buyerNm',
      Header: '고객사 명',
    },
    {
      accessor: 'orderItems',
      Header: '상품명',
      /* type: 'arrayCell', */
    },
    {
      accessor: 'employeeId',
      Header: '영업사원번호',
    },    
    {
      accessor: 'createdAt',
      Header: '등록일',
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
              <ClickableTable 
              columns = {columns} data = {orders.data} onRowClick={(value) => console.log('value: ', value)}> 
              </ClickableTable>}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SalesHistoryPage;