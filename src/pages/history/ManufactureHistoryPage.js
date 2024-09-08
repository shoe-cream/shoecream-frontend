import { useTable } from 'react-table';
import { useMemo } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTable from '../../components/Table/ReactTable';

const ManufactureHistoryPage = () => {
    const columnData = [
        {
          accessor: 'email',
          Header: 'Email',
        },
        {
          accessor: 'walletID',
          Header: 'Wallet ID',
        },
        {
          accessor: 'coin_list',
          Header: 'Wallet Balance',
        },
        {
          accessor: 'created_at',
          Header: 'Created At',
        },
        {
          accessor: 'edited_at',
          Header: 'Edited At',
        },
    ]
    
    const columns = useMemo(() => columnData, []);
    
    const data = useMemo(() => [{
        "email": "이메일이에용",
        "walletID": "아이디에용",
        "created_at": "2021-08-03 01:14:47",
        "edited_at": "2021-08-03 01:15:49",
        "coin_list": ["TRV", "BTC", "BCH", "ETH"]
    }], [])

    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div>제품 공급 내역 페이지~</div>
                    <ReactTable columns={columns} data={data}></ReactTable>
                </div>
            </div>
        </div>
    );
}
export default ManufactureHistoryPage;