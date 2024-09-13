import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import Header from '../../components/header/Header'; 
import Sidebar from '../../components/sidebar/Sidebar';
import '../../App.css'; // 공통 스타일 적용
import './OrderDetail.css'; // OrderDetail 전용 스타일 적용

const OrderDetail = () => {
    const [orderData, setOrderData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 상태 관리
    const [email, setEmail] = useState("");  // 입력받은 이메일 상태
    const [isSending, setIsSending] = useState(false); // 이메일 전송 상태

    useEffect(() => {
        // 임시 데이터 설정
        const tempData = {
            orderId: 1,
            createdAt: '2024-09-12 16:22:48.745814',
            orderCd: 'SHO97D1A00F1BE3',
            orderStatus: 'REQUEST_TEMP',
            requestDate: '2024-09-10 10:00:00',
            buyerId: 1,
            memberId: 1,
            orderItems: [
                { orderItemId: 1, itemCd: '이광희', quantity: 10, unitPrice: 100.50 },
                { orderItemId: 2, itemCd: '안경 돌려줘', quantity: 5, unitPrice: 200.00 }
            ]
        };
        setOrderData(tempData);
    }, []);

    if (!orderData) {
        return <div>로딩 중...</div>;
    }

    const totalAmount = orderData.orderItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
    const tax = totalAmount * 0.1;

    const handleDownloadPDF = () => {
        const element = document.getElementById('quotation-content');
        html2pdf().from(element).save('quotation.pdf');
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSendEmail = () => {
        setIsSending(true); // 전송 상태 변경
        const element = document.getElementById('quotation-content');

        // PDF를 Blob 형태로 변환
        html2pdf().from(element).toPdf().outputPdf().then((pdf) => {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("content", "Here is your attached file.");
            formData.append("file", new Blob([pdf], { type: "application/pdf" }), "quotation.pdf");

            fetch('http://localhost:8080/email/send', {
                method: 'POST',
                body: formData,
            })
            .then((response) => {
                if (response.ok) {
                    alert("메일이 전송되었습니다.");
                } else {
                    alert("메일 전송에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error("메일 전송 오류:", error);
                alert("메일 전송 중 오류가 발생했습니다.");
            })
            .finally(() => {
                setIsSending(false); // 전송 상태 해제
                handleCloseModal(); // 모달 닫기
            });
        });
    };

    return (
        <div>
            <Header />
            <div className='app-container'>
                <Sidebar />
                <div className='app-content-container'>
                    <div className='quotation-content' id='quotation-content'>
                        <h1>견적서</h1>
                        <div className='quotation-info'>
                            <p><strong>Invoice No.</strong> #002121</p>
                            <p><strong>견적일</strong> 2024-09-04</p>
                            <p><strong>견적서 만료일</strong> 2024-09-11</p>
                        </div>

                        <h2>주문 상세 내역</h2>
                        {orderData ? (
                            <table className='order-table'>
                                <thead>
                                    <tr>
                                        <th>제품 코드</th>
                                        <th>수량</th>
                                        <th>단가</th>
                                        <th>총액</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderData.orderItems.map(item => (
                                        <tr key={item.orderItemId}>
                                            <td>{item.itemCd}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.unitPrice.toFixed(2)}</td>
                                            <td>{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>로딩 중...</p>
                        )}

                        <div className='quotation-total'>
                            <p><strong>소계</strong>: ${totalAmount.toFixed(2)}</p>
                            <p><strong>세금</strong>: ${tax.toFixed(2)}</p>
                            <p><strong>총합계</strong>: ${(totalAmount + tax).toFixed(2)}</p>
                        </div>
                    </div>
                    <div className='button-container'>
                        <button onClick={handleDownloadPDF}>PDF 다운로드</button>
                        <button onClick={handleOpenModal}>메일로 보내기</button>
                    </div>
                </div>
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>이메일 보내기</h2>
                        <label>
                            이메일 주소:
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일을 입력하세요"
                            />
                        </label>
                        <div className="modal-buttons">
                            <button onClick={handleSendEmail} disabled={isSending}>
                                {isSending ? "전송 중..." : "전송"}
                            </button>
                            <button onClick={handleCloseModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;
