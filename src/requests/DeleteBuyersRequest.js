import axios from 'axios';
import Swal from 'sweetalert2';

const sendDeleteBuyersRequest = async (state, checkedData, setChecked, executeAfter) => {
    try {
        console.log('checkedData in request: ', checkedData);
        /* const selected = checkedItems.map(item => item + (pageInfo.page - 1) * pageInfo.size);
        console.log('selected: ', selected); */
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/buyers`, 
            {   
                
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`
                },
                data: {
                    buyerId: checkedData
                }
            }
        );

        if (response.status === 204) {
            console.log('고객사 삭제 성공: ', response.data);
            Swal.fire({text : '고객사 삭제 성공', icon : 'success'});
            setChecked([]);
            if(executeAfter !== undefined){
                executeAfter();
            }
        } else if (response.status === 400){
            console.log('고객사 삭제 실패: ', response.status);
            Swal.fire({text: `고객사 삭제 실패`});
        } else if (response.status === 404){
            console.log('고객사 삭제 실패: ', response.status);
            Swal.fire({text: `삭제하려는 고객사가 없습니다`});
        } else {
            console.log('고객사 삭제 실패: ', response.status);
            Swal.fire({text: `고객사 삭제 실패`});
        }
    } catch (error) {
        console.error('고객사 삭제 실패(에러 발생):', error);
        Swal.fire({text: `요청 실패(${error.status})`});
    }
};

export default sendDeleteBuyersRequest;
