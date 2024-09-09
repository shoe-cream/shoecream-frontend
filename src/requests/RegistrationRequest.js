import axios from "axios";

const sendRegistrationRequest = async(emailInput, passwordInput, employeeIdInput) => {
    try{
        const response = await axios.post('http://localhost:8080/members',
            {
                email: emailInput,
                password: passwordInput,
                employeeId: employeeIdInput,
                name: '홍길동',
                authCode: '1234',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }   
            }
        );
        if(response.status === 201){
            console.log('회원가입 완료');
        }else{
            console.log('Member POST요청 실패: ', response.status);
        }
    } catch(error){
        console.error('Member POST요청 실패(에러 발생): ', error);
    }
}
export default sendRegistrationRequest;