import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import './HistoryPage.css';
import DateRangePicker from '../../components/datepicker/DateRangePicker.js';
import getOrderAllRequest from '../../requests/GetOrders.js';
import { useAuth } from '../../auth/AuthContext.js';
import sendGetAllBuyersRequest from '../../requests/GetAllBuyersRequest.js';
import sendGetAllItemsRequest from '../../requests/GetAllItemsRequest.js';
import ClickableTable from '../../components/Table/ClickableTable.js';
import Swal from 'sweetalert2';
import sendGetSaleHistoryRequest from '../../requests/GetSaleHistoryRequest.js';
import TableModal from '../../components/modal/TableModal.js';

const SalesHistoryPage = () => {
  const { state } = useAuth();
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState({ data: [] });
  const [buyers, setBuyers] = useState({ data: [] });
  const [items, setItems] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [buyerCdInput, setBuyerCdInput] = useState('B001');
  const [itemCdInput, setItemCdInput] = useState('AD002');
  const [historyData, setHistoryData] = useState({ data: [] });
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

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
  const historyColumns = [
    { accessor: 'orderCd', Header: '주문코드', },
    { accessor: 'buyerCd', Header: '고객사 코드', },
    { accessor: 'buyerNm', Header: '고객사 명', },
    { accessor: 'saleHistoryItems', Header: '품목', },
    { accessor: 'employeeId', Header: '영업사원번호', },
    { accessor: 'createdAt', Header: '등록일', },
  ]

  const handleRowClick = useCallback((value) => {
    sendGetSaleHistoryRequest(
      {
        state: state,
        rowData: value,
        page: 1,
        size: 10,
        setData: setHistoryData,
        setIsModalOpen: setIsHistoryModalOpen,
      }
    );
    setIsHistoryModalOpen(true);
  }, [state, setHistoryData, setIsHistoryModalOpen]);

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
                columns={columns}
                data={orders.data}
                onRowClick={handleRowClick}>
              </ClickableTable>}
          </div>
          {isHistoryModalOpen ? <TableModal setOpened={setIsHistoryModalOpen} columnData={historyColumns} data={historyData}
          ></TableModal> : <div />}
        </div>
      </div>
    </div>
  );
}
export default SalesHistoryPage;