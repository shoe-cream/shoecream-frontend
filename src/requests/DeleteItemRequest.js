import axios from 'axios';
import Swal from 'sweetalert2';

const sendDeleteItemRequest = async (state, pageInfo, checkedItems, setChecked, executeAfter) => {
    try {
        console.log('checkedItems in request: ', checkedItems);
        /* const selected = checkedItems.map(item => item + (pageInfo.page - 1) * pageInfo.size);
        console.log('selected: ', selected); */
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/items`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`
                },
                data: {
                    itemId: checkedItems
                },
            }
        );

        if (response.status === 204) {
            console.log('제품 삭제 성공: ', response.data);
            Swal.fire({text: `제품 삭제 성공`});
            setChecked([]);
            if(executeAfter !== undefined){
                executeAfter();
            }
        } else {
            console.log('제품 삭제 실패: ', response.status);
            Swal.fire({text: `제품 삭제 실패`});
        }
    } catch (error) {
        console.error('제품 삭제 실패(에러 발생):', error);
        Swal.fire({text: `제품 삭제 실패(에러 발생)`});
    }
};

export default sendDeleteItemRequest;
