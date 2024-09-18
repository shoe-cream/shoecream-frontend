import axios from 'axios';
import Swal from 'sweetalert2';


const sendGetReportsRequest = async (state, startDate, endDate, setReports, setIsLoading) => {
    try {
        const response = await axios.get(`http://localhost:8080/orders/reports`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            },
            params :{
                startDate : startDate,
                endDate : endDate
            }
        });

        if (response.status === 200) {
            console.log("sadasdasd",response.data);
            setReports(response.data);
            setIsLoading(false);
        } else {
            console.log('Failed to fetch orders data:', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch (error) {
        console.error('Error fetching buyer data:', error);
        Swal.fire({ text: '해당되는 리포트는 없어요' });
    }
};

export default sendGetReportsRequest;
