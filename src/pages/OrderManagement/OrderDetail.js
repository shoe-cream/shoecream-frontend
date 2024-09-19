import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  
import html2pdf from 'html2pdf.js';
import Header from '../../components/header/Header'; 
import Sidebar from '../../components/sidebar/Sidebar';
import '../../App.css'; 
import './OrderDetail.css'; 
import { useLocation } from 'react-router-dom';

const OrderDetail = () => {
    const { orderCd } = useParams();  
    const [orderData, setOrderData] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [email, setEmail] = useState(""); 
    const [isSending, setIsSending] = useState(false); 
    const location = useLocation(); // navigate로부터 넘겨받은 state 접근
    const token = location.state?.token;

    // API 요청으로 주문 데이터 받아오기
    useEffect(() => {
        console.log('Token:', token); 
        if (!token) {
            console.error('토큰이 없습니다');
            return;
        }

        fetch(`http://localhost:8080/orders/${orderCd}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}` // 토큰을 Authorization 헤더로 전달
            }
        })
        .then(response => response.json())
        .then(data => {
            setOrderData(data.data); 
        })
        .catch(error => {
            console.error('Error fetching order data:', error);
        });
    }, [orderCd, token]);   

    if (!orderData) {
        return <div>로딩 중...</div>;
    }

    const totalAmount = orderData.orderItems.reduce((total, item) => {
        const quantity = item.qty || 0; 
        const unitPrice = item.unitPrice || 0; 
        return total + quantity * unitPrice;
    }, 0); 
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
        setIsSending(true); 
        const element = document.getElementById('quotation-content');
    
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
                setIsSending(false);  
                handleCloseModal();  
            });
        });
    };

   
    const handlePrint = () => {
        const printContent = document.getElementById('quotation-content').innerHTML;
        const originalContent = document.body.innerHTML;

        
        document.body.innerHTML = printContent;

        
        window.print();


        document.body.innerHTML = originalContent;
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
                                {orderData.orderItems.map((item, index) => (
                                    <tr key={item.orderItemCd || index}> 
                                        <td>{item.itemCd}</td>
                                        <td>{item.qty || 0}</td>
                                        <td>{item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'}</td>
                                        <td>{(item.qty * item.unitPrice || 0).toFixed(2)}</td>
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
                        <button onClick={handlePrint}>인쇄</button> 
                        <button onClick={handleOpenModal}>메일로 보내기</button>
                    </div>
                </div>
            </div>

        
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
