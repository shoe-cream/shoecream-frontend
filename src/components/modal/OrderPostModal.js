import React, { useState, useEffect } from 'react';
import './Modal.css';
import './PostModal.css';
import EditableTableWithCheckboxYoung from '../Table/EditableTableWithCheckboxYoung';
import getBuyerJoinItemsRequest from '../../requests/GetBuyerJoinItems';
import getItemRequest from '../../requests/GetItemRequest'; // getItemRequest를 import합니다.
import Swal from 'sweetalert2';

const OrderPostModal = ({ state, setOpened, buyerCd, onItemsSelected }) => {
    const [buyerItems, setBuyerItems] = useState({ data: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [checked, setChecked] = useState([]);
    const [edited, setEdited] = useState([]);
    const [itemsDetails, setItemsDetails] = useState({});
    const [itemsWithDetails, setItemsWithDetails] = useState([]);

    useEffect(() => {
        const fetchBuyerItems = async () => {
            try {
                await getBuyerJoinItemsRequest(state, buyerCd, setBuyerItems, 1, 10, setIsLoading); // 페이지와 사이즈 지정
            } catch (error) {
                console.error("Failed to fetch buyer items:", error);
                Swal.fire({ text: '고객 아이템을 가져오는데 실패했습니다.' });
            }
        };
        fetchBuyerItems();
    }, [state, buyerCd]);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const details = {};
                for (const item of buyerItems.data) {
                    if (!details[item.itemCd]) {
                        await getItemRequest(state, item.itemCd, (data) => {
                            details[item.itemCd] = data;
                        }, setIsLoading);
                    }
                }
                setItemsDetails(details);
            } catch (error) {
                console.error("Failed to fetch item details:", error);
                Swal.fire({ text: '아이템 세부정보를 가져오는데 실패했습니다.' });
            }
        };

        if (!isLoading) {
            fetchItemDetails();
        }
    }, [buyerItems, state, isLoading]);

    useEffect(() => {
        if (buyerItems.data.length > 0 && Object.keys(itemsDetails).length > 0) {
            const combinedItems = buyerItems.data.map(item => ({
                itemCd: item.itemCd,
                itemNm: item.itemNm,
                color: itemsDetails[item.itemCd]?.data.color || '',
                size: itemsDetails[item.itemCd]?.data.size || '',
                unitPrice: item.unitPrice,
                unit: item.unit,
                quantity: 0 // 초기값 설정
            }));
            setItemsWithDetails(combinedItems);
        }
    }, [buyerItems, itemsDetails]);

    const columnData = [
        { Header: "제품코드", accessor: "itemCd" },
        { Header: "제품명", accessor: "itemNm" },
        { Header: "색상", accessor: "color" },
        { Header: "사이즈", accessor: "size" },
        { Header: "단가", accessor: "unitPrice" },
        { Header: "수량", accessor: "quantity", editable: true },
        { Header: "단위", accessor: "unit" }
    ];

    const handleSubmit = () => {
        const selectedItems = checked.map(index => itemsWithDetails[index]);
        onItemsSelected(selectedItems);
        setOpened(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="modal-background">
            <div className='modal-container'>
                <EditableTableWithCheckboxYoung
                    columns={columnData}
                    ogData={{ data: itemsWithDetails }}
                    data={{ data: itemsWithDetails }}
                    setData={setItemsWithDetails}
                    checked={checked}
                    setChecked={setChecked}
                    edited={edited}
                    setEdited={setEdited}
                />
                <div className='modal-footer'>
                    <button onClick={handleSubmit} className="modal-submit-btn">확인</button>
                    <button onClick={() => setOpened(false)} className="modal-close-btn">취소</button>
                </div>
            </div>
        </div>
    );
};

export default OrderPostModal;
