import axios from "axios";
import Swal from "sweetalert2";

const sendPatchMultiItemRequest = async(state, requestBody, executeAfter) => {
    try{
        console.log('requestBody in request: ', requestBody);
        const response = await axios.patch('http://localhost:8080/items',
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': state.token
                }   
            }
        );
        if(response.status === 200 || response.status === 201){
            alert('수정 완료');
            console.log('제품 일괄 수정 성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            console.log('제품 일괄 수정 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch(error){
        console.error('제품 일괄 수정 실패(에러 발생): ', error);
        Swal.fire({text: `요청 실패(${error.status})`});
    }
}
export default sendPatchMultiItemRequest;