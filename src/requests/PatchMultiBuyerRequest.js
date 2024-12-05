import axios from "axios";
import Swal from "sweetalert2";

const sendPatchMultiBuyerRequest = async(state, requestBody, executeAfter) => {
    try{
        //console.log('requestBody in request: ', requestBody);
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/buyers`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': state.token
                }   
            }
        );
        if(response.status === 200 || response.status === 201){
            Swal.fire({text: '수정 완료', icon: 'success'});
            //console.log('고객사 일괄 수정 성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            //console.log('고객사 일괄 수정 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch(error){
        //console.error('고객사 일괄 수정 실패(에러 발생): ', error);
        const errorMessage = error.response.data.message.toLowerCase();
        switch(error.status){
            case 409:
                if(errorMessage.includes('buyer')){
                    Swal.fire({text: `이미 등록된 고객사명입니다.`});
                    break;
                }
                if(errorMessage.includes('email')){
                    Swal.fire({text: `이미 등록된 이메일입니다.`});
                    break;
                }
                if(errorMessage.includes('tel')){
                    Swal.fire({text: `이미 등록된 전화번호입니다.`});
                    break;
                }
                Swal.fire({text: `이메일 또는 전화번호가 이미 존재합니다.`});
                break;
            default:
                Swal.fire({text: `요청 실패(${error.status})`});

        }
    }
}
export default sendPatchMultiBuyerRequest;