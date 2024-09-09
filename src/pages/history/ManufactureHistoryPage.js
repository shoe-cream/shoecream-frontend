import { useTable } from 'react-table';
import { useMemo } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTable from '../../components/Table/ReactTable';
import './HistoryPage.css';
import DateRangePicker from '../../components/datepicker/DateRangePicker.js';
import { columnData, data } from '../../data/ManufactureHistoryData.js';

const ManufactureHistoryPage = () => {
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
                      <ReactTable columns={columnData} data={data}></ReactTable>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ManufactureHistoryPage;