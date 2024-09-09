import axios from 'axios';


const getBuyerRequest = async (state ,buyerCd, setData, setIsLoading) => {
    try {
        console.log('buyerCd:', buyerCd);
        const response = await axios.get(`http://localhost:8080/buyers/search`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${state.token}`
            }   
            ,params: {
                buyerCd: buyerCd
            }
        });

        if (response.status === 200) {
            console.log('Buyer data fetched successfully:', response.data);
            setData(response.data);
            setIsLoading(false);
        } else {
            console.log('Failed to fetch buyer data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching buyer data:', error);
    }
};

export default getBuyerRequest;
