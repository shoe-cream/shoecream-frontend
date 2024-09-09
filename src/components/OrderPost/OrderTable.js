import React from 'react';
import ReactTableWithCheckbox from '../Table/ReactTableWithCheckbox';

const OrderTable = ({ data }) => {
    const columns = React.useMemo(
      () => [
        { Header: "고객사", accessor: "buyerNm" },
        { Header: "고객코드", accessor: "buyerCd" },
        { Header: "등록일", accessor: "registrationDate" },
        { Header: "납기일", accessor: "deliveryDate" ,Cell: () => <input type='date' />},
        { Header: "제품명", accessor: "itemNm" },
        { Header: "제품코드", accessor: "itemCd" },
        { Header: "제품 단가", accessor: "unitPrice" },
        { Header: "색상", accessor: "color" },
        { Header: "사이즈", accessor: "size" },
        { Header: "수량", accessor: "qty" },
        { Header: "단위", accessor: "unit" },
        { Header: "금액", accessor: "quantity" },
        { Header: "계약 기간", accessor: "contractPeriod" }, // 새 열 추가
      ],
      []
    );

    return <ReactTableWithCheckbox columns={columns} data={data} />;
}

export default OrderTable;