import axios from "axios";
import Swal from "sweetalert2";

const sendPostItemRequest = async(state, nameInput, codeInput, unitInput, unitpriceInput, sizeInput, colorInput, categoryInput, executeAfter) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/items`,
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
            //console.log('제품 등록 성공', response);
            if(executeAfter !== undefined){
                executeAfter();
            }
        }else{
            //console.log('제품 등록 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch(error){
        //console.error('제품 등록 실패(에러 발생): ', error);
        switch (error.status){
            case 409:
                Swal.fire({text: '이미 등록된 제품입니다.'});
                break;
            default:
                Swal.fire({text: `요청 실패(${error.status})`});
        }
    }
}
export default sendPostItemRequest;