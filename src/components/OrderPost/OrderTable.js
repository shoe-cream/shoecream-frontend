import React from 'react';
import ReactTable from '../Table/ReactTable';

const OrderTable = ({ data }) => {
    const columns = React.useMemo(
      () => [
        { Header: "선택", accessor: "selection", Cell: () => <input type='checkbox' /> },
        { Header: "고객사", accessor: "customer" },
        { Header: "고객코드", accessor: "customerCode" },
        { Header: "등록일", accessor: "registrationDate" },
        { Header: "납기일", accessor: "deliveryDate" },
        { Header: "제품명", accessor: "productName" },
        { Header: "제품코드", accessor: "productCode" },
        { Header: "제품 단가", accessor: "unitPrice" },
        { Header: "색상", accessor: "color" },
        { Header: "사이즈", accessor: "size" },
        { Header: "수량", accessor: "quantity" },
        { Header: "단위", accessor: "unit" },
        { Header: "금액", accessor: "amount" },
        { Header: "계약 기간", accessor: "contractPeriod" }, // 새 열 추가
      ],
      []
    );

    return <ReactTable columns={columns} data={data} />;
}

export default OrderTable;
