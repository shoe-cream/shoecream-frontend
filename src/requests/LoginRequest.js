import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const sendLoginRequest = async (emailInput, passwordInput, navigate, login) => {
    try {
        console.log("주소: ", process.env.REACT_APP_API_URL);
        const response = await axios.post(`https://shoecream.store/auth/login`,
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
        if (response.status === 200) {
            console.log('로그인 성공', response);
            login(response.headers.authorization);
            navigate('/dashboard');
        } else {
            Swal.fire({ text: `요청 실패(${response.status})` });
        }
    } catch (error) {
        switch (error.status) {
            case 401:
                Swal.fire({ text: `비밀번호를 다시 확인해주세요` });
                break;
            case 404:
                Swal.fire({ text: `존재하지 않는 사원번호입니다` });
                break;
            default:
                Swal.fire({ text: `요청 실패(${error.status})` });
        }
    }
}
export default sendLoginRequest;