import React from 'react';
import './OrderItemsModal.css';

const OrderItemsModal = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;

  return (
    <div className="order-item-modal">
      <div className="order-item-modal-content">
        <h3 className="modal-title">주문 아이템 상세</h3>
        <div className='order-item-main'>
          <table className='order-item-table'>
            <thead>
              <tr>
                <th className='order-item-th'>상품명</th>
                <th className='order-item-th'>수량</th>
                <th className='order-item-th'>단가 적용 만료일</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr className='order-item-tr' key={index}>
                  <td className='order-item-td'>{item.itemNm}</td>
                  <td className='order-item-td'>{item.qty} {item.unit}</td>
                  <td className='order-item-td'>{item.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="close-button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default OrderItemsModal;