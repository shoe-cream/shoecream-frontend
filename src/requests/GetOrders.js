import axios from 'axios';
import Swal from 'sweetalert2';

const getOrderAllRequest = async (state, searchParams, page, size, setOrders, setIsLoading) => {
    try {
        const params = {
            ...searchParams,
            page,
            size
        };

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            }, 
            params: params
        });

        if (response.status === 200) {
            //console.log('주문 GET요청 성공: ', response.data);
            if (response.data.data && response.data.data.length > 0) {
                setOrders(response.data);
            } else {
                setOrders({ data: [] });
            }
            setIsLoading(false);
        } else {
            //console.log('Failed to fetch orders data:', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
            setOrders({ data: [] });
        }
    } catch (error) {
        //console.error('Error fetching buyer data:', error);
        Swal.fire({ text: '데이터를 가져오는 중 오류가 발생했습니다.' });
        setOrders({ data: [] });
    } finally {
        setIsLoading(false);
    }
};

export default getOrderAllRequest;