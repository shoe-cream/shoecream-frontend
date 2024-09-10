import axios from 'axios';
import Swal from 'sweetalert2'; 


const getOrderAllRequest = async (state , buyerCd, itemCd, orderStatus, orderId, searchStartDate, searchEndDate, page, size, setOrders, setIsLoading) => {
    try {
        const response = await axios.get(`http://localhost:8080/orders`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${state.token}`
            }   
            ,params: {
                buyerCode : buyerCd,
                itemCode : itemCd,
                status : orderStatus,
                orderId : orderId,
                searchStartDate : searchStartDate,
                searchEndDate : searchEndDate,
                page : page,
                size : size
            }
        });

        if (response.status === 200) {
            console.log(response.data);
            setOrders(response.data);
            setIsLoading(false);
        } else {
            console.log('Failed to fetch orders data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching buyer data:', error);
        Swal.fire({ text: '해당되는 고객코드는 없어요' });
    }
};

export default getOrderAllRequest;
