import axios from "axios";

const sendPatchMultiItemRequest = async(state, requestBody, executeAfter) => {
    try{
        console.log('requestBody: ', requestBody);
        const response = await axios.patch('http://localhost:8080/items',
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': state.token
                }   
            }
        );
        if(response.status === 200 || response.status === 201){
            alert('수정 완료');
            console.log('제품 일괄 수정 성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            console.log('제품 일괄 수정 실패: ', response.status);
        }
    } catch(error){
        console.error('제품 일괄 수정 실패(에러 발생): ', error);
    }
}
export default sendPatchMultiItemRequest;