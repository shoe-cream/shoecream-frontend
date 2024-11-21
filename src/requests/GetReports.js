import axios from 'axios';
import Swal from 'sweetalert2';


const sendGetReportsRequest = async (state, startDate, endDate, setReports, setIsLoading, topNumber = undefined) => {
    try {
        const params = {
            startDate: startDate,
            endDate: endDate
        };

        // topNumber가 정의되어 있을 때만 params에 추가
        if (topNumber !== undefined) {
            params.topNumber = topNumber;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/reports`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            },
            params: params
        });

        if (response.status === 200) {
            console.log("asdasdasdasd",response.data)
;            setReports(response.data);
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
