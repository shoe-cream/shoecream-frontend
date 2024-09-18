import axios from "axios";
import Swal from "sweetalert2";

const sendPatchPasswordRequest = async(state, memberId, requestBody, executeAfter) => {
    try{
        console.log('requestBody in request: ', requestBody);
        const response = await axios.patch(`http://localhost:8080/members/${memberId}/password`,
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
            console.log('비밀번호 변경 성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            console.log('비밀번호 변경 실패: ', response.status);
            Swal.fire({text: `비밀번호가 틀립니다.`, icon: 'error'});
        }
    } catch(error){
        console.error('비밀번호 변경 실패(에러 발생): ', error);
        Swal.fire({text: `요청 실패(${error.response?.status || 'Unknown'})`, icon: 'error'});
    }
}

export default sendPatchPasswordRequest;