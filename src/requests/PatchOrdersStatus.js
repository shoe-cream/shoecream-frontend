import axios from "axios";
import Swal from "sweetalert2";

const sendPatchStatusRequest = async (state, requestBody, executeAfter) => {
    try {
        //console.log('requestBody in request: ', requestBody);
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/orders`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`
                }   
            }
        );
        
        if (response.status === 200 || response.status === 201) {
            let successMessage = '';
            switch (requestBody[0].orderStatus) {
                case 'PURCHASE_REQUEST':
                    successMessage = '발주 요청 완료';
                    break;
                case 'APPROVED':
                    successMessage = '주문 승인 완료';
                    break;
                case 'SHIPPED':
                    successMessage = '출하 완료';
                    break;
                case 'PRODUCT_PASS':
                    successMessage = '주문 합격 처리 완료';
                    break;
                case 'CANCELLED':
                    successMessage = '주문 취소 완료';
                    break;
                case 'PRODUCT_FAIL':
                    successMessage = '주문 불합격 처리 완료';
                    break;
                default:
                    successMessage = '수정 완료';
            }
            
            Swal.fire({text: successMessage, icon: 'success'});
            //console.log('주문 상태 변경 성공', response);
            if (executeAfter !== undefined) {
                executeAfter();
            }
        } else {
            //console.log('주문 상태 변경 실패: ', response.status);
            Swal.fire({text: `주문 요청이 불가합니다. 선택을 다시 해주세요`, icon: 'error'});
        }
    } catch (error) {
        //console.error('주문 상태 변경 실패(에러 발생): ', error);
        Swal.fire({text: `주문 요청이 불가합니다. 선택을 다시 해주세요`, icon: 'error'});
    }
}

export default sendPatchStatusRequest;