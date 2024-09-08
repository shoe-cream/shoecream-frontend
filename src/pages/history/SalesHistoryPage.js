import { useMemo } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTable from '../../components/Table/ReactTable';
import './HistoryPage.css';
import DateRangePicker from '../../components/datepicker/DateRangePicker.js';

const SalesHistoryPage = () => {
    const columnData = [
        {
          accessor: 'pic',
          Header: '담당자',
        },
        {
          accessor: 'order_code',
          Header: '주문 번호',
        },
        {
          accessor: 'order_status',
          Header: '주문 상태',
        },
        {
          accessor: 'created_at',
          Header: '등록일',
        },
        {
          accessor: 'due_date',
          Header: '납기일',
        },
        {
          accessor: 'buyer',
          Header: '고객사 명',
        },
        {
          accessor: 'buyer_code',
          Header: '고객 코드',
        },
        {
          accessor: 'item_name',
          Header: '제품 명',
        },
        {
          accessor: 'quantity',
          Header: '수량',
        },
        {
          accessor: 'unitprice',
          Header: '단가',
        },
        {
          accessor: 'cost',
          Header: '총 금액',
        },
        {
          accessor: 'history_created_at',
          Header: '기록일',
        },
    ]
    
    const columns = useMemo(() => columnData, []);
    
    const data = useMemo(() => [
        {
            "pic": "John Doe",                // 담당자
            "order_code": "ORD123456",        // 주문 번호
            "order_status": "배송 중",        // 주문 상태
            "created_at": "2023-07-15",       // 등록일
            "due_date": "2023-08-01",         // 납기일
            "buyer": "An Giang",              // 고객사 명
            "buyer_code": "BUY001",           // 고객 코드
            "item_name": "Air Max 270",       // 제품 명
            "quantity": 500,                  // 수량
            "unitprice": 150000,              // 단가
            "cost": 75000000,                 // 총 금액
            "history_created_at": "2023-07-16" // 기록일
        },
        {
            "pic": "Jane Smith",              // 담당자
            "order_code": "ORD123457",        // 주문 번호
            "order_status": "배송 완료",      // 주문 상태
            "created_at": "2023-08-02",       // 등록일
            "due_date": "2023-08-15",         // 납기일
            "buyer": "Bing Duong",            // 고객사 명
            "buyer_code": "BUY002",           // 고객 코드
            "item_name": "Ultraboost 22",     // 제품 명
            "quantity": 300,                  // 수량
            "unitprice": 180000,              // 단가
            "cost": 54000000,                 // 총 금액
            "history_created_at": "2023-08-03" // 기록일
        },
        {
            "pic": "Robert Brown",            // 담당자
            "order_code": "ORD123458",        // 주문 번호
            "order_status": "배송 대기",      // 주문 상태
            "created_at": "2023-06-20",       // 등록일
            "due_date": "2023-07-05",         // 납기일
            "buyer": "Ba Ria-Vung Tau",       // 고객사 명
            "buyer_code": "BUY003",           // 고객 코드
            "item_name": "574 Classics",      // 제품 명
            "quantity": 400,                  // 수량
            "unitprice": 130000,              // 단가
            "cost": 52000000,                 // 총 금액
            "history_created_at": "2023-06-21" // 기록일
        }
    ], [])

    const search = () => {
      alert('검색 기능 공사중~')
    }
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                <div className='history-container'>
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
                      <ReactTable columns={columns} data={data}></ReactTable>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SalesHistoryPage;