import React from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTableWithCheckbox from '../../components/Table/ReactTableWithCheckbox';
import './CancelledOrdersPage.css';
import DateRangePicker from '../../components/datepicker/DateRangePicker';
import getOrderAllRequest from '../../requests/GetOrders';

const CancelledOrdersPage = () => {
    // 테이블의 열 정의
    const columns = React.useMemo(
        () => [
            { Header: "담당자", accessor: "member" },
            { Header: "주문번호", accessor: "orderId" },
            { Header: "주문상태", accessor: "orderStatus" },
            { Header: "등록일", accessor: "registerDate" },
            { Header: "납기일", accessor: "dueDate" },
            { Header: "고객사 명", accessor: "customerName" },
            { Header: "고객 코드", accessor: "customerCode" },
            { Header: "제품 명", accessor: "productName" },
            { Header: "수량", accessor: "quantity" },
            { Header: "금액", accessor: "price" },
            { Header: "총금액", accessor: "totalPrice" },
        ],
        []
    );

    // 임시 데이터
    const data = React.useMemo(
        () => [
            { selection: false, member: "홍길동", orderId: "12345", orderStatus: "취소됨", registerDate: "2024-09-01", dueDate: "2024-09-15", customerName: "고객사A", customerCode: "C001", productName: "제품A", quantity: 10, price: 50000, totalPrice: 500000 },
            // 추가 데이터...
        ],
        []
    );

    // const [orders, setOrders] = useState([]);
    // const [keyword, setKeyword] = useState('');
    // const [isLoading, setIsLoading] = useState(true);
    // const { state } = useAuth();


    const handleExportToExcel = () => {
        console.log("Export to Excel");
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSearch = () => {
        
        
    };

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='date'>
                        <DateRangePicker></DateRangePicker>
                        <label>주문 번호</label>
                        <input type='text' id='productName'/>
                        <button id='searchProduct' className='search-button'>
                            <img src='/icons/zoom.png' alt='Search' className='search-icon' />
                        </button>
                    </div>
                    <div className='actions-container'>
                        <button className='miscBtn' onClick={handleSearch}>조회</button>
                        <button className='miscBtn' onClick={handleExportToExcel}>엑셀 다운</button>
                        <button className='miscBtn' onClick={handlePrint}>인쇄</button>
                    </div>
                    <h2>취소된 주문</h2>
                    <ReactTableWithCheckbox columns={columns} data={data} />
                </div>
            </div>
        </div>
    );
}

export default CancelledOrdersPage;
