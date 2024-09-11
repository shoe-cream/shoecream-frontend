import axios from "axios";

const sendPostMultiItemRequest = async(state, requestBody, executeAfter) => {
    try{
        console.log('requestBody: ', requestBody);
        const response = await axios.post('http://localhost:8080/items',
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': state.token
                }   
            }
        );
        if(response.status === 200 || response.status === 201){
            console.log('제품 일괄 등록 성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            console.log('제품 일괄 등록 실패: ', response.status);
        }
    } catch(error){
        console.error('제품 일괄 등록 실패(에러 발생): ', error);
    }
}
export default sendPostMultiItemRequest;