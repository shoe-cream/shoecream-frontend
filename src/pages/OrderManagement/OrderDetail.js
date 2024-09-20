import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import styled from 'styled-components';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from "../../components/header/Header";

const AppContainer = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  font-size: 14px;  // 기본 글자 크기를 줄임
`;

const QuotationCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;  // 최대 너비를 제한하여 더 compact하게 만듦
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
  height: 40px;
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
  padding: 8px;  // 패딩을 줄임
  text-align: left;
  font-weight: bold;
  font-size:18px;
  white-space: nowrap;  // 줄넘김 방지
`;

const TableCell = styled.td`
  padding: 8px;  // 패딩을 원래대로 유지
  font-size: 16px;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;  // 줄넘김 방지
`;

const SummaryTable = styled(Table)`
  width: 50%;  // 요약 테이블의 너비를 줄임
  margin-left: auto;  // 오른쪽 정렬
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
    const totalWithTax = totalAmount + tax;

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
    
        // 새로운 창을 열어 프린트 내용 렌더링
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>견적서</title>
                    <style>
                        /* 프린트할 때 필요한 스타일을 여기 추가할 수 있습니다 */
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
    
        printWindow.document.close(); // 문서가 완성되면 닫기
        printWindow.focus(); // 프린트 창에 포커스
    
        printWindow.print(); // 프린트 실행
        printWindow.onafterprint = function() {
            printWindow.close(); // 프린트 완료 후 창 닫기
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
                            <Logo src="logo/text-logo.png" alt="Logo" />
                        </QuotationHeader>
                        <InfoSection>
                            <InfoColumn>
                                <p><strong>Invoice No:</strong> {orderData.orderCd}</p>
                                <p><strong>견적일:</strong> {orderData.createdAt}</p>
                                <p><strong>견적서 만료일:</strong> {orderData.requestDate}</p>
                            </InfoColumn>
                            <InfoColumn>
                                <p><strong>수신자:</strong> ________________</p>
                                <p><strong>담당자:</strong> ________________</p>
                                <p><strong>내선전화:</strong> ________________</p>
                            </InfoColumn>
                        </InfoSection>
    
                        <h2>주문 상세 내역</h2>
                        <Table>
                            <thead>
                                <tr>
                                    <TableHeader>제품 코드</TableHeader>
                                    <TableHeader>수량</TableHeader>
                                    <TableHeader>단가</TableHeader>
                                    <TableHeader>총액</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {orderData.orderItems.map((item, index) => (
                                    <tr key={item.orderItemCd || index}>
                                        <TableCell>{item.itemCd}</TableCell>
                                        <TableCell>{item.qty || 0}</TableCell>
                                        <TableCell>${item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'}</TableCell>
                                        <TableCell>${(item.qty * item.unitPrice || 0).toFixed(2)}</TableCell>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
    
                        <TotalSection>
                            <SummaryTable>
                                <tbody>
                                    <tr>
                                        <TableCell><strong>수량</strong></TableCell>
                                        <TableCell>{orderData.orderItems.reduce((total, item) => total + (item.qty || 0), 0)}</TableCell>
                                    </tr>
                                    <tr>
                                        <TableCell><strong>소계</strong></TableCell>
                                        <TableCell>${totalAmount.toFixed(2)}</TableCell>
                                    </tr>
                                    <tr>
                                        <TableCell><strong>공급가액</strong></TableCell>
                                        <TableCell>${totalAmount.toFixed(2)}</TableCell>
                                    </tr>
                                    <tr>
                                        <TableCell><strong>부가세 (10%)</strong></TableCell>
                                        <TableCell>${tax.toFixed(2)}</TableCell>
                                    </tr>
                                    <tr>
                                        <TableCell><strong>총합계</strong></TableCell>
                                        <TableCell><strong>${totalWithTax.toFixed(2)}</strong></TableCell>
                                    </tr>
                                </tbody>
                            </SummaryTable>
                        </TotalSection>
                    </QuotationCard>
                    <ButtonContainer>
                        <PdfButton onClick={handleDownloadPDF}>PDF 다운로드</PdfButton>
                        <PrintButton onClick={handlePrint}>인쇄</PrintButton>
                        <EmailButton onClick={handleSendEmail}>메일로 보내기</EmailButton>
                    </ButtonContainer>
                </ContentContainer>
            </AppContainer>
        </div>
    );
};

export default OrderDetail;