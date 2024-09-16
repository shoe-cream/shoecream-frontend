import axios from 'axios';
import Swal from 'sweetalert2';

const sendGetSaleHistoryRequest = async ({state, rowData, page, size, setData, setIsLoading, setIsModalOpen }) => {
    try {
        console.log("rowData: ", rowData);
        const response = await axios.get(`http://localhost:8080/orders/${rowData.orderCd}/histories`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            }, 
            params: {
                page,
                size,
            }
        });

        if (response.status === 200) {
            console.log('주문 히스토리 GET요청 성공: ', response.data);
            setData(response.data);
            if(setIsLoading !== undefined){
                setIsLoading(false);
            }
            if(setIsModalOpen !== undefined){
                setIsModalOpen(true);
            }
        } else {
            console.log('주문 히스토리 GET요청 실패 :', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch (error) {
        console.error('주문 히스토리 GET요청 실패 :', error);
        Swal.fire({ text: `요청 실패 (${error.status})` });
    } 
};

export default sendGetSaleHistoryRequest;