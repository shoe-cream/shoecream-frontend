import axios from "axios";
import Swal from "sweetalert2";

const sendPatchApproveRequest = async(state, requestBody, executeAfter) => {
    try{
        console.log('requestBody in request: ', requestBody);
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/orders/approve`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`
                }   
            }
        );
        if(response.status === 200 || response.status === 201){
            Swal.fire({text: '승인 완료', icon: 'success'});
            console.log('성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            console.log('제품 일괄 수정 실패: ', response.status);
            Swal.fire({text: `주문 요청이 불가합니다. 선택을 다시 해주세요`, icon: 'error'});
        }
    } catch(error){
        console.error('제품 일괄 수정 실패(에러 발생): ', error);
        Swal.fire({text: `주문 요청이 불가합니다. 선택을 다시 해주세요`, icon: 'error'});
    }
}

export default sendPatchApproveRequest;