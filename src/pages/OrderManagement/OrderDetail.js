import axios from 'axios'; // axios import 추가
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import styled from 'styled-components';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from "../../components/header/Header";

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmailInput = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #2b538b;
  }
`;

const SendButton = styled.button`
  padding: 10px;
  background-color: #2b538b;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1e3a62;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const AppContainer = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  font-size: 14px;
`;

const QuotationCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

const QuotationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const Logo = styled.img`
  max-width: 150px;  
  height: auto;    
`;


const InfoSection = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`;

const InfoColumn = styled.div`
  flex: 1;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  background-color: #f3f4f6;
  padding: 8px;
  text-align: left;
  font-weight: bold;
  font-size:18px;
  white-space: nowrap;
`;

const TableCell = styled.td`
  padding: 8px;
  font-size: 16px;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
`;

const SummaryTable = styled(Table)`
  width: 50%;
  margin-left: auto;
`;

const TotalSection = styled.div`
  text-align: right;
  margin-top: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

const PdfButton = styled(Button)`
  background-color: #2b538b;
  color: white;
`;

const PrintButton = styled(Button)`
  background-color: #2b538b;
  color: white;
`;

const EmailButton = styled(Button)`
  background-color: #2b538b;
  color: white;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const OrderDetail = () => {
    const { orderCd } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const location = useLocation(); // navigate로부터 넘겨받은 state 접근
    const token = location.state?.token;
    const [isLoading, setIsLoading] = useState(true);

    // API 요청으로 주문 데이터 받아오기
    useEffect(() => {
        console.log('Token:', token);
        if (!token) {
            console.error('토큰이 없습니다');
            return;
        }

        axios.get(`http://localhost:8080/orders/${orderCd}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}` // 토큰을 Authorization 헤더로 전달
            }
        })
            .then(response => {
                setOrderData(response.data.data);
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
    const totalWithTax = totalAmount + tax;

    const handleDownloadPDF = () => {
        const element = document.getElementById('quotation-content');
        html2pdf().from(element).save('quotation.pdf');
    };

    const handleSendEmail = () => {
        setIsSending(true);
        const element = document.getElementById('quotation-content');

        html2pdf().from(element).toPdf().output('blob').then((pdf) => {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("content", "Here is your attached file.");
            formData.append("file", pdf, "quotation.pdf");

            axios.post('http://localhost:8080/email/send', formData)
                .then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: '메일 전송 성공',
                            text: '메일이 성공적으로 전송되었습니다.'
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '메일 전송 실패',
                            text: '메일 전송에 실패했습니다. 다시 시도해주세요.'
                        });
                    }
                })
                .catch((error) => {
                    console.error("메일 전송 오류:", error);
                    Swal.fire({
                        icon: 'error',
                        title: '메일 전송 오류',
                        text: '메일 전송 중 오류가 발생했습니다.'
                    });
                })
                .finally(() => {
                    setIsSending(false);
                    setIsModalOpen(false);
                });
        });
    };

    const handlePrint = () => {
        const printContent = document.getElementById('quotation-content').innerHTML;

        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>견적서</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                        }
                        .quotation-info, .order-table, .quotation-total {
                            margin: 20px 0;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: left;
                        }
                        .quotation-total {
                            text-align: right;
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = function() {
            printWindow.close();
        };
    };

    return (
        <div>
            <Header />
            <AppContainer>
                <Sidebar />
                <ContentContainer>
                    <QuotationCard id="quotation-content">
                    <QuotationHeader>
    <Title>견적서</Title>
    <Logo src="/logo/logo-shoeCream.png" />
</QuotationHeader>
                        <InfoSection>
                            <InfoColumn>
                                <p><strong>Order No:</strong> {orderData.orderCd}</p>
                                <p><strong>견적일:</strong> {orderData.createdAt}</p>
                                <p><strong>견적서 만료일:</strong> {orderData.requestDate}</p>
                            </InfoColumn>
                            <InfoColumn>
                                <p><strong>수신</strong> {orderData.buyerNm || '정보 없음'}</p>
                                <p><strong>담당자 이름</strong> {orderData.employeeNm || '수정될 예정'}</p>
                                <p><strong>내선 번호</strong> {'010-1111-2222'}</p>
                                <p><strong>납기일자</strong> {orderData.orderItems[0].endDate || '정보 없음'}</p>
                            </InfoColumn>
                        </InfoSection>

                        <h2>주문 상세 내역</h2>
                        <Table>
                            <thead>
                                <tr>
                                    <TableHeader>품목</TableHeader>
                                    <TableHeader>수량</TableHeader>
                                    <TableHeader>단가</TableHeader>
                                    <TableHeader>금액</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {orderData.orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <TableCell>{item.itemNm || '정보 없음'}</TableCell>
                                        <TableCell>{item.qty || '정보 없음'}</TableCell>
                                        <TableCell>{item.unitPrice || '정보 없음'}</TableCell>
                                        <TableCell>{(item.qty * item.unitPrice).toLocaleString() || '0'}</TableCell>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <SummaryTable>
                            <tbody>
                                <tr>
                                    <TableCell>총 금액</TableCell>
                                    <TableCell>{totalAmount.toLocaleString()}</TableCell>
                                </tr>
                                <tr>
                                    <TableCell>부가세 (10%)</TableCell>
                                    <TableCell>{tax.toLocaleString()}</TableCell>
                                </tr>
                                <tr>
                                    <TableCell><strong>합계</strong></TableCell>
                                    <TableCell><strong>{totalWithTax.toLocaleString()}</strong></TableCell>
                                </tr>
                            </tbody>
                        </SummaryTable>

                        <TotalSection>
                            <h2>총 합계: {totalWithTax.toLocaleString()} 원</h2>
                        </TotalSection>
                    </QuotationCard>

                    <ButtonContainer>
                        <PdfButton onClick={handleDownloadPDF}>PDF로 저장</PdfButton>
                        <PrintButton onClick={handlePrint}>인쇄하기</PrintButton>
                        <EmailButton onClick={() => setIsModalOpen(true)}>이메일로 전송</EmailButton>
                    </ButtonContainer>

                    {isModalOpen && (
                        <>
                            <Overlay onClick={() => setIsModalOpen(false)} />
                            <ModalContainer>
                            <ModalHeader>
                                <h2>이메일로 전송</h2>
                                <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
                            </ModalHeader>
                            <ModalContent>
                                <EmailInput 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="이메일 주소를 입력하세요" 
                                />
                                <SendButton onClick={handleSendEmail} disabled={isSending}>
                                {isSending ? "전송 중..." : "전송"}
                                </SendButton>
                            </ModalContent>
                            </ModalContainer>
                        </>
                    )}
                </ContentContainer>
            </AppContainer>
        </div>
    );
};

export default OrderDetail;
