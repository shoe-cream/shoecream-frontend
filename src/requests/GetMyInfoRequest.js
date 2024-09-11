import axios from "axios";

const sendGetMyInfoRequest = async(state, setData, setIsLoading) => {
    try{
        console.log('state: ', state);
        const response = await axios.get('http://localhost:8080/members/my-info',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`
                }   
            }
        );
        if(response.status === 200){
            console.log('내 정보 GET요청 성공: ', response.data);
            setData(response.data);
            setIsLoading(false);
        }else{
            console.log('내 정보 GET요청 실패: ', response.status);
        }
    } catch(error){
        console.error('내 정보 GET요청 실패(에러 발생): ', error);
    }
}
export default sendGetMyInfoRequest;