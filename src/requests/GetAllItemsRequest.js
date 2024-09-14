import axios from 'axios';
import Swal from 'sweetalert2';

const sendGetAllItemsRequest = async (state, setData, setIsLoading) => {
    try {
        const response = await axios.get(`http://localhost:8080/items/all`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': state.token
                }   
            }
        );
        if (response.status === 200) {
            console.log('모든 제품 정보 GET요청 성공: ', response.data);
            setData(response.data);
            if(setIsLoading !== undefined){
                setIsLoading(false);
            }
        } else {
            console.log('모든 제품 아이템 정보 GET요청 실패');
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch (error) {
        console.error('모든 제품 정보 GET요청 실패(에러 발생)', error);
        Swal.fire({text: `요청 실패(${error.status})`});
    }
};

export default sendGetAllItemsRequest;