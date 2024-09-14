import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const sendLoginRequest = async(emailInput, passwordInput, navigate, login) => {
    try{
        const response = await axios.post('http://localhost:8080/auth/login',
            {
                employeeId: emailInput,
                password: passwordInput,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }   
            }
        );
        if(response.status === 200){
            console.log('로그인 성공', response);
            login(response.headers.authorization);
            navigate('/dashboard');
        }else{
            console.log('로그인 요청 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch(error){
        console.error('로그인 요청 실패(에러 발생): ', error);
        Swal.fire({text: `요청 실패(${error.status})`});
    }
}
export default sendLoginRequest;