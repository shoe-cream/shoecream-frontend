import axios from 'axios';
import Swal from 'sweetalert2';


const sendGetOrderRequest = async (state, orderCd, setOrder, setIsLoading) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/${orderCd}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            }
        });

        if (response.status === 200) {
            //console.log(response.data);
            setOrder(response.data);
            setIsLoading(false);
        } else {
            //console.log('Failed to fetch orders data:', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch (error) {
        //console.error('Error fetching buyer data:', error);
        Swal.fire({ text: '해당되는 고객코드는 없어요' });
    }
};

export default sendGetOrderRequest;
