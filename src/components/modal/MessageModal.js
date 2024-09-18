import React, { useState } from 'react';
import './MessageModal.css';

const MessageModal = ({ isOpen, onClose, onSubmit, title, type }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(message);
    setMessage('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="modal-textarea"
        />
        <div className="modal-buttons">
          <button className={`action-button ${type}-button`} onClick={handleSubmit}>
            {type === 'approve' ? '승인' : '반려'}
          </button>
          <button className="cancel-button" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;