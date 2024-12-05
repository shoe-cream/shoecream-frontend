import axios from "axios";
import Swal from "sweetalert2";

const sendPostBuyersRequest = async(state, requestBody, executeAfter) => {
    try{
        //console.log('requestBody: ', requestBody);
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/buyers`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': state.token
                }   
            }
        );
        if(response.status === 200 || response.status === 201){
            //console.log('고객사 일괄 등록 성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            //console.log('고객사 일괄 등록 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch(error){
        //console.error('고객사 일괄 등록 실패(에러 발생): ', error);
        const errorMessage = error.response.data.message.toLowerCase();
        //console.log(errorMessage);
        switch(error.status){
            case 400:
                Swal.fire({text: '이메일을 올바른 형식으로 입력해주세요'});
                break;
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
                Swal.fire({text: `고객사명 또는 연락처 또는 이메일이 이미 존재합니다`});
                break;
            default:
                Swal.fire({text: `요청 실패(${error.status})`});
        }
    }
}
export default sendPostBuyersRequest;