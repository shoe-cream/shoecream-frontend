import React from 'react';
import './OrderItemsModal.css';

const OrderItemsModal = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;

  console.log("itemsssss", items)

  return (
    <div className="order-item-modal">
      <div className="order-item-modal-content">
        <h3>주문 아이템 상세</h3>
        <div className='order-item-main' style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table className='order-item-table' style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead className='order-item-thead'>
              <tr className='order-item-tr'>
                <th className = 'order-item-th' style={{ border: '1px solid #ddd', padding: '8px' }}>상품명</th>
                <th className = 'order-item-th' style={{ border: '1px solid #ddd', padding: '8px' }}>수량</th>
                <th className = 'order-item-th' style={{ border: '1px solid #ddd', padding: '8px' }}>단가 적용 만료일</th>
                <th className = 'order-item-th' style={{ border: '1px solid #ddd', padding: '8px' }}>마진율</th>
                <th className = 'order-item-th' style={{ border: '1px solid #ddd', padding: '8px' }}>제품 주문별 금액</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr className='order-item-tr' key={index}>
                  <td className='order-item-td'>{item.itemNm}</td>
                  <td className='order-item-td'>{item.qty} {item.unit}</td>
                  <td className='order-item-td'>{item.endDate}</td>
                  <td className='order-item-td'>{item.margin}</td>
                  <td className='order-item-td'>{(item.qty * item.unitPrice).toLocaleString()} $</td>
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