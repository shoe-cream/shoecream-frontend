import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // 주문 ID 파라미터를 받아오기 위한 훅
import html2pdf from 'html2pdf.js';
import Header from '../../components/header/Header'; 
import Sidebar from '../../components/sidebar/Sidebar';
import '../../App.css'; 
import './OrderDetail.css'; 

const OrderDetail = () => {
    const { orderId } = useParams();  // URL에서 orderId를 받아옴
    const [orderData, setOrderData] = useState(null); // 주문 데이터 상태
    const [isModalOpen, setIsModalOpen] = useState(false);  // 이메일 모달 상태
    const [email, setEmail] = useState("");  // 이메일 입력 상태
    const [isSending, setIsSending] = useState(false);  // 이메일 전송 상태

    // API 요청으로 주문 데이터 받아오기
    useEffect(() => {
        fetch(`http://localhost:8080/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer <Your_Token>',  // 인증이 필요하다면 토큰 추가
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setOrderData(data.data); // API로부터 받은 데이터 저장
        })
        .catch(error => {
            console.error('Error fetching order data:', error);
        });
    }, [orderId]);  // orderId가 변경될 때마다 API 호출

    if (!orderData) {
        return <div>로딩 중...</div>;
    }

    const totalAmount = orderData.orderItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
    const tax = totalAmount * 0.1;

    // PDF 다운로드 함수
    const handleDownloadPDF = () => {
        const element = document.getElementById('quotation-content');
        html2pdf().from(element).save('quotation.pdf');
    };

    // 이메일 모달 열기
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // 이메일 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // 이메일 전송 함수
    const handleSendEmail = () => {
        setIsSending(true); // 전송 중 상태 설정
        const element = document.getElementById('quotation-content');

        // PDF를 Blob 형태로 변환하여 이메일로 전송
        html2pdf().from(element).toPdf().output('blob').then((pdf) => {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("content", "Here is your attached file.");
            formData.append("file", pdf, "quotation.pdf");

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
                setIsSending(false);  // 전송 상태 해제
                handleCloseModal();   // 모달 닫기
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
                            <p><strong>Invoice No.</strong> {orderData.orderCd}</p>
                            <p><strong>견적일</strong> {orderData.createdAt}</p>
                            <p><strong>견적서 만료일</strong> {orderData.requestDate}</p>
                        </div>

                        <h2>주문 상세 내역</h2>
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

            {/* 이메일 모달 */}
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
