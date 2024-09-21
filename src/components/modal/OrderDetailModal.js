import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './OrderDetailModal.css';
import EditableTableWithCheckbox from '../Table/EditableTableWithCheckbox';
import sendPatchMultiItemRequest from '../../requests/PatchOrders';
import { useAuth } from '../../auth/AuthContext';
import Swal from 'sweetalert2';
import { FileDown, Printer, FileText, Edit, Check, XCircle, RotateCcw } from 'lucide-react';

const OrderDetailModal = ({ isOpen, onClose, order, status, fetchOrders }) => {
    const { state } = useAuth();
    const [originalData, setOriginalData] = useState({ data: [] });
    const [modifiedData, setModifiedData] = useState({ data: [] });
    const [checkedItems, setCheckedItems] = useState([]);
    const [edited, setEdited] = useState([]);



    const handlePatchOrder = () => {
        const ordersPatch = modifiedData.data.filter((item, index) => {
            const originalItem = originalData.data[index];
            return checkedItems.includes(index) && (
                item.unitPrice !== originalItem.unitPrice ||
                item.qty !== originalItem.qty ||
                item.startDate !== originalItem.startDate ||
                item.endDate !== originalItem.endDate
            );
        });

        if (ordersPatch.length === 0) {
            Swal.fire({
                title: '알림',
                text: '수정할 항목이 없습니다.',
                icon: 'info',
                confirmButtonText: '확인'
            });
            return;
        }

        const itemsToSend = ordersPatch.map(item => ({
            orderId: item.orderId,
            itemId: item.itemId,
            unitPrice: item.unitPrice,
            qty: item.qty,
            startDate: item.startDate,
            endDate: item.endDate
        }));

        sendPatchMultiItemRequest(state, itemsToSend, () => {
            setCheckedItems([]);
            onClose();
            fetchOrders();
            Swal.fire({
                title: '성공',
                text: '주문이 성공적으로 수정되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'
            });
        });
    };


    const transOrderData = (orderData) => {
        if (!orderData || !orderData.orderItems || !Array.isArray(orderData.orderItems)) {
            console.log("Invalid order data structure:", orderData);
            return [];
        }

        return orderData.orderItems.map(item => ({
            employeeId: orderData.employeeId,
            orderId: orderData.orderId,
            orderCd: orderData.orderCd,
            status: orderData.status,
            createdAt: orderData.createdAt,
            requestDate: orderData.requestDate,
            createdAtV2: orderData.createdAt ? orderData.createdAt.split('T')[0] : '',
            requestDateV2: orderData.requestDate ? orderData.requestDate.split('T')[0] : '',
            buyerNm: orderData.buyerNm,
            buyerCd: orderData.buyerCd,
            itemId: item.orderItemId,
            itemCd: item.itemCd,
            itemNm: item.itemNm,
            qty: item.qty,
            unitPrice: item.unitPrice,
            startDate: item.startDate,
            endDate: item.endDate,
            startDateV2: item.startDate ? item.startDate.split('T')[0] : '',
            endDateV2: item.endDate ? item.endDate.split('T')[0] : ''
        }));
    };

    useEffect(() => {
        if (order) {
            console.log("Original order:", order);
            const transformed = transOrderData(order);
            console.log("Transformed data:", transformed);
            setOriginalData({ data: transformed });
            setModifiedData({ data: transformed });
        }
    }, [order]);

    const columns = useMemo(() => {
        const commonColumns = [
            { Header: "담당자", accessor: "employeeId" },
            { Header: "주문코드", accessor: "orderCd" },
            { Header: "주문상태", accessor: "status" },
            { Header: "등록일", accessor: "createdAtV2" },
            { Header: "납기일", accessor: "requestDateV2" },
            { Header: "고객사 명", accessor: "buyerNm" },
            { Header: "고객 코드", accessor: "buyerCd" },
            { Header: "제품 코드", accessor: "itemCd" },
            {
                Header: '제품 단가 시작일',
                accessor: 'startDateV2'
            },
            {
                Header: '제품 단가 만료일',
                accessor: 'endDateV2'
            }
        ];

        // 조건부로 컬럼 추가
        if (status === 'REQUEST_TEMP' || status === 'REJECTED') {
            commonColumns.splice(7, 0, { Header: "수량", accessor: "qty", type: "number" });
            commonColumns.splice(8, 0, { Header: "제품 단가", accessor: "unitPrice", type: "number" });
        } else {
            commonColumns.splice(7, 0, { Header: "수량", accessor: "qty" });
            commonColumns.splice(8, 0, { Header: "제품 단가", accessor: "unitPrice" });
        }
        return commonColumns;
    }, [status]);

    if (!isOpen) return null;

    return (
        <div className="order-detail-modal">
            <div className="order-detail-modal-content">
                <EditableTableWithCheckbox
                    columns={columns}
                    ogData={originalData}
                    data={modifiedData}
                    setData={setModifiedData}
                    checked={checkedItems}
                    setChecked={setCheckedItems}
                    edited={edited}
                    setEdited={setEdited}
                // onCheckboxChange={handleCheckboxChange}
                // onRowClick={handleRowClick}
                /><div className ='modalActionBtn' style={{display : 'flex'}}>
                    {status === 'REQUEST_TEMP' || status === 'REJECTED' ?
                        <button className='btn btn-secondary' onClick={handlePatchOrder}>
                            <Edit className="btn-icon" size={14} /> 수정
                        </button>
                        : <div></div>
                    }
                    <button className='btn btn-secondary' onClick={onClose}>
                        <XCircle className='"btn-icon' size={14} /> 닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;