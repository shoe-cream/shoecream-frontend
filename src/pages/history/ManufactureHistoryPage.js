import { useTable } from 'react-table';
import { useMemo } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTable from '../../components/Table/ReactTable';
import './HistoryPage.css';
import DateRangePicker from '../../components/datepicker/DateRangePicker.js';

const ManufactureHistoryPage = () => {
    const columnData = [
        {
          accessor: 'created_at',
          Header: '등록일',
        },
        {
          accessor: 'manufacturer',
          Header: '공급사',
        },
        {
          accessor: 'item_name',
          Header: '제품명',
        },
        {
          accessor: 'item_code',
          Header: '제품코드',
        },
        {
          accessor: 'category',
          Header: '분류',
        },
        {
          accessor: 'quantity',
          Header: '공급량',
        },
        {
          accessor: 'size',
          Header: '사이즈',
        },
        {
          accessor: 'color',
          Header: '색상',
        },
        {
          accessor: 'unitprice',
          Header: '공급가',
        },
    ]
    
    const columns = useMemo(() => columnData, []);
    
    const data = useMemo(() => [
      {
        "created_at": "2023-07-15",      // 등록일
        "manufacturer": "An Giang",          // 공급사
        "item_name": "Air Max 270",      // 제품명
        "item_code": "NK270AM",          // 제품코드
        "category": "운동화",             // 분류
        "quantity": 500,                 // 공급량
        "size": "42",                    // 사이즈
        "color": "블랙",                 // 색상
        "unitprice": 150000              // 공급가
    },
    {
        "created_at": "2023-08-02",      // 등록일
        "manufacturer": "Bing Duong",        // 공급사
        "item_name": "Ultraboost 22",    // 제품명
        "item_code": "ADUB22",           // 제품코드
        "category": "운동화",             // 분류
        "quantity": 300,                 // 공급량
        "size": "44",                    // 사이즈
        "color": "화이트",               // 색상
        "unitprice": 180000              // 공급가
    },
    {
        "created_at": "2023-06-20",      // 등록일
        "manufacturer": "Ba Ria-Vung Tau",   // 공급사
        "item_name": "574 Classics",     // 제품명
        "item_code": "NB574CL",          // 제품코드
        "category": "운동화",             // 분류
        "quantity": 400,                 // 공급량
        "size": "43",                    // 사이즈
        "color": "그레이",               // 색상
        "unitprice": 130000              // 공급가
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
                    <div className='app-background'>
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
export default ManufactureHistoryPage;