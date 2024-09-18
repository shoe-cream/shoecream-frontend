import React, { useState } from 'react';


const MessageModal = ({ isOpen, onClose, onSubmit, title }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(message);
    setMessage('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit}>확인</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;