import axios from "axios";
import Swal from "sweetalert2";

const sendPostManufacturersRequest = async(state, requestBody, executeAfter) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/manufacturers`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': state.token
                }   
            }
        );
        if(response.status === 200 || response.status === 201){
            //console.log('제조사 등록 성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            //console.log('제조사 등록 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch(error){
        //console.error('제조사 등록 실패(에러 발생): ', error);
        const errorMessage = error.response.data.message.toLowerCase();
        switch(error.status){
            case 400:
                Swal.fire({text: '이메일을 올바른 형식으로 입력해주세요'});
                break;
            case 409:
                if(errorMessage.includes('mf')){
                    Swal.fire({text: `이미 등록된 제조사명입니다.`});
                    break;
                }
                if(errorMessage.includes('email')){
                    Swal.fire({text: `이미 등록된 이메일입니다.`});
                    break;
                }
                Swal.fire({text: `제조사명 또는 이메일이 이미 존재합니다`});
                break;
            default:
                Swal.fire({text: `요청 실패(${error.status})`});
        }
    }
}
export default sendPostManufacturersRequest;