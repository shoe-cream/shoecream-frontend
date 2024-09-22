import React, { useState, useEffect } from 'react';
import './Modal.css';
import './PostModal.css';
import EditableTableWithCheckbox from '../../components/Table/EditableTableWithCheckbox';
import getBuyerItemsPeriodRequest from '../../requests/GetBuyerItemsPeriod';
import getItemRequest from '../../requests/GetItemRequest';
import Swal from 'sweetalert2';

const OrderPostModal = ({ state, setOpened, buyerCd, onItemsSelected, orderDate }) => {
    const [buyerItems, setBuyerItems] = useState({ data: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [checked, setChecked] = useState([]);
    const [edited, setEdited] = useState([]); // 이 상태는 수정된 데이터를 저장합니다.
    const [itemsDetails, setItemsDetails] = useState({});
    const [originalData, setOriginalData] = useState([]); // 원본 데이터를 저장합니다.
    const [itemsWithDetails, setItemsWithDetails] = useState({ data: [] });
    const [page, setPage] = useState(1);
    const [masterItem, setMasterItem] = useState({});

    useEffect(() => {
        const fetchBuyerItems = async () => {
            try {
                await getBuyerItemsPeriodRequest(state, buyerCd, orderDate, setBuyerItems, page, 10, setIsLoading);
            } catch (error) {
                console.error("Failed to fetch buyer items:", error);
                Swal.fire({ text: '고객 아이템을 가져오는데 실패했습니다.' });
            }
        };
        fetchBuyerItems();
    }, [state, buyerCd, page]);

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
    
        if (!isLoading && buyerItems.data.length > 0) {
            fetchItemDetails();
        }
    }, [buyerItems, state, isLoading]);

    useEffect(() => {
        if (buyerItems.data.length > 0 && Object.keys(itemsDetails).length > 0) {
            const combinedItems = buyerItems.data.map(item => {
                const originalItem = {
                    itemCd: item.itemCd,
                    itemNm: item.itemNm,
                    color: itemsDetails[item.itemCd]?.data.color || '',
                    size: itemsDetails[item.itemCd]?.data.size || '',
                    unitPrice: item.unitPrice,
                    masterUnitPrice : itemsDetails[item.itemCd]?.data.unitPrice,
                    unit: item.unit,
                    quantity: 0,
                    prepareOrder: itemsDetails[item.itemCd]?.data.prepareOrder,
                    totalStock: itemsDetails[item.itemCd]?.data.totalStock || '',
                    startDate: item.startDate.split('T')[0],
                    endDate: item.endDate.split('T')[0],
                    margin: Math.round((item.unitPrice -  itemsDetails[item.itemCd]?.data.unitPrice) /  itemsDetails[item.itemCd]?.data.unitPrice * 100)
                };
                return originalItem;
            });
            if (originalData.length === 0) { // 원본 데이터가 비어 있을 때만 설정
                setOriginalData(combinedItems); // 원본 데이터를 설정합니다.
            }
            setItemsWithDetails({ data: combinedItems }); // 데이터 테이블에 표시할 데이터를 설정합니다.
        }
    }, [buyerItems, itemsDetails]);
    
    useEffect(() => {
        if (itemsWithDetails.data.length > 0 && originalData.length > 0) {
            const updatedItems = itemsWithDetails.data.map(item => {
                const originalItem = originalData.find(orig => orig.itemCd === item.itemCd);
                console.log("asdasd", originalItem)
                if (originalItem.margin) {
                    const margin = originalItem.unitPrice > 0
                        ? ((item.unitPrice - originalItem.masterUnitPrice) / originalItem.masterUnitPrice) * 100 // 마진율 계산
                        : 0;
                    const roundedMargin = Math.round(margin * 100) / 100;
                    return {
                        ...item,
                        margin: roundedMargin // 마진계산
                    };
                }
                return item;
            });
    
            // 데이터가 실제로 변경되었을 때만 상태를 업데이트합니다.
            if (JSON.stringify(updatedItems) !== JSON.stringify(itemsWithDetails.data)) {
                setItemsWithDetails({ data: updatedItems });
            }
        }
    }, [itemsWithDetails.data, originalData]);
    

    const columnData = [
        { Header: "제품코드", accessor: "itemCd" },
        { Header: "제품명", accessor: "itemNm" },
        { Header: "색상", accessor: "color" },
        { Header: "사이즈", accessor: "size" },
        { Header: "단가", accessor: "unitPrice", type: "number" },
        { Header: "수량", accessor: "quantity", type: "number" },
        { Header: "단위", accessor: "unit" },
        { Header: "발주 대기", accessor: "prepareOrder" },
        { Header: "재고량", accessor: "totalStock" },
        { Header: "시작일", accessor: "startDate" },
        { Header: "종료일", accessor: "endDate"},
        { Header: "마진율 (%)", accessor: "margin"}
    ];

    const handleSubmit = () => {
        if (checked.length === 0) {
            Swal.fire({ text: '아이템을 선택하세요.' });
            return;
        }

        const selectedItems = checked.map(index => itemsWithDetails.data[index]);
        const itemWithZeroQuantity = selectedItems.find(item => item.quantity === 0 || item.quantity === '0');

        if (itemWithZeroQuantity) {
            Swal.fire({ text: '체크된 아이템의 수량을 입력해주세요.' });
            return;
        }

        // quantity가 totalStock보다 클 경우 경고를 표시
        const itemWithExcessQuantity = selectedItems.find(item => Number(item.quantity) > Number(item.totalStock));
        if (itemWithExcessQuantity) {
            Swal.fire({ text: `수량이 재고량을 초과했습니다. (제품: ${itemWithExcessQuantity.itemNm})` });
            return;
        }

        const formattedItems = selectedItems.map(item => ({
            ...item,
            contractPeriod: `${item.startDate || ''} ~ ${item.endDate || ''}`
        }));

        onItemsSelected(formattedItems);
        setOpened(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="modal-background">
            <div className='modal-container'>
                <EditableTableWithCheckbox
                    columns={columnData}
                    ogData={{ data: originalData }} // 원본 데이터를 설정합니다.
                    data={itemsWithDetails}
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
