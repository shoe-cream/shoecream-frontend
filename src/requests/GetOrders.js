import axios from 'axios';
import Swal from 'sweetalert2';


const getOrderAllRequest = async (state, buyerCd, itemCd, orderStatus, orderCd, searchStartDate, searchEndDate, page, size, setOrders, setIsLoading) => {
    try {
        const params = {};
        if (buyerCd) params.buyerCode = buyerCd;
        if (itemCd) params.itemCode = itemCd;
        if (orderStatus) params.status = orderStatus;
        if (orderCd) params.orderCd = orderCd;
        if (searchStartDate) params.searchStartDate = searchStartDate;
        if (searchEndDate) params.searchEndDate = searchEndDate;
        params.page = page;
        params.size = size;


        const response = await axios.get(`http://localhost:8080/orders`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            }, 
            params: params
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
        Swal.fire({ text: '해당되는 주문이 없어요' });
    }
};

export default getOrderAllRequest;
