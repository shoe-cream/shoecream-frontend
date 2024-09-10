import axios from 'axios';

const sendGetItemsRequest = async (state ,page, size, setData, setIsLoading) => {
    console.log("state: ", state);
    try {
        const response = await axios.get(`http://localhost:8080/items`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`
                }   
                ,params: {
                    page: page,
                    size: size,
                }
            }
        );

        if (response.status === 200) {
            console.log('제품 정보 GET요청 성공: ', response.data);
            setData(response.data);
            setIsLoading(false);
        } else {
            console.log('제품 정보 GET요청 실패');
        }
    } catch (error) {
        console.error('제품 정보 GET요청 실패(에러 발생)', error);
    }
};

export default sendGetItemsRequest;
