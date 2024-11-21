import axios from "axios";
import Swal from "sweetalert2";

const sendLogoutRequest = async(state, logout, navigate) => {
    try{
        console.log('state: ', state); 
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`,
            {},
            {   
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`,
                }   
            }
        );
        if(response.status === 200){
            console.log('로그아웃 성공: ', response.data);
            logout();
            navigate('/');
        }else{
            console.log('로그아웃 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch(error){
        console.error('로그아웃 실패(에러 발생): ', error);
        Swal.fire({text: `요청 실패(${error.status})`});
    }
}
export default sendLogoutRequest;