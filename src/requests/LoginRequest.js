import axios from "axios";
import { useNavigate } from "react-router-dom";

const sendLoginRequest = async(emailInput, passwordInput, navigate, login) => {
    try{
        const response = await axios.post('http://localhost:8080/auth/login',
            {
                username: emailInput,
                password: passwordInput,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }   
            }
        );
        if(response.status === 200){
            console.log('로그인 성공');
            login();
            navigate('/');
        }else{
            console.log('로그인 요청 실패: ', response.status);
        }
    } catch(error){
        console.error('로그인 요청 실패(에러 발생): ', error);
    }
}
export default sendLoginRequest;