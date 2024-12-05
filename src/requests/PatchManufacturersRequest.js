import axios from "axios";
import Swal from "sweetalert2";

const sendPatchManufacturersRequest = async(state, requestBody, executeAfter) => {
    try{
        //console.log('requestBody in request: ', requestBody);
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/manufacturers`,
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
            //console.log('제조사 일괄 수정 성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            //console.log('제조사 일괄 수정 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch(error){
        //console.error('제조사 일괄 수정 실패(에러 발생): ', error);
        switch(error.status){
            case 400:
                Swal.fire({text: '이메일을 올바른 형식으로 입력해주세요'});
                break;
            case 409:
                Swal.fire({text: `이메일이 이미 존재합니다`});
                break;
            default:
                Swal.fire({text: `요청 실패(${error.status})`});
        }
    }
}
export default sendPatchManufacturersRequest;