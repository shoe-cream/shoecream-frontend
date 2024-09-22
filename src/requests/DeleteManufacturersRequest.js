import axios from 'axios';
import Swal from 'sweetalert2';

const sendDeleteManufacturersRequest = async (state, checkedData, setChecked, executeAfter) => {
    try {
        console.log('checkedData in request: ', checkedData);
        /* const selected = checkedItems.map(item => item + (pageInfo.page - 1) * pageInfo.size);
        console.log('selected: ', selected); */
        const response = await axios.delete(`http://localhost:8080/manufacturers`, 
            {   
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`
                },
                data: {
                    mfId: checkedData
                }
            }
        );

        if (response.status === 204) {
            console.log('제조사 삭제 성공: ', response.data);
            setChecked([]);
            Swal.fire({text: '제조사 삭제 성공', icon: 'success'});
            if(executeAfter !== undefined){
                executeAfter();
            }
        } else {
            console.log('제조사 삭제 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch (error) {
        console.error('제조사 삭제 실패(에러 발생):', error);
        Swal.fire({text: `요청 실패(${error.status})`});
    }
};

export default sendDeleteManufacturersRequest;
