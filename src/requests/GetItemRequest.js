import axios from 'axios';
import Swal from 'sweetalert2'; 


const getItemRequest= async (state ,itemCd, setItem, setIsLoading) => {
    try {
        console.log('itemCd:', itemCd);
        const response = await axios.get(`http://localhost:8080/items/${itemCd}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${state.token}`
            }   
        });

        if (response.status === 200) {
            console.log(response.data);
            setItem(response.data);
            setIsLoading(false);
        } else {
            console.log('Failed to fetch buyer data:', response.status);
            setIsLoading(false);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch (error) {
        console.error('Error fetching buyer data:', error);
        setIsLoading(false);
        Swal.fire({text: `요청 실패(${error.status})`});
    }
};

export default getItemRequest;
