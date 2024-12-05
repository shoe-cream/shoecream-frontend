import axios from "axios";
import Swal from "sweetalert2";

const sendPatchRejectRequest = async(state, requestBody, executeAfter) => {
    try{
        //console.log('requestBody in request: ', requestBody);
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/orders/reject`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`
                }   
            }
        );
        if(response.status === 200 || response.status === 201){
            Swal.fire({text: '주문 반려', icon: 'success'});
            //console.log('성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            //console.log('제품 일괄 수정 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`, icon: 'error'});
        }
    } catch(error){
        //console.error('제품 일괄 수정 실패(에러 발생): ', error);
        Swal.fire({text: `요청 실패(${error.response?.status || 'Unknown'})`, icon: 'error'});
    }
}

export default sendPatchRejectRequest;