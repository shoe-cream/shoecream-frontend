import axios from 'axios';
import Swal from 'sweetalert2'; 


const getBuyerItemsPeriodRequest = async (state ,buyerCd, orderDate, setBuyerItems, page, size, setIsLoading) => {
    try {
        console.log('buyerCd:', buyerCd);
        const response = await axios.get(`http://localhost:8080/buyer-items/period`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            }   
            ,params: {
                buyerCd: buyerCd,
                date : orderDate,
                page : page,
                size : size
            }
        });

        if (response.status === 200) {
            console.log('Buyer data fetched successfully:', response.data);
            setBuyerItems(response.data);
            setIsLoading(false);
        } else {
            console.log('Failed to fetch buyer data:', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch (error) {
        console.error('Error fetching buyer data:', error);
        Swal.fire({ text: '해당되는 고객코드는 없어요' });
    }
};

export default getBuyerItemsPeriodRequest;