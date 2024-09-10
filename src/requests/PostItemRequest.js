import axios from "axios";

const sendPostItemRequest = async(state, nameInput, codeInput, unitInput, unitpriceInput, sizeInput, colorInput, categoryInput, executeAfter) => {
    try{
        const response = await axios.post('http://localhost:8080/items',
            {
                "itemCd": codeInput,
                "itemNm": nameInput,
                "unit": unitInput,
                "unitPrice": unitpriceInput,
                "size": sizeInput,
                "color": colorInput,
                "category": categoryInput
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': state.token
                }   
            }
        );
        if(response.status === 200 || response.status === 201){
            console.log('제품 등록 성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            console.log('제품 등록 실패: ', response.status);
        }
    } catch(error){
        console.error('제품 등록 실패(에러 발생): ', error);
    }
}
export default sendPostItemRequest;